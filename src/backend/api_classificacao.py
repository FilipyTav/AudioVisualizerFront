import os
import numpy as np
import pandas as pd
import librosa
import soundfile as sf
import scipy.stats as stats
import joblib 
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import tempfile

# ======================================
# CONFIGURAÇÕES E CARREGAMENTO
# ======================================
# Inicializa o Flask
app = Flask(__name__)

# Configurações de áudio (devem ser as mesmas usadas no treinamento)
SR = 22050
N_MFCC = 13

# Caminhos dos arquivos (assumindo que estão na mesma pasta do script)
DIRETORIO_SCRIPT = os.path.dirname(os.path.abspath(__file__))
ARQUIVO_MODELO = os.path.join(DIRETORIO_SCRIPT, "modelo_svm_avancado.joblib")
ARQUIVO_SCALER = os.path.join(DIRETORIO_SCRIPT, "scaler_avancado.joblib")

# Carregar Modelo e Scaler
try:
    MODELO_SVM = joblib.load(ARQUIVO_MODELO)
    SCALER = joblib.load(ARQUIVO_SCALER)
    print("✅ Modelo e scaler carregados com sucesso.")
except Exception as e:
    print(f"❌ Erro ao carregar o modelo/scaler: {e}")
    # Se o modelo não carregar, a API deve falhar, por isso o raise
    raise RuntimeError("Não foi possível carregar os arquivos do modelo. Verifique os caminhos.")

# ======================================
# FUNÇÕES DE EXTRAÇÃO (Adaptadas para usar caminho de arquivo)
# ======================================

def carregar_audio(caminho, sr=SR):
    """Carrega e normaliza um arquivo de áudio (copiado de extrator_features_avancado.py)."""
    try:
        y, orig_sr = sf.read(caminho)
    except Exception as e:
        print(f"Erro ao ler {caminho}: {e}")
        return None
    if y.ndim > 1:
        y = np.mean(y, axis=1)
    if orig_sr != sr:
        y = librosa.resample(y.astype(float), orig_sr=orig_sr, target_sr=sr)
    if np.max(np.abs(y)) > 0:
        y = y / np.max(np.abs(y))
    return y.astype(float)

def extrair_mfcc_stats(caminho, sr=SR, n_mfcc=N_MFCC):
    """Extrai MFCCs e estatísticas (copiado de extrator_features_avancado.py)."""
    y = carregar_audio(caminho, sr)
    if y is None:
        return None
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n_mfcc)
    mean = np.mean(mfcc, axis=1)
    std = np.std(mfcc, axis=1)
    skew = stats.skew(mfcc, axis=1)
    kurt = stats.kurtosis(mfcc, axis=1)
    return np.concatenate([mean, std, skew, kurt])

def formatar_vetor_para_df(vetor_features):
    """Converte o vetor de features em um DataFrame com os nomes de colunas corretos (copiado de prever_audio_novo_avancado.py)."""
    if vetor_features is None:
        return None
        
    N = N_MFCC
    data = {}
    for i in range(N):
        data[f"mfcc_mean_{i+1}"] = [vetor_features[i]]
        data[f"mfcc_std_{i+1}"] = [vetor_features[i + N]]
        data[f"mfcc_skew_{i+1}"] = [vetor_features[i + 2*N]]
        data[f"mfcc_kurt_{i+1}"] = [vetor_features[i + 3*N]]
    
    return pd.DataFrame(data)

# ======================================
# ENDPOINT DA API
# ======================================

@app.route('/prever', methods=['POST'])
def prever_audio():
    # 1. Checagem do Arquivo
    if 'audio_file' not in request.files:
        return jsonify({"erro": "Nenhum arquivo 'audio_file' na requisição."}), 400

    audio_file = request.files['audio_file']
    if audio_file.filename == '':
        return jsonify({"erro": "Nome de arquivo inválido."}), 400

    if not audio_file.filename.lower().endswith((".wav", ".mp3", ".ogg")):
         return jsonify({"erro": "Formato de arquivo não suportado. Use .wav, .mp3 ou .ogg."}), 400

    # 2. Salvar o arquivo temporariamente para processamento
    # O librosa/soundfile precisa de um caminho de arquivo no disco
    # Usamos o tempfile para garantir que o arquivo seja deletado após o uso
    temp_dir = tempfile.gettempdir()
    temp_path = os.path.join(temp_dir, secure_filename(audio_file.filename))
    audio_file.save(temp_path)
    
    try:
        # 3. Extrair Features
        vetor_features = extrair_mfcc_stats(temp_path)
        
        if vetor_features is None:
            return jsonify({"erro": "Erro na leitura ou extração de features do áudio."}), 500

        # 4. Formatar, Normalizar e Predizer
        df_feature = formatar_vetor_para_df(vetor_features)
        X_novo_audio = df_feature.values
        X_novo_audio_scaled = SCALER.transform(X_novo_audio)

        # Predição e Certeza
        predicao = MODELO_SVM.predict(X_novo_audio_scaled)
        classe_predita = predicao[0]

        probabilidades = MODELO_SVM.predict_proba(X_novo_audio_scaled)
        classes = MODELO_SVM.classes_
        idx_classe_predita = np.where(classes == classe_predita)[0][0]
        prob_predita = probabilidades[0, idx_classe_predita]
        
        # 5. Retornar Resultado
        return jsonify({
            "status": "sucesso",
            "arquivo": audio_file.filename,
            "classe_predita": classe_predita,
            "certeza_percentual": f"{prob_predita * 100:.2f}"
        })
        
    finally:
        # 6. Limpar arquivo temporário
        if os.path.exists(temp_path):
            os.remove(temp_path)


if __name__ == '__main__':
    # Adicione esta linha para permitir requisições de outras origens (CORS)
    from flask_cors import CORS 
    CORS(app) 
    print("\nAPI pronta. Execute-a com: python api_classificacao.py")
    # A API será executada em http://127.0.0.1:5000/
    app.run(debug=True)
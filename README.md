# Frontend AURIS

Este é um projeto desenvolvido com SvelteKit, utilizando Yarn como gerenciador de pacotes.

## Requerimentos

- npm
- yarn

## Como baixar e rodar o projeto - Frontend

### 1. Clonar o repositório

```bash
git clone <URL-do-repositório>
```

### 2. Entrar na pasta do projeto

```bash
cd <nome-da-pasta-do-projeto>
```

### 3. Instalar as dependências

```bash
yarn install
```

### 4. Rodar em modo de desenvolvimento

```bash
yarn run dev
```
O servidor estará rodando em http://localhost:5173, e poderá ser acessado pelo navegador.

## Backend

Para funcionar, o Backend precisa estar rodando.

### Local

```bash
cd src/backend/
```

### Instalar dependências

```bash
pip install -r requirements.txt
```

### Rodar
```bash
{python.exe} api_classificacao.py
```

O servidor estará rodando em http://127.0.0.1:5000

## IoT

O IP do ESP32 precisa ser configurado pelo arquivo

```bash
src/lib/utils/config.ts
```

## Equipe

| Integrante | Função |
|-------------|--------|
| **Denival Biotto Filho** | Back End (Desenvolvimento de Código) |
| **Filipe Gomes Ferreira** | Back End (Desenvolvimento de Código) |
| **Filipy Tavares dos Santos** | Front End (HTML) |
| **Naum Calebe Félix Sarti** | Front End (Design e Interface) |
| **Luan Vitor Pereira Rocha** | IoT (Desenvolvimento de Sensores e Coleta de Dados) |
| **Luiz Otávio Machado Seles** | IoT (Integração de Dispositivo) |
| **Pedro Azevedo Batista (Piphoka)** | Apresentação, Pesquisa Teórica e Integração |
| **Rafael Magesto** | Modelo 3D do IoT |
| **Luis Henrique da Silva** | Dados |

---

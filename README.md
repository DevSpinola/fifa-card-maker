# FIFA Card Builder

Bem-vindo ao projeto **FIFA Card Builder**! Este é um sistema completo para criar, personalizar e gerenciar cartas de jogadores no estilo FIFA, composto por um aplicativo móvel e uma API backend.

## 📚 Documentação

O projeto é dividido em dois módulos principais. Para detalhes técnicos, guias de instalação e explicações sobre o código, consulte as documentações específicas abaixo:

### 📱 Frontend (Mobile)
Toda a lógica de interface, telas e componentes visuais.
- **[📄 Ler Documentação do Frontend](./fifa-card-builder/FRONTEND_DOCUMENTATION.md)**
- **Tecnologias:** React Native, Expo.

### 🖥️ Backend (API)
Servidor responsável por gerenciar os dados dos jogadores, cartas e regras de negócio.
- **[📄 Ler Documentação da API](./fifa-card-builder-api/API_DOCUMENTATION.md)**
- **Tecnologias:** Node.js, Express.

---

## 🚀 Guia Rápido de Execução

Para utilizar o sistema completo, você deve rodar os dois serviços simultaneamente (em terminais separados).

### 1. Rodando a API (Backend)
```bash
cd fifa-card-builder-api
npm install
npm start
```
*O servidor rodará por padrão na porta 3000.*

### 2. Rodando o App (Frontend)
```bash
cd fifa-card-builder
npm install
npx expo start
```
*Use o aplicativo Expo Go no seu celular ou um emulador para visualizar.*

---

## 📂 Estrutura do Repositório

- `/fifa-card-builder` - Código fonte do aplicativo mobile.
- `/fifa-card-builder-api` - Código fonte da API e banco de dados.

# Documentação do Frontend - FIFA Card Builder

## 1. Visão Geral
O **FIFA Card Builder** é uma aplicação móvel desenvolvida em **React Native** com **Expo**, projetada para permitir que usuários criem, visualizem e gerenciem cartas personalizadas de jogadores no estilo FIFA (Ultimate Team). A aplicação se comunica com uma API backend para persistência de dados.

## 2. Tecnologias Utilizadas
*   **React Native**: Framework principal para desenvolvimento mobile.
*   **Expo**: Plataforma para facilitar o desenvolvimento, build e deploy.
*   **React Navigation**: Gerenciamento de rotas e navegação entre telas (Native Stack).
*   **Axios**: Cliente HTTP para comunicação com a API.
*   **Expo Image Picker**: Biblioteca para acesso à galeria e câmera do dispositivo.
*   **Remove.bg API**: Integração para remoção automática de fundo das fotos dos jogadores.

## 3. Estrutura do Projeto

```
fifa-card-builder/
├── assets/             # Imagens estáticas (templates de cartas, ícones)
├── components/         # Componentes reutilizáveis de UI
│   └── FifaCard.js     # Componente visual da carta
├── screens/            # Telas da aplicação
│   ├── Home.js         # Menu principal
│   ├── ConsultCards.js # Listagem de cartas
│   ├── CreateCard.js   # Criação de cartas
│   └── CreatePlayer.js # Cadastro de jogadores
├── services/           # Camada de comunicação com a API
│   ├── api.js          # Configuração do Axios
│   ├── CardService.js  # Endpoints de Cartas
│   ├── PlayerService.js# Endpoints de Jogadores
│   └── SportService.js # Endpoints de Esportes
├── App.js              # Ponto de entrada e configuração de rotas
└── package.json        # Dependências e scripts
```

## 4. Instalação e Execução

### Pré-requisitos
*   Node.js instalado.
*   Expo CLI ou aplicativo Expo Go no celular.

### Passos
1.  Navegue até a pasta do projeto:
    ```bash
    cd fifa-card-builder
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Inicie o projeto:
    ```bash
    npx expo start
    ```
4.  Escaneie o QR Code com o aplicativo Expo Go (Android/iOS) ou pressione `w` para abrir na web (funcionalidades de câmera podem ser limitadas na web).

## 5. Telas (Screens)

### `Home.js`
*   **Função**: Tela inicial da aplicação.
*   **Navegação**: Fornece botões para navegar para "Nova Carta", "Novo Jogador" e "Consultar Cartas".

### `CreatePlayer.js`
*   **Função**: Formulário para cadastrar um novo jogador.
*   **Funcionalidades**:
    *   **Input de Nome**: Campo de texto para o nome do jogador.
    *   **Seleção de Imagem**: Utiliza `expo-image-picker` para selecionar uma foto da galeria.
    *   **Remoção de Fundo**: Integração com a API `remove.bg`. Ao selecionar uma foto, o app tenta remover o fundo automaticamente. Se falhar (ou sem chave de API), usa a imagem original.
    *   **Conversão Base64**: As imagens são convertidas para Base64 antes de serem enviadas ao backend.
    *   **Validação**: Verifica tamanho da imagem (limite de ~2.5MB) e campos obrigatórios.

### `CreateCard.js`
*   **Função**: Formulário para criar uma carta vinculada a um jogador e um esporte.
*   **Funcionalidades**:
    *   Seleção de Jogador (dropdown).
    *   Seleção de Esporte (dropdown).
    *   Definição de Atributos (ex: Ataque, Defesa) baseados no esporte selecionado.
    *   Cálculo automático ou manual do *Overall*.

### `ConsultCards.js`
*   **Função**: Exibe uma lista de todas as cartas criadas.
*   **Funcionalidades**:
    *   Renderiza cada carta usando o componente `FifaCard`.
    *   Permite visualizar os detalhes visuais finais da carta.

## 6. Componentes

### `FifaCard.js`
*   **Descrição**: O componente central que desenha a carta.
*   **Props**: Recebe um objeto `card` contendo dados do jogador, esporte e atributos.
*   **Lógica Visual**:
    *   **Template**: Seleciona o fundo (Ouro, Prata, Bronze) baseado no *Overall* (>=75 Ouro, >=65 Prata, <65 Bronze).
    *   **Layout**: Posiciona a foto do jogador, nome, *overall*, posição, ícone do esporte e atributos em posições absolutas sobre o template da carta.
    *   **Atributos Dinâmicos**: Exibe as siglas dos atributos (ex: PAC, SHO para futebol; ATK, BLO para vôlei) dinamicamente baseados nas definições do esporte.

## 7. Serviços (Services)

A comunicação com o backend é centralizada na pasta `services`.

*   **`api.js`**: Cria uma instância do Axios. **Importante**: O `baseURL` deve apontar para o IP da sua máquina local (ex: `http://192.168.x.x:3000`) para funcionar em dispositivos físicos, ou `localhost` para emuladores.

*   **`PlayerService.js`**:
    *   `createPlayer(data)`: POST /player
    *   `getPlayerById(id)`: GET /player/:id
    *   `updatePlayer(id, data)`: PUT /player/:id

*   **`CardService.js`**:
    *   `getCards()`: GET /card
    *   `createCard(data)`: POST /card
    *   `deleteCard(id)`: DELETE /card/:id

*   **`SportService.js`**:
    *   `getSports()`: GET /sport (Usado para popular os dropdowns de criação de carta).

## 8. Fluxo de Dados Típico

1.  Usuário acessa `CreatePlayer` -> Seleciona foto -> App remove fundo -> Envia JSON (Nome + Base64) para API -> API salva no MongoDB.
2.  Usuário acessa `CreateCard` -> App busca jogadores e esportes na API -> Usuário preenche atributos -> Envia JSON para API.
3.  Usuário acessa `ConsultCards` -> App busca cartas -> Renderiza lista usando `FifaCard`.

## 9. Configuração da API Remove.bg
No arquivo `screens/CreatePlayer.js`, existe uma constante `REMOVE_BG_API_KEY`. Para que a remoção de fundo funcione, é necessário uma chave válida da [remove.bg](https://www.remove.bg/api).

# API de Cartas estilo FIFA

Este documento descreve a API implementada neste workspace. Ele cobre modelos, regras de validação, endpoints e exemplos de requisições.

**URL Base:** `http://localhost:3000`

## 🚀 Como Rodar

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Inicie o servidor:
   ```bash
   npm start
   ```
   *O servidor rodará em modo de desenvolvimento usando nodemon.*

3. Teste rápido de conectividade:
   ```bash
   curl http://localhost:3000/test
   ```

---

## 🛠️ Scripts Utilitários

### Popular Banco de Dados (`populate_db.py`)
Existe um script Python na raiz deste projeto (`fifa-card-builder-api/populate_db.py`) que limpa o banco de dados e insere dados iniciais de Esportes (Futebol, Basquete, Vôlei, Tênis, Futebol Americano) com seus respectivos atributos e ícones.

**Como usar:**
1. Certifique-se de ter Python instalado e a biblioteca `requests`.
   ```bash
   pip install requests
   ```
2. Com o servidor rodando (`npm start`), execute:
   ```bash
   python populate_db.py
   ```

---

## 📦 Modelos (Models)

- **`Player`** (`src/model/PlayerModel.js`)
  - `playerId` (string, único)
  - `name` (string, obrigatório)
  - `photo` (string, obrigatório) — aceita Data URI ou base64. O middleware normaliza para Data URI.

- **`Sport`** (`src/model/SportModel.js`)
  - `sportId` (string, único)
  - `name` (string, obrigatório)
  - `icon` (string, opcional) — URL ou Data URI do ícone do esporte.
  - `attributeDefs` (array) — metadados para o front-end (chaves, labels, valores min/max/padrão).

- **`PlayerSport`** (`src/model/PlayerSportModel.js`)
  - `playerSportId` (string, único)
  - `player` (ObjectId ref `Player`, obrigatório)
  - `sport` (ObjectId ref `Sport`, obrigatório)
  - `position` (string, opcional)
  - `overall` (número 0–100) — valor armazenado; pode ser fornecido pelo cliente ou calculado pelo servidor.
  - `attributes` (objeto) — chaves/valores dos atributos fornecidos pela API ou cliente.

---

## 🛡️ Validação (Middlewares)

- **`PlayerValidation`** (`src/middlewares/PlayerValidation.js`)
  - `name`: obrigatório, string, tamanho mínimo 2.
  - `photo`: obrigatório, deve ser base64 ou Data URI; tipos MIME permitidos: `image/png`, `image/jpeg`, `image/jpg`, `image/webp`, `image/gif`.
  - Impõe um tamanho máximo de imagem decodificada de 2.5 MB e normaliza `req.body.photo` para o formato `data:<mime>;base64,<data>`.

- **`SportValidation`** (`src/middlewares/SportValidation.js`)
  - `name`: obrigatório, string, tamanho mínimo 2.
  - `icon`: string opcional.
  - Em `PUT /sport/:id`: verifica se o `:id` tem formato ObjectId válido e se o esporte existe.

- **`PlayerSportValidation`** (`src/middlewares/PlayerSportValidation.js`)
  - `player` e `sport`: obrigatórios, ObjectId válido, devem existir no banco.
  - `attributes`: objeto obrigatório (não array), deve conter entre 3 e 6 chaves.
  - Cada valor de atributo: numérico 0..100 (o backend valida, mas não altera os valores).
  - `overall` (opcional): se fornecido, numérico 0..100 (validado).
  - Se `overall` não for fornecido, o controller calcula uma média simples e armazena.

---

## 🔗 Endpoints

Todos os corpos de requisição/resposta são JSON, a menos que indicado o contrário.

### Jogadores (Players)

- `POST /player` — criar um jogador
  - Middleware: `PlayerValidation`
  - Corpo:
    ```json
    {
      "name": "Nome do Jogador",
      "photo": "data:image/png;base64,AAAA..." // ou base64 puro
    }
    ```
  - Resposta: `201` Created com o objeto Player.

- `GET /player` — listar jogadores

- `GET /player/:id` — obter jogador por id

- `PUT /player/:id` — atualizar jogador
  - Middleware: `PlayerValidation`

- `DELETE /player/:id` — deletar jogador

### Esportes (Sports)

- `POST /sport` — criar esporte
  - Middleware: `SportValidation`
  - Exemplo de corpo:
    ```json
    {
      "name": "Futebol",
      "icon": "https://exemplo.com/icon.png",
      "attributeDefs": [
        { "key": "pac", "label": "Ritmo", "min": 0, "max": 99, "default": 70 },
        { "key": "sho", "label": "Chute", "min": 0, "max": 99, "default": 65 }
      ]
    }
    ```

- `GET /sport` — listar esportes
- `GET /sport/:id` — obter esporte (inclui `attributeDefs`)
- `PUT /sport/:id` — atualizar esporte (usa `SportValidation`)
- `DELETE /sport/:id` — deletar esporte

### Cartas (PlayerSport)

- `POST /playersport` — criar uma carta (vínculo jogador-esporte)
  - Middleware: `PlayerSportValidation`
  - Exemplos de corpo:
    - Deixar o servidor calcular o overall:
      ```json
      {
        "player":"<playerObjectId>",
        "sport":"<sportObjectId>",
        "attributes":{"pac":80,"sho":77,"pas":75},
        "position":"ATA"
      }
      ```
    - Fornecer overall manualmente:
      ```json
      {
        "player":"<playerObjectId>",
        "sport":"<sportObjectId>",
        "attributes":{"pac":80,"sho":77,"pas":75},
        "overall":90
      }
      ```
  - Regras:
    - `attributes` deve ser um objeto com 3 a 6 chaves.
    - valores numéricos 0..100.
    - Se `overall` for fornecido, deve ser 0..100; caso contrário, o servidor calcula a média arredondada.

- `GET /playersport` — listar todas as cartas (popula os campos `player` e `sport`)
- `DELETE /playersport/:id` — deletar uma carta

---

## 💻 Exemplos de Requisição (cURL)

- **Criar Jogador:**
```bash
curl -X POST http://localhost:3000/player \
 -H "Content-Type: application/json" \
 -d '{"name":"Fulano da Silva","photo":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUg..."}'
```

- **Criar Esporte:**
```bash
curl -X POST http://localhost:3000/sport \
 -H "Content-Type: application/json" \
 -d '{"name":"Futebol","icon":"...","attributeDefs":[{"key":"pac","label":"Ritmo","min":0,"max":99,"default":70}]}'
```

- **Criar Carta (Servidor calcula Overall):**
```bash
curl -X POST http://localhost:3000/playersport \
 -H "Content-Type: application/json" \
 -d '{"player":"<playerId>","sport":"<sportId>","attributes":{"pac":80,"sho":77,"pas":75},"position":"ATA"}'
```

---

## 📝 Notas & Recomendações

- **Armazenamento de Fotos:** Atualmente, as fotos são armazenadas como Data URIs (Base64) diretamente no banco de dados (MongoDB). Para produção, considere armazenar as imagens em disco ou nuvem (AWS S3, Firebase Storage) e salvar apenas as URLs no banco.
- **Atributos:** O backend valida se os valores são numéricos, mas espera que o frontend envie o objeto de atributos correto (3–6 chaves). As definições (`attributeDefs`) no modelo `Sport` servem como metadados para a UI construir os formulários dinamicamente.
- **Rotas:** As rotas atuais estão no singular (`/player`, `/sport`, `/playersport`).

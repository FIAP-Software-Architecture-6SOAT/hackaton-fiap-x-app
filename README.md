# FIAP X App
> Projeto do curso de pós graduação da FIAP

## Requisitos para deploy
- Banco de dados em produção
- Cluster EKS em produção
<br />

## Secrets
Secrets cadastradas no repositório do GitHub

```bash
AWS_REGION
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_SESSION_TOKEN
MONGODB_CONNECTION_STRING
DOCKERHUB_TOKEN
```

## Como rodar o projeto local?
### Docker compose
- Para iniciar
```bash
docker compose up
```
- Para encerrar
```bash
docker compose down
```

## Endpoints

### Auth routes

| Method | Endpoint           | Description       |
| ------ | ------------------ | ----------------- |
| POST   | `/auth/login`      | login do usuário  |


### User routes

| Method | Endpoint                   | Description          |
| ------ | -------------------------- | -------------------- |
| POST   | `/user`                    | Criar usuário        |

### Video routes

| Method | Endpoint                     | Description                |
| ------ | ---------------------------- | -------------------------- |
| GET    | `/videos`                    | Todos os vídeo do usuário  |
| GET    | `/videos/:id`                | Um vídeo do usuário        |
| GET    | `/videos/:id/download/image` | Link para download         |
| POST   | `/videos/upload`             | Upload de vídeo            |

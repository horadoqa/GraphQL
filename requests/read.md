# CURL

Como seu servidor está rodando em `http://localhost:4000`, você pode fazer a consulta `users` com:

```bash
curl -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { users { id name email password administrador } }"
  }' | jq
```

 A resposta deve ser parecida com:

```json
{
  "data": {
    "users": [
      {
        "id": "1",
        "name": "Hora do QA",
        "email": "horadoqa@email.com"
      }
    ]
  }
}
```

## Testando a busca por ID

Para executar:

```
query {
  user(id: "1") {
    id
    name
    email
  }
}
```

 Use:

```bash
curl -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { user(id: \"1\") { id name email password administrador} }"
  }' | jq
```

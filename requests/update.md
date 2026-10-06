# UPDATE

Utilizando o arquivo `update.json`

```json
{
  "query": "mutation UpdateUser($id: ID!, $name: String!, $email: String!) { updateUser(id: $id, name: $name, email: $email) { id name email } }",
  "variables": {
    "id": "2",
    "name": "Ricardo Fahham - Atualizado",
    "email": "ricardo.fahham@email.com"
  }
}
```

O Comando:

```bash
curl -s -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -d @update.json | jq
```

A resposta:

```json
{
  "data": {
    "updateUser": {
      "id": "2",
      "name": "Ricardo Fahham - Atualizado",
      "email": "ricardo.fahham@email.com"
    }
  }
}
```
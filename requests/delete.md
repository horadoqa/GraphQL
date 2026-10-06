# Delete

Utilizando o arquivo `request.json`

```json
{
  "query": "mutation DeleteUser($id: ID!) { deleteUser(id: $id) { id name email } }",
  "variables": {
    "id": "2"
  }
}
```

O Comando:

```bash
curl -s -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -d @delete.json | jq
```

A resposta será:

```json
{
  "data": {
    "deleteUser": {
      "id": "2",
      "name": "Ricardo Fahham - Atualizado",
      "email": "ricardo.fahham@email.com"
    }
  }
}
```

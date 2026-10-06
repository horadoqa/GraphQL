# Deletar Registros

Para deletar os registros, precisamos executar:

```bash
curl -s -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -d '{"query":"query { users { id } }"}' \
  | jq -r '.data.users[].id' > ids.csv
```


Não incluir o usuário protegido

```bash
(
  echo "id"
  curl -s -X POST http://localhost:4000 \
    -H "Content-Type: application/json" \
    -d '{"query":"query { users { id } }"}' \
    | jq -r '.data.users[].id | select(. != "00M9D1vh4YvezjL9")'
) > ids.csv

```



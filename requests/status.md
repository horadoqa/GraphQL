# Status Code

Para verificar o Status Code

Como sua API GraphQL precisa retornar o JSON:

```
curl -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { users { id name email password administrador } }"
  }' | jq
```

 Ou, de forma mais curta:

```
curl http://localhost:4000 \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { users { id name email password administrador } }"
  }' | jq
```

 O `curl` identifica o `POST` automaticamente quando você usa `-d`.

 ### Se você quer verificar apenas o status HTTP

```
curl -s -o /dev/null \
  -w "HTTP Status: %{http_code}\n" \
  -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { users { id name email password administrador } }"
  }'
```

 Isso vai retornar algo como:

```
HTTP Status: 200
```

Para testar sua API GraphQL, eu usaria o **primeiro comando**, porque você consegue verificar também se a resposta contém os usuários corretamente.

```bash
curl -s -o /dev/null \
  -w "HTTP Status: %{http_code}\n" \
  -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { users { id name email password administrador } }"
  }'

```

Resposta:

```bash
HTTP Status: 200
```
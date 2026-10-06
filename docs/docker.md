# Docker

Subindo uma stack com Docker

## Buidando a aplicação

```bash
docker compose up --build
```

Conferindo o Container

```bash
docker ps
CONTAINER ID   IMAGE                COMMAND                  CREATED          STATUS                   PORTS                                         NAMES
5652735fa04a   418117aef783         "docker-entrypoint.s…"   14 minutes ago   Up 8 minutes             0.0.0.0:4000->4000/tcp, [::]:4000->4000/tcp   graphql-api
e5a66c04a540   postgres:17-alpine   "docker-entrypoint.s…"   14 minutes ago   Up 8 minutes (healthy)                                                 graphql-postgres
```

Verificanco o Appolo

```bash
curl http://localhost:4000
```


```bash
curl -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __typename }"}' | jq
```

Resposta:

```json
{
  "data": {
    "__typename": "Query"
  }
}
```

## Removendo os containers

```bash
docker-compose down -v
```

## Conferindo

```bash
docker ps
CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
```


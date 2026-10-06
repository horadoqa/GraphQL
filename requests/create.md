# Create

Direto via linha de comando

```bash
curl -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { createUser(name: \"Ricardo Fahham\", email: \"ricardo.fahham@email.com\") { id name email } }"
  }'
```

A resposta

```json
{"data":{"createUser":{"id":"2","name":"Ricardo Fahham","email":"ricardo.fahham@email.com"}}}
```

### **como fazer essas mesmas requisições usando variáveis GraphQL**, que é a forma mais correta para uma aplicação real.

E essa é a forma que você vai querer usar em uma aplicação real, porque evita concatenar valores diretamente dentro da query.

 ## 1\. Query `users`

 Essa não precisa de variável porque não recebe parâmetros:

```
curl -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { users { id name email } }"
  }'
```

 ## 2\. Buscar usuário por ID usando variável

 Em vez de:

```
query {
  user(id: "1") {
    id
    name
    email
  }
}
```

 usamos:

```
query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
    email
  }
}
```

 E enviamos o valor de `$id` separadamente através de `variables`:

```
curl -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query GetUser($id: ID!) { user(id: $id) { id name email } }",
    "variables": {
      "id": "1"
    }
  }'
```

 A ideia é:

```
query
  ↓
$id
  ↓
variables.id = "1"
  ↓
user(id: $id)
```

 Isso é especialmente útil porque o valor pode vir de um formulário, URL, banco de dados etc., sem precisar montar a string da query.

 ## 3\. Mutation usando variáveis

 Aqui fica ainda mais interessante.

 Hoje nosso schema está assim:

```
type Mutation {
  createUser(name: String!, email: String!): User!
}
```

Podemos fazer:

```
mutation CreateUser($name: String!, $email: String!) {
  createUser(name: $name, email: $email) {
    id
    name
    email
  }
}
```

 No `curl`:

```bash
curl -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation CreateUser($name: String!, $email: String!) { createUser(name: $name, email: $email) { id name email } }",
    "variables": {
      "name": "Ricardo Fahham",
      "email": "Ricardo Fahham@email.com"
    }
  }'
```

 Resposta:

```
{
  "data": {
    "createUser": {
      "id": "2",
      "name": "Ricardo Fahham",
      "email": "Ricardo Fahham@email.com"
    }
  }
}
```

 ## 4\. Uma forma melhor de usar o curl

 Para queries maiores, colocar tudo em uma linha fica ruim. Você pode usar um arquivo JSON.

 Por exemplo, crie `create.json`:

```json
{
  "query": "mutation CreateUser($name: String!, $email: String!) { createUser(name: $name, email: $email) { id name email } }",
  "variables": {
    "name": "Ricardo Fahham",
    "email": "ricardo.fahham@email.com"
  }
}
```

 E execute:

```bash
curl -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -d @create.json | jq
```

A resposta:

```json
{
  "data": {
    "createUser": {
      "id": "2",
      "name": "Ricardo Fahham",
      "email": "ricardo.fahham@email.com"
    }
  }
}
```

 Isso fica muito mais fácil de manter.

 ### Um detalhe importante

 GraphQL possui **dois conceitos diferentes**:

```
query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
  }
}
```

Aqui:

- `$id` → variável definida pela operação.
- `id: $id` → argumento passado para o resolver.
- `"variables": { "id": "1" }` → valor fornecido pelo cliente.

 Esse padrão é fundamental em GraphQL.

 **Próximo passo recomendado:** podemos melhorar seu `createUser` para receber um `input`:

```
mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    name
    email
  }
}
```

Isso é um padrão muito comum em APIs GraphQL reais e vai deixar seu projeto bem mais próximo de uma aplicação de produção.
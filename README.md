# Aplicação com GraphQL

Projeto desenvolvido para estudar e praticar **GraphQL** utilizando **Node.js, TypeScript e Apollo Server**.

O objetivo é construir uma API GraphQL evoluindo gradualmente de um exemplo simples em memória para uma API CRUD completa utilizando banco de dados.

---

# Sobre

## O que é GraphQL?

GraphQL é uma linguagem de consulta para APIs que permite ao cliente especificar exatamente quais dados deseja receber.

Em uma API REST tradicional, normalmente temos diferentes endpoints:

```
GET    /users
GET    /users/1
POST   /users
PUT    /users/1
DELETE /users/1
```

No GraphQL, normalmente trabalhamos com um único endpoint e diferentes operações:

```
query
mutation
```

Por exemplo:

```
query {
  users {
    id
    name
    email
  }
}
```

O cliente recebe somente os campos solicitados.

---

## Principais conceitos

 Uma aplicação GraphQL normalmente possui três partes principais:

### Schema

 Define os tipos de dados e as operações disponíveis na API.

```
type User {
  id: ID!
  name: String!
  email: String!
}
```

 ### Resolvers

 Implementam a lógica responsável por buscar ou alterar os dados.

```
Query: {
  users: () => users,
}
```

 ### Servidor GraphQL

 Recebe as requisições, valida as operações de acordo com o schema e executa os resolvers correspondentes.

 Neste projeto utilizamos o **Apollo Server**.

---

 # Projeto

 ## Tecnologias

 | Tecnologia | Utilização |
| --- | --- |
| Node.js | Runtime |
| TypeScript | Linguagem |
| GraphQL | API |
| Apollo Server | Servidor GraphQL |
| nanoid | Geração de IDs |
| Prisma | ORM |
| PostgreSQL | Banco de dados |
| Apollo Client | Cliente GraphQL |
| React | Frontend |

A arquitetura planejada é:

```
React
   ↓
Apollo Client
   ↓
Apollo Server
   ↓
GraphQL
   ↓
Prisma
   ↓
PostgreSQL
```

---

 ## Por que Apollo Server?

 O **Apollo Server** é uma opção consolidada no ecossistema GraphQL e possui ferramentas voltadas para aplicações que podem evoluir para arquiteturas maiores.

 Também existe o **GraphQL Yoga**, que é uma alternativa bastante utilizada e possui suporte a diferentes runtimes e ambientes.

 Neste projeto, a escolha é pelo Apollo Server para manter o foco no ecossistema Apollo e facilitar uma possível evolução para arquiteturas utilizando Apollo Federation.

 Uma arquitetura futura poderia ser:

 Mermaid flowchart: Frontend, Apollo Router, Serviço de Usuários, Serviço de Produtos, Serviço de Pedidos

Nesse cenário, diferentes serviços podem participar de um único grafo GraphQL.

---

 # Consultas

 As consultas GraphQL são chamadas de **Queries**.

 ## Listar usuários

```
query {
  users {
    id
    name
    email
  }
}
```

 Resposta:

```
{
  "data": {
    "users": [
      {
        "id": "00M9D1vh4YvezjL9",
        "name": "Hora do QA",
        "email": "horadoqa@email.com"
      }
    ]
  }
}
```

---

 ## Buscar um usuário

 Podemos consultar um usuário específico utilizando seu ID:

```
query {
  user(id: "00M9D1vh4YvezjL9") {
    id
    name
    email
  }
}
```

---

 # Mutações

 As operações que alteram dados são chamadas de **Mutations**.

 Neste projeto temos:

```
createUser
updateUser
deleteUser
```

---

 ## Criar usuário

```
mutation {
  createUser(
    name: "Ricardo Fahham"
    email: "ricardo.fahham@email.com"
    password: "1q2w3e4r"
    administrador: true
  ) {
    id
    name
    email
    administrador
  }
}
```

 O ID é gerado automaticamente pelo servidor utilizando `nanoid`.

 Exemplo:

```
{
  "id": "X7kP2mQa9Lw3NzRt",
  "name": "Ricardo Fahham",
  "email": "ricardo.fahham@email.com",
  "administrador": true
}
```

 O cliente não precisa informar o ID.

---

 ## GraphQL Variables

 Em vez de colocar os valores diretamente na mutation, podemos utilizar **Variables**.

 Query:

```
mutation CreateUser(
  $name: String!
  $email: String!
  $password: String!
  $administrador: Boolean!
) {
  createUser(
    name: $name
    email: $email
    password: $password
    administrador: $administrador
  ) {
    id
    name
    email
    administrador
  }
}
```

 Variables:

```
{
  "name": "Ricardo Fahham",
  "email": "ricardo.fahham@email.com",
  "password": "1q2w3e4r",
  "administrador": true
}
```

 Essa abordagem é especialmente importante quando começarmos a trabalhar com aplicações reais.

---

 ## Atualizar usuário

 Para atualizar um usuário, utilizamos o ID retornado anteriormente:

```
mutation UpdateUser(
  $id: ID!
  $name: String!
  $email: String!
  $password: String!
  $administrador: Boolean!
) {
  updateUser(
    id: $id
    name: $name
    email: $email
    password: $password
    administrador: $administrador
  ) {
    id
    name
    email
    administrador
  }
}
```

 Variables:

```
{
  "id": "X7kP2mQa9Lw3NzRt",
  "name": "Ricardo Fahham - Atualizado",
  "email": "ricardo.fahham@email.com",
  "password": "1q2w3e4r",
  "administrador": false
}
```

---

 ## Excluir usuário

```
mutation DeleteUser($id: ID!) {
  deleteUser(id: $id) {
    id
    name
    email
  }
}
```

 Variables:

```
{
  "id": "X7kP2mQa9Lw3NzRt"
}
```

---

 # Estrutura do projeto

 A estrutura inicial pode ser:

```
horadoqa/
├── src/
│   ├── index.ts
│   ├── schema.ts
│   └── resolvers.ts
│
├── requests/
│   ├── create.json
│   ├── read.json
│   ├── update.json
│   └── delete.json
│
├── package.json
├── tsconfig.json
└── README.md
```

A pasta `requests` pode ser utilizada para armazenar exemplos de requisições GraphQL que podem ser executadas utilizando `curl`.

---

 # Configuração do projeto

 ## 1\. Criar o projeto

```
mkdir horadoqa
cd horadoqa

npm init -y
```

 ## 2\. Instalar dependências

```
npm install @apollo/server graphql nanoid
npm install -D typescript tsx @types/node
```

 ## 3\. Schema

 Crie `src/schema.ts`:

```
export const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    administrador: Boolean!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    createUser(
      name: String!
      email: String!
      password: String!
      administrador: Boolean!
    ): User!

    updateUser(
      id: ID!
      name: String!
      email: String!
      password: String!
      administrador: Boolean!
    ): User

    deleteUser(id: ID!): User
  }
`;
```

---

 # Resolvers

 Crie `src/resolvers.ts`:

```
import { nanoid } from "nanoid";

const users = [
  {
    id: "00M9D1vh4YvezjL9",
    name: "Hora do QA",
    email: "horadoqa@email.com",
    password: "1q2w3e4r",
    administrador: true,
  },
];

export const resolvers = {
  Query: {
    users: () => users,

    user: (_: unknown, args: { id: string }) => {
      return users.find(user => user.id === args.id);
    },
  },

  Mutation: {
    createUser: (
      _: unknown,
      args: {
        name: string;
        email: string;
        password: string;
        administrador: boolean;
      }
    ) => {
      const user = {
        id: nanoid(16),
        name: args.name,
        email: args.email,
        password: args.password,
        administrador: args.administrador,
      };

      users.push(user);

      return user;
    },

    updateUser: (
      _: unknown,
      args: {
        id: string;
        name: string;
        email: string;
        password: string;
        administrador: boolean;
      }
    ) => {
      const user = users.find(user => user.id === args.id);

      if (!user) {
        return null;
      }

      user.name = args.name;
      user.email = args.email;
      user.password = args.password;
      user.administrador = args.administrador;

      return user;
    },

    deleteUser: (_: unknown, args: { id: string }) => {
      const index = users.findIndex(user => user.id === args.id);

      if (index === -1) {
        return null;
      }

      const [deletedUser] = users.splice(index, 1);

      return deletedUser;
    },
  },
};
```

 > **Nota:** este exemplo utiliza um array em memória apenas para fins didáticos. Os dados serão perdidos quando o servidor for reiniciado.

 Em uma aplicação real, as informações deverão ser armazenadas em um banco de dados.

---

 # Servidor

 Crie `src/index.ts`:

```
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function startServer() {
  const { url } = await startStandaloneServer(server, {
    listen: {
      port: 4000,
    },
  });

  console.log(`🚀 Servidor rodando em ${url}`);
}

startServer();
```

 No `package.json`:

```
{
  "scripts": {
    "dev": "tsx watch src/index.ts"
  }
}
```

 Execute:

```
npm run dev
```

 Servidor:

```
http://localhost:4000
```

---

 # Testando com cURL

 ## Create

```
curl -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -d @requests/create.json | jq
```

 ## Read

```
curl -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -d @requests/read.json | jq
```

 ## Update

```
curl -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -d @requests/update.json | jq
```

 ## Delete

```
curl -X POST http://localhost:4000 \
  -H "Content-Type: application/json" \
  -d @requests/delete.json | jq
```

---

 # ID dos usuários

 Os usuários utilizam IDs gerados pelo `nanoid`.

 Exemplo:

```
00M9D1vh4YvezjL9
X7kP2mQa9Lw3NzRt
V1StGXR8_Z5jdHi6
```

 A geração é feita no servidor:

```
id: nanoid(16)
```

 Dessa forma, o cliente não precisa controlar a sequência dos IDs.

 Isso é preferível à utilização de:

```
id: String(users.length + 1)
```

 porque IDs sequenciais baseados no tamanho atual do array podem gerar duplicidades após exclusões.

---

 # Evolução do projeto

 O projeto será evoluído gradualmente.

 ## Etapa 1 — GraphQL básico

 - [x] Apollo Server
- [x] TypeScript
- [x] Schema
- [x] Queries
- [x] Mutations
- [x] CRUD de usuários
- [x] GraphQL Variables
- [x] Geração de IDs com nanoid

 ## Etapa 2 — Organização

 - [ ] Input Types
- [ ] Separação de tipos
- [ ] Validações
- [ ] Tratamento de erros
- [ ] Organização por módulos
- [ ] Services
- [ ] Repository Pattern

 ## Etapa 3 — Banco de dados

```
GraphQL
   ↓
Resolvers
   ↓
Services
   ↓
Prisma
   ↓
PostgreSQL
```

 - [ ] Prisma
- [ ] PostgreSQL
- [ ] Migrations
- [ ] Models
- [ ] Relacionamentos
- [ ] Paginação
- [ ] Filtros

 ## Etapa 4 — Segurança

 - [ ] Hash de senha
- [ ] Autenticação
- [ ] JWT
- [ ] Autorização
- [ ] Controle de acesso
- [ ] Validação de entrada

 ## Etapa 5 — Frontend

```
React
   ↓
Apollo Client
   ↓
GraphQL API
```

 - [ ] Apollo Client
- [ ] Queries
- [ ] Mutations
- [ ] Cache
- [ ] Loading states
- [ ] Error handling

---

 # Objetivo final

 Ao final do projeto, teremos uma aplicação seguindo uma arquitetura próxima da encontrada em projetos profissionais:

```
                    ┌──────────────┐
                    │    React     │
                    └──────┬───────┘
                           │
                    Apollo Client
                           │
                           ▼
                    ┌──────────────┐
                    │    GraphQL   │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │    Apollo    │
                    │    Server    │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │   Services   │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │    Prisma    │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │  PostgreSQL  │
                    └──────────────┘
```

 A ideia é utilizar este projeto como laboratório para entender, na prática, como construir uma API GraphQL desde os conceitos fundamentais até uma arquitetura mais próxima de uma aplicação profissional.

 Eu faria **“Sobre”, “Projeto” e “Consultas” como os três primeiros blocos principais**, exatamente como você pensou. Depois entraria em **Mutações**, porque elas são a continuação natural das consultas. Isso deixa o README muito mais fácil de acompanhar enquanto você evolui o projeto.
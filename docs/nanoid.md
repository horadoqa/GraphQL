# Nanoid

Na versão anterior a geração do ID é feita no **resolver**. 

Hoje ela está sendo feita aqui:

```
id: String(users.length + 1),
```

 Se você quer usar IDs como `"00M9D1vh4YvezjL9"`, pode substituir essa lógica por uma função de geração de ID.

 Por exemplo, usando `nanoid`:

```
npm install nanoid
```

 E no resolver:

```
import { nanoid } from "nanoid";

const users = [
  {
    id: "00M9D1vh4YvezjL9",
    name: "Hora do QA",
    email: "horadoqa@email.com",
    password: "1q2w3e4r",
    administrador: true,
  }
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

 A cada `createUser`, o `nanoid(16)` produzirá algo nesse estilo:

```
00M9D1vh4YvezjL9
V1StGXR8_Z5jdHi6
kP3x7LmN2QaBcR8T
```

 ### Mas tem um detalhe importante

 Eu **não recomendo** fazer:

```
id: String(users.length + 1)
```

 porque seu `deleteUser` pode criar IDs duplicados.

 Exemplo:

```
1
2
3
```

 Você remove o `3`:

```
1
2
```

 Agora `users.length` é `2`. O próximo usuário recebe:

```
id: "3"
```

 Isso ainda funciona nesse caso. Mas se você remover o usuário `2`:

```
1
3
```

 `users.length` volta a ser `2`, e o próximo usuário receberá:

```
id: "3"
```

 **Colisão de ID.**

 Com `nanoid`, você elimina esse problema de forma muito mais apropriada.

 E eu manteria o campo como **`id`**, não `_id`, no seu GraphQL, a menos que você tenha uma razão específica para usar `_id`. `_id` é muito associado ao MongoDB; para sua API GraphQL, `id: ID!` é uma convenção mais natural.

 Se você me mostrar também seu **`typeDefs`/schema GraphQL**, posso adaptar o `createUser`, `updateUser` e `deleteUser` para ficar bem estruturado, inclusive permitindo **enviar um ID customizado no `createUser`** se é isso que você está querendo fazer.
import { GraphQLError } from "graphql";
import { nanoid } from "nanoid";

const DEFAULT_USER_ID = "00M9D1vh4YvezjL9";

const users = [
  {
    id: DEFAULT_USER_ID,
    name: "Hora do QA",
    email: "horadoqa@email.com",
    password: "1q2w3e4r",
    administrador: true,
  }
];

export const resolvers = {
  Query: {
    users: () => users,

    usersCount: () => users.length,

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
      if (args.id === DEFAULT_USER_ID) {
        throw new GraphQLError(
          "O usuário padrão não pode ser alterado.",
          {
            extensions: {
              code: "FORBIDDEN",
            },
          }
        );
      }

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
      if (args.id === DEFAULT_USER_ID) {
        throw new GraphQLError(
          "O usuário padrão não pode ser excluído.",
          {
            extensions: {
              code: "FORBIDDEN",
            },
          }
        );
      }

      const index = users.findIndex(user => user.id === args.id);

      if (index === -1) {
        return null;
      }

      const [deletedUser] = users.splice(index, 1);

      return deletedUser;
    },

  },
};
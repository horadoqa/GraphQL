const users = [
  {
    id: "1",
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
      args: { name: string; email: string; password: string; administrador: boolean }
    ) => {
      const user = {
        id: String(users.length + 1),
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
      args: { id: string; name: string; email: string; password: string; administrador: boolean }
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

    deleteUser: (
      _: unknown,
      args: { id: string }
    ) => {
      const index = users.findIndex(user => user.id === args.id);

      if (index === -1) {
        return null;
      }

      const [deletedUser] = users.splice(index, 1);

      return deletedUser;
    },

  },

};
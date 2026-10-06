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
    createUser(name: String!, email: String!, password: String!, administrador: Boolean!): User!
    updateUser(id: ID!, name: String!, email: String!, password: String!, administrador: Boolean!): User
    deleteUser(id: ID!): User
  }`;
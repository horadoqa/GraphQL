# Querys

## Consultar a quantidade de registros

No Apollo: `http://localhost:4000/`


query {
  usersCount
}

## Consultar os registros

query {
  users {
    id
    name
    email
    password
    administrador
  }
}
import { test, expect } from '@playwright/test';
import { GRAPHQL_URL } from '../../config/environment';

test('consulta usuário via GraphQL', async ({ request }) => {
  const response = await request.post(GRAPHQL_URL, {
    data: {
      query: `
        query GetUser($id: ID!) {
          user(id: $id) {
            id
            name
            email
            password
            administrador
          }
        }
      `,
      variables: {
        id: '00M9D1vh4YvezjL9',
      },
    },
  });

  expect(response.ok()).toBeTruthy();

  const body = await response.json();

  expect(body.errors).toBeUndefined();

  const user = body.data.user;

  expect(user).toEqual({
    id: '00M9D1vh4YvezjL9',
    name: 'Hora do QA',
    email: 'horadoqa@email.com',
    password: '1q2w3e4r',
    administrador: true,
  });
});

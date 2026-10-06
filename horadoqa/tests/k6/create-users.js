import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Trend } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:4000';

const createUserDuration = new Trend('create_user_duration');
const createUserSuccess = new Counter('create_user_success');
const createUserErrors = new Counter('create_user_errors');

export const options = {
  scenarios: {
    create_users: {
      executor: 'constant-vus',

      // Quantidade de usuários virtuais
      vus: 5,

      // Tempo total do teste
      duration: '30s',
    },
  },

  thresholds: {
    http_req_failed: ['rate<0.01'],
    create_user_duration: ['p(95)<500'],
    create_user_errors: ['count<10'],
  },
};

const CREATE_USER_QUERY = `
mutation CreateUser(
  $name: String!,
  $email: String!,
  $password: String!,
  $administrador: Boolean!
) {
  createUser(
    name: $name,
    email: $email,
    password: $password,
    administrador: $administrador
  ) {
    id
    name
    email
    password
    administrador
  }
}
`;

export default function () {
  const uniqueId = `${__VU}-${__ITER}-${Date.now()}`;

  const variables = {
    name: `Ricardo Fahham ${uniqueId}`,
    email: `ricardo.fahham.${uniqueId}@email.com`,
    password: '1q2w3e4r',
    administrador: true,
  };

  const payload = JSON.stringify({
    query: CREATE_USER_QUERY,
    variables,
  });

  const response = http.post(BASE_URL, payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  createUserDuration.add(response.timings.duration);

  const success = check(response, {
    'status 200': (r) => r.status === 200,

    'response possui data': (r) => {
      try {
        return r.json('data') !== null;
      } catch (e) {
        return false;
      }
    },

    'usuário criado': (r) => {
      try {
        return r.json('data.createUser') !== null;
      } catch (e) {
        return false;
      }
    },

    'possui id': (r) => {
      try {
        return r.json('data.createUser.id') !== undefined;
      } catch (e) {
        return false;
      }
    },

    'sem erros GraphQL': (r) => {
      try {
        const errors = r.json('errors');
        return !errors || errors.length === 0;
      } catch (e) {
        return false;
      }
    },
  });

  if (success) {
    createUserSuccess.add(1);
  } else {
    createUserErrors.add(1);

    console.error(
      `Erro ao criar usuário: ${response.status} - ${response.body}`
    );
  }

  // sleep(1);
}

import http from 'k6/http';
import { check } from 'k6';
import { Counter, Trend } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:4000';

// ============================================================
// MÉTRICAS
// ============================================================

const getUserDuration = new Trend('get_user_duration');

const getUserSuccess = new Counter('get_user_success');
const getUserErrors = new Counter('get_user_errors');

// ============================================================
// CONFIGURAÇÃO DO TESTE
// ============================================================

export const options = {
  scenarios: {
    get_users: {
      executor: 'constant-vus',

      // Quantidade de usuários virtuais
      vus: 5,

      // Duração do teste
      duration: '30s',
    },
  },

  thresholds: {
    http_req_failed: ['rate<0.01'],

    get_user_duration: [
      'p(95)<300',
      'p(99)<500',
    ],
  },
};

// ============================================================
// QUERY PARA BUSCAR A LISTA DE USUÁRIOS
// ============================================================

const GET_USERS_QUERY = `
query GetUsers {
  users {
    id
    name
    email
    administrador
  }
}
`;

// ============================================================
// QUERY PARA BUSCAR UM USUÁRIO
// ============================================================

const GET_USER_QUERY = `
query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
    email
    administrador
  }
}
`;

// ============================================================
// BUSCA A LISTA DE USUÁRIOS
// ============================================================

export function setup() {
  const response = http.post(
    BASE_URL,
    JSON.stringify({
      query: GET_USERS_QUERY,
    }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  const success = check(response, {
    'lista - status 200': (r) => r.status === 200,

    'lista - sem erros GraphQL': (r) => {
      try {
        const errors = r.json('errors');
        return !errors || errors.length === 0;
      } catch (e) {
        return false;
      }
    },

    'lista - possui usuários': (r) => {
      try {
        const users = r.json('data.users');

        return Array.isArray(users) && users.length > 0;
      } catch (e) {
        return false;
      }
    },
  });

  if (!success) {
    throw new Error(
      `Não foi possível carregar os usuários. ` +
      `Status: ${response.status} ` +
      `Body: ${response.body}`
    );
  }

  const users = response.json('data.users');

  const userIds = users.map((user) => String(user.id));

  console.log(`Usuários encontrados: ${userIds.length}`);

  return {
    userIds,
  };
}

// ============================================================
// TESTE
// ============================================================

export default function (data) {
  const { userIds } = data;

  if (!userIds || userIds.length === 0) {
    return;
  }

  /*
   * Cada VU possui sua própria posição.
   *
   * __ITER = número da iteração atual do VU.
   * Usamos __ITER para percorrer a lista continuamente.
   */

  const index = (__ITER) % userIds.length;

  const userId = userIds[index];

  // ==========================================================
  // BUSCA USUÁRIO
  // ==========================================================

  const response = http.post(
    BASE_URL,
    JSON.stringify({
      query: GET_USER_QUERY,

      variables: {
        id: userId,
      },
    }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
      tags: {
        operation: 'get_user',
      },
    }
  );

  getUserDuration.add(response.timings.duration);

  // ==========================================================
  // VALIDAÇÃO
  // ==========================================================

  const success = check(response, {
    'usuário - status 200': (r) => r.status === 200,

    'usuário - encontrado': (r) => {
      try {
        return r.json('data.user') !== null;
      } catch (e) {
        return false;
      }
    },

    'usuário - ID correto': (r) => {
      try {
        return String(r.json('data.user.id')) === String(userId);
      } catch (e) {
        return false;
      }
    },

    'usuário - sem erro GraphQL': (r) => {
      try {
        const errors = r.json('errors');

        return !errors || errors.length === 0;
      } catch (e) {
        return false;
      }
    },
  });

  if (success) {
    getUserSuccess.add(1);
  } else {
    getUserErrors.add(1);

    console.error(
      `Erro ao buscar usuário ${userId}: ` +
      `status=${response.status} ` +
      `body=${response.body}`
    );
  }
}
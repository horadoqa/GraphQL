import http from 'k6/http';
import { check } from 'k6';
import { Counter, Trend } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:4000';

const VUS = 5;

const idsFile = open('./ids.csv');

const ids = idsFile
  .split('\n')
  .slice(1)
  .map((id) => id.trim())
  .filter(Boolean);

const deleteUserDuration = new Trend('delete_user_duration');
const deleteUserSuccess = new Counter('delete_user_success');
const deleteUserErrors = new Counter('delete_user_errors');

export const options = {
  scenarios: {
    delete_users: {
      executor: 'constant-vus',
      vus: VUS,
      duration: '2m',
    },
  },

  thresholds: {
    http_req_failed: ['rate<0.01'],
    delete_user_duration: ['p(95)<500'],
    delete_user_errors: ['count<10'],
  },
};

const DELETE_USER_QUERY = `
mutation DeleteUser($id: ID!) {
  deleteUser(id: $id) {
    id
    name
    email
    administrador
  }
}
`;

export default function () {
  /*
   * Distribui os IDs entre os VUs e iterações.
   *
   * VU 1 / Iteração 0 → ID 0
   * VU 2 / Iteração 0 → ID 1
   * VU 3 / Iteração 0 → ID 2
   *
   * VU 1 / Iteração 1 → ID 5
   * VU 2 / Iteração 1 → ID 6
   */
  const index = (__ITER * VUS) + (__VU - 1);

  if (index >= ids.length) {
    return;
  }

  const id = ids[index];

  const payload = JSON.stringify({
    query: DELETE_USER_QUERY,
    variables: {
      id,
    },
  });

  const response = http.post(BASE_URL, payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  deleteUserDuration.add(response.timings.duration);

  const success = check(response, {
    'status 200': (r) => r.status === 200,

    'response possui data': (r) => {
      try {
        return r.json('data') !== null;
      } catch (e) {
        return false;
      }
    },

    'usuário excluído': (r) => {
      try {
        return r.json('data.deleteUser') !== null;
      } catch (e) {
        return false;
      }
    },

    'possui id': (r) => {
      try {
        return r.json('data.deleteUser.id') !== undefined;
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
    deleteUserSuccess.add(1);

    console.log(
      `DELETE ${id} | VU=${__VU} | ITER=${__ITER}`
    );
  } else {
    deleteUserErrors.add(1);

    console.error(
      `Erro ao excluir ${id}: ${response.status} - ${response.body}`
    );
  }
}

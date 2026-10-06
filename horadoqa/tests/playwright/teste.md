# Testando a API com Playwright

Claro. Se você quer começar um projeto de **Playwright** para testes automatizados, o caminho mais simples é usar Node.js \+ TypeScript.

 ## 1\. Crie o projeto

```
mkdir meu-projeto-playwright
cd meu-projeto-playwright
npm init playwright@latest
```

 O instalador vai perguntar algumas coisas. Uma configuração comum é:

 - **TypeScript:** Yes
- **Test folder:** `tests`
- **Add GitHub Actions:** opcional
- **Install Playwright browsers:** Yes

 Depois disso, você terá algo parecido com:

```
meu-projeto-playwright/
├── tests/
│   └── example.spec.ts
├── playwright.config.ts
├── package.json
└── tsconfig.json
```

 ## 2\. Execute os testes

```
npx playwright test
```

 Para visualizar o navegador durante a execução:

```
npx playwright test --headed
```

 E para abrir o relatório:

```
npx playwright show-report
```

 ## 3\. Crie seu primeiro teste

 Por exemplo, `tests/login.spec.ts`:

```
import { test, expect } from '@playwright/test';

test('deve acessar a página de login', async ({ page }) => {
  await page.goto('https://exemplo.com/login');

  await expect(page).toHaveTitle(/Login/);
});
```

 Execute:

```
npx playwright test tests/login.spec.ts
```

 ## 4\. Uma estrutura mais organizada

 Quando o projeto crescer, eu recomendo algo assim:

```
tests/
├── login/
│   └── login.spec.ts
├── cadastro/
│   └── cadastro.spec.ts
│
pages/
├── LoginPage.ts
└── CadastroPage.ts

fixtures/
└── auth.fixture.ts

playwright.config.ts
package.json
```

 Você pode usar o **Page Object Model** para separar a lógica da página dos testes:

```
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly email: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.email = page.getByLabel('E-mail');
    this.password = page.getByLabel('Senha');
    this.loginButton = page.getByRole('button', { name: 'Entrar' });
  }

  async login(email: string, password: string) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.loginButton.click();
  }
}
```

 E o teste fica mais limpo:

```
import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('login com sucesso', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await page.goto('https://exemplo.com/login');
  await loginPage.login('usuario@email.com', '123456');
});
```

 ### Comandos que você vai usar bastante

```
# Rodar todos os testes
npx playwright test

# Rodar um teste específico
npx playwright test login.spec.ts

# Ver o navegador
npx playwright test --headed

# Executar em modo debug
npx playwright test --debug

# Gerar código automaticamente
npx playwright codegen https://exemplo.com

# Ver relatório
npx playwright show-report
```

 Se você estiver começando agora, **eu sugiro não complicar com Page Objects, fixtures e várias abstrações de imediato**. Primeiro faça 2–3 testes simples e depois estruturamos o projeto.

 Se quiser, posso também te mostrar **como montar um projeto Playwright profissional do zero (TypeScript + Page Object + fixtures + `.env` \+ CI/CD + Docker)**.



 Com **Playwright**, você pode testar GraphQL de duas formas principais:

 1. **Diretamente pela API**, usando `request` — ideal para testes de API.
2. **Interceptando as requisições do navegador**, usando `page.route()` — útil para testar o frontend sem depender do backend.

 ## 1\. Testando GraphQL diretamente

 Se sua API GraphQL estiver em:

```
https://api.exemplo.com/graphql
```

 Você pode fazer:

```
import { test, expect } from '@playwright/test';

test('consulta usuário via GraphQL', async ({ request }) => {
  const response = await request.post('https://api.exemplo.com/graphql', {
    data: {
      query: `
        query GetUser($id: ID!) {
          user(id: $id) {
            id
            name
            email
          }
        }
      `,
      variables: {
        id: '123',
      },
    },
  });

  expect(response.ok()).toBeTruthy();

  const body = await response.json();

  expect(body.errors).toBeUndefined();
  expect(body.data.user.id).toBe('123');
});
```

 Isso é equivalente a fazer um `POST` para o endpoint GraphQL com:

```
{
  "query": "...",
  "variables": {
    "id": "123"
  }
}
```

 ### Validando erros do GraphQL

 Um detalhe importante: **HTTP 200 não significa necessariamente que a operação GraphQL deu certo**.

 Por exemplo:

```
expect(response.ok()).toBeTruthy();

const body = await response.json();

expect(body.errors).toBeUndefined();
```

 Você pode também validar especificamente:

```
expect(body.data.user.name).toBe('João');
```

---

 ## 2\. Usando headers/autenticação

 Se sua API exige Bearer Token:

```
const response = await request.post(
  'https://api.exemplo.com/graphql',
  {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    data: {
      query: `
        query {
          me {
            id
            name
          }
        }
      `,
    },
  }
);
```

 Uma abordagem ainda melhor é configurar o `baseURL` e headers no `playwright.config.ts`:

```
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'https://api.exemplo.com',
    extraHTTPHeaders: {
      Authorization: `Bearer ${process.env.API_TOKEN}`,
    },
  },
});
```

 Então:

```
const response = await request.post('/graphql', {
  data: {
    query: `
      query {
        me {
          id
          name
        }
      }
    `,
  },
});
```

---

 ## 3\. Interceptando GraphQL no teste E2E

 Agora imagine que você tem uma tela que chama:

```
POST /graphql
```

 Você pode interceptar essa chamada:

```
test('exibe usuário', async ({ page }) => {
  await page.route('**/graphql', async route => {
    const request = route.request();
    const body = request.postDataJSON();

    console.log(body.query);
    console.log(body.variables);

    await route.continue();
  });

  await page.goto('/usuarios/123');

  await expect(page.getByText('João')).toBeVisible();
});
```

 Isso é muito útil para verificar se o frontend realmente está enviando a query esperada.

---

 ## 4\. Mockando uma resposta GraphQL

 Você também pode evitar completamente o backend:

```
test('exibe usuário retornado pelo GraphQL', async ({ page }) => {
  await page.route('**/graphql', async route => {
    const body = route.request().postDataJSON();

    if (body.operationName === 'GetUser') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            user: {
              id: '123',
              name: 'João',
              email: 'joao@example.com',
            },
          },
        }),
      });

      return;
    }

    await route.continue();
  });

  await page.goto('/usuarios/123');

  await expect(page.getByText('João')).toBeVisible();
});
```

 ### Uma dica importante

 Se possível, use `operationName` nas suas queries:

```
query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
  }
}
```

 Assim o Playwright consegue distinguir facilmente:

```
if (body.operationName === 'GetUser') {
   // mock
}
```

 Isso é muito mais robusto do que procurar uma string dentro da query.

---

 ### Qual abordagem usar?

 | Objetivo | Abordagem |
| --- | --- |
| Testar o resolver/API GraphQL | `request.post()` |
| Testar autenticação | `request` \+ headers |
| Testar frontend + GraphQL real | `page` \+ `waitForResponse()` |
| Mockar GraphQL | `page.route()` |
| Testar diferentes cenários de resposta | `page.route()` \+ `route.fulfill()` |
| Teste E2E completo | `page` \+ backend real |

Se você estiver começando a montar uma **estrutura de testes Playwright + GraphQL em TypeScript**, posso te mostrar uma arquitetura com `GraphQLClient`, queries separadas, fixtures, autenticação e mocks, evitando duplicação nos testes.
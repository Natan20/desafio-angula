# Desafio Sprint 07 — Angular (Ford)

Dashboard para a equipe de gestão da Ford acompanhar dados dos veículos: login,
tela inicial (home) e dashboard com busca, cartões de métricas e tabela de
veículos conectados. Feito em **Angular 21** (standalone components) consumindo
uma API **Node/Express** própria.

## Estrutura do projeto

```
desafio-angula/
├── back-end/     API Express (mock) — porta 3000
│   ├── api.js
│   ├── package.json
│   └── img/       imagens dos veículos servidas pela própria API
└── front-end/     Aplicação Angular — porta 4200
    └── src/app/
        ├── pages/login/        tela de login
        ├── pages/home/         tela inicial
        ├── pages/dashboard/    dashboard principal
        ├── services/           AuthService, VehicleService
        ├── guards/             auth.guard.ts
        └── models/             Usuario, Veiculo, VehicleData
```

## Como rodar

Precisa de **dois terminais abertos ao mesmo tempo** (a API e o Angular são
processos separados).

**Terminal 1 — API**
```bash
cd back-end
npm install   # só na primeira vez
npm start
```
Sobe em `http://localhost:3000`.

**Terminal 2 — Front-end**
```bash
cd front-end
npm install   # só na primeira vez
npm start
```
Sobe em `http://localhost:4200`.

Abra `http://localhost:4200` no navegador. Login: **admin** / **123456**.

Para parar: `Ctrl+C` em cada terminal.

## Endpoints da API (`back-end/api.js`)

| Rota | Método | O que faz |
|---|---|---|
| `/login` | POST | Recebe `{ nome, senha }`, valida contra o usuário cadastrado (`admin`/`123456`) e retorna os dados do usuário ou erro 401. |
| `/vehicle` | GET | Lista os modelos de veículo (Ranger, Mustang, Territory, Bronco Sport) com total de vendas, conectados, updates de software e a URL da imagem. |
| `/vehicleData` | GET | Lista os veículos individuais (por VIN) com odômetro, nível de combustível, status e coordenadas. |

## Tour pelas 3 telas (mapeado aos passos do desafio)

### 1. Login (`pages/login/`)
- Formulário com `ngModel` (Passo 1) e botão de confirmação (Passo 2).
- `login.ts` chama `AuthService.login()`, que faz `POST /login` (Passo 3 — busca e
  autentica o usuário no back-end). Erro de credencial mostra um alerta
  (`*ngIf="exibirErroLogin"`).

### 2. Home (`pages/home/`)
- Cartão de boas-vindas (Passo 4), item de logout no menu lateral (Passo 5),
  imagem de fundo (Passo 6) e link para o dashboard (Passo 7).
- Usa um `offcanvas` do Bootstrap como menu lateral.

### 3. Dashboard (`pages/dashboard/`)
- Cartão com busca por modelo de veículo, populado via `VehicleService.getVeiculos()`
  (Passo 8).
- 3 cartões (total de vendas / conectados / update software) que reagem ao
  veículo selecionado (Passo 9).
- Imagem central do veículo selecionado, vinda da API (Passo 10).
- Tabela com busca por código do veículo (VIN) e 5 colunas de dados (Passo 11).

Ambas as buscas (por modelo e por VIN) usam o mesmo padrão reativo:
```
input do usuário → Subject → debounceTime → distinctUntilChanged → map → filter → atualiza a lista exibida
```

## Conceitos Angular usados — guia rápido para explicar em aula

| Conceito | Onde está | Para que serve aqui |
|---|---|---|
| **Standalone components** | todos os `*.ts` de `pages/` (`standalone: true`, `imports: [...]`) | Angular moderno não usa mais `@NgModule` obrigatoriamente; cada componente declara suas próprias dependências. |
| **`ngModel`** | `login.html`, `dashboard.html` | Two-way binding — liga o `<input>` direto a uma variável do componente. |
| **`*ngIf` / `*ngFor`** | `dashboard.html`, `login.html` | Mostra/esconde elementos (ex.: alerta de erro, cartões vazios) e repete elementos (linhas da tabela, sugestões de modelo). |
| **Services (`@Injectable`)** | `services/auth.service.ts`, `services/vehicle.service.ts` | Centralizam a comunicação HTTP com a API — os componentes não sabem como os dados são buscados, só consomem o resultado (`Observable`). |
| **Guards (`CanActivateFn`)** | `guards/auth.guard.ts` | Bloqueia acesso a `/home` e `/dashboard` se o usuário não tiver feito login (ver `app.routes.ts`). |
| **RxJS — `map`** | `vehicle.service.ts` (extrai o array da resposta), `dashboard.ts` (normaliza o texto digitado) | Transforma o valor emitido por um Observable. |
| **RxJS — `pluck`** | `vehicle.service.ts` | Extrai uma propriedade específica do objeto retornado pela API (`{ vehicles: [...] }` → `[...]`). É um operador **depreciado** no RxJS 7 (hoje se prefere `map(x => x.prop)`), mas ainda funciona e é o exigido pelo enunciado do desafio. |
| **RxJS — `debounceTime`** | `dashboard.ts` (busca por modelo e por VIN) | Espera o usuário parar de digitar (300ms) antes de filtrar — evita filtrar a cada tecla. |
| **RxJS — `distinctUntilChanged`** | `dashboard.ts` | Ignora emissões repetidas (ex.: digitar e apagar voltando ao mesmo texto). |
| **RxJS — `filter`** | `dashboard.ts` | Só deixa a busca prosseguir se já existirem dados carregados da API. |

### Observação sobre mudança de estado (zoneless)

Este projeto Angular 21 roda **sem `zone.js`** (modo "zoneless" — dá para
confirmar pela ausência de `zone.js` no `package.json`). Isso muda uma regra
importante: quando você atualiza uma variável do componente **dentro de um
`.subscribe()`** (uma resposta HTTP, por exemplo), a tela não atualiza
sozinha — é preciso chamar manualmente `this.cdr.markForCheck()`
(`ChangeDetectorRef`), como feito em `login.ts` e `dashboard.ts`. Em uma
aula, esse é um bom exemplo de "por que a interface às vezes não reflete o
dado que já chegou".

## Critérios de avaliação do desafio — onde cada um aparece

- **Classes/funções TypeScript**: `models/*.ts` (interfaces `Usuario`, `Veiculo`, `VehicleData`).
- **Modules, components e services**: componentes standalone em `pages/`, services em `services/`.
- **Comunicação com o back-end**: `AuthService` e `VehicleService` (HttpClient).
- **Bootstrap**: classes `card`, `row`/`col`, `table`, `btn`, `offcanvas`, `alert` em todos os templates.
- **Diretivas `ngModel`, `ngIf`, `ngFor`**: ver tabela acima.
- **RxJS (`map`, `pluck`, `debounceTime`, `filter`, `distinctUntilChanged`)**: `vehicle.service.ts` e `dashboard.ts`.

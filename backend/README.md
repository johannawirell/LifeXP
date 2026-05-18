# Backend setup

Lokal backend-infra för NestJS microservices med:

- PostgreSQL: en separat databas per service
- Redis: cache och queues
- Prisma: ett schema per service
- Auth: `auth-service` med Google OAuth, Apple OAuth och JWT

## Tjänster och databaser

- `auth-service` -> `lifexp_auth`
- `user-service` -> `lifexp_user`
- `goals-service` -> `lifexp_goals`
- `analytics-service` -> `lifexp_analytics`
- `gamification-service` -> `lifexp_gamification`
- `notification-service` -> `lifexp_notification`

## Starta backend lokalt

Kör allt från [backend](/Users/johannawirell/Desktop/LifeXP/backend).

### 1. Installera beroenden

```bash
cd /Users/johannawirell/Desktop/LifeXP/backend

npm install
```

### 2. Skapa env-fil

Om `.env` saknas, skapa den från `.env.example`.

```bash
cp .env.example .env
```

### 3. Starta PostgreSQL och Redis

```bash
npm run infra:up
```

Om PostgreSQL redan har en gammal Docker-volym med andra credentials, återställ den först:

```bash
docker compose -f docker-compose.yml down -v
npm run infra:up
```

### 4. Skapa databastabeller

```bash
npm run prisma:push
```

### 5. Seeda prototypdata i alla services

```bash
npm run seed:all
```

### 6. Starta tjänsterna

Terminal 1:

```bash
cd /Users/johannawirell/Desktop/LifeXP/backend
npm run dev:auth-service
```

Terminal 2:

```bash
cd /Users/johannawirell/Desktop/LifeXP/backend
npm run dev:user-service
```

Terminal 3:

```bash
cd /Users/johannawirell/Desktop/LifeXP/backend
npm run dev:goals-service
```

Terminal 4:

```bash
cd /Users/johannawirell/Desktop/LifeXP/backend
npm run dev:analytics-service
```

Terminal 5:

```bash
cd /Users/johannawirell/Desktop/LifeXP/backend
npm run dev:gamification-service
```

Terminal 6:

```bash
cd /Users/johannawirell/Desktop/LifeXP/backend
npm run dev:api-gateway
```

### Alternativ: starta allt med ett script

Det finns också ett script som kör hela backend-flödet:

- startar PostgreSQL och Redis
- väntar på att PostgreSQL är redo
- kör `prisma:generate`
- kör Prisma push
- kör seed för alla prototypservices
- startar `auth-service`
- startar `user-service`
- startar `goals-service`
- startar `analytics-service`
- startar `gamification-service`
- startar `api-gateway`

Kör:

```bash
cd /Users/johannawirell/Desktop/LifeXP/backend
chmod +x start-backend.sh
./start-backend.sh
```

Stoppa scriptet med `Ctrl+C`.

Du behöver inte köra `npm run seed:goals` separat om du använder scriptet. Det kör redan `seed:all`.

## OAuth-secrets

Fyll i de här värdena i [backend/.env](/Users/johannawirell/Desktop/LifeXP/backend/.env):

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_ANDROID_CLIENT_ID=
GOOGLE_IOS_CLIENT_ID=

APPLE_CLIENT_ID=
APPLE_TEAM_ID=
APPLE_KEY_ID=
APPLE_PRIVATE_KEY=

AUTH_ALLOWED_REDIRECT_URIS=myapp://auth/callback,http://localhost
GOOGLE_CALLBACK_URL=http://localhost:3005/auth/google/callback
APPLE_CALLBACK_URL=http://localhost:3005/auth/apple/callback
```

### Google

Du behöver normalt:

- ett `Web application` OAuth client ID för backend-flödet
- ett `Android` client ID för Android
- ett `iOS` client ID för iPhone/iPad

Steg:

1. Öppna Google Cloud Console.
2. Skapa eller välj ett projekt.
3. Konfigurera `OAuth consent screen`.
4. Skapa ett `Web application` OAuth client ID.
5. Lägg till callback-URL:
   `http://localhost:3005/auth/google/callback`
6. Kopiera `Client ID` och `Client secret` till:
   `GOOGLE_CLIENT_ID` och `GOOGLE_CLIENT_SECRET`
7. Skapa ett `Android` OAuth client ID.
8. Ange paketnamn och SHA-1.
9. Kopiera värdet till `GOOGLE_ANDROID_CLIENT_ID`.
10. Skapa ett `iOS` OAuth client ID.
11. Ange bundle identifier.
12. Kopiera värdet till `GOOGLE_IOS_CLIENT_ID`.

### Apple

Du behöver:

- ett `Services ID`
- `Team ID`
- `Key ID`
- en privat `.p8`-nyckel

Steg:

1. Logga in på Apple Developer.
2. Aktivera `Sign in with Apple` på din primära App ID.
3. Skapa ett `Services ID`.
4. Koppla det till appen.
5. Lägg till callback-URL:
   `http://localhost:3005/auth/apple/callback`
6. Skapa en `Sign in with Apple` private key.
7. Lägg in:
   - `Services ID` -> `APPLE_CLIENT_ID`
   - `Team ID` -> `APPLE_TEAM_ID`
   - `Key ID` -> `APPLE_KEY_ID`
   - `.p8`-innehållet -> `APPLE_PRIVATE_KEY`
8. Spara privatnyckeln i `.env` som en rad med `\n` för radbrytningar.

### Expo redirect

Appen använder schemat från [my-app/app.json](/Users/johannawirell/Desktop/LifeXP/my-app/app.json):

```json
"scheme": "myapp"
```

Det innebär att auth-callbacken tillbaka till appen är:

```text
myapp://auth/callback
```

### 7. Backend-endpoint

När allt är igång finns profil-endpointen här:

```text
http://localhost:3000/api/profile/demo-auth-user-1
```

Mål-relaterade endpoints:

```text
http://localhost:3000/api/goals/demo-auth-user-1
http://localhost:3000/api/goals/templates/list
http://localhost:3000/api/goals/templates/<templateId>
POST http://localhost:3000/api/goals/<userId>/from-template/<templateId>
```

## Databasansvar per service

### auth-service
- OAuth-identiteter
- refresh tokens
- sessions
- verifierings-/återställningstokens

### user-service
- profil
- avatar
- inställningar

### goals-service
- mål
- delmål
- återkommande scheman
- progressloggar

### analytics-service
- aggregerad statistik
- dagliga snapshots

### gamification-service
- XP-ledger
- levels
- streaks
- achievements

### notification-service
- notification jobs
- notification preferences
- delivery log

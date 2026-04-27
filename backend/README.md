# Backend setup

Lokal backend-infra för NestJS microservices med:

- PostgreSQL: en separat databas per service
- Redis: cache och queues
- Prisma: ett schema per service
- Auth: Google OAuth + JWT

## Tjänster och databaser

- `auth-service` -> `lifexp_auth`
- `user-service` -> `lifexp_user`
- `goals-service` -> `lifexp_goals`
- `analytics-service` -> `lifexp_analytics`
- `gamification-service` -> `lifexp_gamification`
- `notification-service` -> `lifexp_notification`

## Starta backend lokalt

Kör allt från [backend](/backend).

### 1. Installera beroenden

```bash
cd /backend

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

### 5. Seeda user-service med profil-data

```bash
npm run seed:user
```

### 6. Starta tjänsterna

Terminal 1:

```bash
cd backend
npm run dev:user-service
```

Terminal 2:

```bash
cd backend
npm run dev:api-gateway
```

### Alternativ: starta allt med ett script

Det finns också ett script som kör hela backend-flödet:

- startar PostgreSQL och Redis
- väntar på att PostgreSQL är redo
- kör Prisma push
- kör seed för `user-service`
- startar `user-service`
- startar `api-gateway`

Kör:

```bash
cd backend
chmod +x start-backend.sh
./start-backend.sh
```

Stoppa scriptet med `Ctrl+C`.

### 7. Backend-endpoint

När allt är igång finns profil-endpointen här:

```text
http://localhost:3000/api/profile
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

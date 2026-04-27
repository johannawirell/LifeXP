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

## Starta lokalt

1. Kopiera `.env.example` till `.env`.
2. Starta infrastrukturen:

```bash
docker compose -f backend/docker-compose.yml up -d
```

3. Använd respektive `*_DATABASE_URL` i varje NestJS/Prisma-service.

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

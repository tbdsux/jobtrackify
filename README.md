![](./static/android-chrome-192x192.png)

# jobtrackify

Track job applications and save job links.

**Demo**

![](./demo/3.png)
![](./demo/2.png)
![](./demo/1.png)

## Development

Required environment variables (`.env`)

```sh
# better-auth
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
BETTER_AUTH_TRUSTED_ORIGINS=

# postres
POSTGRES_PASSWORD=DB-PASSWORD
POSTGRES_USER=postgres
POSTGRES_DB=jobtrackify
POSTGRES_HOST=DB-HOST
POSTGRES_PORT=5432
DATABASE_URL="postgres://postgres:DB-PASSWORD@DB-HOST:5432/jobtrackify"

# github
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# others
PUBLIC_BASE_URL=
```

### Docker

For deployment using docker, there are 3 services for this:

#### app

Main production service

#### jt-postgres

Postgres database service

#### jt-workspace

Service / app where you can run migrations and stuff

```sh
# Exec into the container
docker compose exec -it workspace bash
```

- Running migrations

```sh
# First, better-auth migrations
pnpm dlx @better-auth/cli migrate

# Second, kysely db migrations
#   Run until all migrations are done
pnpm dlx kysely-ctl migrate up
```

# base node image
FROM node:16-bullseye-slim as base

# Install openssl
RUN apt-get update && apt-get install -y openssl sqlite3

# Update npm | Install pnpm | Set PNPM_HOME
RUN npm i -g npm@latest; \
  # Install pnpm
  npm install -g pnpm; \
  pnpm --version; \
  pnpm setup; \
  mkdir -p /usr/local/share/pnpm &&\
  export PNPM_HOME="/usr/local/share/pnpm" &&\
  export PATH="$PNPM_HOME:$PATH"; \
  pnpm bin -g



# Setup production node_modules
FROM base as deps
WORKDIR /myapp

COPY .npmrc ./
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY apps/admin/package.json ./apps/admin/package.json
COPY apps/web/package.json ./apps/web/package.json

COPY packages/api/package.json ./packages/api/package.json
COPY packages/eslint-config-custom/package.json ./packages/eslint-config-custom/package.json
COPY packages/tsconfig/package.json ./packages/tsconfig/package.json
COPY packages/ui/package.json ./packages/ui/package.json

RUN pnpm i




FROM base as production-deps
ENV NODE_ENV production
WORKDIR /myapp
COPY --from=deps /myapp /myapp
RUN pnpm prune --prod








# Build the app
FROM deps as build
WORKDIR /myapp
# COPY --from=deps /myapp /myapp
ADD . .
RUN pnpm build






# Finally, build the production image with minimal footprint
FROM base

# ENV DATABASE_URL=file:/data/sqlite.db
# ENV PORT="8080"
ENV NODE_ENV production

# # add shortcut for connecting to database CLI
# RUN echo "#!/bin/sh\nset -x\nsqlite3 \$DATABASE_URL" > /usr/local/bin/database-cli && chmod +x /usr/local/bin/database-cli

WORKDIR /myapp

COPY --from=production-deps /myapp/node_modules /myapp/node_modules
# COPY --from=production-deps /myapp/apps/admin/node_modules /myapp/apps/admin/node_modules
COPY --from=production-deps /myapp/apps/web/node_modules /myapp/apps/web/node_modules
COPY --from=production-deps /myapp/packages/api/node_modules /myapp/packages/api/node_modules
COPY --from=production-deps /myapp/packages/ui/node_modules /myapp/packages/ui/node_modules

COPY --from=build /myapp/package.json /myapp/package.json
COPY --from=build /myapp/pnpm-lock.yaml /myapp/pnpm-lock.yaml
COPY --from=build /myapp/pnpm-workspace.yaml /myapp/pnpm-workspace.yaml
COPY --from=build /myapp/turbo.json /myapp/turbo.json

COPY --from=build /myapp/apps/admin/dist /myapp/apps/admin/dist
COPY --from=build /myapp/apps/admin/public /myapp/apps/admin/public
COPY --from=build /myapp/apps/admin/package.json /myapp/apps/admin/package.json

COPY --from=build /myapp/apps/web/build /myapp/apps/web/build
COPY --from=build /myapp/apps/web/public /myapp/apps/web/public
COPY --from=build /myapp/apps/web/package.json /myapp/apps/web/package.json

COPY --from=build /myapp/packages/api/dist /myapp/packages/api/dist
COPY --from=build /myapp/packages/api/package.json /myapp/packages/api/package.json
COPY --from=build /myapp/packages/ui/dist /myapp/packages/ui/dist
COPY --from=build /myapp/packages/ui/package.json /myapp/packages/ui/package.json

# ENTRYPOINT [ "pnpm", "start" ]
CMD tail -f /dev/null

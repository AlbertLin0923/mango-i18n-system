#!/usr/bin/env zx

cd('./packages/server')
await $`pnpm remove @mango-scripts/i18n-utils`

cd("../client");
await $`pnpm remove @mango-scripts/react-scripts`
await $`pnpm remove @mango-scripts/i18n-scripts`
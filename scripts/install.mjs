#!/usr/bin/env zx

cd('./packages/server')
await $`pnpm install @mango-scripts/i18n-utils`

cd("../client");
await $`pnpm install @mango-scripts/react-scripts`
await $`pnpm install @mango-scripts/i18n-scripts`
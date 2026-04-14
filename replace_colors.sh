#!/bin/bash
find src -name "*.tsx" -type f -exec sed -i 's/bg-zinc-50/bg-app-bg/g' {} +
find src -name "*.tsx" -type f -exec sed -i 's/text-zinc-950/text-app-text/g' {} +
find src -name "*.tsx" -type f -exec sed -i 's/text-teal-600/text-app-primary/g' {} +
find src -name "*.tsx" -type f -exec sed -i 's/bg-teal-600/bg-app-primary/g' {} +
find src -name "*.tsx" -type f -exec sed -i 's/border-teal-600/border-app-primary/g' {} +
find src -name "*.tsx" -type f -exec sed -i 's/bg-white/bg-app-card/g' {} +
find src -name "*.tsx" -type f -exec sed -i 's/border-zinc-200/border-app-border/g' {} +
find src -name "*.tsx" -type f -exec sed -i 's/text-zinc-500/text-app-muted/g' {} +
find src -name "*.tsx" -type f -exec sed -i 's/bg-zinc-100/bg-app-surface/g' {} +
find src -name "*.tsx" -type f -exec sed -i 's/border-zinc-100/border-app-surface/g' {} +
find src -name "*.tsx" -type f -exec sed -i 's/text-zinc-400/text-app-muted\/80/g' {} +
find src -name "*.tsx" -type f -exec sed -i 's/bg-teal-50/bg-app-primary\/10/g' {} +
find src -name "*.tsx" -type f -exec sed -i 's/text-white/text-app-primary-fg/g' {} +
find src -name "*.tsx" -type f -exec sed -i 's/from-teal-600 to-emerald-600/from-app-primary to-app-primary\/80/g' {} +

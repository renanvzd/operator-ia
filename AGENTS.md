# DevRoast

Brutally honest code reviews powered by AI.

## Stack

- Next.js 16 (App Router)
- Tailwind CSS v4
- Biome (lint/format)
- Base UI (primitives)
- Shiki (syntax highlighting)

## Padrões

### Componentes UI
Local: `src/components/ui/`
- Named exports sempre
- Usar `tailwind-variants` para variantes
- Composição para componentes com sub-areas (CardRoot, CardHeader, etc.)
- Props simples para primitivos (Button, Badge)
- Extender props nativas com `ComponentProps<"element">`

### Tailwind
- Cores via `@theme` no globals.css
- Classes canônicas: `bg-accent-green`, `text-text-primary`
- Fontes: `font-mono` (JetBrains Mono), `font-sans` (sistema)

### Estrutura
- `src/components/ui/` - componentes reutilizáveis
- `src/components/` - componentes específicos do app
- `src/app/` - rotas Next.js

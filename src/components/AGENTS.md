# App Components

- Componentes de dados podem ser client components quando a integracao exigir hooks do React Query ou animacoes client-side.
- Para metricas numericas animadas, usar `@number-flow/react`.
- Quando a contagem precisar entrar em cena apos o carregamento, iniciar em `0` e animar para o valor real.
- Manter componentes de loading separados do componente principal de dados (ex: `*-skeleton.tsx`).

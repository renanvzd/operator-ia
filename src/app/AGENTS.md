# App Router

- Ao integrar dados no frontend, preferir Server Components sempre que possivel.
- Para dados via tRPC, iniciar no server com `prefetch()` e renderizar o client dentro de `HydrateClient`.
- Preferir `Suspense` para loading states de dados assíncronos.
- Cada area assíncrona deve ter um skeleton component dedicado quando houver loading visivel.
- Evitar migrar partes nao solicitadas para tRPC; integrar apenas o trecho pedido.

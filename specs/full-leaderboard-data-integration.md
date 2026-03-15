# Spec: Integracao de dados na leaderboard completa

## Resumo

Substituir os dados estaticos da pagina `/leaderboard` por dados reais vindos de tRPC + Drizzle, mantendo a ordenacao pelos piores scores e limitando a exibicao a no maximo 20 trechos. A homepage continua usando a mesma procedure com o comportamento atual de top 3.

## Pesquisa realizada

### Estrategias de API avaliadas

| Abordagem | Descricao | Pros | Contras | Veredicto |
|---|---|---|---|---|
| Reutilizar `leaderboard.getLeaderboard` com `limit` opcional | Mesma procedure atende home e pagina completa | Evita duplicacao, mantem stats e ranking consistentes | Exige pequeno ajuste de tipos e validacao | **Escolhido** |
| Criar `leaderboard.list` separado | Procedure dedicada para a pagina completa | Nome mais especifico | Duplica query e aumenta manutencao | Descartado |
| Buscar direto com Drizzle na page | RSC consulta banco sem tRPC | Simples no curto prazo | Quebra o padrao atual da app e duplica logica | Descartado |

### Estrategias de consumo no frontend

| Abordagem | Descricao | Veredicto |
|---|---|---|
| `caller` em Server Component | A pagina busca dados no server e renderiza HTML pronto | **Usar** |
| `prefetch` + client component | Hidrata cache para consumo via React Query no client | Desnecessario para esta tela agora |

## Decisao

Evoluir `leaderboard.getLeaderboard` para receber input opcional com `limit`, aplicar clamp para no maximo 20 itens e preservar `3` como default para a home.

Fluxo:

```text
/leaderboard page (RSC)
  -> caller.leaderboard.getLeaderboard({ limit: 20 })
       -> tRPC router
            -> Drizzle select ordered by lowest score
```

Isso mantem a homepage e a pagina completa alinhadas na mesma fonte de verdade.

## Especificacao de implementacao

- Criar `specs/full-leaderboard-data-integration.md`
- Modificar `src/trpc/routers/leaderboard.ts`:
  - adicionar `.input()` com `limit` opcional
  - usar `Math.min(limit, 20)` para limitar a consulta
  - manter `3` como default quando nao houver input
  - continuar retornando `entries`, `totalRoasts` e `avgScore`
- Modificar `src/app/leaderboard/page.tsx`:
  - remover os dados hardcoded
  - buscar no server via `caller.leaderboard.getLeaderboard({ limit: 20 })`
  - renderizar stats reais no hero
- Modificar `src/components/leaderboard-entry-card.tsx`:
  - aceitar `language: string`
  - normalizar linguagem com `normalizeLanguage()` para renderizar `CodeBlock`
  - usar fallback `plaintext` quando a linguagem vier invalida

Pseudocodigo:

```ts
const leaderboardRouter = createTRPCRouter({
  getLeaderboard: baseProcedure
    .input(z.object({ limit: z.number().int().min(1).optional() }).optional())
    .query(async ({ ctx, input }) => {
      const limit = Math.min(input?.limit ?? 3, 20)
      // query ordenada por menor score
    }),
})
```

## Dependencias novas

Nenhuma.

## Riscos e consideracoes

1. **Linguagens do banco variam mais do que o tipo atual do card** — o seed inclui `python`, `go`, `rust`, `html` e `css`. Mitigar aceitando `string` no card e normalizando com fallback para `plaintext`.
2. **Stats usando window function com `limit`** — a query atual depende de `count(*) over ()` e `avg(...) over ()`. Manter esse comportamento para evitar uma segunda query.
3. **Lista pode crescer no futuro** — como o pedido atual e no maximo 20, nao adicionar paginacao nesta rodada.

## TODOs de implementacao

- [x] Criar spec da integracao da leaderboard completa
- [x] Parametrizar `leaderboard.getLeaderboard` com `limit` opcional e clamp em 20
- [x] Substituir dados hardcoded de `src/app/leaderboard/page.tsx`
- [x] Ajustar `LeaderboardEntryCard` para suportar linguagens vindas do banco
- [x] Rodar lint e build

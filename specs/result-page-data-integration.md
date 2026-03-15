# Spec: Integracao de dados na pagina de resultado

## Resumo

Substituir os mocks da pagina `src/app/roast/[id]/page.tsx` por dados reais vindos de tRPC + Drizzle e mover o cache para uma funcao de dados dedicada usando Cache Components. A tela continua server-rendered, com revalidacao de 1 hora por roast.

## Pesquisa realizada

### Estrategias de acesso a dados avaliadas

| Abordagem | Descricao | Pros | Contras | Veredicto |
|---|---|---|---|---|
| `caller.roast.getById()` dentro de funcao cacheada | RSC chama tRPC no server dentro de helper com `use cache` | Reaproveita router, mantem padrao da app e permite cache granular por roast | Exige montar shape da UI no server | **Escolhido** |
| Query direta com Drizzle na page | Buscar o roast sem passar por tRPC | Menos camadas | Duplica logica de acesso a dados e foge do padrao atual | Descartado |
| `prefetch()` + client component | Hidratar cache de React Query e montar tudo no client | Reaproveita hooks | Desnecessario para pagina puramente server-side | Descartado |

### Estrategias de cache avaliadas

| Abordagem | Descricao | Veredicto |
|---|---|---|
| `use cache` na page inteira | Cache de toda a rota | Funciona, mas mistura concern de rota com dados |
| `use cache` em helper `getCachedRoastResult()` | Cache da leitura do roast por `id` | **Usar** |

## Decisao

Adicionar `roast.getById` no router e criar um helper cacheado na pagina de resultado para buscar e transformar os dados do roast. A page so coordena `params`, metadata e `notFound()`.

Fluxo:

```text
/roast/[id] page (RSC)
  -> getCachedRoastResult(id)
       -> "use cache" + cacheLife("hours")
       -> caller.roast.getById({ id })
       -> normaliza dados para a UI
```

## Especificacao de implementacao

- Criar `specs/result-page-data-integration.md`
- Modificar `src/trpc/routers/roast.ts`:
  - adicionar `getById` com input `z.string().uuid()`
  - buscar roast e `analysisItems` ordenados por `order`
  - retornar `null` quando o roast nao existir
- Modificar `src/app/roast/[id]/page.tsx`:
  - remover mocks
  - criar `getCachedRoastResult(id)` com `use cache` e `cacheLife("hours")`
  - usar `caller.roast.getById({ id })`
  - gerar `diff` simples a partir de `code` e `suggestedFix`
  - usar `notFound()` quando o roast nao existir
  - reutilizar o helper cacheado em `generateMetadata`

Pseudocodigo:

```ts
async function getCachedRoastResult(id: string) {
  "use cache"
  cacheLife("hours")

  const roast = await caller.roast.getById({ id })
  if (!roast) return null

  return mapRoastToResultData(roast)
}
```

## Dependencias novas

Nenhuma.

## Riscos e consideracoes

1. **`suggestedFix` nao e um diff real** — o banco guarda a versao melhorada completa. Mitigar gerando um diff simples por linha para esta primeira iteracao.
2. **Roasts inexistentes** — a rota recebe UUID valido, mas o registro pode nao existir. Mitigar retornando `null` no router e usando `notFound()` na page.
3. **Duplicacao entre metadata e page** — ambas precisam do roast. Mitigar usando a mesma funcao cacheada.

## TODOs de implementacao

- [x] Criar spec da integracao da pagina de resultado
- [x] Adicionar `roast.getById` no router
- [x] Substituir mocks da pagina de resultado por dados reais
- [x] Mover o cache para helper dedicado com `use cache`
- [x] Rodar lint e build

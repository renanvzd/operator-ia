# Spec: Criacao de roasts com OpenAI

## Resumo

Permitir que o usuario envie um trecho de codigo, opcionalmente ative `roast mode`, receba uma analise gerada pela OpenAI e seja redirecionado para `/roast/[id]`. O resultado deve ser persistido no banco com score, verdict, quote, analysis items e suggested fix, e a pagina de resultado deve ler esses dados do DB.

## Pesquisa realizada

### Fluxos de navegacao avaliados

| Abordagem | Descricao | Pros | Contras | Veredicto |
|---|---|---|---|---|
| Mutation cria roast e faz redirect para `/roast/[id]` | Home chama mutation, servidor gera roast, persiste e retorna id | Simples, resiliente e reaproveita a pagina de resultado | A experiencia nao mostra progresso de streaming | **Escolhido** |
| Streaming na propria home | Resultado parcial aparece antes da persistencia | Mais dinamico | Muito mais complexo, exige arquitetura diferente | Descartado |

### Integracao com IA avaliada

| Abordagem | Descricao | Veredicto |
|---|---|---|
| Vercel AI SDK + `@ai-sdk/openai` + `generateText` estruturado | Saida tipada com Zod e provider OpenAI | **Usar** |
| SDK oficial da OpenAI sem camada do AI SDK | Menos abstracao | Desnecessario para o stack atual |

## Decisao

Seguir o fluxo documentado em `docs/2026-03-11-roast-creation-plan.md` e `docs/2026-03-11-roast-creation-design.md`:

```text
HomeEditor (client)
  -> trpc.roast.create mutation
       -> OpenAI gpt-4o-mini
       -> insert roast + analysisItems no DB
       -> retorna { id }
  -> router.push(`/roast/${id}`)
  -> /roast/[id] busca dados reais via caller.roast.getById()
```

O `suggestedFix` continua sendo gerado pela IA e a UI de diff e derivada a partir dele na pagina de resultado.

## Especificacao de implementacao

- Criar `specs/roast-creation.md`
- Adicionar dependencias `ai` e `@ai-sdk/openai`
- Criar `src/lib/ai.ts` com:
  - model `openai("gpt-4o-mini")`
  - schema de output do roast
  - factory de system prompt com e sem `roastMode`
- Modificar `src/trpc/routers/roast.ts`:
  - adicionar mutation `create`
  - manter `getById` para alimentar a page `/roast/[id]`
  - persistir roast e analysis items
- Modificar `src/components/home-editor.tsx`:
  - usar `useMutation` com `trpc.roast.create`
  - desabilitar o botao durante a mutation
  - redirecionar para `/roast/[id]`
  - mostrar erro inline se a mutation falhar
- Modificar `src/app/roast/[id]/page.tsx` apenas no que for necessario para consumir os dados reais gerados

## Dependencias novas

| Pacote | Motivo | Impacto |
|---|---|---|
| `ai` | Vercel AI SDK para structured output | Servidor |
| `@ai-sdk/openai` | Provider da OpenAI | Servidor |

## Riscos e consideracoes

1. **`OPENAI_API_KEY` ausente** — a mutation falhara em runtime sem a chave. Mitigar com mensagem clara de erro e documentacao no final.
2. **Resposta estruturada invalida da IA** — mesmo com schema, a geracao pode falhar. Mitigar com `TRPCError` e prompt restritivo.
3. **Latencia da criacao** — a mutation espera IA + DB antes do redirect. Mitigar com loading state claro no botao.
4. **Share roast fora de escopo** — manter sem integracao funcional nesta entrega.

## TODOs de implementacao

- [x] Criar spec da feature de criacao de roast
- [x] Adicionar modulo de IA com schema e prompts
- [x] Implementar `roast.create`
- [x] Integrar `HomeEditor` com a mutation e redirect
- [x] Validar pagina `/roast/[id]` com dados reais
- [x] Rodar lint e build

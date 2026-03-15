# Spec: Expandir codigo na shame leaderboard da home

## Resumo

Substituir o preview truncado de uma linha na `shame leaderboard` da homepage por um preview com syntax highlight usando o `CodeBlock`. Cada linha da leaderboard deve mostrar um trecho maior do codigo com altura maxima quando fechada e permitir expandir para ver o snippet completo.

## Pesquisa realizada

### Abordagens de expansao analisadas

| Abordagem | Descricao | Prós | Contras | Veredicto |
|---|---|---|---|---|
| `truncate` em texto puro | Manter a linha atual com string reduzida | Mais simples | Nao resolve o pedido de ver mais codigo nem syntax highlight | Descartado |
| Preview fixo + pagina dedicada | Mostrar poucas linhas e mandar o usuario para outra tela | Reaproveita a pagina `/leaderboard` | Adiciona atrito e nao melhora a home em si | Descartado |
| Preview com altura maxima + expansao inline | Mostrar `CodeBlock` com `max-height` quando fechado e expandir inline ao clicar | Resolve leitura rapida, preserva contexto e usa syntax highlight | Exige componente interativo na linha | **Escolhido** |

### Primitivos de interacao avaliados

| Opcao | Descricao | Veredicto |
|---|---|---|
| Estado manual com `useState` | Controle proprio de open/close | Viavel, mas menos consistente com a diretriz do projeto | Apoio apenas se necessario |
| `@base-ui/react/collapsible` | Primitive acessivel com `Root`, `Trigger` e `Panel` | **Usar** para trigger/panel e acessibilidade |

## Decisao

Criar uma linha especifica da leaderboard da home composta por duas partes:

1. Um wrapper server component para normalizar a linguagem e renderizar duas versoes do `CodeBlock` com Shiki.
2. Um client component com `Collapsible` do Base UI para alternar entre preview fechado e snippet completo expandido.

Fluxo:

```text
HomeShameLeaderboard (server)
  -> HomeShameLeaderboardRow (server)
       -> CodeBlock preview (server)
       -> CodeBlock expanded (server)
       -> HomeShameLeaderboardRowCollapsible (client, Base UI)
```

Essa divisao preserva o syntax highlight server-side e limita a interatividade ao menor trecho necessario.

## Especificacao de implementacao

- Modificar `src/components/home-shame-leaderboard.tsx` para trocar `LeaderboardRow` pela nova linha expansivel.
- Criar `src/components/home-shame-leaderboard-row.tsx` como server component:
  - Recebe `rank`, `score`, `language`, `code`
  - Normaliza `language` via `normalizeLanguage()`
  - Calcula `lineCount`
  - Renderiza `CodeBlock` para preview e expandido
- Criar `src/components/home-shame-leaderboard-row-collapsible.tsx` como client component:
  - Usa `Collapsible.Root`, `Collapsible.Trigger` e `Collapsible.Panel`
  - Quando fechado, mostra preview com `max-height` e fade no fim
  - Quando aberto, mostra o snippet completo com syntax highlight
  - Mantem metadados da linha (`rank`, `score`, `language`, `lineCount`)

Pseudocodigo:

```ts
type HomeShameLeaderboardRowProps = {
  rank: number;
  score: string;
  language: string;
  code: string;
}

async function HomeShameLeaderboardRow(props: HomeShameLeaderboardRowProps) {
  const normalizedLanguage = normalizeLanguage(props.language) ?? "plaintext";

  return (
    <HomeShameLeaderboardRowCollapsible
      preview={<CodeBlock ... />}
      expanded={<CodeBlock ... />}
    />
  );
}
```

Detalhes visuais:

- Preview fechado com aproximadamente 8-10 linhas visiveis (`max-h-*`)
- Overlay em gradiente para indicar conteudo oculto
- CTA monoespacado (`show_code` / `hide_code`)
- Layout responsivo sem quebrar a tabela em mobile

## Riscos e consideracoes

1. **Duplicacao de render do `CodeBlock`** — o preview fechado e o expandido renderizam o mesmo snippet duas vezes. Mitigar limitando esse padrao apenas aos 3 itens da home, onde o custo e baixo.
2. **Linguagens vindas do banco podem ser inconsistentes** — `CodeBlock` precisa de linguagem suportada. Mitigar normalizando com `normalizeLanguage()` e fallback para `plaintext`.
3. **Linha pode ficar muito alta em mobile** — o preview fechado precisa de altura controlada e CTA visivel. Mitigar com `max-height` menor e metadados empilhados.

## TODOs de implementacao

- [x] Criar spec da expansao inline da leaderboard da home
- [x] Criar server component da linha da leaderboard com `CodeBlock`
- [x] Criar client component com `Collapsible` do Base UI
- [x] Integrar nova linha em `src/components/home-shame-leaderboard.tsx`
- [ ] Validar responsividade e estados aberto/fechado
- [x] Rodar Biome nos arquivos alterados

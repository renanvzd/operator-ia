# Spec: OG image dinamica para resultado de roast

## Resumo

Adicionar uma OG image dinamica para `/roast/[id]` com base no frame selecionado no Pencil e expor metadata dinamica para Open Graph e Twitter. Como os roasts sao imutaveis depois de criados, a imagem sera gerada como PNG em route handler dedicado com cache longo.

## Pesquisa realizada

### Abordagens de renderizacao da imagem avaliadas

| Abordagem | Descricao | Pros | Contras | Veredicto |
|---|---|---|---|---|
| `@takumi-rs/image-response` em route handler | Renderizar JSX para PNG no server com Takumi | Alinha com o plano, usa API proxima de `next/og`, suporta `tw` e permite PNG nativo | Exige dependencia nativa e configuracao em `next.config.ts` | **Escolhido** |
| `next/og` (`ImageResponse` do Next) | Usar renderer padrao do ecossistema Next | Sem dependencia extra | Nao segue a direcao definida e nao valida a estrategia com Takumi | Descartado |
| Geracao estatica offline | Precomputar imagem no momento de criacao do roast | Facilita entrega em runtime | Aumenta complexidade de persistencia e foge do pedido de route handler dedicado | Descartado |

### Estrategias de metadata avaliadas

| Abordagem | Descricao | Pros | Contras | Veredicto |
|---|---|---|---|---|
| `generateMetadata()` dinamico na page | Ler roast por `id` e montar `title`, `description`, `openGraph` e `twitter` | Mantem a logica da rota junto da page e segue App Router | Exige leitura adicional de dados | **Escolhido** |
| `metadata` estatico | Definir titulo e descricao fixos | Simples | Nao suporta score, linguagem, quote nem `og:image` por roast | Descartado |

### Estrategias de cache avaliadas

| Abordagem | Descricao | Pros | Contras | Veredicto |
|---|---|---|---|---|
| Cache HTTP longo na rota da imagem | `Cache-Control: public, max-age=31536000, immutable` | Ideal para recurso imutavel compartilhavel | Requer invalidacao por URL nova se layout mudar | **Escolhido** |
| Sem cache | Regerar a imagem a cada request | Implementacao minima | Custo desnecessario para dados imutaveis | Descartado |

## Decisao

Implementar a OG image em duas partes:

```text
/roast/[id]/page.tsx
  -> generateMetadata()
       -> getCachedRoastResult(id)
       -> titulo/descricao dinamicos
       -> openGraph.images -> /roast/[id]/opengraph-image

/roast/[id]/opengraph-image/route.ts
  -> caller.roast.getById({ id })
  -> <RoastOgImage ... />
  -> new ImageResponse(..., { format: "png" })
  -> Cache-Control: public, max-age=31536000, immutable
```

O layout da imagem segue o frame `Screen 4 - OG Image` no Pencil: canvas 1200x630, fundo quase preto, bloco central vertical com logo, score destacado, verdict colorido, metadados da linguagem e quote centralizada. O componente usa Geist Mono do Takumi por padrao para preservar o carater mono do design sem pipeline de fontes customizadas.

## Especificacao de implementacao

- Criar `specs/roast-result-og-image.md`
- Modificar `package.json` e lockfile:
  - adicionar `@takumi-rs/image-response`
- Modificar `next.config.ts`:
  - manter `cacheComponents: true`
  - adicionar `serverExternalPackages: ["@takumi-rs/core"]`
- Criar `src/components/og/roast-og-image.tsx`:
  - exportar `RoastOgImage(props)` com layout em JSX + `tw`
  - implementar helper de cor por score (`<= 3`, `<= 6`, `> 6`)
  - aceitar `score`, `verdict`, `language`, `lineCount`, `roastQuote`
- Criar `src/app/roast/[id]/opengraph-image/route.ts`:
  - usar `ImageResponse` do Takumi
  - buscar roast via `caller.roast.getById({ id })`
  - retornar 404 para roast inexistente
  - responder PNG 1200x630 com cache longo
- Modificar `src/app/roast/[id]/page.tsx`:
  - atualizar `generateMetadata()` para usar score, linguagem e quote reais
  - incluir `openGraph` com imagem da rota dedicada
  - incluir metadata de Twitter com `summary_large_image`

Pseudocodigo:

```ts
type RoastOgImageProps = {
  score: number
  verdict: string
  language: string
  lineCount: number
  roastQuote: string | null
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const roast = await caller.roast.getById({ id })

  return new ImageResponse(createElement(RoastOgImage, roast), {
    width: 1200,
    height: 630,
    format: "png",
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
```

## Dependencias novas

| Pacote | Motivo | Estimativa de bundle |
|---|---|---|
| `@takumi-rs/image-response` | Renderizar OG image dinamica em route handler no server | Server-only; sem impacto relevante no bundle client |

## Riscos e consideracoes

1. **Dependencia nativa no ambiente Node** — Takumi precisa que `@takumi-rs/core` nao seja empacotado pelo Next. Mitigar com `serverExternalPackages`.
2. **Falha em IDs inexistentes** — crawlers podem requisitar links invalidos. Mitigar retornando `404` na rota da imagem e metadata de fallback na page quando necessario.
3. **Quebra visual por fonte diferente do Pencil** — o frame usa JetBrains/IBM Plex Mono, enquanto o plano sugere Geist Mono. Mitigar mantendo tamanhos, pesos, espacamentos e cores do frame, usando Geist Mono apenas como aproximacao suportada nativamente pelo Takumi.
4. **Duplicacao de leitura do roast** — metadata e page consomem o mesmo dado. Mitigar reutilizando o helper cacheado ja existente na page; a rota da imagem faz leitura propria por ser request separada.

## TODOs de implementacao

- [x] Revisar design/arquitetura em `docs/2026-03-11-og-image-design.md`
- [x] Inspecionar o frame selecionado no Pencil (`Screen 4 - OG Image`)
- [x] Instalar Takumi e configurar `serverExternalPackages`
- [x] Criar o componente `RoastOgImage`
- [x] Criar a rota `/roast/[id]/opengraph-image`
- [x] Atualizar `generateMetadata()` em `src/app/roast/[id]/page.tsx`
- [ ] Rodar validacoes (`pnpm lint` e `pnpm build`)

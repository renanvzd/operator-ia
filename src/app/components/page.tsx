import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CardDescription,
  CardHeader,
  CardRoot,
  CardTitle,
} from "@/components/ui/card";
import { CodeBlock, CodeBlockHeader } from "@/components/ui/code-block";
import { DiffLine } from "@/components/ui/diff-line";
import { LeaderboardRow } from "@/components/ui/leaderboard-row";
import { ScoreRing } from "@/components/ui/score-ring";
import { Toggle } from "@/components/ui/toggle";

const sampleCode = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}`;

export default async function ComponentsPage() {
  return (
    <main className="min-h-screen bg-bg-page p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 font-mono text-3xl font-bold text-text-primary">
          UI Components
        </h1>
        <p className="mb-12 font-mono text-text-secondary">
          Demonstração de todos os componentes de UI
        </p>

        <section className="mb-16">
          <h2 className="mb-2 font-mono text-xl font-semibold text-text-primary">
            Button
          </h2>
          <p className="mb-6 font-mono text-text-secondary">
            Botões com múltiplas variantes e tamanhos
          </p>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" size="sm">
              roast_my_code
            </Button>
            <Button variant="primary" size="md">
              roast_my_code
            </Button>
            <Button variant="primary" size="lg">
              roast_my_code
            </Button>
            <Button variant="secondary" size="sm">
              share_roast
            </Button>
            <Button variant="secondary" size="md">
              share_roast
            </Button>
            <Button variant="secondary" size="lg">
              share_roast
            </Button>
            <Button variant="link" size="sm">
              view_all &gt;&gt;
            </Button>
            <Button variant="link" size="md">
              view_all &gt;&gt;
            </Button>
            <Button variant="link" size="lg">
              view_all &gt;&gt;
            </Button>
            <Button variant="primary" size="md" disabled>
              Disabled
            </Button>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="mb-2 font-mono text-xl font-semibold text-text-primary">
            Toggle
          </h2>
          <p className="mb-6 font-mono text-text-secondary">
            Interruptor com label
          </p>
          <div className="flex flex-wrap gap-6">
            <Toggle checked={false} label="roast mode" />
            <Toggle checked={true} label="roast mode" />
            <Toggle checked={false} disabled label="disabled" />
          </div>
        </section>

        <section className="mb-16">
          <h2 className="mb-2 font-mono text-xl font-semibold text-text-primary">
            Badge
          </h2>
          <p className="mb-6 font-mono text-text-secondary">
            Indicadores de status
          </p>
          <div className="flex flex-wrap gap-6">
            <Badge variant="critical">critical</Badge>
            <Badge variant="warning">warning</Badge>
            <Badge variant="good">good</Badge>
            <Badge variant="verdict">needs_serious_help</Badge>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="mb-2 font-mono text-xl font-semibold text-text-primary">
            Card
          </h2>
          <p className="mb-6 font-mono text-text-secondary">
            Container com borda
          </p>
          <CardRoot className="w-[480px]">
            <CardHeader>
              <span className="h-2 w-2 rounded-full bg-accent-red" />
              <Badge variant="critical">critical</Badge>
            </CardHeader>
            <CardTitle>using var instead of const/let</CardTitle>
            <CardDescription>
              the var keyword is function-scoped rather than block-scoped, which
              can lead to unexpected behavior and bugs. modern javascript uses
              const for immutable bindings and let for mutable ones.
            </CardDescription>
          </CardRoot>
        </section>

        <section className="mb-16">
          <h2 className="mb-2 font-mono text-xl font-semibold text-text-primary">
            DiffLine
          </h2>
          <p className="mb-6 font-mono text-text-secondary">Linhas de diff</p>
          <div className="flex flex-col gap-0 w-[560px] border border-border-primary">
            <DiffLine type="removed" code="var total = 0;" />
            <DiffLine type="added" code="const total = 0;" />
            <DiffLine
              type="context"
              code="for (let i = 0; i &lt; items.length; i++) {"
            />
          </div>
        </section>

        <section className="mb-16">
          <h2 className="mb-2 font-mono text-xl font-semibold text-text-primary">
            LeaderboardRow
          </h2>
          <p className="mb-6 font-mono text-text-secondary">
            Linha de leaderboard
          </p>
          <div className="w-[560px] border border-border-primary">
            <LeaderboardRow
              rank={1}
              score={2.1}
              codePreview="function calculateTotal(items) { var total = 0; ..."
              language="javascript"
            />
            <LeaderboardRow
              rank={2}
              score={1.8}
              codePreview="const result = items.reduce((acc, item) => ..."
              language="javascript"
            />
            <LeaderboardRow
              rank={3}
              score={1.5}
              codePreview="function processData(data) { return data.map(x => ..."
              language="typescript"
            />
          </div>
        </section>

        <section className="mb-16">
          <h2 className="mb-2 font-mono text-xl font-semibold text-text-primary">
            ScoreRing
          </h2>
          <p className="mb-6 font-mono text-text-secondary">
            Círculo de pontuação com gradiente
          </p>
          <div className="flex flex-wrap gap-8 items-center">
            <ScoreRing score={10} maxScore={10} />
            <ScoreRing score={7.5} maxScore={10} />
            <ScoreRing score={5} maxScore={10} />
            <ScoreRing score={2.5} maxScore={10} />
          </div>
        </section>

        <section className="mb-16">
          <h2 className="mb-2 font-mono text-xl font-semibold text-text-primary">
            CodeBlock
          </h2>
          <p className="mb-6 font-mono text-text-secondary">
            Bloco de código com syntax highlighting (shiki + vesper)
          </p>
          <div className="w-[560px] overflow-hidden border border-border-primary bg-bg-input">
            <CodeBlockHeader filename="calculate.js" />
            <CodeBlock
              code={sampleCode}
              lang="javascript"
              className="border-0"
            />
          </div>
        </section>
      </div>
    </main>
  );
}

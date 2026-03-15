type RoastOgImageProps = {
  score: number;
  verdict: string;
  language: string;
  lineCount: number;
  roastQuote: string | null;
};

function getScoreColor(score: number) {
  if (score <= 3) {
    return "#EF4444";
  }

  if (score <= 6) {
    return "#F59E0B";
  }

  return "#10B981";
}

export function RoastOgImage({
  score,
  verdict,
  language,
  lineCount,
  roastQuote,
}: RoastOgImageProps) {
  const scoreColor = getScoreColor(score);

  return (
    <div
      tw="flex h-full w-full items-center justify-center"
      style={{
        backgroundColor: "#0A0A0A",
        color: "#FAFAFA",
        fontFamily: "Geist Mono",
      }}
    >
      <div
        tw="flex h-full w-full flex-col items-center justify-center"
        style={{
          backgroundColor: "#0A0A0A",
          gap: 28,
          padding: 64,
        }}
      >
        <div tw="flex items-center justify-center" style={{ gap: 8 }}>
          <span
            style={{
              color: "#10B981",
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            {">"}
          </span>
          <span
            style={{
              color: "#FAFAFA",
              fontSize: 20,
              fontWeight: 500,
            }}
          >
            devroast
          </span>
        </div>

        <div tw="flex items-end justify-center" style={{ gap: 4 }}>
          <span
            style={{
              color: scoreColor,
              fontSize: 160,
              fontWeight: 900,
              lineHeight: 1,
            }}
          >
            {score.toFixed(1)}
          </span>
          <span
            style={{
              color: "#4B5563",
              fontSize: 56,
              lineHeight: 1,
            }}
          >
            /10
          </span>
        </div>

        <div tw="flex items-center justify-center" style={{ gap: 8 }}>
          <div
            tw="rounded-full"
            style={{
              backgroundColor: scoreColor,
              height: 12,
              width: 12,
            }}
          />
          <span
            style={{
              color: scoreColor,
              fontSize: 20,
            }}
          >
            {verdict}
          </span>
        </div>

        <span
          style={{
            color: "#4B5563",
            fontSize: 16,
          }}
        >
          {`lang: ${language} · ${lineCount} lines`}
        </span>

        {roastQuote ? (
          <span
            tw="text-center"
            style={{
              color: "#FAFAFA",
              fontFamily: "Geist",
              fontSize: 22,
              lineHeight: 1.5,
              maxWidth: 820,
            }}
          >
            {`"${roastQuote}"`}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export type { RoastOgImageProps };

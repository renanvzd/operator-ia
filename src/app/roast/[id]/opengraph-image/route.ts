import { ImageResponse } from "@takumi-rs/image-response";
import { TRPCError } from "@trpc/server";
import { createElement } from "react";
import { RoastOgImage } from "@/components/og/roast-og-image";
import { caller } from "@/trpc/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;

  try {
    const roast = await caller.roast.getById({ id });

    return new ImageResponse(
      createElement(RoastOgImage, {
        score: roast.score,
        verdict: roast.verdict,
        language: roast.language,
        lineCount: roast.lineCount,
        roastQuote: roast.roastQuote,
      }),
      {
        format: "png",
        headers: {
          "Cache-Control": "public, max-age=31536000, immutable",
        },
        height: 630,
        width: 1200,
      },
    );
  } catch (error) {
    if (
      error instanceof TRPCError &&
      (error.code === "BAD_REQUEST" || error.code === "NOT_FOUND")
    ) {
      return new Response("Roast not found", { status: 404 });
    }

    throw error;
  }
}

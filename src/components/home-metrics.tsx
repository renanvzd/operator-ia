"use client";

import type { Format } from "@number-flow/react";
import NumberFlow from "@number-flow/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTRPC } from "@/trpc/client";

type AnimatedMetricNumberProps = {
  value: number;
  format?: Format;
  suffix?: string;
};

function AnimatedMetricNumber({
  value,
  format,
  suffix,
}: AnimatedMetricNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setDisplayValue(value);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <NumberFlow
      className="font-mono text-xs text-text-primary [font-variant-numeric:tabular-nums]"
      format={format}
      locales="en-US"
      suffix={suffix}
      value={displayValue}
      willChange
    />
  );
}

function HomeMetrics() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.roast.getStats.queryOptions());

  return (
    <div className="flex items-center gap-6 font-mono text-xs text-text-tertiary">
      <span className="flex items-center gap-1.5">
        <AnimatedMetricNumber value={data.totalRoasts} />
        <span>codes roasted</span>
      </span>

      <span aria-hidden="true">&middot;</span>

      <span className="flex items-center gap-1.5">
        <span>avg score:</span>
        <AnimatedMetricNumber
          format={{
            maximumFractionDigits: 1,
            minimumFractionDigits: 1,
          }}
          suffix="/10"
          value={data.avgScore}
        />
      </span>
    </div>
  );
}

export { HomeMetrics };

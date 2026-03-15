"use client";

import { Switch } from "@base-ui/react/switch";
import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

const toggle = twMerge(
  "inline-flex items-center gap-3 font-mono text-xs transition-colors",
  "disabled:opacity-50 disabled:cursor-not-allowed",
);

type ToggleProps = Omit<ComponentProps<"div">, "onChange"> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
};

function Toggle({
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  label,
  className,
  ...props
}: ToggleProps) {
  return (
    <div className={twMerge(toggle, className)} {...props}>
      <Switch.Root
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className="relative w-10 h-[22px] rounded-[11px] p-[3px] transition-colors bg-border-primary data-[checked]:bg-accent-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page"
      >
        <Switch.Thumb className="block w-4 h-4 rounded-full bg-black transition-transform translate-x-0 data-[checked]:translate-x-4" />
      </Switch.Root>
      {label && (
        <span className={checked ? "text-accent-green" : "text-text-secondary"}>
          {label}
        </span>
      )}
    </div>
  );
}

export { Toggle, type ToggleProps, toggle };

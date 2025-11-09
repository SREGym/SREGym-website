"use client";

import { cn } from "@/lib/utils";
import { useQueryState } from "nuqs";
import { ButtonHTMLAttributes } from "react";
import { toast } from "sonner";
import { parseAsSetOfStrings } from "@/app/(home)/problems/lib/parse-as-set-of-strings";

type FilterButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onClick"
> & {
  valuesName: string;
  value: string;
};

export function FilterButton({
  valuesName,
  value,
  className,
  ...props
}: FilterButtonProps) {
  const [values, setValues] = useQueryState(
    valuesName,
    parseAsSetOfStrings.withDefault(new Set()),
  );

  const handleClick = () => {
    const currentValues = values ?? new Set<string>();
    const nextValues = new Set<string>(currentValues);
    nextValues.add(value);
    setValues(nextValues);
    toast.info(`Now showing ${value} problems`);
  };

  return (
    <button
      {...props}
      className={cn("cursor-pointer", className)}
      onClick={handleClick}
    />
  );
}

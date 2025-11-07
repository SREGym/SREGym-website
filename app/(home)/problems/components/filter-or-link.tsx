"use client";

import { useRouter } from "next/navigation";
import { FilterButton } from "./filter-button";

interface FilterOrLinkProps {
  value: string;
  valuesName: string;
  children: React.ReactNode;
  className?: string;
  behavior?: "filter" | "navigate";
}

export function FilterOrLink({
  value,
  valuesName,
  children,
  className,
  behavior = "filter",
}: FilterOrLinkProps) {
  const router = useRouter();

  if (behavior === "navigate") {
    return (
      <button
        className={className}
        onClick={(event) => {
          event.preventDefault();
          const params = new URLSearchParams();
          params.set(valuesName, value);
          router.push(`/problems?${params.toString()}`);
        }}
      >
        {children}
      </button>
    );
  }

  return (
    <FilterButton value={value} valuesName={valuesName} className={className}>
      {children}
    </FilterButton>
  );
}

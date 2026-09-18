import { ResearchFigure } from "@/components/blog/research-figure";

export function JevResults() {
  return (
    <ResearchFigure
      id="jev-fault-results"
      number={2}
      title="Results by SRE problem"
      src="/blog/jev/fault-results.svg"
      mobileSrc="/blog/jev/fault-results-mobile.svg"
      height={920}
      mobileHeight={1070}
      alt="Paired bars on a shared zero-to-five scale compare successful attempts without Jev and with Jev for each SRE problem. Every bar shows its exact score. Four problems improved, two regressed, and four were unchanged. Total passes rose from 20 of 50 to 24 of 50."
      caption="Successful attempts per SRE problem, with and without Jev."
    />
  );
}

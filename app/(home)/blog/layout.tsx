import type { ReactNode } from "react";
import "./blog.css";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return <div className="blog-theme min-w-0 flex-1 font-sans">{children}</div>;
}

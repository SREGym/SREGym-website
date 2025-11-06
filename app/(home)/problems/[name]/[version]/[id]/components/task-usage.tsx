import { CodeBlock } from "@/components/ui/code-block";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import Link from "next/link";
import { Section } from "./section";

interface TaskUsageProps {
  taskId: string;
  datasetName: string;
  datasetVersion: string;
}

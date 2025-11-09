import fs from "fs";
import path from "path";
import * as yaml from "js-yaml";
import { Tables } from "@/lib/supabase/database.types";

export type Task = Tables<"task"> & {
  registry: Tables<"registry">;
};

type TaskData = {
  tasks: Array<{
    id: string;
    author_email: string;
    author_name: string;
    category: string;
    // difficulty: "easy" | "medium" | "hard";
    description: string;
    tags: string[];
    file_id: string;
    github_url: string;
    demo_url?: string | null;
    include_in_launch?: boolean;
    created_at?: string;
    updated_at?: string;
  }>;
  registry: {
    name: string;
    version: string;
    branch: string;
    commit_hash: string;
    dataset_path: string;
    github_url: string;
    description?: string | null;
    is_encrypted: boolean;
    terminal_bench_version: string;
    created_at?: string;
    updated_at?: string;
  };
};

const DATA_DIR = path.join(process.cwd(), "data", "problems");

export const DEFAULT_DATASET_NAME = "problem-repertoire";
export const DEFAULT_DATASET_VERSION = "head";
export const DEFAULT_DATASET = {
  name: DEFAULT_DATASET_NAME,
  version: DEFAULT_DATASET_VERSION,
} as const;

function loadYamlData(name: string, version: string): TaskData | null {
  try {
    const filePath = path.join(DATA_DIR, name, `${version}.yaml`);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const data = yaml.load(fileContent) as TaskData;

    return data;
  } catch (error) {
    console.error(`Error loading YAML data for ${name}/${version}:`, error);
    return null;
  }
}

export async function getTasks(
  name: string,
  version: string,
): Promise<Task[]> {
  const data = loadYamlData(name, version);

  if (!data) {
    return [];
  }

  return data.tasks.map((task) => ({
    ...task,
    dataset_name: data.registry.name,
    dataset_version: data.registry.version,
    created_at: task.created_at ?? new Date().toISOString(),
    updated_at: task.updated_at ?? new Date().toISOString(),
    include_in_launch: task.include_in_launch ?? false,
    demo_url: task.demo_url ?? null,
    registry: {
      ...data.registry,
      created_at: data.registry.created_at ?? new Date().toISOString(),
      updated_at: data.registry.updated_at ?? new Date().toISOString(),
      description: data.registry.description ?? null,
    },
  }));
}

export async function getTask(
  id: string,
  name: string,
  version: string,
): Promise<Task | null> {
  const data = loadYamlData(name, version);

  if (!data) {
    return null;
  }

  const task = data.tasks.find((t) => t.id === id);

  if (!task) {
    return null;
  }

  return {
    ...task,
    dataset_name: data.registry.name,
    dataset_version: data.registry.version,
    created_at: task.created_at ?? new Date().toISOString(),
    updated_at: task.updated_at ?? new Date().toISOString(),
    include_in_launch: task.include_in_launch ?? false,
    demo_url: task.demo_url ?? null,
    registry: {
      ...data.registry,
      created_at: data.registry.created_at ?? new Date().toISOString(),
      updated_at: data.registry.updated_at ?? new Date().toISOString(),
      description: data.registry.description ?? null,
    },
  };
}

export async function getDefaultTasks(): Promise<Task[]> {
  return getTasks(DEFAULT_DATASET_NAME, DEFAULT_DATASET_VERSION);
}

export async function getDefaultTask(id: string): Promise<Task | null> {
  return getTask(id, DEFAULT_DATASET_NAME, DEFAULT_DATASET_VERSION);
}


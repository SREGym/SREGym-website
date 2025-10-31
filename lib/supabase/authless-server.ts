import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "./database.types";

// When env vars are not provided, return a minimal stub that avoids runtime crashes
// and makes pages render with empty datasets instead of erroring.
export async function createClient(): Promise<any> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (url && key) {
    return createServerClient<Database>(url, key, {
      cookies: {
        getAll() {
          return [];
        },
        setAll(cookiesToSet) {},
      },
    });
  }

  // Fallback stub mimicking a Postgrest query builder "thenable"
  function createQueryBuilder() {
    const state = { single: false } as { single: boolean };
    const builder: any = {
      select() {
        return builder;
      },
      eq() {
        return builder;
      },
      in() {
        return builder;
      },
      single() {
        state.single = true;
        return builder;
      },
      then(onFulfilled: (value: any) => any) {
        const result = state.single
          ? { data: null, error: { message: "Supabase disabled" } }
          : { data: [], error: null };
        return Promise.resolve(onFulfilled(result));
      },
      catch(onRejected: (reason: any) => any) {
        return Promise.resolve(onRejected(null));
      },
    };
    return builder;
  }

  const stubClient: any = {
    from(_table: string) {
      return createQueryBuilder();
    },
  };

  return stubClient;
}

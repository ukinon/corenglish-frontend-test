import taskService from "@/services/api/task";
import { SearchParams } from "@/types";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { TASKS_QUERY_KEYS } from "@/lib/query-keys";
import { TasksClient } from "./client-page";

export const dynamic = "force-dynamic";

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const query = await searchParams;
  const queryString = new URLSearchParams(
    query as Record<string, string>
  ).toString();
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: TASKS_QUERY_KEYS.list(queryString),
    queryFn: () => {
      const params = new URLSearchParams(queryString);
      const page = params.get("page") ? parseInt(params.get("page")!) : 1;
      const limit = params.get("limit") ? parseInt(params.get("limit")!) : 10;
      const status = params.get("status") || "";

      const filters: Record<string, string> = {};
      if (status) {
        filters["status"] = status;
      }

      return taskService.getTasks({
        query: queryString,
        filters,
        page,
        limit,
      });
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="px-6 py-8 space-y-6 max-w-7xl mx-auto">
        <div className="space-y-2 flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
            <p className="text-muted-foreground">
              Manage your tasks efficiently
            </p>
          </div>
        </div>

        <TasksClient />
      </div>
    </HydrationBoundary>
  );
}

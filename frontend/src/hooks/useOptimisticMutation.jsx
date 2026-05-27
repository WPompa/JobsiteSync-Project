import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/API-Service";

export const useOptimisticMutation = (tableName, primaryKeyName) => {
  const queryClient = useQueryClient();

  // Create a structured cache key matching the Dashboard query setup
  // By using just [baseKey, tableName], cancelQueries matches fuzzy key variations
  // const queryKeyPattern = ["dashboardData", tableName];

  return useMutation({
    mutationFn: ({ id, payload }) => {
      if (typeof id === "object") {
        const params = new URLSearchParams(id).toString();
        return api.patch(`${tableName}/?${params}`, payload);
      }

      // Calls the Express PATCH endpoint: e.g., PATCH /api/employees/4
      return api.patch(`${tableName}/${id}`, payload);
    },

    onMutate: async ({ id, payload }) => {
      // Create a base search pattern to match any key string starting with this prefix
      const baseCacheKey = ["dashboardData", tableName];

      // Freeze query requests matching the pattern
      await queryClient.cancelQueries({ queryKey: baseCacheKey });

      // Get all query keys currently tracked in memory matching our base prefix
      const cacheQueries = queryClient
        .getQueryCache()
        .findAll({ queryKey: baseCacheKey });

      // Store a complete map snapshot of all matching keys before changing values
      const rollbackSnapshots = cacheQueries.map((query) => ({
        key: query.queryKey,
        data: query.state.data,
      }));

      // Update the matching cache keys to make the UI update instantly
      cacheQueries.forEach((query) => {
        queryClient.setQueryData(query.queryKey, (oldResponse) => {
          if (!oldResponse || !oldResponse.result) return oldResponse;

          return {
            ...oldResponse,
            result: oldResponse.result.map((item) => {
              // Composite keys
              if (Array.isArray(primaryKeyName)) {
                const isMatch = primaryKeyName.every(
                  (key) => item[key] === id[key],
                );
                return isMatch ? { ...item, ...payload } : item;
              }

              // Single primary key
              return item[primaryKeyName] === id
                ? { ...item, ...payload }
                : item;
            }),
          };
        });
      });

      // Pass the snapshot map down to onError
      return { rollbackSnapshots };
    },
    /* onSuccess: (data, variables, context) => {
      // Execute local UI updates (like closing edit mode) ONLY on success
      if (callbacks.onSuccess) callbacks.onSuccess();
    }, */
    onError: (err, variables, context) => {
      if (context?.rollbackSnapshots) {
        context.rollbackSnapshots.forEach((snapshot) => {
          queryClient.setQueryData(snapshot.key, snapshot.data);
        });
      }

      /* // Execute local component rollback behavior on failure
      if (callbacks.onError) callbacks.onError(); */

      /* alert(`Failed to save changes: ${err?.message || "Validation Error"}`); */
    },
    onSettled: () => {
      const baseCacheKey = ["dashboardData", tableName];

      // Find all active and inactive query instances matching the base table layout
      const cacheQueries = queryClient
        .getQueryCache()
        .findAll({ queryKey: baseCacheKey });

      // Explicitly invalidate each matching query key to force background updates
      cacheQueries.forEach((query) => {
        queryClient.invalidateQueries({ queryKey: query.queryKey });
      });
    },
  });
};

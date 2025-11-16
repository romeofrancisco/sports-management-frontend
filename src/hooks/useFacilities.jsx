import { getFacilities, getFacilitiesRaw } from "@/api/facilitiesApi";
import { useQuery } from "@tanstack/react-query";

// Flexible hook:
// - useFacilities(params, options)
// - useFacilities(params, page, pageSize)
// - useFacilities(params, page, pageSize, options)
// options may include `noPagination: true` to fetch all facilities at once.
export const useFacilities = (params = {}, arg2 = {}, arg3 = undefined, arg4 = {}) => {
  let page = 1;
  let pageSize = 20;
  let options = {};

  // Backwards-compatible argument parsing
  if (typeof arg2 === "object" && arg3 === undefined) {
    // Called as useFacilities(params, options)
    options = arg2 || {};
  } else {
    // Called as useFacilities(params, page, pageSize, options)
    page = arg2 || 1;
    pageSize = arg3 || 20;
    options = arg4 || {};
  }

  const noPagination = Boolean(options.noPagination || options.no_pagination);

  const queryKey = noPagination
    ? ["facilities", "no_pagination", params]
    : ["facilities", { ...params, page, page_size: pageSize }];

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (noPagination) {
        // Return a plain array when requesting all facilities
        const data = await getFacilitiesRaw({ ...params, no_pagination: 1 });
        return Array.isArray(data) ? data : data.results || [];
      }

      // Paginated request: return the full paginated object (count, results, etc.)
      const data = await getFacilitiesRaw({ ...params, page, page_size: pageSize });
      return data;
    },
    keepPreviousData: true,
    ...options,
  });
};

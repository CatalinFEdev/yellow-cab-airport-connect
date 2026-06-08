import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

// Base path the app is served from in production (e.g. https://yourdns.com/airport-taxi).
// Kept as "/" in dev so the Lovable preview keeps working at the root.
export const BASE_PATH = import.meta.env.PROD ? "/airport-taxi" : "/";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    basepath: BASE_PATH,
  });

  return router;
};

import { ReactNode } from "react";
import {
  createRootRoute,
  createRoute,
  createRouter,
  createMemoryHistory,
  RouterProvider,
  Outlet,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * Render a UI fragment inside a minimal in-memory TanStack router so that
 * <Link> and other router-aware primitives work in tests without SSR.
 */
export function renderWithRouter(ui: ReactNode, initialPath = "/") {
  const rootRoute = createRootRoute({ component: () => <Outlet /> });
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    component: () => <>{ui}</>,
  });
  const orderRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/order",
    component: () => <div data-testid="order-page">order</div>,
  });

  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute, orderRoute]),
    history: createMemoryHistory({ initialEntries: [initialPath] }),
  });

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router as never} />
    </QueryClientProvider>
  );
}

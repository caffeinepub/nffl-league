import {
  Outlet,
  RouterProvider,
  createHashHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { useTeamInit } from "./hooks/useTeamInit";
import { HomePage } from "./pages/HomePage";
import { NewsDetailPage } from "./pages/NewsDetailPage";
import { NewsPage } from "./pages/NewsPage";
import { SchedulePage } from "./pages/SchedulePage";
import { StandingsPage } from "./pages/StandingsPage";
import { TeamsPage } from "./pages/TeamsPage";

function RootLayout() {
  useTeamInit();
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

// Root layout
const rootRoute = createRootRoute({
  component: RootLayout,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const teamsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/teams",
  component: TeamsPage,
});

const scheduleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/schedule",
  component: SchedulePage,
});

const standingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/standings",
  component: StandingsPage,
});

const newsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/news",
  component: NewsPage,
});

const newsDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/news/$id",
  component: NewsDetailPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  teamsRoute,
  scheduleRoute,
  standingsRoute,
  newsRoute,
  newsDetailRoute,
]);

const hashHistory = createHashHistory();
const router = createRouter({ routeTree, history: hashHistory });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Switch, Route } from "wouter";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import DashboardPage from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import FiltersPage from "./pages/FiltersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import AuthPage from "./pages/AuthPage";
import Layout from "./components/Layout";
import { useUser } from "./hooks/use-user";
import { Loader2 } from "lucide-react";

function Router() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <Layout>
      <Switch>
        <Route path="/" component={DashboardPage} />
        <Route path="/users" component={UsersPage} />
        <Route path="/filters" component={FiltersPage} />
        <Route path="/analytics" component={AnalyticsPage} />
        <Route>404 Page Not Found</Route>
      </Switch>
    </Layout>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  </StrictMode>,
);
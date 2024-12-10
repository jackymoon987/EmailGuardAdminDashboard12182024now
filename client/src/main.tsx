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
import OnboardingPage from "./pages/OnboardingPage";
import EmailProviderPage from "./pages/EmailProviderPage";
import ApprovedSendersPage from "./pages/ApprovedSendersPage";
import Layout from "./components/Layout";
import { useUser } from "./hooks/use-user";
import { Loader2 } from "lucide-react";
import { InitialSetup } from "./components/InitialSetup";

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

  // Show onboarding for new users
  if (!user.firstName || !user.lastName) {
    return <OnboardingPage />;
  }

  return (
    <Switch>
      <Route path="/get-started" component={EmailProviderPage} />
      <Route path="/" component={DashboardPage} />
      <Route path="/users" component={UsersPage} />
      <Route path="/filters" component={FiltersPage} />
      <Route path="/analytics">
        <AnalyticsPage />
      </Route>
      <Route path="/analytics/:userId">
        <AnalyticsPage />
      </Route>
      <Route path="/approved-senders/:userId" component={ApprovedSendersPage} />
      <Route>404 Page Not Found</Route>
    </Switch>
  );

  // Show initial setup for new users
  if (user.showInitialSetup) {
    return (
      <InitialSetup
        onComplete={async (settings) => {
          // Update user preferences in the database
          await fetch('/api/user/preferences', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings)
          });
          window.location.href = '/';
        }}
        onReviewSenders={() => {
          window.location.href = '/filters';
        }}
      />
    );
  }

  return (
    <Layout>
      <Switch>
        <Route path="/" component={DashboardPage} />
        <Route path="/users" component={UsersPage} />
        <Route path="/filters" component={FiltersPage} />
        <Route path="/analytics">
          <AnalyticsPage />
        </Route>
        <Route path="/analytics/:userId">
          <AnalyticsPage />
        </Route>
        <Route path="/approved-senders/:userId" component={ApprovedSendersPage} />
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

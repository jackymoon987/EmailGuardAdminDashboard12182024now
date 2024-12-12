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
import AdminProfilePage from "./pages/AdminProfilePage";
import EmailProviderPage from "./pages/EmailProviderPage";
import ApprovedSendersPage from "./pages/ApprovedSendersPage";
import ReviewSendersPage from "./pages/ReviewSendersPage";
import SettingsPage from "./pages/SettingsPage";
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

  // After onboarding, show email provider selection
  const path = window.location.pathname;
  if (path === '/get-started') {
    return <EmailProviderPage />;
  }

  // Show company settings only after email provider selection
  if (path === '/company-settings') {
    return (
      <InitialSetup
        onComplete={async (settings) => {
          try {
            await fetch('/api/user/preferences', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(settings)
            });
            window.location.href = '/'; // Routes to dashboard
          } catch (error) {
            console.error('Failed to save preferences:', error);
          }
        }}
        onReviewSenders={() => {
          window.location.href = '/review-senders';
        }}
      />
    );
  }

  return (
    <Layout>
      <Switch>
        <Route path="/get-started" component={EmailProviderPage} />
        <Route path="/settings" component={SettingsPage} />
        <Route path="/review-senders" component={ReviewSendersPage} />
        <Route path="/company-settings">
          <InitialSetup
            onComplete={async (settings) => {
              await fetch('/api/user/preferences', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
              });
              window.location.href = '/';
            }}
            onReviewSenders={() => {
              window.location.href = '/review-senders';
            }}
          />
        </Route>
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
        <Route path="/admin-profile" component={AdminProfilePage} />
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
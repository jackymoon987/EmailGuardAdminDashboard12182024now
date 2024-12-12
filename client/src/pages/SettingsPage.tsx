import { InitialSetup } from "../components/InitialSetup";
import { useLocation } from "wouter";

export default function SettingsPage() {
  const [, setLocation] = useLocation();

  const handleInitialSetupComplete = async (settings: {
    surveyEmailDefault: "yes" | "no" | "later";
    evaluatingFolderDefault: "yes" | "no" | "later";
  }) => {
    try {
      const response = await fetch('/api/user/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to save preferences');
      }

      setLocation('/');
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const handleReviewSenders = () => {
    setLocation('/review-senders');
  };

  return (
    <InitialSetup
      onComplete={handleInitialSetupComplete}
      onReviewSenders={handleReviewSenders}
    />
  );
}

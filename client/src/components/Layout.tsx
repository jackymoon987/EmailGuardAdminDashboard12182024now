import TopNav from "./TopNav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="container py-6">
        {children}
      </main>
    </div>
  );
}

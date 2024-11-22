import TopNav from "./TopNav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="container py-6 px-8 md:px-12">
        {children}
      </main>
    </div>
  );
}

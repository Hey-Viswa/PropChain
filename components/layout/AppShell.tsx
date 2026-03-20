import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto px-6 py-6 md:px-8 md:py-8 xl:px-12 xl:py-10 2xl:px-16 2xl:py-12">
          <div className="w-full max-w-screen-2xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

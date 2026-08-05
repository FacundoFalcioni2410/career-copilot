import NavLinks from "@/components/layout/NavLinks";
import MobileNav from "@/components/layout/MobileNav";
import LogoutButton from "@/components/layout/LogoutButton";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col md:flex-row">
      <aside className="hidden md:flex md:w-56 md:shrink-0 md:flex-col md:border-r md:border-gray-200 md:bg-white">
        <div className="border-b border-gray-200 px-4 py-4">
          <span className="text-sm font-semibold text-gray-900">
            Career Copilot
          </span>
        </div>
        <div className="flex flex-1 flex-col justify-between px-2 py-3">
          <NavLinks />
          <LogoutButton />
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <MobileNav />
        <main className="flex-1 bg-white px-6 py-6 md:px-8">{children}</main>
      </div>
    </div>
  );
}

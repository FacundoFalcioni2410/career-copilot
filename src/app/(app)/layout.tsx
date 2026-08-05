import RequireAuth from "@/components/auth/RequireAuth";
import AppShell from "@/components/layout/AppShell";

export default function AppGroupLayout({ children }: LayoutProps<"/">) {
  return (
    <RequireAuth>
      <AppShell>{children}</AppShell>
    </RequireAuth>
  );
}

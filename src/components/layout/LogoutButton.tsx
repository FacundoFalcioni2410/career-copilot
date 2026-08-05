"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded px-2.5 py-1.5 text-left text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    >
      Log out
    </button>
  );
}

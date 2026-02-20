"use client";

import { LogOut } from "lucide-react";
import { logoutUser } from "@/app/auth/actions";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-[#1a3328] dark:hover:text-white transition-colors w-full"
    >
      <LogOut className="w-5 h-5" />
      Sair
    </button>
  );
}

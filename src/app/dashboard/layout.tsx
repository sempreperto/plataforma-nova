// Ficheiro: src/app/dashboard/layout.tsx
"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { FiHome, FiCpu, FiLogOut, FiSettings, FiUser, FiBarChart2 } from "react-icons/fi";
import { usePathname } from 'next/navigation';
import { ProfileCompletionChecker } from "@/components/ProfileCompletionChecker";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", icon: FiHome, label: "Meus Projetos" },
    { href: "/dashboard/test-device", icon: FiCpu, label: "Testar Dispositivo" },
    { href: "/dashboard/gerador-firmware", icon: FiBarChart2, label: "Gerador Firmware" },
  ];

  return (
    <ProfileCompletionChecker>
      <div className="flex h-screen bg-gray-900 text-white">
        <aside className="w-64 bg-gray-800/50 p-6 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-10 text-purple-400">Soneh</h1>
            <nav className="space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                    pathname === item.href
                      ? "bg-purple-600 text-white"
                      : "text-gray-400 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <item.icon />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="border-t border-gray-700 pt-6">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={session?.user?.image || "/default-avatar.png"}
                alt="Avatar"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold">{session?.user?.name}</p>
                <p className="text-sm text-gray-400">{session?.user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
            >
              <FiLogOut />
              Sair
            </button>
          </div>
        </aside>
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </ProfileCompletionChecker>
  );
}

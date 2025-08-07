// src/components/ProfileCompletionChecker.tsx
"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { FiLoader } from "react-icons/fi";

// Páginas que não precisam de verificação (são públicas ou parte do fluxo de auth)
const WHITELISTED_PATHS = [
    '/auth/signin',
    '/auth/complete-profile',
    '/', // A página inicial
    '/kit-iot',
];

export function ProfileCompletionChecker({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (status === "loading") return; // Ainda a carregar, não faz nada
        if (status === "unauthenticated") return; // Deixa o NextAuth/middleware tratar disso

        const isProfileComplete = !!session?.user?.telefone;
        const isWhitelisted = WHITELISTED_PATHS.includes(pathname);

        if (status === "authenticated" && !isProfileComplete && !isWhitelisted) {
            router.push('/auth/complete-profile');
        }

    }, [session, status, router, pathname]);

    // Se o perfil está incompleto e estamos numa página protegida, mostra um loader
    if (status === "authenticated" && !session?.user?.telefone && !WHITELISTED_PATHS.includes(pathname)) {
        return (
             <div className="flex h-screen w-full items-center justify-center bg-gray-900 text-white">
                <FiLoader className="animate-spin mr-3" size={24}/> Redirecionando...
            </div>
        );
    }

    return <>{children}</>;
}

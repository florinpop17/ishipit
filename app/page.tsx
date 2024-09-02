"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./lib/supabaseClient";
import { Session } from "@supabase/supabase-js";

export default function Home() {
    const router = useRouter();
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        const getSession = async () => {
            const { data } = await supabase.auth.getSession();
            setSession(data.session);
        };
        getSession();
    }, []);

    useEffect(() => {
        if (session) {
            router.push("/dashboard");
        }
    }, [session, router]);

    if (session) {
        return null; // or a loading spinner
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <h1 className="text-4xl font-bold mb-4">Welcome to iShipIt</h1>
            <p className="text-lg mb-8">
                iShipIt helps you stay productive by timing your work sessions
                and keeping track of your progress.
            </p>
            <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => router.push("/login")}
            >
                Sign Up / Login
            </button>
        </main>
    );
}

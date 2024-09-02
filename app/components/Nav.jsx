"use client";

import Link from "next/link";
import { supabase } from "../lib/supabaseClient";

export default function Nav() {
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Error logging out:", error.message);
        } else {
            window.location.href = "/";
        }
    };

    return (
        <nav className="bg-gray-800 p-4 flex justify-between items-center">
            <ul className="flex space-x-4">
                <li>
                    <Link href="/" className="text-white">
                        Home
                    </Link>
                </li>
                <li>
                    <Link href="/profile" className="text-white">
                        Profile
                    </Link>
                </li>
                {/* Add more links as needed */}
            </ul>
            <button onClick={handleLogout} className="text-white">
                Logout
            </button>
        </nav>
    );
}

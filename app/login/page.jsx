"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Login() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleLogin = async (e) => {
        setLoading(true);

        const { error } = await supabase.auth.signInWithOtp({ email });
        setLoading(false);

        if (error) {
            console.error("Error logging in:", error.message);
            setMessage("Error logging in. Please try again.");
        } else {
            setMessage("Check your email for the login link!");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleLogin();
                }}
                className="p-8 bg-gray-800 rounded-lg shadow-lg text-center"
            >
                {message && (
                    <div className="mb-4 p-3 rounded bg-blue-500 text-white">
                        {message}
                    </div>
                )}
                <h1 className="text-2xl font-bold text-white mb-6">Login</h1>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 mb-4 rounded bg-gray-700 text-white border border-gray-600"
                />
                <button
                    className="w-full p-3 rounded bg-purple-600 text-white hover:bg-purple-700"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Login"}
                </button>
            </form>
        </div>
    );
}

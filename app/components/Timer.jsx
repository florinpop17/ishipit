"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Timer({ session }) {
    const [timeLeft, setTimeLeft] = useState(7200); // 2 hours in seconds
    const [isRunning, setIsRunning] = useState(false);
    const [workDetails, setWorkDetails] = useState("");
    const { user } = session;

    useEffect(() => {
        let timer;
        if (isRunning) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        }

        if (timeLeft === 0) {
            clearInterval(timer);
            alert("Time is up!");
            // Store end time in the database
            const { user } = session;
            supabase
                .from("sessions")
                .insert({ user_id: user.id, end_time: new Date() });
        }

        return () => clearInterval(timer);
    }, [isRunning, timeLeft, session]);

    const handleStart = async () => {
        setIsRunning(true);
        await supabase
            .from("sessions")
            .insert({ user_id: user.id, start_time: new Date() });
    };

    const handleSaveWorkDetails = async () => {
        await supabase
            .from("work_sessions")
            .insert({ user_id: user.id, details: workDetails });
    };

    const handleStop = async () => {
        setIsRunning(false);
        await supabase
            .from("sessions")
            .update({ end_time: new Date() })
            .eq("user_id", user.id)
            .order("id", { ascending: false })
            .limit(1);
    };

    return (
        <div className="max-w-md mx-auto p-4 border rounded-lg shadow-lg">
            <h1 className="text-2xl mb-5 text-center">Timer</h1>
            <div className="text-3xl text-black font-bold mb-5 p-5 border-2 border-gray-800 rounded-lg bg-white text-center">
                {Math.floor(timeLeft / 3600)}:
                {Math.floor((timeLeft % 3600) / 60)
                    .toString()
                    .padStart(2, "0")}
                :{timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}
            </div>
            <div className="flex justify-center space-x-4">
                <button
                    className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700 disabled:bg-gray-400"
                    onClick={handleStart}
                    disabled={isRunning}
                >
                    Start Timer
                </button>
                <button
                    className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-700 disabled:bg-gray-400"
                    onClick={handleStop}
                    disabled={!isRunning}
                >
                    Stop Timer
                </button>
            </div>
            {timeLeft === 0 && (
                <div className="mt-5">
                    <h2 className="text-xl mb-2">What did you work on?</h2>
                    <textarea
                        className="w-full p-2 border rounded mb-2"
                        value={workDetails}
                        onChange={(e) => setWorkDetails(e.target.value)}
                    />
                    <button
                        className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-700"
                        onClick={handleSaveWorkDetails}
                    >
                        Save
                    </button>
                </div>
            )}
        </div>
    );
}

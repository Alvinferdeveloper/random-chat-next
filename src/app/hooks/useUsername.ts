"use client";
import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";

export function useUsername() {
    const [username, setUsername] = useState<string>("");
    const { session, isPending } = useAuth();

    useEffect(() => {
        if (isPending) return;

        if (session && session.user.name) {
            setUsername(session.user.name);
            localStorage.setItem("username", session.user.name);
        } else {
            let storedUsername = localStorage.getItem("username");
            if (!storedUsername || !storedUsername.startsWith("Usuario")) {
                storedUsername = `Usuario${Math.floor(Math.random() * 10000)}`;
                localStorage.setItem("username", storedUsername);
            }
            setUsername(storedUsername);
        }
    }, [session, isPending]);

    return username;
}

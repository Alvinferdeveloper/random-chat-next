"use client";
import { useState, useEffect } from "react";

export function useUsername() {
    const [username, setUsername] = useState<string>("");

    useEffect(() => {
        let storedUsername = localStorage.getItem("username");
        if (!storedUsername) {
            storedUsername = `Usuario${Math.floor(Math.random() * 10000)}`;
            localStorage.setItem("username", storedUsername);
        }
        setUsername(storedUsername);
    }, []);

    return username;
}

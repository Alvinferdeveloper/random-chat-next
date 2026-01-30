"use client";
import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";

const ADJECTIVES = ["Happy", "Swift", "Brave", "Calm", "Bright", "Eager", "Fancy", "Gentle", "Jolly", "Kind", "Lively", "Misty", "Proud", "Quiet", "Royal", "Sunny", "Witty", "Zesty"];
const NOUNS = ["Panda", "Eagle", "Fox", "Lion", "Tiger", "Bear", "Wolf", "Hawk", "Koala", "Otter", "Dolphin", "Whale", "Falcon", "Badger", "Rabbit", "Lynx", "Gecko", "Swan"];

function generateRandomName() {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const number = Math.floor(Math.random() * 100);
    return `${adj}${noun}${number}`;
}

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
            // If stored name is the old "Usuario..." format or doesn't exist, generate a new fun one
            if (!storedUsername || storedUsername.startsWith("Usuario")) {
                storedUsername = generateRandomName();
                localStorage.setItem("username", storedUsername);
            }
            setUsername(storedUsername);
        }
    }, [session, isPending]);

    return username;
}

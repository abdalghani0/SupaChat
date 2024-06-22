"use client"
import React, { useEffect, useState } from 'react';
import { Switch } from './ui/switch';
import { useTheme } from 'next-themes';

export default function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme, setTheme } = useTheme();
    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }
    return (
        <>
            <Switch
                checked={resolvedTheme === "dark"}
                onCheckedChange={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            />
        </>
    );
}

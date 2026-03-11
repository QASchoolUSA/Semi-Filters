'use client'

import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { HiOutlineSun, HiOutlineMoon } from 'react-icons/hi'

export default function ThemeToggle() {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div style={{ width: 44, height: 44 }} />
    }

    const isLight = theme === 'light'

    return (
        <button
            onClick={() => setTheme(isLight ? 'dark' : 'light')}
            className="cart-button"
            aria-label="Toggle theme"
            title={`Switch to ${isLight ? 'Dark' : 'Light'} Theme`}
        >
            {isLight ? (
                <HiOutlineMoon size={22} className="text-gray-800" />
            ) : (
                <HiOutlineSun size={22} className="text-gray-200" />
            )}
        </button>
    )
}

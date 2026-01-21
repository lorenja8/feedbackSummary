import React from "react";
import { useAuth } from "../context/AuthContext";
import { useUser } from "../hooks/useUser";
import { useState } from "react";

export default function HeaderLayout({ children, title }: { children: React.ReactNode; title?: string }) {
  const { role, logout } = useAuth();
  const { data: me } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  if (role === "student") {
    return (
        <div className="min-h-screen flex flex-col">
        {/* Header */}
        <nav className="bg-gray-200 fixed top-4 left-4 right-4 z-20 rounded-md">
            <div className="max-w-screen-xl mx-auto flex items-center justify-between p-4">
            
                {/* Left side: Welcome (hidden on mobile) */}
                <div className="hidden md:block flex-shrink-0 text-black font-medium">
                    {me?.name || "Session ended"}
                </div>

                {/* Center: Website name */}
                <div className="absolute left-1/2 transform -translate-x-1/2 text-black font-bold text-[60px]">
                    FBCK
                </div>

                {/* Right side: Nav buttons */}
                <div className="hidden md:flex space-x-4 text-white font-medium">
                    <a href="/student">
                        <button className="px-3 py-1 text-black rounded">Sessions</button>
                    </a>
                    <a href="/profile">
                        <button className="px-3 py-1 text-black rounded">Profile</button>
                    </a>
                    <a>
                        <button onClick={logout} className="px-3 py-1 text-black rounded">Logout</button>
                    </a>
                </div>

                {/* Mobile dropdown button */}
                <div className="md:hidden ml-auto">
                    <button
                        type="button"
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="text-black focus:outline-none border rounded"
                        aria-controls="mobile-menu"
                        aria-expanded={menuOpen}
                    >
                        ☰
                    </button>
                </div>

            </div>

            {/* Mobile menu */}
            {menuOpen && (
            <div className="md:hidden" id="mobile-menu">
                <ul className="flex flex-col space-y-2 p-4 bg-white text-white">
                <a href="/student">
                    <button className="px-3 py-1 text-black border rounded">Sessions</button>
                </a>
                <a href="/profile">
                    <button className="px-3 py-1 text-black border rounded">Profile</button>
                </a>
                <a>
                    <button onClick={logout} className="px-3 py-1 text-black border rounded">Logout</button>
                </a>
                </ul>
            </div>
            )}
        </nav>

        {/* Main content */}
        <main className="flex-1 pt-20">
            {title && <h1 className="text-2xl font-semibold mb-4">{title}</h1>}
            {children}
        </main>
        </div>

    );
  } else if (role === "teacher") {
    return (
        <div className="min-h-screen flex flex-col">
        {/* Header */}
        <nav className="bg-blue-200 fixed top-4 left-4 right-4 z-20 rounded-md">
            <div className="max-w-screen-xl mx-auto flex items-center justify-between p-4">
            
                {/* Left side: Welcome (hidden on mobile) */}
                <div className="hidden md:block flex-shrink-0 text-black font-medium">
                    {me?.name || "Session ended"}
                </div>

                {/* Center: Website name */}
                <div className="absolute left-1/2 transform -translate-x-1/2 text-black font-bold text-[60px]">
                    FBCK
                </div>

                {/* Right side: Nav buttons */}
                <div className="hidden md:flex space-x-4 text-white font-medium">
                    <a href="/teacher">
                        <button className="px-3 py-1 text-black rounded">Analysis</button>
                    </a>
                    <a href="/profile">
                        <button className="px-3 py-1 text-black rounded">Profile</button>
                    </a>
                    <a>
                        <button onClick={logout} className="px-3 py-1 text-black rounded">Logout</button>
                    </a>
                </div>

                {/* Mobile dropdown button */}
                <div className="md:hidden ml-auto">
                    <button
                        type="button"
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="text-black focus:outline-none border rounded"
                        aria-controls="mobile-menu"
                        aria-expanded={menuOpen}
                    >
                        ☰
                    </button>
                </div>

            </div>

            {/* Mobile menu */}
            {menuOpen && (
            <div className="md:hidden" id="mobile-menu">
                <ul className="flex flex-col space-y-2 p-4 bg-white text-white">
                <a href="/teacher">
                    <button className="px-3 py-1 text-black border rounded">Analysis</button>
                </a>
                <a href="/profile">
                    <button className="px-3 py-1 text-black border rounded">Profile</button>
                </a>
                <a>
                    <button onClick={logout} className="px-3 py-1 text-black border rounded">Logout</button>
                </a>
                </ul>
            </div>
            )}
        </nav>

        {/* Main content */}
        <main className="flex-1 pt-20">
            {title && <h1 className="text-2xl font-semibold mb-4">{title}</h1>}
            {children}
        </main>
        </div>

    );
  } else if (role === "admin") {
    return (
        <div className="min-h-screen flex flex-col">
        {/* Header */}
        <nav className="bg-yellow-200 fixed top-4 left-4 right-4 z-20 rounded-md">
            <div className="max-w-screen-xl mx-auto flex items-center justify-between p-4">
            
                {/* Left side: Welcome (hidden on mobile) */}
                <div className="hidden md:block flex-shrink-0 text-black font-medium">
                    {me?.name || "Session ended"}
                </div>

                {/* Center: Website name */}
                <div className="absolute left-1/2 transform -translate-x-1/2 text-black font-bold text-[60px]">
                    FBCK
                </div>

                {/* Right side: Nav buttons */}
                <div className="hidden md:flex space-x-4 text-white font-medium">
                    <a href="/admin">
                        <button className="px-3 py-1 text-black rounded">Editor</button>
                    </a>
                    <a href="/profile">
                        <button className="px-3 py-1 text-black rounded">Profile</button>
                    </a>
                    <a>
                        <button onClick={logout} className="px-3 py-1 text-black rounded">Logout</button>
                    </a>
                </div>

                {/* Mobile dropdown button */}
                <div className="md:hidden ml-auto">
                    <button
                        type="button"
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="text-black focus:outline-none border rounded"
                        aria-controls="mobile-menu"
                        aria-expanded={menuOpen}
                    >
                        ☰
                    </button>
                </div>

            </div>

            {/* Mobile menu */}
            {menuOpen && (
            <div className="md:hidden" id="mobile-menu">
                <ul className="flex flex-col space-y-2 p-4 bg-white text-white">
                <a href="/admin">
                    <button className="px-3 py-1 text-black border rounded">Editor</button>
                </a>
                <a href="/profile">
                    <button className="px-3 py-1 text-black border rounded">Profile</button>
                </a>
                <a>
                    <button onClick={logout} className="px-3 py-1 text-black border rounded">Logout</button>
                </a>
                </ul>
            </div>
            )}
        </nav>

        {/* Main content */}
        <main className="flex-1 pt-20">
            {title && <h1 className="text-2xl font-semibold mb-4">{title}</h1>}
            {children}
        </main>
        </div>

    );
  }
}

import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
    {
        to: "/dashboard",
        label: "Dashboard",
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="w-4 h-4"
            >
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
        ),
    },
    {
        to: "/accounts",
        label: "Accounts",
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="w-4 h-4"
            >
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <path d="M2 10h20" />
                <path d="M6 15h4" strokeLinecap="round" />
            </svg>
        ),
    },
    {
        to: "/transactions",
        label: "Transactions",
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="w-4 h-4"
            >
                <path
                    d="M7 16V4m0 0L3 8m4-4l4 4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M17 8v12m0 0l4-4m-4 4l-4-4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        ),
    },
    {
        to: "/system",
        label: "System",
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="w-4 h-4"
            >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
            </svg>
        ),
    },
];

export default function Layout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const initials = user?.name
        ? user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)
        : "?";

    return (
        <div className="flex min-h-screen bg-ink-950">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 w-60 bg-ink-900 border-r border-ink-700 flex flex-col transition-transform duration-300
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:flex`}
            >
                {/* Logo */}
                <div className="px-6 py-6 border-b border-ink-700">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-jade-500 flex items-center justify-center shrink-0">
                            <svg
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-4 h-4 text-ink-950"
                            >
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-display font-bold text-white text-sm leading-none">
                                Fintech
                            </p>
                            <p className="font-display text-jade-400 text-xs font-semibold tracking-wider">
                                LEDGER
                            </p>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-0.5">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={() => setMobileOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150
                ${
                    isActive
                        ? "bg-jade-500/10 text-jade-400 border border-jade-500/20"
                        : "text-slate-400 hover:text-white hover:bg-ink-700"
                }`
                            }
                        >
                            {item.icon}
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* User */}
                <div className="px-3 py-4 border-t border-ink-700">
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1">
                        <div className="w-7 h-7 rounded-lg bg-ink-600 border border-ink-500 flex items-center justify-center shrink-0">
                            <span className="text-xs font-display font-bold text-slate-300">
                                {initials}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-white truncate">
                                {user?.name}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                                {user?.email}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-rose-400 hover:bg-rose-500/10 transition-all duration-150"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="w-4 h-4"
                        >
                            <path
                                d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"
                                strokeLinecap="round"
                            />
                            <polyline
                                points="16 17 21 12 16 7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <line
                                x1="21"
                                y1="12"
                                x2="9"
                                y2="12"
                                strokeLinecap="round"
                            />
                        </svg>
                        Sign out
                    </button>
                </div>
            </aside>

            {mobileOpen && (
                <div
                    className="fixed inset-0 z-30 bg-ink-950/80 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="lg:hidden flex items-center justify-between px-4 py-4 border-b border-ink-700 bg-ink-900">
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-ink-700"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="w-5 h-5"
                        >
                            <line
                                x1="3"
                                y1="6"
                                x2="21"
                                y2="6"
                                strokeLinecap="round"
                            />
                            <line
                                x1="3"
                                y1="12"
                                x2="21"
                                y2="12"
                                strokeLinecap="round"
                            />
                            <line
                                x1="3"
                                y1="18"
                                x2="21"
                                y2="18"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>
                    <span className="font-display font-bold text-white text-sm">
                        Fintech Ledger
                    </span>
                    <div className="w-9" />
                </header>
                <main className="flex-1 p-6 lg:p-8 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { accountService } from "../services/api";
import { SkeletonRow, EmptyState } from "../components/UI";

const fmt = (amount, currency = "INR") =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
    }).format(amount ?? 0);

function AccountBalanceCard({ account, index }) {
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        accountService
            .getBalance(account._id)
            .then((r) => setBalance(r.data.balance))
            .catch(() => setBalance(0))
            .finally(() => setLoading(false));
    }, [account._id]);

    const statusCls = {
        ACTIVE: "badge-success",
        FROZEN: "badge-warning",
        CLOSED: "badge-danger",
    };

    return (
        <div
            className="card p-6 flex flex-col gap-2 hover:border-ink-500 transition-colors animate-fade-up"
            style={{
                animationDelay: `${index * 80}ms`,
                animationFillMode: "both",
                opacity: 0,
            }}
        >
            <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-xl bg-jade-500/10 border border-jade-500/20 flex items-center justify-center text-jade-400">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="w-4 h-4"
                    >
                        <rect x="2" y="5" width="20" height="14" rx="2" />
                        <path d="M2 10h20" />
                    </svg>
                </div>
                <span className={statusCls[account.status] || "badge-neutral"}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {account.status}
                </span>
            </div>
            <div className="mt-4">
                {loading ? (
                    <div className="h-7 w-32 rounded shimmer-bg" />
                ) : (
                    <p className="font-display font-bold text-2xl text-white">
                        {fmt(balance, account.currency)}
                    </p>
                )}
                <p className="text-slate-500 text-xs font-mono mt-1 truncate">
                    {account._id}
                </p>
            </div>
            <div className="mt-3 pt-3 border-t border-ink-600 flex items-center justify-between">
                <span className="text-slate-500 text-xs">
                    {account.currency}
                </span>
                <span className="text-slate-500 text-xs">
                    {new Date(account.createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    })}
                </span>
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const { user } = useAuth();
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchAccounts = useCallback(async () => {
        setLoading(true);
        try {
            const r = await accountService.getAll();
            setAccounts(r.data.accounts || []);
        } catch {
            setAccounts([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAccounts();
    }, [fetchAccounts]);

    const hour = new Date().getHours();
    const greeting =
        hour < 12
            ? "Good morning"
            : hour < 17
              ? "Good afternoon"
              : "Good evening";

    const stats = [
        {
            label: "Total Accounts",
            value: accounts.length,
            color: "text-jade-400 bg-jade-500/10 border-jade-500/20",
        },
        {
            label: "Active",
            value: accounts.filter((a) => a.status === "ACTIVE").length,
            color: "text-jade-400 bg-jade-500/10 border-jade-500/20",
        },
        {
            label: "Frozen",
            value: accounts.filter((a) => a.status === "FROZEN").length,
            color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
        },
        {
            label: "Closed",
            value: accounts.filter((a) => a.status === "CLOSED").length,
            color: "text-slate-400 bg-slate-500/10 border-slate-500/20",
        },
    ];

    return (
        <div>
            <div className="mb-8 animate-fade-up">
                <p className="text-slate-400 text-sm mb-1">{greeting},</p>
                <h1 className="font-display font-bold text-3xl text-white">
                    {user?.name?.split(" ")[0]} 👋
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                    Here's an overview of your financial accounts
                </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                {stats.map((s, i) => (
                    <div
                        key={s.label}
                        className="card p-4 animate-fade-up"
                        style={{
                            animationDelay: `${i * 60}ms`,
                            animationFillMode: "both",
                            opacity: 0,
                        }}
                    >
                        <p className="font-display font-bold text-xl text-white">
                            {loading ? "—" : s.value}
                        </p>
                        <p className="text-slate-500 text-xs">{s.label}</p>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-base text-white">
                    Your Accounts
                </h2>
                <Link
                    to="/accounts"
                    className="text-jade-400 hover:text-jade-300 text-xs transition-colors"
                >
                    Manage accounts →
                </Link>
            </div>

            {loading ? (
                <div className="card divide-y divide-ink-700">
                    {[...Array(3)].map((_, i) => (
                        <SkeletonRow key={i} />
                    ))}
                </div>
            ) : accounts.length === 0 ? (
                <div className="card">
                    <EmptyState
                        icon={
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                className="w-6 h-6"
                            >
                                <rect
                                    x="2"
                                    y="5"
                                    width="20"
                                    height="14"
                                    rx="2"
                                />
                                <path d="M2 10h20" />
                            </svg>
                        }
                        title="No accounts yet"
                        description="Create your first account to start managing your finances."
                        action={
                            <Link
                                to="/accounts"
                                className="btn-primary text-sm"
                            >
                                Create Account
                            </Link>
                        }
                    />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {accounts.map((a, i) => (
                        <AccountBalanceCard key={a._id} account={a} index={i} />
                    ))}
                </div>
            )}

            <div className="mt-8">
                <h2 className="font-display font-semibold text-base text-white mb-4">
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                        {
                            to: "/accounts",
                            title: "New Account",
                            desc: "Open a new ledger account",
                        },
                        {
                            to: "/transactions",
                            title: "Transfer Funds",
                            desc: "Send money between accounts",
                        },
                    ].map((item) => (
                        <Link
                            key={item.to}
                            to={item.to}
                            className="card p-5 flex items-center gap-4 hover:border-ink-500 transition-all duration-200 group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-jade-500/10 border border-jade-500/20 flex items-center justify-center text-jade-400 group-hover:bg-jade-500/20 transition-colors">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="w-4 h-4"
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <line
                                        x1="12"
                                        y1="8"
                                        x2="12"
                                        y2="16"
                                        strokeLinecap="round"
                                    />
                                    <line
                                        x1="8"
                                        y1="12"
                                        x2="16"
                                        y2="12"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="font-display font-semibold text-sm text-white">
                                    {item.title}
                                </p>
                                <p className="text-slate-500 text-xs">
                                    {item.desc}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

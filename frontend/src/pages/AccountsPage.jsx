import React, { useEffect, useState, useCallback } from "react";
import { accountService } from "../services/api";
import {
    PageHeader,
    EmptyState,
    SkeletonRow,
    Toast,
    Modal,
    CopyButton,
} from "../components/UI";

const fmt = (amount, currency = "INR") =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
    }).format(amount ?? 0);

function AccountRow({ account, onSelect }) {
    const [balance, setBalance] = useState(null);
    const [balLoading, setBalLoading] = useState(true);

    useEffect(() => {
        accountService
            .getBalance(account._id)
            .then((r) => setBalance(r.data.balance))
            .catch(() => setBalance(0))
            .finally(() => setBalLoading(false));
    }, [account._id]);

    const statusCls = {
        ACTIVE: "badge-success",
        FROZEN: "badge-warning",
        CLOSED: "badge-danger",
    };

    return (
        <div
            className="flex items-center gap-4 p-4 hover:bg-ink-700/50 transition-colors cursor-pointer rounded-xl"
            onClick={() => onSelect(account)}
        >
            <div className="w-9 h-9 rounded-xl bg-jade-500/10 border border-jade-500/20 flex items-center justify-center text-jade-400 shrink-0">
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
            <div className="flex-1 min-w-0">
                <p className="text-xs font-mono text-slate-400 truncate">
                    {account._id}
                </p>
                <p className="text-xs text-slate-600 mt-0.5">
                    Created{" "}
                    {new Date(account.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    })}
                </p>
            </div>
            <div className="text-right shrink-0">
                <p className="font-display font-bold text-sm text-white">
                    {balLoading ? (
                        <span className="shimmer-bg inline-block w-20 h-4 rounded" />
                    ) : (
                        fmt(balance, account.currency)
                    )}
                </p>
                <span
                    className={`${statusCls[account.status] || "badge-neutral"} mt-1`}
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {account.status}
                </span>
            </div>
        </div>
    );
}

function AccountDetailModal({ account, onClose }) {
    const [balance, setBalance] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!account) return;
        setLoading(true);
        accountService
            .getBalance(account._id)
            .then((r) => setBalance(r.data.balance))
            .catch(() => setBalance(0))
            .finally(() => setLoading(false));
    }, [account]);

    if (!account) return null;
    const statusCls = {
        ACTIVE: "badge-success",
        FROZEN: "badge-warning",
        CLOSED: "badge-danger",
    };

    return (
        <Modal isOpen={!!account} onClose={onClose} title="Account Details">
            <div className="space-y-4">
                <div className="bg-ink-700 rounded-xl p-4 text-center">
                    <p className="text-slate-400 text-xs mb-1">
                        Current Balance
                    </p>
                    {loading ? (
                        <div className="h-8 w-36 rounded shimmer-bg mx-auto" />
                    ) : (
                        <p className="font-display font-bold text-3xl text-white">
                            {fmt(balance, account.currency)}
                        </p>
                    )}
                </div>
                <div className="space-y-3">
                    {[
                        { label: "Account ID", value: account._id, copy: true },
                        { label: "Currency", value: account.currency },
                        {
                            label: "Status",
                            value: (
                                <span
                                    className={
                                        statusCls[account.status] ||
                                        "badge-neutral"
                                    }
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                    {account.status}
                                </span>
                            ),
                        },
                        {
                            label: "Created",
                            value: new Date(account.createdAt).toLocaleString(
                                "en-IN",
                            ),
                        },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className="flex items-center justify-between"
                        >
                            <span className="text-slate-500 text-xs">
                                {item.label}
                            </span>
                            {item.copy ? (
                                <CopyButton
                                    value={item.value}
                                    label={item.value.slice(0, 20) + "..."}
                                />
                            ) : typeof item.value === "string" ? (
                                <span className="text-white text-xs font-mono">
                                    {item.value}
                                </span>
                            ) : (
                                item.value
                            )}
                        </div>
                    ))}
                </div>
                <button
                    onClick={onClose}
                    className="btn-ghost w-full mt-2 text-sm"
                >
                    Close
                </button>
            </div>
        </Modal>
    );
}

export default function AccountsPage() {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [toast, setToast] = useState(null);
    const [selectedAccount, setSelectedAccount] = useState(null);

    const fetchAccounts = useCallback(async () => {
        setLoading(true);
        try {
            const r = await accountService.getAll();
            setAccounts(r.data.accounts || []);
        } catch {
            setToast({ message: "Failed to load accounts", type: "error" });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAccounts();
    }, [fetchAccounts]);

    const handleCreate = async () => {
        setCreating(true);
        try {
            await accountService.create();
            setToast({
                message: "Account created successfully",
                type: "success",
            });
            await fetchAccounts();
        } catch (err) {
            setToast({
                message:
                    err.response?.data?.message || "Failed to create account",
                type: "error",
            });
        } finally {
            setCreating(false);
        }
    };

    return (
        <div>
            <PageHeader
                title="Accounts"
                subtitle="Manage all your ledger accounts"
                action={
                    <button
                        onClick={handleCreate}
                        disabled={creating}
                        className="btn-primary flex items-center gap-2 text-sm"
                    >
                        {creating ? (
                            <>
                                <svg
                                    className="animate-spin w-4 h-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <circle
                                        className="opacity-20"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                    />
                                    <path
                                        className="opacity-80"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"
                                    />
                                </svg>
                                Creating…
                            </>
                        ) : (
                            <>
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="w-4 h-4"
                                >
                                    <line
                                        x1="12"
                                        y1="5"
                                        x2="12"
                                        y2="19"
                                        strokeLinecap="round"
                                    />
                                    <line
                                        x1="5"
                                        y1="12"
                                        x2="19"
                                        y2="12"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                New Account
                            </>
                        )}
                    </button>
                }
            />

            {toast && (
                <div className="mb-5">
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                </div>
            )}

            <div className="card">
                {loading ? (
                    <div className="divide-y divide-ink-700">
                        {[...Array(4)].map((_, i) => (
                            <SkeletonRow key={i} />
                        ))}
                    </div>
                ) : accounts.length === 0 ? (
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
                        description="Create your first account to start tracking your balances."
                        action={
                            <button
                                onClick={handleCreate}
                                disabled={creating}
                                className="btn-primary text-sm"
                            >
                                Create Account
                            </button>
                        }
                    />
                ) : (
                    <div className="divide-y divide-ink-700/60 p-2">
                        {accounts.map((a) => (
                            <AccountRow
                                key={a._id}
                                account={a}
                                onSelect={setSelectedAccount}
                            />
                        ))}
                    </div>
                )}
            </div>

            <AccountDetailModal
                account={selectedAccount}
                onClose={() => setSelectedAccount(null)}
            />
        </div>
    );
}

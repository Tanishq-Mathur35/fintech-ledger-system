import React, { useEffect, useState } from "react";
import { accountService, transactionService } from "../services/api";
import {
    PageHeader,
    Toast,
    Modal,
    Spinner,
    EmptyState,
} from "../components/UI";
import { generateId } from "../utils/uuid";

const fmt = (amount) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(amount ?? 0);

function TransferModal({ isOpen, onClose, accounts, onSuccess }) {
    const [form, setForm] = useState({
        fromAccount: "",
        toAccount: "",
        amount: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [fromBalance, setFromBalance] = useState(null);

    useEffect(() => {
        if (!form.fromAccount) {
            setFromBalance(null);
            return;
        }
        accountService
            .getBalance(form.fromAccount)
            .then((r) => setFromBalance(r.data.balance))
            .catch(() => setFromBalance(null));
    }, [form.fromAccount]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (form.fromAccount === form.toAccount) {
            setError("Source and destination must be different");
            return;
        }
        setLoading(true);
        try {
            const res = await transactionService.create({
                fromAccount: form.fromAccount,
                toAccount: form.toAccount,
                amount: parseFloat(form.amount),
                idempotencyKey: `txn_${Date.now()}_${generateId()}`,
            });
            onSuccess(res.data);
            setForm({ fromAccount: "", toAccount: "", amount: "" });
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Transaction failed");
        } finally {
            setLoading(false);
        }
    };

    const active = accounts.filter((a) => a.status === "ACTIVE");

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Transfer Funds">
            {error && (
                <div className="mb-4">
                    <Toast
                        message={error}
                        type="error"
                        onClose={() => setError("")}
                    />
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="label">From Account</label>
                    <select
                        className="input-field"
                        value={form.fromAccount}
                        onChange={(e) =>
                            setForm({ ...form, fromAccount: e.target.value })
                        }
                        required
                    >
                        <option value="">Select source account</option>
                        {active.map((a) => (
                            <option key={a._id} value={a._id}>
                                {a._id.slice(-10)}… ({a.currency})
                            </option>
                        ))}
                    </select>
                    {fromBalance !== null && (
                        <p className="text-xs text-slate-500 mt-1.5">
                            Available:{" "}
                            <span className="text-jade-400">
                                {fmt(fromBalance)}
                            </span>
                        </p>
                    )}
                </div>
                <div>
                    <label className="label">To Account</label>
                    <select
                        className="input-field"
                        value={form.toAccount}
                        onChange={(e) =>
                            setForm({ ...form, toAccount: e.target.value })
                        }
                        required
                    >
                        <option value="">Select destination account</option>
                        {active
                            .filter((a) => a._id !== form.fromAccount)
                            .map((a) => (
                                <option key={a._id} value={a._id}>
                                    {a._id.slice(-10)}… ({a.currency})
                                </option>
                            ))}
                    </select>
                </div>
                <div>
                    <label className="label">Amount</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">
                            ₹
                        </span>
                        <input
                            type="number"
                            className="input-field pl-8"
                            placeholder="0.00"
                            min="0.01"
                            step="0.01"
                            value={form.amount}
                            onChange={(e) =>
                                setForm({ ...form, amount: e.target.value })
                            }
                            required
                        />
                    </div>
                </div>
                {active.length < 2 && (
                    <Toast
                        message="You need at least 2 active accounts to transfer."
                        type="warning"
                    />
                )}
                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn-ghost flex-1 text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading || active.length < 2}
                        className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm"
                    >
                        {loading ? (
                            <>
                                <Spinner size="sm" />
                                Processing…
                            </>
                        ) : (
                            "Transfer"
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

function TransactionCard({ tx, index }) {
    const cfg = {
        COMPLETED: { cls: "badge-success", label: "Completed" },
        PENDING: { cls: "badge-warning", label: "Pending" },
        FAILED: { cls: "badge-danger", label: "Failed" },
        REVERSED: { cls: "badge-neutral", label: "Reversed" },
    }[tx.status] || { cls: "badge-neutral", label: tx.status };

    return (
        <div
            className="flex items-center gap-4 p-4 hover:bg-ink-700/40 transition-colors rounded-xl animate-fade-up"
            style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: "both",
                opacity: 0,
            }}
        >
            <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0
        ${
            tx.status === "COMPLETED"
                ? "bg-jade-500/10 border border-jade-500/20 text-jade-400"
                : tx.status === "FAILED"
                  ? "bg-rose-500/10 border border-rose-500/20 text-rose-400"
                  : "bg-amber-500/10 border border-amber-500/20 text-amber-400"
        }`}
            >
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
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-mono text-slate-400 truncate">
                    {tx.fromAccount?.slice(-8)}… → {tx.toAccount?.slice(-8)}…
                </p>
                <p className="text-xs text-slate-600 mt-0.5">
                    {tx.createdAt
                        ? new Date(tx.createdAt).toLocaleString("en-IN")
                        : "Just now"}
                </p>
            </div>
            <div className="text-right shrink-0">
                <p className="font-display font-bold text-sm text-white mb-1">
                    {fmt(tx.amount)}
                </p>
                <span className={cfg.cls}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {cfg.label}
                </span>
            </div>
        </div>
    );
}

export default function TransactionsPage() {
    const [accounts, setAccounts] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState(null);
    const [loadingAccounts, setLoadingAccounts] = useState(true);

    useEffect(() => {
        accountService
            .getAll()
            .then((r) => setAccounts(r.data.accounts || []))
            .catch(() => {})
            .finally(() => setLoadingAccounts(false));
    }, []);

    const handleSuccess = (data) => {
        setToast({
            message: "Transaction completed successfully!",
            type: "success",
        });
        if (data.transaction)
            setTransactions((prev) => [data.transaction, ...prev]);
    };

    return (
        <div>
            <PageHeader
                title="Transactions"
                subtitle="Transfer funds between accounts"
                action={
                    <button
                        onClick={() => setShowModal(true)}
                        disabled={loadingAccounts}
                        className="btn-primary flex items-center gap-2 text-sm"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
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
                        New Transfer
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

            <div className="card p-4 mb-6 flex items-start gap-3 border-amber-500/20 bg-amber-500/5">
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="w-4 h-4 text-amber-400 mt-0.5 shrink-0"
                >
                    <circle cx="12" cy="12" r="10" />
                    <line
                        x1="12"
                        y1="8"
                        x2="12"
                        y2="12"
                        strokeLinecap="round"
                    />
                    <line
                        x1="12"
                        y1="16"
                        x2="12.01"
                        y2="16"
                        strokeLinecap="round"
                    />
                </svg>
                <p className="text-amber-400/80 text-xs leading-relaxed">
                    Transactions are ACID-compliant with idempotency key
                    protection. The backend introduces a 15s processing delay
                    for demonstration.
                </p>
            </div>

            <div className="card">
                {transactions.length === 0 ? (
                    <EmptyState
                        icon={
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                className="w-6 h-6"
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
                        }
                        title="No transactions yet"
                        description="Initiate a transfer to see your transaction history here."
                        action={
                            <button
                                onClick={() => setShowModal(true)}
                                className="btn-primary text-sm"
                            >
                                New Transfer
                            </button>
                        }
                    />
                ) : (
                    <div className="divide-y divide-ink-700/60 p-2">
                        {transactions.map((tx, i) => (
                            <TransactionCard
                                key={tx._id || i}
                                tx={tx}
                                index={i}
                            />
                        ))}
                    </div>
                )}
            </div>

            <TransferModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                accounts={accounts}
                onSuccess={handleSuccess}
            />
        </div>
    );
}

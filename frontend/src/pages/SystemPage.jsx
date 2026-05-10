import React, { useState, useEffect } from "react";
import { accountService, transactionService } from "../services/api";
import { PageHeader, Toast, Spinner, Modal } from "../components/UI";
import { generateId } from "../utils/uuid";

export default function SystemPage() {
    const [accounts, setAccounts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ toAccount: "", amount: "" });
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [loadingAccounts, setLoadingAccounts] = useState(true);

    useEffect(() => {
        accountService
            .getAll()
            .then((r) => setAccounts(r.data.accounts || []))
            .catch(() => {})
            .finally(() => setLoadingAccounts(false));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await transactionService.createInitialFunds({
                toAccount: form.toAccount,
                amount: parseFloat(form.amount),
                idempotencyKey: `sys_${Date.now()}_${generateId()}`,
            });
            setToast({
                message: "Initial funds deposited successfully!",
                type: "success",
            });
            setShowModal(false);
            setForm({ toAccount: "", amount: "" });
        } catch (err) {
            setToast({
                message:
                    err.response?.data?.message ||
                    "Failed. Ensure you are a system user.",
                type: "error",
            });
            setShowModal(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <PageHeader
                title="System"
                subtitle="Administrative operations (system user only)"
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

            <div className="card p-5 mb-6 border-rose-500/20 bg-rose-500/5 flex items-start gap-3">
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="w-5 h-5 text-rose-400 mt-0.5 shrink-0"
                >
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    <line
                        x1="12"
                        y1="9"
                        x2="12"
                        y2="13"
                        strokeLinecap="round"
                    />
                    <line
                        x1="12"
                        y1="17"
                        x2="12.01"
                        y2="17"
                        strokeLinecap="round"
                    />
                </svg>
                <div>
                    <p className="font-display font-semibold text-sm text-rose-400 mb-1">
                        Restricted Access
                    </p>
                    <p className="text-rose-400/70 text-xs leading-relaxed">
                        Only accessible to system users (
                        <code className="font-mono text-rose-300">
                            systemUser: true
                        </code>
                        ). Regular accounts will receive a 403 Forbidden error.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card p-6">
                    <div className="flex items-start gap-4 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-jade-500/10 border border-jade-500/20 flex items-center justify-center text-jade-400 shrink-0">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="w-4 h-4"
                            >
                                <path
                                    d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-display font-semibold text-sm text-white mb-1">
                                Deposit Initial Funds
                            </h3>
                            <p className="text-slate-500 text-xs leading-relaxed">
                                Credit funds from the system account to any
                                target account for seeding balances.
                            </p>
                        </div>
                    </div>
                    <div className="bg-ink-700 rounded-xl p-3 mb-5 space-y-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500 text-xs">
                                Endpoint
                            </span>
                            <code className="text-jade-400 text-xs font-mono">
                                POST /api/transactions/system/initial-funds
                            </code>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-slate-500 text-xs">Auth</span>
                            <code className="text-amber-400 text-xs font-mono">
                                systemUserMiddleware
                            </code>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        disabled={loadingAccounts}
                        className="btn-primary w-full text-sm flex items-center justify-center gap-2"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
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
                        Deposit Funds
                    </button>
                </div>

                <div className="card p-6">
                    <div className="flex items-start gap-4 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-slate-500/10 border border-slate-500/20 flex items-center justify-center text-slate-400 shrink-0">
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
                        </div>
                        <div>
                            <h3 className="font-display font-semibold text-sm text-white mb-1">
                                System Architecture
                            </h3>
                            <p className="text-slate-500 text-xs leading-relaxed">
                                Double-entry bookkeeping with full auditability.
                            </p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {[
                            ["Ledger Model", "Immutable double-entry records"],
                            [
                                "ACID Compliance",
                                "MongoDB session-based transactions",
                            ],
                            ["Idempotency", "Key-based duplicate prevention"],
                            ["Balance Calc", "Aggregation pipeline on ledger"],
                        ].map(([label, desc]) => (
                            <div
                                key={label}
                                className="flex items-center gap-3"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-jade-500 shrink-0" />
                                <span className="font-mono text-xs text-white">
                                    {label}
                                </span>
                                <span className="text-slate-600 text-xs">
                                    —
                                </span>
                                <span className="text-slate-500 text-xs">
                                    {desc}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Deposit Initial Funds"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="label">Destination Account</label>
                        <select
                            className="input-field"
                            value={form.toAccount}
                            onChange={(e) =>
                                setForm({ ...form, toAccount: e.target.value })
                            }
                            required
                        >
                            <option value="">Select account</option>
                            {accounts
                                .filter((a) => a.status === "ACTIVE")
                                .map((a) => (
                                    <option key={a._id} value={a._id}>
                                        {a._id.slice(-10)}… ({a.currency})
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div>
                        <label className="label">Amount to Deposit</label>
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
                    <div className="bg-ink-700 rounded-xl p-3">
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Creates a DEBIT on the system account and CREDIT on
                            the target account within a single MongoDB session.
                        </p>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="btn-ghost flex-1 text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm"
                        >
                            {loading ? (
                                <>
                                    <Spinner size="sm" />
                                    Processing…
                                </>
                            ) : (
                                "Deposit"
                            )}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

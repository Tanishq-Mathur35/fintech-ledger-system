import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Spinner, Toast } from "../components/UI";

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        const res = await login(form.email, form.password);
        setLoading(false);
        if (res.success) navigate("/dashboard");
        else setError(res.message);
    };

    return (
        <div className="min-h-screen bg-ink-950 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(#4ade80 1px, transparent 1px), linear-gradient(90deg, #4ade80 1px, transparent 1px)`,
                    backgroundSize: "40px 40px",
                }}
            />

            <div className="relative w-full max-w-sm animate-fade-up">
                <div className="flex items-center gap-3 justify-center mb-10">
                    <div className="w-10 h-10 rounded-xl bg-jade-500 flex items-center justify-center">
                        <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-5 h-5 text-ink-950"
                        >
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-display font-bold text-white leading-none">
                            Fintech Ledger
                        </p>
                        <p className="font-mono text-jade-400 text-xs">
                            Secure financial management
                        </p>
                    </div>
                </div>

                <div className="card p-8">
                    <div className="mb-6">
                        <h1 className="font-display font-bold text-xl text-white">
                            Welcome back
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">
                            Sign in to your account
                        </p>
                    </div>

                    {error && (
                        <div className="mb-5">
                            <Toast
                                message={error}
                                type="error"
                                onClose={() => setError("")}
                            />
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="label">Email address</label>
                            <input
                                type="email"
                                className="input-field"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={(e) =>
                                    setForm({ ...form, email: e.target.value })
                                }
                                required
                                autoFocus
                            />
                        </div>
                        <div>
                            <label className="label">Password</label>
                            <input
                                type="password"
                                className="input-field"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        password: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? (
                                <>
                                    <Spinner size="sm" />
                                    Signing in…
                                </>
                            ) : (
                                "Sign in"
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500 mt-6">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="text-jade-400 hover:text-jade-300 transition-colors"
                        >
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

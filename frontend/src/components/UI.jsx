import React, { useState } from "react";

export function Spinner({ size = "md", className = "" }) {
    const s = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-7 h-7" };
    return (
        <svg
            className={`animate-spin ${s[size]} ${className}`}
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
    );
}

export function Toast({ message, type = "success", onClose }) {
    const colors = {
        success: "bg-jade-500/10 border-jade-500/30 text-jade-400",
        error: "bg-rose-500/10 border-rose-500/30 text-rose-400",
        warning: "bg-amber-500/10 border-amber-500/30 text-amber-400",
        info: "bg-slate-500/10 border-slate-500/30 text-slate-300",
    };
    return (
        <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm animate-fade-up ${colors[type]}`}
        >
            <span className="flex-1">{message}</span>
            {onClose && (
                <button
                    onClick={onClose}
                    className="opacity-60 hover:opacity-100 transition-opacity ml-2"
                >
                    ✕
                </button>
            )}
        </div>
    );
}

export function SkeletonRow() {
    return (
        <div className="flex items-center gap-4 p-4">
            <div className="w-8 h-8 rounded-lg shimmer-bg" />
            <div className="flex-1 space-y-2">
                <div className="h-3 rounded shimmer-bg w-1/3" />
                <div className="h-2.5 rounded shimmer-bg w-1/2" />
            </div>
            <div className="h-3 rounded shimmer-bg w-16" />
        </div>
    );
}

export function EmptyState({ icon, title, description, action }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="w-14 h-14 rounded-2xl bg-ink-700 border border-ink-600 flex items-center justify-center mb-4 text-slate-500">
                {icon}
            </div>
            <p className="font-display font-semibold text-white text-base mb-1">
                {title}
            </p>
            <p className="text-sm text-slate-500 max-w-xs mb-4">
                {description}
            </p>
            {action}
        </div>
    );
}

export function PageHeader({ title, subtitle, action }) {
    return (
        <div className="flex items-start justify-between mb-8">
            <div>
                <h1 className="font-display font-bold text-2xl text-white tracking-tight">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-slate-400 text-sm mt-1">{subtitle}</p>
                )}
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}

export function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />
            <div className="relative card p-6 w-full max-w-md animate-fade-up shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display font-bold text-lg text-white">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-ink-700 transition-colors"
                    >
                        ✕
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

export function CopyButton({ value, label }) {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button
            onClick={copy}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-jade-400 transition-colors"
        >
            <span className="truncate max-w-40">{label || value}</span>
            <span>{copied ? "✓" : "⎘"}</span>
        </button>
    );
}

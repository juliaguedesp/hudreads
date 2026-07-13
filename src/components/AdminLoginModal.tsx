"use client";

import { useState } from "react";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function AdminLoginModal({ open, onClose }: Props) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (res.ok) {
      setPassword("");
      onClose();
      window.location.reload();
    } else {
      setError("Invalid password.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest/40 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-cream p-8 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-forest/60 transition-colors hover:text-forest"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        <h2 className="font-display text-2xl font-bold text-forest">
          Admin login
        </h2>
        <p className="mt-2 text-sm text-forest/70">
          Sign in to manage reviews and content.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="admin-password"
              className="block text-sm font-medium text-forest"
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border border-forest/20 bg-white px-3 py-2 text-forest outline-none focus:border-forest"
              required
            />
          </div>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-forest px-4 py-2.5 text-cream transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

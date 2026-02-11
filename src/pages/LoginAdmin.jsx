import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";

const ADMIN_EMAIL = "admin@parksys.tn";
const ADMIN_PASSWORD = "admin123";

export default function LoginAdmin({ setAdminAuth }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.email.trim()) { setError("Veuillez saisir votre adresse e-mail."); return; }
    if (!form.password) { setError("Veuillez saisir votre mot de passe."); return; }

    setLoading(true);
    setTimeout(() => {
      if (form.email === ADMIN_EMAIL && form.password === ADMIN_PASSWORD) {
        setAdminAuth(true);
        navigate("/admin");
      } else {
        setError("Identifiants incorrects. Vérifiez votre e-mail et mot de passe.");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="auth-wrapper">
      {/* Fond décoratif */}
      <div className="auth-bg">
        <div className="auth-bg-orb orb-1" />
        <div className="auth-bg-orb orb-2" />
        <div className="auth-bg-grid" />
      </div>

      {/* Header */}
      <header className="auth-header">
        <div className="auth-header-inner">
          <button className="auth-back-btn" onClick={() => navigate("/")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Retour
          </button>
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="10" width="40" height="30" rx="4" stroke="currentColor" strokeWidth="2.5" />
                <path d="M4 18h40" stroke="currentColor" strokeWidth="2" />
                <rect x="10" y="22" width="8" height="12" rx="2" fill="currentColor" opacity="0.8" />
                <rect x="22" y="22" width="8" height="12" rx="2" fill="currentColor" opacity="0.8" />
                <rect x="34" y="22" width="8" height="12" rx="2" fill="currentColor" opacity="0.8" />
                <path d="M18 10V6M30 10V6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <span className="auth-brand">ParkSys</span>
              <span className="auth-brand-sub">Smart Parking — v2.6</span>
            </div>
          </div>
        </div>
        <div className="auth-header-line" />
      </header>

      {/* Card */}
      <main className="auth-main">
        <div className="auth-card admin-card">
          <div className="auth-card-badge admin-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Espace Administrateur
          </div>

          <h1 className="auth-card-title">Connexion Admin</h1>
          <p className="auth-card-sub">Accès réservé au personnel autorisé</p>

          {error && (
            <div className="auth-alert error">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label htmlFor="adm-email">Adresse e-mail</label>
              <div className="auth-input-wrap">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <path d="m22 6-10 7L2 6" />
                </svg>
                <input
                  id="adm-email"
                  type="email"
                  placeholder=""
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="adm-password">Mot de passe</label>
              <div className="auth-input-wrap">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  id="adm-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  autoComplete="current-password"
                />
                <button type="button" className="toggle-pw" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <path d="m1 1 22 22" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className={`auth-submit admin-submit ${loading ? "loading" : ""}`} disabled={loading}>
              {loading ? (
                <><span className="spinner" /> Vérification…</>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" />
                    <line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                  Accéder au tableau de bord
                </>
              )}
            </button>
          </form>

          <div className="auth-divider"><span>ou</span></div>

          <button className="auth-alt-btn" onClick={() => navigate("/login-client")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Accès Client
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="auth-footer">
        <span>© 2026 ParkSys Intelligence</span>
        <span className="footer-sep">◆</span>
        <span>Système de gestion de parking professionnel</span>
        <span className="footer-sep">◆</span>
        <span className="footer-status">
          <span className="status-dot" /> Système opérationnel
        </span>
      </footer>
    </div>
  );
}

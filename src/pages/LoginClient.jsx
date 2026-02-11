import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";

export default function LoginClient() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nom: "", email: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.nom.trim() || form.nom.trim().length < 2) e.nom = "Le nom doit contenir au moins 2 caractères.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Adresse e-mail invalide.";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    // Stocker les infos client en sessionStorage pour pré-remplir le formulaire
    sessionStorage.setItem("clientInfo", JSON.stringify({ nom: form.nom.trim(), email: form.email.trim() }));
    setTimeout(() => {
      navigate("/reservation");
    }, 700);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-bg">
        <div className="auth-bg-orb orb-1 client-orb-1" />
        <div className="auth-bg-orb orb-2 client-orb-2" />
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

      <main className="auth-main">
        <div className="auth-card client-card">
          <div className="auth-card-badge client-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Espace Client
          </div>

          <h1 className="auth-card-title">Bienvenue</h1>
          <p className="auth-card-sub">Identifiez-vous pour réserver une place de stationnement</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label htmlFor="cl-nom">Nom complet</label>
              <div className={`auth-input-wrap ${errors.nom ? "has-error" : ""}`}>
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  id="cl-nom"
                  type="text"
                  placeholder="ex : Ahmed Ben Salem"
                  value={form.nom}
                  onChange={(e) => { setForm({ ...form, nom: e.target.value }); setErrors({ ...errors, nom: "" }); }}
                />
              </div>
              {errors.nom && <span className="field-err">{errors.nom}</span>}
            </div>

            <div className="auth-field">
              <label htmlFor="cl-email">Adresse e-mail</label>
              <div className={`auth-input-wrap ${errors.email ? "has-error" : ""}`}>
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <path d="m22 6-10 7L2 6" />
                </svg>
                <input
                  id="cl-email"
                  type="email"
                  placeholder="ex : ahmed@email.com"
                  value={form.email}
                  onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: "" }); }}
                />
              </div>
              {errors.email && <span className="field-err">{errors.email}</span>}
            </div>

            <button type="submit" className={`auth-submit client-submit ${loading ? "loading" : ""}`} disabled={loading}>
              {loading ? (
                <><span className="spinner" /> Connexion…</>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" />
                    <line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                  Continuer vers la réservation
                </>
              )}
            </button>
          </form>

          <div className="auth-divider"><span>ou</span></div>

          <button className="auth-alt-btn admin-alt" onClick={() => navigate("/login-admin")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Accès Administrateur
          </button>
        </div>
      </main>

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

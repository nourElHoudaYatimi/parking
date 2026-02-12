import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParking } from "./ParkingContext";
import "./auth.css";

const TARIF = 5;

export default function ReservationClient() {
  const navigate = useNavigate();
  const { soumettreReservation, reservations } = useParking();

  const [step, setStep] = useState("form"); // form | waiting | accepted | rejected
  const [reservationId, setReservationId] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Pré-remplir depuis sessionStorage
  const clientInfo = (() => {
    try { return JSON.parse(sessionStorage.getItem("clientInfo") || "{}"); }
    catch { return {}; }
  })();

  const [form, setForm] = useState({
    nom: clientInfo.nom || "",
    email: clientInfo.email || "",
    telephone: "",
    matricule: "",
    heureEntree: "",
    heureSortie: "",
  });

  // Surveiller le statut de la réservation
  useEffect(() => {
    if (!reservationId) return;
    const res = reservations.find((r) => r.id === reservationId);
    if (!res) return;
    if (res.status === "accepted") setStep("accepted");
    else if (res.status === "rejected") setStep("rejected");
  }, [reservations, reservationId]);

  const validate = () => {
    const e = {};
    if (!form.nom.trim() || form.nom.trim().length < 2) e.nom = "Nom requis (min. 2 caractères).";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "E-mail invalide.";
    if (!form.telephone.trim() || !/^[0-9+\s\-]{8,15}$/.test(form.telephone)) e.telephone = "Numéro de téléphone invalide (8-15 chiffres).";
    if (!form.matricule.trim() || form.matricule.trim().length < 4) e.matricule = "Matricule invalide (min. 4 caractères).";
    if (!form.heureEntree) e.heureEntree = "Heure d'entrée requise.";
    if (!form.heureSortie) e.heureSortie = "Heure de sortie requise.";
    if (form.heureEntree && form.heureSortie) {
      const [hE, mE] = form.heureEntree.split(":").map(Number);
      const [hS, mS] = form.heureSortie.split(":").map(Number);
      if (hS * 60 + mS <= hE * 60 + mE) e.heureSortie = "L'heure de sortie doit être après l'heure d'entrée.";
    }
    return e;
  };

  const calcMontant = () => {
    if (!form.heureEntree || !form.heureSortie) return null;
    const [hE, mE] = form.heureEntree.split(":").map(Number);
    const [hS, mS] = form.heureSortie.split(":").map(Number);
    const totalMin = hS * 60 + mS - (hE * 60 + mE);
    if (totalMin <= 0) return null;
    const heures = totalMin / 60;
    return { heures: heures.toFixed(2), montant: (heures * TARIF).toFixed(2) };
  };

  const calc = calcMontant();

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      const id = soumettreReservation({ ...form, matricule: form.matricule.toUpperCase() });
      setReservationId(id);
      setStep("waiting");
      setLoading(false);
    }, 600);
  };

  const updateField = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  };

  // ── STEP: WAITING ──
  if (step === "waiting") {
    return (
      <div className="auth-wrapper">
        <div className="auth-bg">
          <div className="auth-bg-orb orb-1 client-orb-1" /><div className="auth-bg-orb orb-2 client-orb-2" />
          <div className="auth-bg-grid" />
        </div>
        <WaitingHeader navigate={navigate} />
        <main className="auth-main">
          <div className="auth-card waiting-card">
            <div className="waiting-animation">
              <div className="waiting-ring" /><div className="waiting-ring ring-2" /><div className="waiting-ring ring-3" />
              <div className="waiting-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
            </div>
            <h2 className="waiting-title">Demande envoyée !</h2>
            <p className="waiting-sub">Votre demande de réservation est en cours de traitement par l'administrateur.</p>
            <div className="waiting-info">
              <div className="winfo-row"><span>Matricule</span><strong>{form.matricule.toUpperCase()}</strong></div>
              <div className="winfo-row"><span>Entrée</span><strong>{form.heureEntree}</strong></div>
              <div className="winfo-row"><span>Sortie</span><strong>{form.heureSortie}</strong></div>
              {calc && <div className="winfo-row total"><span>Montant estimé</span><strong className="gold">{calc.montant} DT</strong></div>}
            </div>
            <p className="waiting-note">Cette page se met à jour automatiquement dès que l'admin répond.</p>
          </div>
        </main>
        <AuthFooter />
      </div>
    );
  }

  // ── STEP: ACCEPTED ──
  if (step === "accepted") {
    const res = reservations.find((r) => r.id === reservationId);
    return (
      <div className="auth-wrapper">
        <div className="auth-bg">
          <div className="auth-bg-orb orb-1 client-orb-1" /><div className="auth-bg-orb orb-2 client-orb-2" />
          <div className="auth-bg-grid" />
        </div>
        <WaitingHeader navigate={navigate} />
        <main className="auth-main">
          <div className="auth-card accepted-card">
            <div className="status-icon accepted-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h2 className="waiting-title accepted-title">Réservation Confirmée !</h2>
            <p className="waiting-sub">Votre place a été réservée avec succès. Bienvenue au parking ParkSys.</p>
            <div className="waiting-info">
              <div className="winfo-row"><span>Place attribuée</span><strong className="gold">#{res?.placeNum || "—"}</strong></div>
              <div className="winfo-row"><span>Matricule</span><strong>{form.matricule.toUpperCase()}</strong></div>
              <div className="winfo-row"><span>Client</span><strong>{form.nom}</strong></div>
              <div className="winfo-row"><span>Entrée</span><strong>{form.heureEntree}</strong></div>
              <div className="winfo-row"><span>Sortie</span><strong>{form.heureSortie}</strong></div>
              {calc && <div className="winfo-row total"><span>Montant</span><strong className="gold">{calc.montant} DT</strong></div>}
            </div>
            <button className="auth-submit client-submit" style={{marginTop:"24px"}} onClick={() => navigate("/")}>
              Voir le plan du parking
            </button>
          </div>
        </main>
        <AuthFooter />
      </div>
    );
  }

  // ── STEP: REJECTED ──
  if (step === "rejected") {
    return (
      <div className="auth-wrapper">
        <div className="auth-bg">
          <div className="auth-bg-orb orb-1 client-orb-1" /><div className="auth-bg-orb orb-2 client-orb-2" />
          <div className="auth-bg-grid" />
        </div>
        <WaitingHeader navigate={navigate} />
        <main className="auth-main">
          <div className="auth-card rejected-card">
            <div className="status-icon rejected-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <h2 className="waiting-title rejected-title">Demande Refusée</h2>
            <p className="waiting-sub">Votre demande de réservation a été refusée par l'administrateur.</p>
            <div className="rejected-actions">
              <button className="auth-submit client-submit" onClick={() => { setStep("form"); setReservationId(null); }}>
                Faire une nouvelle demande
              </button>
              <button className="auth-alt-btn" style={{marginTop:"12px"}} onClick={() => navigate("/")}>
                Retour à l'accueil
              </button>
            </div>
          </div>
        </main>
        <AuthFooter />
      </div>
    );
  }

  // ── STEP: FORM ──
  return (
    <div className="auth-wrapper">
      <div className="auth-bg">
        <div className="auth-bg-orb orb-1 client-orb-1" /><div className="auth-bg-orb orb-2 client-orb-2" />
        <div className="auth-bg-grid" />
      </div>

      <header className="auth-header">
        <div className="auth-header-inner">
          <button className="auth-back-btn" onClick={() => navigate("/login-client")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Retour
          </button>
          <div className="auth-logo">
            <div className="auth-logo-icon">
              <svg viewBox="0 0 48 48" fill="none">
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
        <div className="auth-card reservation-card">
          <div className="auth-card-badge client-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Demande de Stationnement
          </div>

          <h1 className="auth-card-title">Réserver une Place</h1>
          <p className="auth-card-sub">Remplissez le formulaire — votre demande sera validée par l'administrateur</p>

          <form onSubmit={handleSubmit} className="auth-form reservation-form">
            {/* Ligne 1 : Nom + Email */}
            <div className="form-row-2">
              <div className="auth-field">
                <label>Nom complet</label>
                <div className={`auth-input-wrap ${errors.nom ? "has-error" : form.nom ? "has-ok" : ""}`}>
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                  <input type="text" placeholder="Ahmed Ben Salem" value={form.nom} onChange={(e) => updateField("nom", e.target.value)} />
                </div>
                {errors.nom && <span className="field-err">{errors.nom}</span>}
              </div>
              <div className="auth-field">
                <label>Adresse e-mail</label>
                <div className={`auth-input-wrap ${errors.email ? "has-error" : form.email ? "has-ok" : ""}`}>
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <path d="m22 6-10 7L2 6" />
                  </svg>
                  <input type="email" placeholder="ahmed@email.com" value={form.email} onChange={(e) => updateField("email", e.target.value)} />
                </div>
                {errors.email && <span className="field-err">{errors.email}</span>}
              </div>
            </div>

            {/* Ligne 2 : Téléphone + Matricule */}
            <div className="form-row-2">
              <div className="auth-field">
                <label>Numéro de téléphone</label>
                <div className={`auth-input-wrap ${errors.telephone ? "has-error" : form.telephone ? "has-ok" : ""}`}>
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <input type="tel" placeholder="ex : 21 234 567" value={form.telephone} onChange={(e) => updateField("telephone", e.target.value)} />
                </div>
                {errors.telephone && <span className="field-err">{errors.telephone}</span>}
              </div>
              <div className="auth-field">
                <label>Matricule du véhicule</label>
                <div className={`auth-input-wrap ${errors.matricule ? "has-error" : form.matricule ? "has-ok" : ""}`}>
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                  <input type="text" placeholder="ex : 123 TUN 456" value={form.matricule} onChange={(e) => updateField("matricule", e.target.value.toUpperCase())} />
                </div>
                {errors.matricule && <span className="field-err">{errors.matricule}</span>}
              </div>
            </div>

            {/* Ligne 3 : Heures */}
            <div className="form-row-2">
              <div className="auth-field">
                <label>
                  <svg style={{width:"13px",height:"13px",marginRight:"5px",verticalAlign:"middle"}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  Heure d'entrée
                </label>
                <div className={`auth-input-wrap ${errors.heureEntree ? "has-error" : form.heureEntree ? "has-ok" : ""}`}>
                  <input type="time" value={form.heureEntree} onChange={(e) => updateField("heureEntree", e.target.value)} style={{paddingLeft:"16px"}} />
                </div>
                {errors.heureEntree && <span className="field-err">{errors.heureEntree}</span>}
              </div>
              <div className="auth-field">
                <label>
                  <svg style={{width:"13px",height:"13px",marginRight:"5px",verticalAlign:"middle"}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  Heure de sortie
                </label>
                <div className={`auth-input-wrap ${errors.heureSortie ? "has-error" : form.heureSortie ? "has-ok" : ""}`}>
                  <input type="time" value={form.heureSortie} onChange={(e) => updateField("heureSortie", e.target.value)} style={{paddingLeft:"16px"}} />
                </div>
                {errors.heureSortie && <span className="field-err">{errors.heureSortie}</span>}
              </div>
            </div>

            {/* Preview montant */}
            {calc && (
              <div className="res-preview">
                <div className="res-preview-row"><span>Durée estimée</span><strong>{calc.heures} h</strong></div>
                <div className="res-preview-row"><span>Tarif</span><strong>{TARIF} DT / heure</strong></div>
                <div className="res-preview-row total"><span>Montant total</span><strong className="montant-gold">{calc.montant} DT</strong></div>
              </div>
            )}

            <button type="submit" className={`auth-submit client-submit ${loading ? "loading" : ""}`} disabled={loading}>
              {loading ? (
                <><span className="spinner" /> Envoi en cours…</>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  Envoyer la demande
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      <AuthFooter />
    </div>
  );
}

function WaitingHeader({ navigate }) {
  return (
    <header className="auth-header">
      <div className="auth-header-inner">
        <button className="auth-back-btn" onClick={() => navigate("/")}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Accueil
        </button>
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <svg viewBox="0 0 48 48" fill="none">
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
  );
}

function AuthFooter() {
  return (
    <footer className="auth-footer">
      <span>© 2026 ParkSys Intelligence</span>
      <span className="footer-sep">◆</span>
      <span>Système de gestion de parking professionnel</span>
      <span className="footer-sep">◆</span>
      <span className="footer-status">
        <span className="status-dot" /> Système opérationnel
      </span>
    </footer>
  );
}

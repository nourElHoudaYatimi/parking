import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParking } from "./ParkingContext";
import "./admin.css";

const TARIF = 5;

function Admin() {
  const navigate = useNavigate();
  const { places, occuperPlace, libererPlace, mettreAJourSortie } = useParking();

  const [form, setForm] = useState({
    numero: "",
    matricule: "",
    heureEntree: "",
    heureSortie: "",
  });

  const [message, setMessage] = useState(null);
  const [recherche, setRecherche] = useState("");
  const [tab, setTab] = useState("formulaire");

  const calculerMontant = (entree, sortie) => {
    if (!entree || !sortie) return null;
    const [hE, mE] = entree.split(":").map(Number);
    const [hS, mS] = sortie.split(":").map(Number);
    const totalMin = (hS * 60 + mS) - (hE * 60 + mE);
    if (totalMin <= 0) return null;
    const heures = totalMin / 60;
    return { heures: heures.toFixed(2), montant: (heures * TARIF).toFixed(2) };
  };

  const calcActuel = calculerMontant(form.heureEntree, form.heureSortie);

  const handleOccuper = (e) => {
    e.preventDefault();
    const num = parseInt(form.numero);
    if (!num || num < 1 || num > 200) { setMessage({ type: "error", text: "Numéro de place invalide (1–200)." }); return; }
    if (!form.matricule.trim()) { setMessage({ type: "error", text: "Veuillez saisir une matricule." }); return; }
    if (!form.heureEntree) { setMessage({ type: "error", text: "Veuillez saisir l'heure d'entrée." }); return; }
    if (places[num] !== null) { setMessage({ type: "error", text: `La place ${num} est déjà occupée par ${places[num].matricule}.` }); return; }

    const calc = form.heureSortie ? calculerMontant(form.heureEntree, form.heureSortie) : null;

    occuperPlace(num, {
      matricule: form.matricule.trim().toUpperCase(),
      heureEntree: form.heureEntree,
      heureSortie: form.heureSortie || null,
      montant: calc ? calc.montant : null,
      heures: calc ? calc.heures : null,
    });

    setMessage({ type: "success", text: `Place ${num} occupée — ${form.matricule.toUpperCase()} enregistré.` });
    setForm({ numero: "", matricule: "", heureEntree: "", heureSortie: "" });
  };

  const handleLiberer = (num) => {
    libererPlace(num);
    setMessage({ type: "info", text: `Place ${num} libérée.` });
  };

  const handleSortie = (num, heureSortie) => {
    const place = places[num];
    if (!place) return;
    const calc = calculerMontant(place.heureEntree, heureSortie);
    mettreAJourSortie(num, heureSortie, calc ? calc.montant : null, calc ? calc.heures : null);
  };

  const occupees = Object.entries(places).filter(([, v]) => v !== null).sort(([a], [b]) => parseInt(a) - parseInt(b));
  const filtrees = recherche
    ? occupees.filter(([num, v]) => num.includes(recherche) || v.matricule.toLowerCase().includes(recherche.toLowerCase()))
    : occupees;

  const totalOccupees = occupees.length;
  const totalLibres = 200 - totalOccupees;
  const totalRecettes = occupees.reduce((sum, [, v]) => sum + (parseFloat(v.montant) || 0), 0).toFixed(2);

  return (
    <div className="admin-wrapper">

      {/* ─── HEADER ─── */}
      <header className="admin-header">
        <div className="admin-header-inner">
          <button className="back-btn" onClick={() => navigate("/")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Retour
          </button>
          <div className="admin-title-block">
            <h1 className="admin-title">Gestion Admin</h1>
            <span className="admin-sub">Tableau de bord parking</span>
          </div>
          <div className="admin-header-stats">
            <div className="hstat free"><span>{totalLibres}</span> Libres</div>
            <div className="hstat busy"><span>{totalOccupees}</span> Occupées</div>
            <div className="hstat gold"><span>{totalRecettes}</span> DT</div>
          </div>
        </div>
        <div className="admin-bar">
          <div className="admin-bar-fill" style={{ width: `${(totalOccupees / 200) * 100}%` }} />
        </div>
      </header>

      {/* ─── TABS ─── */}
      <div className="tabs-bar">
        <button className={`tab-btn ${tab === "formulaire" ? "active" : ""}`} onClick={() => setTab("formulaire")}>
          ✦ Enregistrer une entrée
        </button>
        <button className={`tab-btn ${tab === "recap" ? "active" : ""}`} onClick={() => setTab("recap")}>
          ◈ Places occupées ({totalOccupees})
        </button>
      </div>

      <main className="admin-main">

        {message && (
          <div className={`alert alert-${message.type}`}>
            <span className="alert-icon">{message.type === "success" ? "✓" : message.type === "error" ? "✕" : "ℹ"}</span>
            {message.text}
            <button className="alert-close" onClick={() => setMessage(null)}>×</button>
          </div>
        )}

        {/* ── TAB FORMULAIRE ── */}
        {tab === "formulaire" && (
          <div className="form-section">
            <div className="form-card">
              <div className="form-card-header">
                <h2>Nouvelle entrée</h2>
                <p>Remplissez les informations du véhicule</p>
              </div>

              <form onSubmit={handleOccuper} className="parking-form">
                <div className="field-group">
                  <label htmlFor="numero">
                    <span className="field-icon">🅿</span>
                    Numéro de place
                  </label>
                  <input
                    id="numero"
                    type="number"
                    min="1"
                    max="200"
                    placeholder="ex : 42"
                    value={form.numero}
                    onChange={(e) => setForm({ ...form, numero: e.target.value })}
                    className={
                      form.numero && places[parseInt(form.numero)] !== null ? "input-error"
                      : form.numero && places[parseInt(form.numero)] === null ? "input-ok" : ""
                    }
                  />
                  {form.numero && places[parseInt(form.numero)] !== null && (
                    <span className="field-hint error">⚠ Place déjà occupée</span>
                  )}
                  {form.numero && places[parseInt(form.numero)] === null && parseInt(form.numero) >= 1 && parseInt(form.numero) <= 200 && (
                    <span className="field-hint ok">✓ Place disponible</span>
                  )}
                </div>

                <div className="field-group">
                  <label htmlFor="matricule">
                    <span className="field-icon">🚗</span>
                    Matricule du véhicule
                  </label>
                  <input
                    id="matricule"
                    type="text"
                    placeholder="ex : 123 TUN 456"
                    value={form.matricule}
                    onChange={(e) => setForm({ ...form, matricule: e.target.value })}
                  />
                </div>

                <div className="field-row">
                  <div className="field-group">
                    <label htmlFor="heureEntree">
                      <span className="field-icon">⬇</span>
                      Heure d'entrée
                    </label>
                    <input
                      id="heureEntree"
                      type="time"
                      value={form.heureEntree}
                      onChange={(e) => setForm({ ...form, heureEntree: e.target.value })}
                    />
                  </div>
                  <div className="field-group">
                    <label htmlFor="heureSortie">
                      <span className="field-icon">⬆</span>
                      Heure de sortie
                      <span className="optional">(optionnel)</span>
                    </label>
                    <input
                      id="heureSortie"
                      type="time"
                      value={form.heureSortie}
                      onChange={(e) => setForm({ ...form, heureSortie: e.target.value })}
                    />
                  </div>
                </div>

                {calcActuel && (
                  <div className="calc-preview">
                    <div className="calc-row"><span>Durée</span><strong>{calcActuel.heures} h</strong></div>
                    <div className="calc-row"><span>Tarif</span><strong>{TARIF} DT / heure</strong></div>
                    <div className="calc-row total"><span>Montant total</span><strong className="montant-gold">{calcActuel.montant} DT</strong></div>
                  </div>
                )}

                <button type="submit" className="submit-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 5v14M5 12l7 7 7-7"/>
                  </svg>
                  Occuper la place
                </button>
              </form>
            </div>

            {/* Mini grille */}
            <div className="mini-grid-card">
              <div className="form-card-header">
                <h2>Aperçu rapide</h2>
                <p>Places 1–40 — vert = libre, rouge = occupé</p>
              </div>
              <div className="mini-grid">
                {Array.from({ length: 40 }, (_, i) => i + 1).map((n) => (
                  <div
                    key={n}
                    className={`mini-place ${places[n] ? "occ" : "lib"} ${parseInt(form.numero) === n ? "selected" : ""}`}
                    title={places[n] ? `Place ${n} — ${places[n].matricule}` : `Place ${n} — Libre`}
                    onClick={() => setForm({ ...form, numero: String(n) })}
                  >
                    {n}
                  </div>
                ))}
              </div>
              <p className="mini-note">Cliquez sur une place pour la sélectionner</p>
            </div>
          </div>
        )}

        {/* ── TAB RECAP ── */}
        {tab === "recap" && (
          <div className="recap-section">
            <div className="search-bar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Rechercher par place ou matricule..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
              />
              {recherche && <button onClick={() => setRecherche("")}>×</button>}
            </div>

            {filtrees.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🅿</div>
                <p>{recherche ? "Aucun résultat trouvé." : "Aucune place occupée pour le moment."}</p>
              </div>
            ) : (
              <div className="recap-table-wrap">
                <table className="recap-table">
                  <thead>
                    <tr>
                      <th>Place</th>
                      <th>Matricule</th>
                      <th>Entrée</th>
                      <th>Sortie</th>
                      <th>Durée</th>
                      <th>Montant</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtrees.map(([num, v]) => (
                      <tr key={num}>
                        <td><span className="place-badge">#{num}</span></td>
                        <td><span className="matricule-badge">{v.matricule}</span></td>
                        <td className="time-cell">{v.heureEntree}</td>
                        <td className="time-cell">
                          <input
                            type="time"
                            className="inline-time"
                            value={v.heureSortie || ""}
                            onChange={(e) => handleSortie(parseInt(num), e.target.value)}
                          />
                        </td>
                        <td className="time-cell">{v.heures ? `${v.heures} h` : <span className="muted">—</span>}</td>
                        <td>{v.montant ? <span className="montant-cell">{v.montant} DT</span> : <span className="muted">—</span>}</td>
                        <td>
                          <button className="liberer-btn" onClick={() => handleLiberer(parseInt(num))}>
                            Libérer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {occupees.length > 0 && (
              <div className="total-recettes">
                <span>Total recettes du jour</span>
                <strong>{totalRecettes} DT</strong>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="admin-footer">
        <span>© 2026 ParkSys Intelligence</span>
        <span className="footer-sep">◆</span>
        <span>Tarif : {TARIF} DT / heure</span>
        <span className="footer-sep">◆</span>
        <span className="footer-status"><span className="status-dot" /> Système opérationnel</span>
      </footer>
    </div>
  );
}

export default Admin;

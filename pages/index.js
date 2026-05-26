import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [regNo, setRegNo]       = useState('');
  const [name, setName]         = useState('');
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState(null);   // null | cert-object | 'not_found'
  const [searchedFor, setSearchedFor] = useState('');

  // ── Validation ──────────────────────────────────────────────────────────────
  function validate() {
    const e = {};
    if (!regNo.trim())           e.regNo = 'Registration No is required.';
    if (!name.trim())            e.name  = 'Student Full Name is required.';
    else if (name.trim().length < 3) e.name = 'Please enter your full name.';
    return e;
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    setSearchedFor(`${regNo.trim()} / ${name.trim()}`);
    try {
      const res  = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ regNo: regNo.trim(), name: name.trim() }),
      });
      const data = await res.json();
      setResult(data.found ? data.certificate : 'not_found');
    } catch {
      setResult('not_found');
    } finally {
      setLoading(false);
    }
  }

  // ── Reset ───────────────────────────────────────────────────────────────────
  function reset() {
    setResult(null);
    setRegNo('');
    setName('');
    setErrors({});
    setSearchedFor('');
  }

  const showForm   = result === null;
  const showResult = result && result !== 'not_found';
  const showError  = result === 'not_found';

  return (
    <>
      <Head>
        <title>Certificate Verification | Tatwansh Digital Pvt. Ltd.</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.webp" />
      </Head>

      {/* ═══════════ HEADER ═══════════ */}
      <header className="site-header">
        <div className="header-inner">
          <div className="logo-block">
            <img src="/logo.webp" alt="Tatwansh Digital Pvt. Ltd." className="logo-img" />
            <div className="logo-text">
              <span className="company-name">Tatwansh Digital Pvt. Ltd.</span>
              <span className="company-tagline">Online Certificate Verification Portal</span>
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════ HERO ═══════════ */}
      <section className="hero-section">
        <div className="hero-content">
          {showForm ? (
            <>
              <div className="official-badge">
                <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true">
                  <path d="M6 0L12 3V7C12 10.31 9.33 13.42 6 14C2.67 13.42 0 10.31 0 7V3L6 0Z" fill="#FAE90C"/>
                </svg>
                OFFICIAL PORTAL
              </div>
              <h1 className="hero-heading">Check Internship Certificate</h1>
              <p className="hero-sub">Enter your Registration No and Name to instantly check your certificate.</p>
            </>
          ) : (
            <>
              <h1 className="hero-heading">Verification Result</h1>
              <p className="hero-sub">
                Searched for: <strong>{searchedFor}</strong>
              </p>
            </>
          )}
        </div>
      </section>

      {/* ═══════════ MAIN CONTENT ═══════════ */}
      <section className="card-section">

        {/* ── Verification Form ── */}
        {showForm && (
          <div className="verify-card">
            <div className="card-inner">
            <div className="card-title">
              <span className="card-icon-wrap">
                <svg width="14" height="16" viewBox="0 0 14 16" fill="none" aria-hidden="true">
                  <path d="M7 0L14 3.5V8C14 12.03 10.89 15.74 7 16C3.11 15.74 0 12.03 0 8V3.5L7 0Z" fill="#FAE90C"/>
                </svg>
              </span>
              Certificate Verification
            </div>
            <p className="card-subtitle">Please fill in the details below exactly as on your certificate.</p>

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="regNo">
                  Registration No <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="regNo"
                  value={regNo}
                  onChange={e => { setRegNo(e.target.value); setErrors(p => ({ ...p, regNo: '' })); }}
                  placeholder="e.g. 118431/2026/WD"
                  className={errors.regNo ? 'input-error' : ''}
                  autoComplete="off"
                />
                {errors.regNo && <span className="field-error">{errors.regNo}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="sname">
                  Student Full Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="sname"
                  value={name}
                  onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })); }}
                  placeholder="Enter your full name"
                  className={errors.name ? 'input-error' : ''}
                  autoComplete="off"
                />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>

              <button type="submit" className="btn-check" disabled={loading}>
                {loading
                  ? <><span className="spinner" /> Checking...</>
                  : <><SearchIcon /> Check Certificate</>
                }
              </button>
            </form>

            <div className="info-note">
              <InfoIcon />
              <span>
                Registration No is mentioned on your internship certificate or offer letter.
                Name should match the one registered during enrollment.
              </span>
            </div>
            </div>{/* .card-inner */}
          </div>
        )}

        {/* ── Success Result ── */}
        {showResult && (
          <div className="result-card">
            <div className="verified-banner">
              <span className="verified-check">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <circle cx="10" cy="10" r="10" fill="white" fillOpacity="0.25"/>
                  <path d="M5 10.5L8.5 14L15 7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <div>
                <div className="verified-title">Certificate Verified ✓</div>
                <div className="verified-sub">This is an authentic certificate issued by Tatwansh Digital Pvt. Ltd.</div>
              </div>
            </div>

            <div className="cert-grid">
              <div className="cert-field">
                <span className="field-label">STUDENT REG. NO.</span>
                <span className="field-value">{result.regNo}</span>
              </div>
              <div className="cert-field">
                <span className="field-label">NAME OF STUDENT</span>
                <span className="field-value">{result.name}</span>
              </div>
              <div className="cert-field">
                <span className="field-label">FATHER&apos;S NAME</span>
                <span className="field-value">{result.fatherName}</span>
              </div>
              <div className="cert-field">
                <span className="field-label">ROLL NO.</span>
                <span className="field-value">{result.rollNo}</span>
              </div>
              <div className="cert-field">
                <span className="field-label">TOTAL HOURS</span>
                <span className="field-value">{result.totalHours}</span>
              </div>
              <div className="cert-field">
                <span className="field-label">INTERNSHIP DURATION</span>
                <span className="field-value">{result.duration}</span>
              </div>
              <div className="cert-field full-width">
                <span className="field-label">INTERNSHIP IN</span>
                <span className="field-value">{result.internshipIn}</span>
              </div>
            </div>

            <div className="result-actions">
              <button onClick={reset} className="btn-search-another">
                ← Search Another
              </button>
            </div>
          </div>
        )}

        {/* ── Not Found ── */}
        {showError && (
          <div className="error-card">
            <div className="error-icon-wrap">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <circle cx="14" cy="14" r="13" stroke="#e53e3e" strokeWidth="2"/>
                <path d="M14 8V15" stroke="#e53e3e" strokeWidth="2.2" strokeLinecap="round"/>
                <circle cx="14" cy="19.5" r="1.2" fill="#e53e3e"/>
              </svg>
            </div>
            <div className="error-title">Certificate Not Found</div>
            <p className="error-msg">
              No certificate matches the provided Registration No and Name.
              Please double-check the details exactly as they appear on your certificate or offer letter.
            </p>
            <button onClick={reset} className="btn-search-another">
              ← Try Again
            </button>
          </div>
        )}
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-col">
            <h4 className="footer-heading">Contact Us</h4>
            <div className="footer-divider" />
            <p className="footer-company">Tatwansh Digital Pvt. Ltd.</p>
            <p className="footer-loc">Jaipur, Rajasthan, India</p>
          </div>

          <div className="footer-col">
            <div className="footer-contact-item">
              <div className="footer-icon-wrap">
                <PhoneIcon />
              </div>
              <div>
                <span className="footer-label">Phone</span>
                <a href="tel:+918619679123" className="footer-value">+91-8619679123</a>
              </div>
            </div>
            <div className="footer-contact-item">
              <div className="footer-icon-wrap">
                <EmailIcon />
              </div>
              <div>
                <span className="footer-label">Email</span>
                <a href="mailto:hello@tatwansh.com" className="footer-value">hello@tatwansh.com</a>
              </div>
            </div>
          </div>

          <div className="footer-col">
            <div className="footer-contact-item align-top">
              <div className="footer-icon-wrap">
                <LocationIcon />
              </div>
              <div>
                <span className="footer-label">Address</span>
                <span className="footer-value">
                  102, 1st Floor, Sankalp Tower, Jharkhand Mod, Queens Road,
                  Vaishali Nagar, Jaipur, Rajasthan
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; 2026 Tatwansh Digital Pvt. Ltd. All rights reserved.</span>
        </div>
      </footer>
    </>
  );
}

/* ── Inline SVG icons ─────────────────────────────────────────────────────── */
function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.8"/>
      <path d="M11 11L14.5 14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}
function InfoIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true" style={{flexShrink:0,marginTop:1}}>
      <circle cx="7.5" cy="7.5" r="7" stroke="#181818" strokeWidth="1.4"/>
      <path d="M7.5 6.5V11" stroke="#181818" strokeWidth="1.4" strokeLinecap="round"/>
      <circle cx="7.5" cy="4.5" r="0.8" fill="#181818"/>
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 1h3l1.5 3.5-1.75 1.25C5.5 7.5 7 9 8.75 9.75L10 8l3.5 1.5V13c0 .55-.45 1-1 1C5.39 14 1 9.61 1 2c0-.55.45-1 1-1Z" stroke="#FAE90C" strokeWidth="1.4" fill="none"/>
    </svg>
  );
}
function EmailIcon() {
  return (
    <svg width="14" height="12" viewBox="0 0 14 12" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="12" height="10" rx="1.5" stroke="#FAE90C" strokeWidth="1.4"/>
      <path d="M1 3l6 4 6-4" stroke="#FAE90C" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}
function LocationIcon() {
  return (
    <svg width="12" height="16" viewBox="0 0 12 16" fill="none" aria-hidden="true">
      <path d="M6 0C3.24 0 1 2.24 1 5c0 3.75 5 11 5 11s5-7.25 5-11c0-2.76-2.24-5-5-5Z" stroke="#FAE90C" strokeWidth="1.4" fill="none"/>
      <circle cx="6" cy="5" r="1.8" stroke="#FAE90C" strokeWidth="1.4" fill="none"/>
    </svg>
  );
}

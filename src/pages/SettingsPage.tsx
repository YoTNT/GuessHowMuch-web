import { useState } from 'react';
import { Button } from '../components/Button';
import { api } from '../api/client';
import type { UserProfile } from '../api/client';

interface SettingsPageProps {
  user: UserProfile;
  onBack: () => void;
  onUpdateUser: (user: UserProfile) => void;
}

interface ApiKeyFieldProps {
  label: string;
  description: string;
  unlocks: string;
  link: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
}

function ApiKeyField({ label, description, unlocks, link, value, onChange, required }: ApiKeyFieldProps) {
  const [show, setShow] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div 
      style={{ border: "1px solid var(--color-border)", borderRadius: "4px", padding: "16px", marginBottom: "12px" }}
      onWheelCapture={e => { window.scrollBy({ top: e.deltaY }); }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
        <div>
          <span style={{ color: "var(--color-text)", fontSize: "12px", fontWeight: "bold" }}>{label}</span>
          {required && <span style={{ color: "var(--color-negative)", fontSize: "11px", marginLeft: "8px" }}>[required]</span>}
          {!required && <span style={{ color: "var(--color-muted)", fontSize: "11px", marginLeft: "8px" }}>[optional]</span>}
        </div>
        <a href={link} target="_blank" rel="noopener noreferrer" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ color: hovered ? "var(--color-text)" : "var(--color-accent)", fontSize: "11px", textDecoration: "underline", cursor: "pointer" }}>
          get key
        </a>
      </div>
      <div style={{ color: "var(--color-muted)", fontSize: "11px", marginBottom: "4px" }}>{description}</div>
      <div style={{ color: "var(--color-accent)", fontSize: "11px", marginBottom: "10px" }}># unlocks: {unlocks}</div>
      <div style={{ position: "relative" }}>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={e => onChange(e.target.value)}
          onWheel={e => {
            e.currentTarget.blur();
            window.scrollBy(0, e.deltaY);
          }}
          placeholder="paste your key here"
          style={{ width: "100%", background: "var(--color-bg)", border: "1px solid var(--color-border)", borderRadius: "2px", padding: "8px 48px 8px 12px", color: "var(--color-text)", fontFamily: "var(--font-mono)", fontSize: "12px", outline: "none", boxSizing: "border-box" }}
        />
        <button onClick={() => setShow(prev => !prev)} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", color: "var(--color-muted)", fontSize: "11px", fontFamily: "var(--font-mono)", padding: "0" }}>
          {show ? "hide" : "show"}
        </button>
      </div>
    </div>
  );
}

export function SettingsPage({ user, onBack, onUpdateUser }: SettingsPageProps) {
  const [keys, setKeys] = useState({ alphaVantage: "", anthropic: "", finnhub: "", huggingFace: "" });

  // Guard — unverified users cannot access settings
  if (!user.emailVerified) {
    return (
      <div style={{ paddingTop: '60px', maxWidth: '480px', margin: '0 auto', fontFamily: 'var(--font-mono)' }}>
        <div style={{ marginBottom: '24px' }}>
          <Button variant="secondary" onClick={onBack}>&lt; back</Button>
        </div>
        <div style={{
          border: '1px solid #cc8800',
          borderRadius: '4px',
          padding: '32px',
          backgroundColor: 'var(--color-surface)',
        }}>
          <div style={{ color: '#cc8800', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>
            ⚠ email verification required
          </div>
          <div style={{ color: 'var(--color-muted)', fontSize: '12px', lineHeight: '1.8' }}>
            verify your email address to access settings and manage your API keys.
          </div>
        </div>
      </div>
    );
  }
  
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const hasChanges = keys.alphaVantage !== "" || keys.anthropic !== "" || keys.finnhub !== "" || keys.huggingFace !== "";

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    const updates: Record<string, string> = {};
    if (keys.alphaVantage) updates.alphaVantage = keys.alphaVantage;
    if (keys.anthropic) updates.anthropic = keys.anthropic;
    if (keys.finnhub) updates.finnhub = keys.finnhub;
    if (keys.huggingFace) updates.huggingFace = keys.huggingFace;
    try {
      const updated = await api.updateApiKeys(updates);
      onUpdateUser(updated);
      setKeys({ alphaVantage: "", anthropic: "", finnhub: "", huggingFace: "" });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <Button variant="secondary" onClick={onBack}>&lt; back</Button>
      </div>
      <div style={{ marginBottom: "32px" }}>
        <div style={{ color: "var(--color-accent)", fontSize: "20px", fontWeight: "bold", marginBottom: "4px" }}>$ settings</div>
        <div style={{ color: "var(--color-muted)", fontSize: "11px" }}>{user.email}</div>
      </div>
      <div style={{ marginBottom: "24px" }}>
        <div style={{ color: "var(--color-muted)", fontSize: "11px", marginBottom: "12px" }}>// current api keys</div>
        <div style={{ border: "1px solid var(--color-border)", borderRadius: "4px", padding: "12px 16px", fontSize: "12px" }}>
          {[
            { label: "Alpha Vantage", value: user.apiKeys.alphaVantage },
            { label: "Anthropic", value: user.apiKeys.anthropic },
            { label: "Finnhub", value: user.apiKeys.finnhub },
            { label: "HuggingFace", value: user.apiKeys.huggingFace },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid var(--color-border)" }}>
              <span style={{ color: "var(--color-muted)" }}>{label}</span>
              <span style={{ color: value ? "var(--color-positive)" : "var(--color-negative)" }}>{value ? value : "[not set]"}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginBottom: "24px" }}>
        <div style={{ color: "var(--color-muted)", fontSize: "11px", marginBottom: "12px" }}>// update api keys</div>
        <ApiKeyField label="Alpha Vantage" description="Required for real-time stock data and historical prices" unlocks="stock quotes, technical indicators, historical data" link="https://www.alphavantage.co/support/#api-key" value={keys.alphaVantage} onChange={val => setKeys(prev => ({ ...prev, alphaVantage: val }))} required />
        <ApiKeyField label="Anthropic" description="Claude AI for generating stock predictions and news analysis" unlocks="AI predictions, deep news sentiment analysis" link="https://console.anthropic.com" value={keys.anthropic} onChange={val => setKeys(prev => ({ ...prev, anthropic: val }))} />
        <ApiKeyField label="Finnhub" description="Realtime financial news + stock data (no delay)" unlocks="news sentiment analysis" link="https://finnhub.io/register" value={keys.finnhub} onChange={val => setKeys(prev => ({ ...prev, finnhub: val }))} />
        <ApiKeyField label="HuggingFace" description="FinBERT financial sentiment model via HuggingFace Inference API" unlocks="FinBERT sentiment analysis (improves prediction accuracy)" link="https://huggingface.co/settings/tokens" value={keys.huggingFace} onChange={val => setKeys(prev => ({ ...prev, huggingFace: val }))} />
      </div>
      {saveError && (
        <div style={{ color: "var(--color-negative)", fontSize: "12px", marginBottom: "12px", border: "1px solid var(--color-negative)", padding: "8px 12px", borderRadius: "2px", backgroundColor: "rgba(255, 68, 68, 0.05)" }}>
          [ERROR] {saveError}
        </div>
      )}
      {saveSuccess && (
        <div style={{ color: "var(--color-positive)", fontSize: "12px", marginBottom: "12px", border: "1px solid var(--color-positive)", padding: "8px 12px", borderRadius: "2px", backgroundColor: "rgba(0, 255, 136, 0.05)" }}>
          [OK] API keys updated successfully
        </div>
      )}
      <Button onClick={handleSave} loading={saving} loadingText="saving" disabled={!hasChanges}>save changes</Button>
    </div>
  );
}

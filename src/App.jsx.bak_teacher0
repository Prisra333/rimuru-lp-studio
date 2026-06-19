
import { useState, useEffect } from 'react';

/* ═══════════════════════════════════════════
   TOKENS & CONSTANTS
═══════════════════════════════════════════ */
const C = {
  bg:     '#060708', bg2: '#0D0E11', bg3: '#141519',
  text:   '#E4DFCF', dim: '#8A8476', muted: '#3E3C45',
  accent: '#B8A88A', border: 'rgba(184,168,138,.12)',
  green:  '#6FCB9F', red: '#E07070',
};
const s = (extra = {}) => ({
  fontFamily:"'Inter','Hiragino Sans',sans-serif", fontWeight:300,
  WebkitFontSmoothing:'antialiased', ...extra
});

const MOODS   = ['Cool','Warm','Minimal','Bold','Playful','Tech'];
const ENGINES = [
  { id:'claude', label:'Claude API', desc:'ブラウザで即生成' },
  { id:'genlp',  label:'gen_lp_v2.py', desc:'Rimuruでコマンド実行' },
];
const TEMPLATES = [
  { id:'dark',  name:'DARK',  desc:'漆黒 × 真鍮\nmonakadesign風',
    hint:'Dark (#060708) background, brass (#B8A88A) accent, Crimson Pro serif, JetBrains Mono, Japanese minimalist aesthetic, smooth animations, preloader counter, hero large serif title, scroll-triggered reveals' },
  { id:'light', name:'LIGHT', desc:'クリーン × モダン\ngen_lp_v2風',
    hint:'Clean white (#FAFAFA) background, vibrant accent color, Inter sans-serif, gradient hero, card-based features, strong CTA buttons, mobile-first' },
  { id:'mix',   name:'MIX',   desc:'ブレンド\n比率を選択',  hint:'' },
];

/* ═══════════════════════════════════════════
   API
═══════════════════════════════════════════ */
async function callClaude(system, userMsg, maxTokens = 8000) {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system,
      messages: [{ role: 'user', content: userMsg }],
      max_tokens: maxTokens,
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
  const text = data.content?.[0]?.text;
  if (!text) throw new Error('No response from Claude');
  return text;
}

/* ═══════════════════════════════════════════
   PROMPTS
═══════════════════════════════════════════ */
function genProposal(brief) {
  const sys = `You are RIMURU LP STUDIO. Generate landing page proposals.
Respond ONLY with valid JSON — no markdown, no code blocks, no explanation.`;
  const msg = `Generate an LP proposal:
Product: ${brief.name}
Description: ${brief.desc}
Target: ${brief.target}
Mood: ${brief.mood}

Return ONLY this JSON (no \`\`\`):
{
  "catchcopy": "compelling headline",
  "subcopy": "supporting subtitle",
  "sections": [
    {"id":"hero","title":"...","content":"..."},
    {"id":"features","title":"...","items":["...","...","..."]},
    {"id":"about","title":"...","content":"..."},
    {"id":"cta","title":"...","content":"...","buttonText":"..."}
  ],
  "tone": "tone description",
  "keyMessages": ["msg1","msg2","msg3"]
}`;
  return { sys, msg };
}

function genHtml(brief, proposal, template, mixRatio) {
  let styleHint = '';
  if (template === 'dark') {
    styleHint = TEMPLATES[0].hint;
  } else if (template === 'light') {
    styleHint = TEMPLATES[1].hint;
  } else {
    const dark = TEMPLATES[0].hint;
    const light = TEMPLATES[1].hint;
    styleHint = `MIX (${mixRatio}% dark, ${100-mixRatio}% light):
    ${mixRatio >= 50 ? 'Primarily dark aesthetic.' : 'Primarily light aesthetic.'}
    Nav + Hero + Footer: ${dark}
    Main content sections: ${mixRatio >= 50 ? dark : light}`;
  }

  const sys = `You are RIMURU LP STUDIO. Generate complete landing pages as single HTML files.
Style: ${styleHint}
Rules:
- ALL CSS and JS must be inline (no external files except Google Fonts CDN)
- Fully responsive
- Include smooth scroll animations and IntersectionObserver reveals
- Return ONLY raw HTML from <!DOCTYPE html> to </html>
- No explanation, no markdown code fences`;

  const msg = `Product: ${brief.name}
Catchcopy: ${proposal.catchcopy}
Subcopy: ${proposal.subcopy}
Sections: ${JSON.stringify(proposal.sections)}
Key messages: ${(proposal.keyMessages||[]).join(', ')}
Tone: ${proposal.tone}`;

  return { sys, msg };
}

/* ═══════════════════════════════════════════
   SHARED STYLE HELPERS
═══════════════════════════════════════════ */
const fillBtn = (disabled = false) => ({
  fontFamily:"'JetBrains Mono',monospace", fontWeight:400, fontSize:'.78rem',
  letterSpacing:'.1em', background: disabled ? C.bg3 : C.accent,
  color: disabled ? C.muted : C.bg, padding:'.88rem 1.85rem',
  border:'none', cursor: disabled ? 'default' : 'pointer',
  transition:'opacity .2s', opacity: disabled ? .5 : 1,
});
const ghostBtn = {
  fontFamily:"'JetBrains Mono',monospace", fontWeight:300, fontSize:'.75rem',
  letterSpacing:'.1em', background:'transparent', color: C.dim,
  padding:'.75rem 1.5rem', border:`1px solid ${C.border}`,
  cursor:'pointer', transition:'all .2s',
};
const labelStyle = {
  fontFamily:"'JetBrains Mono',monospace", fontWeight:300, fontSize:'.65rem',
  letterSpacing:'.16em', color: C.dim, display:'block',
  marginBottom:'.65rem', textTransform:'uppercase',
};
const inputStyle = {
  width:'100%', background: C.bg2, border:`1px solid ${C.border}`,
  color: C.text, fontFamily:"'Inter',sans-serif", fontWeight:300, fontSize:'.9rem',
  lineHeight:1.5, padding:'.75rem 1rem', outline:'none',
  transition:'border-color .2s',
};

/* ═══════════════════════════════════════════
   LOADING / ERROR
═══════════════════════════════════════════ */
function Loader({ msg }) {
  const [dots, setDots] = useState('');
  useEffect(() => {
    const t = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{padding:'5rem 2rem', textAlign:'center'}}>
      <div style={{fontFamily:"'JetBrains Mono',monospace", fontSize:'4rem', color: C.muted,
        animation:'spin 3s linear infinite', display:'inline-block', marginBottom:'1.5rem'}}>⬡</div>
      <p style={{fontFamily:"'JetBrains Mono',monospace", fontSize:'.72rem',
        letterSpacing:'.18em', color: C.accent}}>{msg}{dots}</p>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
function Err({ msg, onRetry }) {
  return (
    <div style={{padding:'3rem 2rem', textAlign:'center'}}>
      <p style={{color: C.dim, marginBottom:'1.5rem', fontSize:'.9rem'}}>エラー: {msg}</p>
      <button onClick={onRetry} style={ghostBtn}>← リトライ</button>
    </div>
  );
}

/* ═══════════════════════════════════════════
   STEP INDICATOR
═══════════════════════════════════════════ */
function StepBar({ current }) {
  const steps = ['Brief','Proposal','Template','Preview','Deploy'];
  return (
    <div style={{
      padding:'1rem 2rem', borderBottom:`1px solid ${C.border}`,
      display:'flex', gap:'.2rem', alignItems:'center', overflowX:'auto',
    }}>
      {steps.map((label, i) => {
        const n = i + 1;
        const active = n === current;
        const done   = n < current;
        return (
          <span key={label} style={{display:'flex', alignItems:'center', gap:'.3rem', flexShrink:0}}>
            <span style={{
              fontFamily:"'JetBrains Mono',monospace", fontSize:'.62rem',
              letterSpacing:'.1em',
              color: active ? C.accent : done ? C.dim : C.muted,
            }}>
              {String(n).padStart(2,'0')} {label.toUpperCase()}
            </span>
            {i < steps.length - 1 && (
              <span style={{color: C.muted, fontSize:'.6rem', marginLeft:'.1rem'}}>—</span>
            )}
          </span>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════
   STEP 1: BRIEF
═══════════════════════════════════════════ */
function BriefStep({ onNext }) {
  const [form, setForm] = useState({ name:'', desc:'', target:'', mood:'Cool', engine:'claude' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const ok = form.name.trim() && form.desc.trim();

  return (
    <div style={{ padding:'3rem 2rem', maxWidth:'560px', margin:'0 auto' }}>
      <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.7rem',
        letterSpacing:'.18em', color: C.accent, marginBottom:'2.5rem',
        textTransform:'uppercase' }}>
        01 / Brief — どんなLPを作りますか？
      </p>

      <div style={{ display:'flex', flexDirection:'column', gap:'1.6rem' }}>
        {/* Name */}
        <div>
          <label style={labelStyle}>プロダクト名</label>
          <input style={inputStyle} value={form.name} placeholder="例: NeuroPulse"
            onChange={e => set('name', e.target.value)} />
        </div>

        {/* Desc */}
        <div>
          <label style={labelStyle}>説明（何のサービス？）</label>
          <textarea style={{ ...inputStyle, resize:'vertical', lineHeight:1.6 }}
            rows={3} value={form.desc} placeholder="例: AIチャットボットのSaaS。LINEと連携してECを自動化する。"
            onChange={e => set('desc', e.target.value)} />
        </div>

        {/* Target */}
        <div>
          <label style={labelStyle}>ターゲット</label>
          <input style={inputStyle} value={form.target} placeholder="例: 中小企業のEC担当者"
            onChange={e => set('target', e.target.value)} />
        </div>

        {/* Mood */}
        <div>
          <label style={labelStyle}>ムード</label>
          <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap' }}>
            {MOODS.map(m => (
              <button key={m} onClick={() => set('mood', m)} style={{
                fontFamily:"'JetBrains Mono',monospace", fontSize:'.72rem',
                letterSpacing:'.08em', padding:'.38rem .9rem', cursor:'pointer',
                background: form.mood === m ? C.accent : 'transparent',
                color:      form.mood === m ? C.bg    : C.dim,
                border:    `1px solid ${form.mood === m ? C.accent : C.border}`,
                transition:'all .15s',
              }}>{m}</button>
            ))}
          </div>
        </div>

        {/* Engine */}
        <div>
          <label style={labelStyle}>エンジン</label>
          <div style={{ display:'flex', flexDirection:'column', gap:'.5rem' }}>
            {ENGINES.map(e => (
              <button key={e.id} onClick={() => set('engine', e.id)} style={{
                display:'flex', alignItems:'center', justifyContent:'space-between',
                padding:'.85rem 1rem', cursor:'pointer', textAlign:'left',
                background: form.engine === e.id ? C.bg3 : 'transparent',
                border:    `1px solid ${form.engine === e.id ? C.accent : C.border}`,
                transition:'all .15s',
              }}>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.75rem',
                  color: form.engine === e.id ? C.accent : C.text }}>{e.label}</span>
                <span style={{ fontFamily:"'Inter',sans-serif", fontSize:'.72rem',
                  color: C.muted }}>{e.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <button onClick={() => ok && onNext(form)} style={fillBtn(!ok)}>
          提案を生成 →
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   STEP 2: PROPOSAL
═══════════════════════════════════════════ */
function ProposalStep({ brief, onNext, onBack }) {
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const fetch_ = () => {
    setLoading(true); setError(null);
    const { sys, msg } = genProposal(brief);
    callClaude(sys, msg, 2000)
      .then(text => {
        const clean = text.replace(/```json\n?|```/g, '').trim();
        setProposal(JSON.parse(clean));
        setLoading(false);
      })
      .catch(e => { setError(e.message); setLoading(false); });
  };

  useEffect(fetch_, []);

  if (loading) return <Loader msg="LP提案を生成中" />;
  if (error)   return <Err msg={error} onRetry={fetch_} />;

  return (
    <div style={{ padding:'3rem 2rem', maxWidth:'660px', margin:'0 auto' }}>
      <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.7rem',
        letterSpacing:'.18em', color: C.accent, marginBottom:'2.5rem', textTransform:'uppercase' }}>
        02 / Proposal — AIが提案しました
      </p>

      <div style={{ display:'flex', flexDirection:'column', gap:'2rem' }}>

        {/* Catchcopy */}
        <div style={{ borderLeft:`2px solid ${C.accent}`, paddingLeft:'1.5rem' }}>
          <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.62rem',
            color: C.muted, letterSpacing:'.14em', marginBottom:'.5rem' }}>CATCHCOPY</p>
          <p style={{ fontFamily:"'Crimson Pro',serif", fontSize:'clamp(1.5rem,4vw,2.2rem)',
            fontWeight:400, color: C.text, lineHeight:1.2 }}>{proposal.catchcopy}</p>
          <p style={{ fontFamily:"'Crimson Pro',serif", fontSize:'1.05rem',
            color: C.dim, marginTop:'.4rem', fontStyle:'italic' }}>{proposal.subcopy}</p>
        </div>

        {/* Sections */}
        <div>
          <p style={{ ...labelStyle, marginBottom:'1rem' }}>セクション構成</p>
          <div style={{ display:'flex', flexDirection:'column', gap:'.5rem' }}>
            {(proposal.sections || []).map((sec, i) => (
              <div key={sec.id} style={{
                display:'flex', gap:'1rem', padding:'.85rem 1rem',
                background: C.bg2, borderLeft:`1px solid ${C.border}`,
              }}>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.6rem',
                  color: C.muted, minWidth:'1.5rem', paddingTop:'.1rem' }}>
                  {String(i+1).padStart(2,'0')}
                </span>
                <div>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.65rem',
                    color: C.accent, letterSpacing:'.1em' }}>{sec.id.toUpperCase()}</span>
                  <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'.82rem',
                    color: C.dim, marginTop:'.3rem' }}>{sec.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key messages */}
        {proposal.keyMessages?.length > 0 && (
          <div>
            <p style={labelStyle}>キーメッセージ</p>
            <div style={{ display:'flex', gap:'.5rem', flexWrap:'wrap' }}>
              {proposal.keyMessages.map(m => (
                <span key={m} style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.68rem',
                  color: C.dim, border:`1px solid ${C.border}`, padding:'.28rem .7rem' }}>{m}</span>
              ))}
            </div>
          </div>
        )}

        <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'.82rem',
          color: C.dim, lineHeight:1.6 }}>
          <span style={{ color: C.text }}>トーン:</span> {proposal.tone}
        </p>

        <div style={{ display:'flex', gap:'1rem' }}>
          <button onClick={onBack} style={ghostBtn}>← 作り直す</button>
          <button onClick={() => onNext(proposal)} style={fillBtn()}>
            テンプレートへ →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   STEP 3: TEMPLATE
═══════════════════════════════════════════ */
function TemplateStep({ onNext, onBack }) {
  const [selected, setSelected] = useState(null);
  const [ratio, setRatio]       = useState(50);

  return (
    <div style={{ padding:'3rem 2rem', maxWidth:'660px', margin:'0 auto' }}>
      <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.7rem',
        letterSpacing:'.18em', color: C.accent, marginBottom:'2.5rem', textTransform:'uppercase' }}>
        03 / Template — スタイルを選択
      </p>

      {/* Template cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem', marginBottom:'2rem' }}>
        {TEMPLATES.map(t => (
          <button key={t.id} onClick={() => setSelected(t.id)} style={{
            background: selected === t.id ? C.bg3 : C.bg2,
            border:    `1px solid ${selected === t.id ? C.accent : C.border}`,
            padding:'1.5rem 1rem', cursor:'pointer', textAlign:'left',
            transition:'all .15s',
          }}>
            {/* Mini preview strip */}
            <div style={{
              height:'60px', marginBottom:'1rem', borderRadius:'2px',
              background: t.id === 'dark'  ? 'linear-gradient(135deg,#060708 60%,#B8A88A20)' :
                          t.id === 'light' ? 'linear-gradient(135deg,#fff 60%,#e0e0ff)' :
                          'linear-gradient(135deg,#060708 50%,#fff 50%)',
              border:`1px solid ${C.border}`,
            }} />
            <p style={{ fontFamily:"'JetBrains Mono',monospace", fontWeight:400, fontSize:'.85rem',
              color: selected === t.id ? C.accent : C.text, marginBottom:'.5rem' }}>{t.name}</p>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'.72rem',
              color: C.dim, lineHeight:1.5, whiteSpace:'pre-line' }}>{t.desc}</p>
          </button>
        ))}
      </div>

      {/* Mix ratio slider */}
      {selected === 'mix' && (
        <div style={{ padding:'1.5rem', background: C.bg2,
          border:`1px solid ${C.border}`, marginBottom:'2rem' }}>
          <p style={{ ...labelStyle, marginBottom:'1rem' }}>ブレンド比率</p>
          <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.68rem',
              color: C.dim, minWidth:'4.5rem' }}>DARK {ratio}%</span>
            <input type="range" min="10" max="90" value={ratio}
              onChange={e => setRatio(Number(e.target.value))}
              style={{ flex:1, accentColor: C.accent }} />
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.68rem',
              color: C.dim, minWidth:'4.5rem', textAlign:'right' }}>LIGHT {100-ratio}%</span>
          </div>
          {/* Visual blend bar */}
          <div style={{ height:'4px', background:`linear-gradient(to right, #060708 ${ratio}%, #FAFAFA ${ratio}%)`,
            marginTop:'1rem', border:`1px solid ${C.border}` }} />
        </div>
      )}

      <div style={{ display:'flex', gap:'1rem' }}>
        <button onClick={onBack} style={ghostBtn}>← 戻る</button>
        <button onClick={() => selected && onNext(selected, ratio)}
          style={fillBtn(!selected)}>LP を生成 →</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   STEP 4: PREVIEW
═══════════════════════════════════════════ */
function PreviewStep({ brief, proposal, template, mixRatio, onNext, onBack }) {
  const [html, setHtml]       = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const isGenLp               = brief.engine === 'genlp';

  const fetch_ = () => {
    if (isGenLp) { setLoading(false); return; }
    setLoading(true); setError(null);
    const { sys, msg } = genHtml(brief, proposal, template, mixRatio);
    callClaude(sys, msg, 8000)
      .then(text => {
        const clean = text.replace(/^```html\n?|\n?```$/g, '').trim();
        setHtml(clean);
        setLoading(false);
      })
      .catch(e => { setError(e.message); setLoading(false); });
  };

  useEffect(fetch_, []);

  const dlHtml = () => {
    const blob = new Blob([html], { type:'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${brief.name.toLowerCase().replace(/[^a-z0-9]/g,'-')}-lp.html`;
    a.click();
  };

  const genLpCmd = `python3 ~/genesis/gen_lp.py \\
  --name "${brief.name}" \\
  --desc "${brief.desc}" \\
  --target "${brief.target}" \\
  --mood "${brief.mood.toLowerCase()}" \\
  --theme ${template === 'light' ? 'light' : 'dark'}`;

  if (loading) return <Loader msg="LP HTML を生成中（30秒ほど）" />;
  if (error)   return <Err msg={error} onRetry={fetch_} />;

  return (
    <div style={{ padding:'2rem', maxWidth:'960px', margin:'0 auto' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
        marginBottom:'1.5rem' }}>
        <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.7rem',
          letterSpacing:'.18em', color: C.accent, textTransform:'uppercase' }}>
          04 / Preview
        </p>
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.62rem',
          color: C.muted }}>
          {template.toUpperCase()}{template === 'mix' ? ` ${mixRatio}:${100-mixRatio}` : ''}
        </span>
      </div>

      {isGenLp ? (
        <div style={{ padding:'1.5rem', background: C.bg2,
          border:`1px solid ${C.border}`, marginBottom:'2rem' }}>
          <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.65rem',
            color: C.accent, letterSpacing:'.14em', marginBottom:'1rem' }}>
            GEN_LP_V2.PY コマンド
          </p>
          <pre style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.78rem',
            color: C.dim, overflowX:'auto', whiteSpace:'pre-wrap', lineHeight:1.8 }}>
            {genLpCmd}
          </pre>
        </div>
      ) : (
        <div style={{ border:`1px solid ${C.border}`, marginBottom:'2rem' }}>
          {/* Preview toolbar */}
          <div style={{ padding:'.6rem 1rem', borderBottom:`1px solid ${C.border}`,
            display:'flex', justifyContent:'space-between', background: C.bg2 }}>
            <div style={{ display:'flex', gap:'.4rem' }}>
              {['#E07070','#F0C060','#6FCB9F'].map(c => (
                <span key={c} style={{ width:'10px', height:'10px', borderRadius:'50%',
                  background: c, display:'inline-block' }} />
              ))}
            </div>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.6rem',
              color: C.muted }}>PREVIEW — {brief.name}</span>
          </div>
          <iframe
            srcDoc={html}
            style={{ width:'100%', height:'68vh', border:'none', display:'block' }}
            title="LP Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      )}

      <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
        <button onClick={onBack} style={ghostBtn}>← 修正</button>
        {!isGenLp && <button onClick={dlHtml} style={ghostBtn}>↓ HTML DL</button>}
        <button onClick={() => onNext(html, genLpCmd)} style={fillBtn()}>
          → デプロイへ
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   STEP 5: DEPLOY
═══════════════════════════════════════════ */
function DeployStep({ brief, html, genLpCmd, onRestart }) {
  const [copied, setCopied] = useState('');

  const copy = (text, key) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  const slug       = brief.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const deployCmd  = `mkdir -p ~/${slug}-lp
cp /sdcard/Download/${slug}-lp.html ~/${slug}-lp/index.html
~/deploy.sh ${slug}-lp`;

  const dlHtml = () => {
    if (!html) return;
    const blob = new Blob([html], { type:'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${slug}-lp.html`;
    a.click();
  };

  return (
    <div style={{ padding:'3rem 2rem', maxWidth:'620px', margin:'0 auto' }}>
      <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.7rem',
        letterSpacing:'.18em', color: C.accent, marginBottom:'2.5rem', textTransform:'uppercase' }}>
        05 / Deploy
      </p>

      <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>

        {/* Download */}
        {html && (
          <div style={{ padding:'1.5rem', background: C.bg2, border:`1px solid ${C.border}` }}>
            <p style={labelStyle}>STEP 1 — HTML をダウンロード</p>
            <button onClick={dlHtml} style={{ ...fillBtn(), alignSelf:'flex-start' }}>
              ↓ {slug}-lp.html をDL
            </button>
          </div>
        )}

        {/* Termux deploy command */}
        <div style={{ padding:'1.5rem', background: C.bg2, border:`1px solid ${C.border}` }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
            marginBottom:'1rem' }}>
            <p style={labelStyle}>STEP 2 — Termux でデプロイ</p>
            <button onClick={() => copy(deployCmd, 'deploy')} style={{ ...ghostBtn, fontSize:'.62rem', padding:'.3rem .7rem' }}>
              {copied === 'deploy' ? 'Copied!' : 'コピー'}
            </button>
          </div>
          <pre style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.75rem',
            color: C.dim, whiteSpace:'pre-wrap', lineHeight:1.8, wordBreak:'break-all' }}>
            {deployCmd}
          </pre>
        </div>

        {/* gen_lp_v2 command (if available) */}
        {genLpCmd && (
          <div style={{ padding:'1.5rem', background: C.bg2, border:`1px solid ${C.border}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
              marginBottom:'1rem' }}>
              <p style={labelStyle}>gen_lp_v2.py コマンド（Rimuruで実行）</p>
              <button onClick={() => copy(genLpCmd, 'genlp')} style={{ ...ghostBtn, fontSize:'.62rem', padding:'.3rem .7rem' }}>
                {copied === 'genlp' ? 'Copied!' : 'コピー'}
              </button>
            </div>
            <pre style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.75rem',
              color: C.dim, whiteSpace:'pre-wrap', lineHeight:1.8, wordBreak:'break-all' }}>
              {genLpCmd}
            </pre>
          </div>
        )}

        {/* Vercel env note */}
        <div style={{ padding:'1rem 1.2rem', borderLeft:`2px solid ${C.border}` }}>
          <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.65rem',
            color: C.muted, lineHeight:1.7 }}>
            ※ このスタジオのデプロイ後、Vercel Dashboard で<br/>
            <span style={{ color: C.accent }}>ANTHROPIC_API_KEY</span> を環境変数に追加してください。
          </p>
        </div>

        <button onClick={onRestart} style={ghostBtn}>← 新しいLPを作る</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════ */
export default function App() {
  const [step, setStep]     = useState(1);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const n = p.get('name');
    if (n) {
      setBrief({ name:n, desc:p.get('desc')||'', target:p.get('target')||'', mood:p.get('mood')||'Cool', engine:'claude' });
      window.history.replaceState({}, '', '/');
    }
  }, []);
  const [brief, setBrief]   = useState(null);
  const [proposal, setP]    = useState(null);
  const [template, setTpl]  = useState(null);
  const [mixRatio, setMix]  = useState(50);
  const [lpHtml, setHtml]   = useState('');
  const [genCmd, setCmd]    = useState('');

  const reset = () => {
    setStep(1); setBrief(null); setP(null);
    setTpl(null); setMix(50); setHtml(''); setCmd('');
  };

  return (
    <div style={{ minHeight:'100vh', background: C.bg, color: C.text,
      fontFamily:"'Inter',sans-serif", fontWeight:300 }}>

      {/* Global styles */}
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${C.bg}; }
        input, textarea, button { font-family: inherit; }
        input::placeholder, textarea::placeholder { color: ${C.muted}; }
        input:focus, textarea:focus { border-color: ${C.accent} !important; }
        button:hover { opacity: 0.85; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.muted}; }
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;1,400&family=JetBrains+Mono:wght@300;400&family=Inter:wght@300;400&display=swap');
      `}</style>

      {/* Header */}
      <header style={{ padding:'1.2rem 2rem', borderBottom:`1px solid ${C.border}`,
        display:'flex', justifyContent:'space-between', alignItems:'center',
        position:'sticky', top:0, background: C.bg, zIndex:50 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.78rem',
            letterSpacing:'.16em', color: C.accent }}>RIMURU LP STUDIO</span>
          <span style={{ width:'5px', height:'5px', borderRadius:'50%',
            background: C.green, animation:'pulse 2s ease-in-out infinite' }} />
        </div>
        <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:'.62rem',
          color: C.muted }}>by Prisra × GENESIS</span>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
      </header>

      <StepBar current={step} />

      {step === 1 && (
        <BriefStep onNext={b => { setBrief(b); setStep(2); }} />
      )}
      {step === 2 && (
        <ProposalStep brief={brief}
          onNext={p => { setP(p); setStep(3); }}
          onBack={() => setStep(1)} />
      )}
      {step === 3 && (
        <TemplateStep
          onNext={(t, r) => { setTpl(t); setMix(r); setStep(4); }}
          onBack={() => setStep(2)} />
      )}
      {step === 4 && (
        <PreviewStep brief={brief} proposal={proposal}
          template={template} mixRatio={mixRatio}
          onNext={(h, cmd) => { setHtml(h); setCmd(cmd); setStep(5); }}
          onBack={() => setStep(3)} />
      )}
      {step === 5 && (
        <DeployStep brief={brief} html={lpHtml}
          genLpCmd={genCmd} onRestart={reset} />
      )}
    </div>
  );
}

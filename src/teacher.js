export const TEACHER_DARK = `<!-- REFERENCE DESIGN DNA — dark editorial "monaka" aesthetic. Match this CSS + structure exactly; fill with the product's real copy. -->
<style>
@import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;500&family=JetBrains+Mono:wght@300;400&family=Inter:wght@300;400&display=swap');
:root{--bg:#060708;--bg2:#0D0E11;--text:#E4DFCF;--dim:#8A8476;--accent:#B8A88A;--border:rgba(184,168,138,.14)}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--text);font-family:'Inter',sans-serif;font-weight:300;-webkit-font-smoothing:antialiased;line-height:1.6}
.wrap{max-width:1080px;margin:0 auto;padding:0 2rem}
.eyebrow{font-family:'JetBrains Mono',monospace;font-size:.72rem;letter-spacing:.22em;text-transform:uppercase;color:var(--accent)}
h1,h2{font-family:'Crimson Pro',serif;font-weight:400;line-height:1.04;letter-spacing:-.01em}
h1{font-size:clamp(2.8rem,8vw,6rem)}
h2{font-size:clamp(1.8rem,4.5vw,3.2rem)}
p{color:var(--dim)}
section{padding:clamp(5rem,12vh,9rem) 0;border-top:1px solid var(--border)}
.reveal{opacity:0;transform:translateY(28px);transition:opacity .9s ease,transform .9s cubic-bezier(.2,.8,.2,1)}
.reveal.in{opacity:1;transform:none}
#pre{position:fixed;inset:0;z-index:99;background:var(--bg);display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace;font-size:clamp(3rem,10vw,7rem);color:var(--dim);transition:opacity .8s}
nav{position:sticky;top:0;z-index:50;display:flex;justify-content:space-between;align-items:center;padding:1.2rem 2rem;background:rgba(6,7,8,.82);backdrop-filter:blur(8px);border-bottom:1px solid var(--border)}
.btn{font-family:'JetBrains Mono',monospace;font-size:.85rem;letter-spacing:.08em;background:var(--accent);color:var(--bg);border:none;padding:1.05rem 2.4rem;cursor:pointer}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:2.6rem}
.idx{font-family:'JetBrains Mono',monospace;font-size:.7rem;color:var(--accent);letter-spacing:.1em}
h3{font-family:'Crimson Pro',serif;font-weight:500;font-size:1.4rem;margin:.6rem 0 .4rem}
</style>
<!-- STRUCTURE in order:
1) #pre preloader: JS counts 00 to 100 in the counter, then sets #pre opacity 0 and display none.
2) nav: brand in JetBrains Mono (left) + small pulsing dot (right).
3) HERO section: .eyebrow micro-label, huge serif h1 = catchcopy, p = subcopy, one .btn.
4) FEATURES section: .wrap > .grid; each cell = .idx 01 + h3 + p.
5) ABOUT section: 2-column .wrap (left: .eyebrow + h2; right: p).
6) CTA section: centered, big h2 + single .btn.
7) footer: minimal, JetBrains Mono, dim, by NAME x GENESIS.
All major blocks use class=reveal; an IntersectionObserver adds .in when they enter view.
Restrained, generous whitespace, editorial. No emoji. Brass accent used sparingly. -->
`;

'use client';
import { authorNames, bookTitle, encodeBook, pages, world, type Story } from '@/lib/story/engine';
import { THINGS } from '@/lib/story/content';
import { COVER_CLOTH } from './Cover';

/**
 * Turning live, layered stages into standalone files: a private reading link,
 * a self-contained HTML picture book and a cover image. No server involved.
 */

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function bookLink(s: Story) {
  return `${window.location.origin}${window.location.pathname}#book=${encodeBook(s)}`;
}

function family(varName: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || 'Georgia, serif';
}

function fixFonts(markup: string) {
  return markup
    .replace(/var\(--font-display\)/g, family('--font-display').replace(/"/g, "'"))
    .replace(/var\(--font-book\)/g, family('--font-book').replace(/"/g, "'"))
    .replace(/var\(--font-ui\)/g, family('--font-ui').replace(/"/g, "'"));
}

/** Embed the Crafta typefaces (latin subset) so exported books look the same anywhere. */
export async function fontCss(): Promise<string> {
  const wanted = ['--font-display', '--font-book', '--font-ui'].map((v) => family(v).split(',')[0].replace(/['"]/g, '').trim());
  const rules: [CSSFontFaceRule, string][] = [];
  for (const sheet of Array.from(document.styleSheets)) {
    let list: CSSRuleList;
    try { list = sheet.cssRules; } catch { continue; }
    for (const r of Array.from(list)) {
      if (r instanceof CSSFontFaceRule) {
        const fam = r.style.getPropertyValue('font-family').replace(/['"]/g, '').trim();
        const range = r.style.getPropertyValue('unicode-range');
        if (wanted.includes(fam) && (!range || /U\+0-FF|U\+0000-00FF/i.test(range))) rules.push([r, sheet.href || window.location.href]);
      }
    }
  }
  const out: string[] = [];
  for (const [r, base] of rules) {
    const m = r.cssText.match(/url\(["']?([^"')]+)["']?\)/);
    if (!m) continue;
    try {
      // Font URLs are relative to the stylesheet that declares them, not to the page.
      const res = await fetch(new URL(m[1], base));
      if (!res.ok) continue;
      const buf = await res.arrayBuffer();
      let bin = '';
      new Uint8Array(buf).forEach((b) => { bin += String.fromCharCode(b); });
      out.push(r.cssText.replace(m[0], `url(data:font/woff2;base64,${btoa(bin)})`));
    } catch { /* offline: fall back to system serif */ }
  }
  return out.join('\n');
}

function defsMarkup() {
  const defs = document.querySelector('body > svg > defs');
  return defs ? new XMLSerializer().serializeToString(defs) : '';
}

/** Flatten a rendered <Stage> into one SVG document (1000×700). */
export function stageSvg(stage: Element, withDefs = true): string {
  const ser = new XMLSerializer();
  const parts: string[] = [`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 700" width="1000" height="700">`];
  if (withDefs) parts.push(defsMarkup());
  const back = stage.querySelector('[data-layer="backdrop"] > svg');
  if (back) {
    const b = back.cloneNode(true) as SVGSVGElement;
    b.setAttribute('x', '0'); b.setAttribute('y', '0'); b.setAttribute('width', '1000'); b.setAttribute('height', '700');
    parts.push(ser.serializeToString(b));
  }
  const actors = Array.from(stage.querySelectorAll<HTMLElement>('.actor')).sort((a, b) => Number(a.style.zIndex) - Number(b.style.zIndex));
  for (const el of actors) {
    const svg = el.querySelector('svg');
    if (!svg) continue;
    const x = Number(el.dataset.x), y = Number(el.dataset.y), w = Number(el.dataset.w), h = Number(el.dataset.h);
    const c = svg.cloneNode(true) as SVGSVGElement;
    c.setAttribute('x', '0'); c.setAttribute('y', '0'); c.setAttribute('width', String(w)); c.setAttribute('height', String(h));
    if (!c.getAttribute('preserveAspectRatio')) c.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    const inner = ser.serializeToString(c);
    parts.push(el.dataset.flip === '1' ? `<g transform="translate(${x + w} ${y}) scale(-1 1)">${inner}</g>` : `<g transform="translate(${x} ${y})">${inner}</g>`);
  }
  parts.push('</svg>');
  return fixFonts(parts.join(''));
}

async function svgImage(svg: string, fonts = '') {
  const withFonts = fonts ? svg.replace('>', `><style>${fonts}</style>`) : svg;
  const img = new Image();
  img.decoding = 'async';
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(withFonts)}`;
  await img.decode();
  return img;
}

function wrap(ctx: CanvasRenderingContext2D, text: string, max: number) {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const t = line ? `${line} ${w}` : w;
    if (ctx.measureText(t).width > max && line) { lines.push(line); line = w; } else line = t;
  }
  if (line) lines.push(line);
  return lines;
}

/** Draw the cover to a 1200×1600 PNG. Text is set with the page's own loaded fonts. */
export async function coverPng(story: Story, coverStage: Element): Promise<Blob> {
  await document.fonts.ready;
  const W = 1200, H = 1600;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d')!;
  const place = world(story).place ?? 'park';
  ctx.fillStyle = COVER_CLOTH[place]; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(0,0,0,.16)'; ctx.fillRect(0, 0, 70, H);
  ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fillRect(70, 0, 4, H);
  const display = family('--font-display'), bookF = family('--font-book');
  const title = bookTitle(story);
  ctx.fillStyle = '#f7f0e1'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  let size = title.length > 28 ? 92 : title.length > 18 ? 106 : 124;
  ctx.font = `600 ${size}px ${display}`;
  let lines = wrap(ctx, title, 960);
  if (lines.length > 3) { size = 84; ctx.font = `600 ${size}px ${display}`; lines = wrap(ctx, title, 960); }
  lines.forEach((l, i) => ctx.fillText(l, 635, 210 + i * size * 1.05));
  const plateY = 210 + lines.length * size * 1.05 + 20;
  ctx.fillStyle = '#f7f0e1'; ctx.fillRect(130, plateY, 1010, 707);
  const img = await svgImage(stageSvg(coverStage), await fontCss());
  ctx.drawImage(img, 135, plateY + 4, 1000, 700);
  ctx.fillStyle = '#f7f0e1';
  ctx.font = `italic 60px ${bookF}`;
  const { child, grownup } = authorNames(story);
  ctx.fillText(`by ${child} & ${grownup}`, 635, plateY + 707 + 110);
  ctx.font = `700 26px ${family('--font-ui')}`;
  ctx.globalAlpha = 0.8;
  ctx.fillText('C R A F T A', 635, H - 70);
  return await new Promise<Blob>((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error('no image'))), 'image/png'));
}

/** A complete, self-contained picture book that opens in any browser, offline, no sign-in. */
export async function bookHtml(story: Story, coverStage: Element, pageStages: Element[]): Promise<string> {
  const { child, grownup } = authorNames(story);
  const title = bookTitle(story);
  const w = world(story);
  const date = new Date(story.finishedAt ?? story.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const fonts = await fontCss();
  const disp = family('--font-display'), bookF = family('--font-book');
  const cloth = COVER_CLOTH[w.place ?? 'park'];
  const text = pages(story);
  const svgDefs = `<svg width="0" height="0" style="position:absolute">${defsMarkup()}</svg>`;
  const page = (i: number) => `<section class="page"><div class="art">${stageSvg(pageStages[i], false)}</div><div class="words"><p${i === 0 ? ' class="first"' : ''}>${esc(text[i].text)}</p><span class="folio">${i + 1}</span></div></section>`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} — by ${esc(child)} &amp; ${esc(grownup)}</title>
<style>${fonts}
*{box-sizing:border-box}html{scroll-snap-type:y mandatory}body{margin:0;background:#efe6d2;color:#33281f;font-family:${bookF}}
section{min-height:100vh;min-height:100svh;scroll-snap-align:start;display:flex;align-items:center;justify-content:center;padding:4vmin;background:#f7f0e1;border-bottom:1px solid #e3d8c2}
svg{display:block;width:100%;height:auto}
.cover{background:#efe6d2}.cv{width:min(86vw,62vh);aspect-ratio:3/4;background:${cloth};color:#f7f0e1;padding:7% 7% 6% 11%;display:flex;flex-direction:column;align-items:center;justify-content:space-between;box-shadow:0 2px 0 rgba(0,0,0,.15),0 20px 40px -18px rgba(50,30,10,.45);position:relative;border-radius:2px 6px 6px 2px}
.cv:before{content:"";position:absolute;inset:0 auto 0 0;width:5.5%;background:rgba(0,0,0,.16)}
.cv h1{font-family:${disp};font-weight:600;font-size:min(8vw,5.4vh);line-height:1.02;text-align:center;margin:0}
.plate{background:#f7f0e1;padding:1.5%;width:100%}.by{font-style:italic;font-size:min(4.4vw,3vh);margin:0}.imp{font:700 11px/1 sans-serif;letter-spacing:.4em;opacity:.8;margin:0}
.title{flex-direction:column;text-align:center}.title h2{font-family:${disp};font-weight:500;font-size:clamp(32px,6vw,64px);margin:.2em 0}.title p{font-size:clamp(18px,2.4vw,26px);margin:.3em}
.page{gap:4vmin}.page .art{flex:1.4;max-width:120vh}.page .words{flex:1;max-width:30em;position:relative}.page p{font-size:clamp(19px,2.3vw,28px);line-height:1.6;margin:0}
.page p.first:first-letter{font-family:${disp};float:left;font-size:3.3em;line-height:.8;padding:.08em .08em 0 0;color:#2f4a3b}
.folio{display:block;margin-top:2em;font-style:italic;color:#8a7a66}
@media (orientation:portrait){.page{flex-direction:column}.page .art{width:100%}}
.end{flex-direction:column;font-family:${disp};font-size:clamp(40px,8vw,90px)}.end small{font-family:${bookF};font-style:italic;font-size:22px;margin-top:1em}
.authors{flex-direction:column;text-align:center}.authors .names{font-family:${disp};font-size:clamp(38px,7vw,80px);margin:.2em 0}.authors .made{font-size:13px;letter-spacing:.2em;text-transform:uppercase;color:#6b5a49;margin-top:3em;font-family:sans-serif}
</style></head><body>${svgDefs}
<section class="cover"><div class="cv"><h1>${esc(title)}</h1><div class="plate">${stageSvg(coverStage, false)}</div><p class="by">by ${esc(child)} &amp; ${esc(grownup)}</p><p class="imp">CRAFTA</p></div></section>
<section class="title"><h2>${esc(title)}</h2><p>written by <strong>${esc(child)}</strong> and <strong>${esc(grownup)}</strong></p><p><em>A Maple Street story · ${esc(date)}</em></p></section>
${text.map((_, i) => page(i)).join('\n')}
<section class="end">The End<small>…until next time, on Maple Street.</small></section>
<section class="authors"><p>This book was made by</p><p class="names">${esc(child)} &amp; ${esc(grownup)}</p><p>on ${esc(date)}${w.object ? `, starring Maya and ${esc(THINGS[w.object].the)}` : ''}.</p><p class="made">Made together with Crafta · Little books. Big memories.</p></section>
</body></html>`;
}

export function fileName(story: Story, ext: string) {
  const { child, grownup } = authorNames(story);
  return `${bookTitle(story)} by ${child} and ${grownup}`.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').slice(0, 80) + `.${ext}`;
}

/** Share a file natively where possible; otherwise download it. Returns how it went. */
export async function deliver(file: File): Promise<'shared' | 'downloaded' | 'cancelled'> {
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
  if (nav.share && nav.canShare?.({ files: [file] })) {
    try { await nav.share({ files: [file], title: file.name }); return 'shared'; } catch (e) { if ((e as Error).name === 'AbortError') return 'cancelled'; }
  }
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url; a.download = file.name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  return 'downloaded';
}

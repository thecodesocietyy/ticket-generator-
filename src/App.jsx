import { useEffect, useMemo, useRef, useState } from 'react';
import JsBarcode from 'jsbarcode';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { ArrowDownToLine, ArrowRight, CalendarDays, Check, Compass, Download, FileImage, FileText, RefreshCw, Sparkles, Ticket, UserRound } from 'lucide-react';

const makeId = () => 'CS-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
const initial = { firstName: 'Alex', lastName: 'Morgan', tagline: 'THINK. CREATE. INNOVATE.' };

function RouteMap() {
  return <svg className="route-map" viewBox="0 0 520 330" aria-hidden="true">
    <g fill="none" stroke="#c8a97e" strokeWidth="1.15" opacity=".62">
      <path d="M35 125 Q125 10 220 105 T475 90" /><path d="M35 125 Q150 280 265 105 T475 90" />
      <path d="M90 265 Q175 130 265 105 T420 260" /><path d="M220 105 Q340 175 420 260" />
      <path d="M35 125 Q85 205 90 265" />
    </g>
    <g fill="#d9b8b4" stroke="#c8a97e" strokeWidth="1">
      {[[35,125],[220,105],[265,105],[475,90],[90,265],[420,260],[350,175]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="3.2"/>)}
    </g>
    <g fill="#e7d0b1" fontFamily="DM Mono" fontSize="9" letterSpacing="1.5">
      <text x="20" y="113">HYD</text><text x="205" y="91">IDEA</text><text x="270" y="94">BUILD</text><text x="458" y="77">SHIP</text><text x="75" y="282">CREATE</text><text x="405" y="278">NEXT</text><text x="355" y="164">CODE</text>
    </g>
  </svg>;
}

function CompassMark({ small = false }) {
  return <svg className={small ? 'compass-mark small' : 'compass-mark'} viewBox="0 0 100 100" aria-hidden="true">
    <circle cx="50" cy="50" r="43" fill="none" stroke="currentColor" strokeWidth="1.1" opacity=".8"/>
    <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth=".6" opacity=".55"/>
    <path d="M50 9 L57 44 L91 50 L57 56 L50 91 L43 56 L9 50 L43 44Z" fill="none" stroke="currentColor" strokeWidth="1"/>
    <path d="M50 17 L56 50 L50 83 L44 50Z" fill="currentColor" opacity=".9"/>
    <path d="M17 50 L50 44 L83 50 L50 56Z" fill="currentColor" opacity=".55"/>
    <circle cx="50" cy="50" r="3" fill="#331116" stroke="currentColor"/>
    <g fill="currentColor" fontFamily="DM Mono" fontSize="7" textAnchor="middle"><text x="50" y="7">N</text><text x="50" y="99">S</text><text x="5" y="53">W</text><text x="95" y="53">E</text></g>
  </svg>;
}

function TicketArtwork({ data, ticketRef }) {
  const barcodeRef = useRef(null);
  useEffect(() => {
    if (barcodeRef.current && data.id) {
      try { JsBarcode(barcodeRef.current, data.id, { format: 'CODE128', width: 1.35, height: 42, displayValue: false, margin: 0, lineColor: '#c8a97e', background: 'transparent' }); } catch {}
    }
  }, [data.id]);

  return <article className="ticket-art" ref={ticketRef} aria-label="Generated Code Society ticket">
    <div className="ticket-top">
      <div className="ticket-brand"><span className="brand-symbol">✦</span><span>CODE SOCIETY</span><i>ADMIT ONE</i></div>
      <div className="ticket-fields">
        <div className="ticket-field"><label>NAME</label><strong>{data.firstName || 'YOUR NAME'}</strong></div>
        <div className="ticket-field"><label>SURNAME</label><strong>{data.lastName || 'YOUR SURNAME'}</strong></div>
        <div className="ticket-field compact"><label>DATE</label><strong>OPEN INVITATION</strong></div>
        <div className="ticket-field compact"><label>TIME</label><strong>ALL DAY</strong></div>
        <div className="ticket-field compact"><label>ENTRY</label><strong>GENERAL</strong></div>
      </div>
      <div className="barcode-block"><svg ref={barcodeRef} /><span>{data.id}</span></div>
    </div>

    <div className="perforation"><span>✦</span><span>✦</span></div>

    <div className="ticket-middle">
      <div className="stamp stamp-left"><span>THE</span><b>MAKERS</b><span>COLLECTIVE</span><i>EST. 2024</i></div>
      <div className="stamp stamp-right"><CompassMark small/><span>EXPLORE<br/>WHAT'S NEXT</span></div>
      <RouteMap />
      <div className="passport-mark">CODE / CREATE / CONNECT</div>
    </div>

    <div className="ticket-bottom">
      <div className="departure-seal"><span>✦</span><b>WELCOME</b><span>TO THE SOCIETY</span><i>✈</i></div>
      <div className="ticket-title">CODE<br/>SOCIETY</div>
      <div className="ticket-tagline">{(data.tagline || 'THINK. CREATE. INNOVATE.').toUpperCase()}</div>
      <div className="ticket-mottos">
        <div><span>∞</span> NO LIMITS</div>
        <div><span>◎</span> BUILD YOUR FUTURE</div>
        <div><span>✳</span> THINK. CREATE. INNOVATE.</div>
        <div><span>↗</span> WELCOME ABOARD</div>
      </div>
      <CompassMark />
      <div className="serial">{data.id}</div>
      <div className="bottom-rule">A COMMUNITY FOR THE CURIOUS — EST. 2024</div>
    </div>
  </article>;
}

export default function App() {
  const [form, setForm] = useState(initial);
  const [ticket, setTicket] = useState({ ...initial, id: makeId() });
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const ticketRef = useRef(null);
  const update = (key) => (event) => setForm(prev => ({ ...prev, [key]: event.target.value }));
  const ready = useMemo(() => Boolean(form.firstName.trim() && form.lastName.trim()), [form]);

  const generate = (event) => {
    event.preventDefault();
    if (!ready) return;
    setTicket({ ...form, id: makeId() });
    setNotice('A fresh ticket has been issued.');
    window.setTimeout(() => setNotice(''), 2600);
  };

  const exportImage = async () => {
    if (!ticketRef.current || busy) return;
    setBusy(true); setNotice('Preparing your ticket…');
    try {
      await document.fonts.ready;
      const dataUrl = await toPng(ticketRef.current, { pixelRatio: 3, cacheBust: true, backgroundColor: '#4D1D24' });
      const link = document.createElement('a'); link.download = `${ticket.id.toLowerCase()}-code-society.png`; link.href = dataUrl; link.click();
      setNotice('PNG downloaded successfully.');
    } catch (error) { console.error(error); setNotice('PNG export failed. Please try again.'); }
    finally { setBusy(false); window.setTimeout(() => setNotice(''), 3200); }
  };

  const exportPdf = async () => {
    if (!ticketRef.current || busy) return;
    setBusy(true); setNotice('Preparing your PDF…');
    try {
      await document.fonts.ready;
      const dataUrl = await toPng(ticketRef.current, { pixelRatio: 3, cacheBust: true, backgroundColor: '#4D1D24' });
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [520, 1050], hotfixes: ['px_scaling'] });
      pdf.addImage(dataUrl, 'PNG', 0, 0, 520, 1050);
      pdf.save(`${ticket.id.toLowerCase()}-code-society.pdf`);
      setNotice('PDF downloaded successfully.');
    } catch (error) { console.error(error); setNotice('PDF export failed. Please try again.'); }
    finally { setBusy(false); window.setTimeout(() => setNotice(''), 3200); }
  };

  return <main className="app-shell">
    <header className="topbar"><a className="wordmark" href="#"><span>✦</span> THE CODE SOCIETY</a><div className="topbar-note">TICKET ATELIER <i/> ISSUE NO. 001</div></header>
    <section className="intro">
      <div className="eyebrow"><span/> A LITTLE SOMETHING TO REMEMBER</div>
      <h1>Make it <em>official.</em></h1>
      <p>Issue a keepsake for the people building what comes next.<br/>A personal pass to the Code Society experience.</p>
    </section>

    <section className="workspace">
      <form className="control-panel" onSubmit={generate}>
        <div className="panel-heading"><div><span className="section-index">01 / PERSONALISE</span><h2>Your details</h2></div><UserRound size={19}/></div>
        <label className="input-label">FIRST NAME<input value={form.firstName} onChange={update('firstName')} placeholder="e.g. Alex" maxLength={24} required /></label>
        <label className="input-label">LAST NAME<input value={form.lastName} onChange={update('lastName')} placeholder="e.g. Morgan" maxLength={24} required /></label>
        <label className="input-label">YOUR TAGLINE <span className="optional">OPTIONAL</span><textarea value={form.tagline} onChange={update('tagline')} placeholder="A line that feels like you…" maxLength={42} rows={2}/></label>
        <button className="issue-button" type="submit" disabled={!ready}><span>ISSUE NEW TICKET</span><ArrowRight size={17}/></button>
        <div className="panel-foot"><Sparkles size={14}/> Each issue gets its own unique ticket ID and barcode.</div>
      </form>

      <div className="preview-panel">
        <div className="preview-heading"><div><span className="section-index">02 / YOUR KEEPSAKE</span><h2>Ticket preview</h2></div><span className="live-pill"><i/> LIVE PREVIEW</span></div>
        <div className="ticket-stage"><TicketArtwork data={ticket} ticketRef={ticketRef}/></div>
        <div className="download-row">
          <button className="download-primary" onClick={exportImage} disabled={busy}><FileImage size={16}/>{busy ? 'PREPARING…' : 'DOWNLOAD PNG'}<ArrowDownToLine size={15}/></button>
          <button className="download-secondary" onClick={exportPdf} disabled={busy}><FileText size={16}/> PDF</button>
          <button className="refresh-button" onClick={() => {setForm(initial);setTicket({...initial,id:makeId()});setNotice('Ready for the next guest.');}} title="Reset for next ticket"><RefreshCw size={16}/></button>
        </div>
        <div className="download-note"><Check size={13}/> High-resolution export · ticket artwork only · no interface included</div>
        {notice && <div className="notice" role="status">{notice}</div>}
      </div>
    </section>
    <footer><span>✦ THE CODE SOCIETY</span><span>THINK. CREATE. INNOVATE.</span><span>MADE FOR THE NEXT GENERATION.</span></footer>
  </main>;
}
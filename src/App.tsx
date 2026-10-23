import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import birthdayPhoto from '@assets/r5_1792722353802.png';
import birthdaySticker from '@assets/Screenshot_20261023-084045_1792723896445.png';
import { ArrowDown, ArrowLeft, ArrowRight, Gift, Heart, RotateCcw, Sparkles } from 'lucide-react';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

function playFirecrackerSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const master = context.createGain();
    master.gain.setValueAtTime(0.0001, context.currentTime);
    master.gain.exponentialRampToValueAtTime(0.42, context.currentTime + 0.015);
    master.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.55);
    master.connect(context.destination);
    const boom = context.createOscillator();
    boom.type = 'sine';
    boom.frequency.setValueAtTime(170, context.currentTime);
    boom.frequency.exponentialRampToValueAtTime(46, context.currentTime + 0.42);
    boom.connect(master);
    boom.start(); boom.stop(context.currentTime + 0.48);
    const buffer = context.createBuffer(1, context.sampleRate * 0.28, context.sampleRate);
    const noise = buffer.getChannelData(0);
    for (let index = 0; index < noise.length; index += 1) noise[index] = (Math.random() * 2 - 1) * (1 - index / noise.length);
    const crackle = context.createBufferSource();
    const crackleGain = context.createGain();
    crackleGain.gain.setValueAtTime(0.0001, context.currentTime);
    crackleGain.gain.exponentialRampToValueAtTime(0.55, context.currentTime + 0.02);
    crackleGain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.28);
    crackle.buffer = buffer; crackle.connect(crackleGain); crackleGain.connect(master); crackle.start();
    window.setTimeout(() => { void context.close(); }, 700);
  } catch { /* Sound is an optional enhancement; the visual burst still runs. */ }
}

function TypingText({ text, delay = 0, speed = 24 }: { text: string; delay?: number; speed?: number }) {
  const [visible, setVisible] = useState('');
  useEffect(() => {
    let interval: number | undefined;
    const start = window.setTimeout(() => {
      let index = 0;
      interval = window.setInterval(() => {
        index += 1;
        setVisible(text.slice(0, index));
        if (index >= text.length && interval) window.clearInterval(interval);
      }, speed);
    }, delay);
    return () => { window.clearTimeout(start); if (interval) window.clearInterval(interval); };
  }, [delay, speed, text]);
  return <span className="typing-text">{visible}<span className="typing-caret" aria-hidden="true">|</span></span>;
}

function Confetti({ count = 34 }: { count?: number }) {
  return <div className="confetti-layer" aria-hidden="true">
    {Array.from({ length: count }, (_, index) => {
      const angle = (Math.PI * 2 * index) / count;
      const distance = 150 + (index % 4) * 32;
      const style = {
        '--dx': `${Math.cos(angle) * distance}px`, '--dy': `${Math.sin(angle) * distance}px`,
        '--spin': `${(index % 2 ? 1 : -1) * (200 + (index % 5) * 90)}deg`, '--delay': `${(index % 6) * 13}ms`,
      } as CSSProperties;
      return <span className={`sprinkle sprinkle-${index % 5}`} style={style} key={index} />;
    })}
  </div>;
}

const introSlides = [
  { kicker: 'A LITTLE SURPRISE, MADE WITH LOVE', title: <>Today is<br /><em>all about you.</em></>, caption: 'Something lovely is on its way', tone: 'intro-tone-rose' },
  { kicker: 'A BRIGHT LITTLE MOMENT', title: <>A day made<br /><em>for smiling.</em></>, caption: 'Keep this feeling close', tone: 'intro-tone-gold' },
  { kicker: 'A NEW YEAR OF YOU', title: <>More dreams,<br /><em>more magic.</em></>, caption: 'A fresh chapter is waiting', tone: 'intro-tone-mint' },
  { kicker: 'MADE JUST FOR ARIYAN', title: <>Your kind of<br /><em>beautiful.</em></>, caption: 'One last little surprise', tone: 'intro-tone-blue' },
];

function Home() {
  const [, navigate] = useLocation();
  const [stage, setStage] = useState(0);
  const [introVariant, setIntroVariant] = useState(0);
  const [burstKey, setBurstKey] = useState(0);
  useEffect(() => {
    if (stage !== 0) return;
    const timer = window.setTimeout(() => {
      if (introVariant < introSlides.length - 1) setIntroVariant((variant) => variant + 1);
      else setStage(1);
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1650);
    return () => window.clearTimeout(timer);
  }, [stage, introVariant]);
  useEffect(() => {
    if (!burstKey) return;
    const timer = window.setTimeout(() => setBurstKey(0), 1600);
    return () => window.clearTimeout(timer);
  }, [burstKey]);
  const enterBirthday = () => {
    try { navigator.vibrate?.([55, 35, 90]); } catch { /* optional enhancement */ }
    setBurstKey((key) => key + 1); setStage(2);
  };
  const openWish = () => { playFirecrackerSound(); try { navigator.vibrate?.([90, 35, 140, 35, 210]); } catch { /* optional enhancement */ } navigate('/wish'); };
  const replay = () => { setIntroVariant(0); setStage(0); setBurstKey(0); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  return <main className={`birthday-page stage-${stage}`}>
    <div className={`opening-screen${stage < 2 ? ' opening-visible' : ' opening-gone'}`} aria-hidden={stage >= 2}>
      <div className="opening-bunting party-bunting" aria-hidden="true"><span /><span /><span /><span /><span /><span /><span /></div>
      <div className="party-balloon balloon-left" aria-hidden="true"><i /></div><div className="party-balloon balloon-right" aria-hidden="true"><i /></div>
      <div className="opening-ring ring-a" /><div className="opening-ring ring-b" /><div className="opening-confetti confetti-a" /><div className="opening-confetti confetti-b" /><div className="opening-confetti confetti-c" />
      <div className="intro-corner intro-corner-tl" aria-hidden="true"><span /><i /><b /></div>
      <div className="intro-corner intro-corner-tr" aria-hidden="true"><span /><i /><b /></div>
      <div className="intro-corner intro-corner-bl" aria-hidden="true"><span /><i /><b /></div>
      <div className="intro-corner intro-corner-br" aria-hidden="true"><span /><i /><b /></div>
      <img src="/birthday-cake.gif" alt="" className="opening-cake" />
      <div className="intro-candles" aria-hidden="true"><span /><span /><span /><span /></div>
      <div className={`opening-message opening-step-${stage} ${stage === 0 ? introSlides[introVariant].tone : 'intro-tone-final'}`}>
        {stage === 0 ? <><p className="opening-kicker">{introSlides[introVariant].kicker}</p><h1 className="opening-title" key={introVariant}>{introSlides[introVariant].title}</h1><p className="opening-caption">{introSlides[introVariant].caption}</p></> : <>
          <p className="opening-kicker">A VERY HAPPY BIRTHDAY TO</p><h2 className="opening-name">Ariyan Shanto</h2><p className="opening-date">23/10/2009</p><span className="opening-divider" /><p className="opening-caption">Your day. Your moment. Your little surprise.</p>
          <button className="go-inside" type="button" onClick={enterBirthday} data-testid="button-go-inside">Go to inside <ArrowDown size={15} /></button>
        </>}
      </div>
      <button className="skip-intro" type="button" onClick={enterBirthday} tabIndex={stage >= 2 ? -1 : 0} data-testid="button-skip-intro">Skip intro <ArrowDown size={14} /></button>
      <span className="opening-index" aria-hidden="true">A · {stage === 0 ? `0${introVariant + 1} / 04` : '05'}</span>
      {stage === 0 && <div className="intro-progress" aria-hidden="true">{introSlides.map((_, index) => <span className={index === introVariant ? 'is-active' : ''} key={index} />)}</div>}
    </div>
    <div className={`birthday-content${stage === 2 ? ' content-visible' : ' content-hidden'}`} aria-hidden={stage !== 2}>
      <div className="party-bunting page-bunting" aria-hidden="true"><span /><span /><span /><span /><span /><span /><span /></div>
      <header className="topline"><span className="topline-mark" aria-hidden="true">A</span><span>A LITTLE CELEBRATION</span><span className="topline-date">23/10/2009</span></header>
      <section className="hero hero-full" aria-labelledby="birthday-title">
        <div className="party-balloon hero-balloon-one" aria-hidden="true"><i /></div><div className="party-balloon hero-balloon-two" aria-hidden="true"><i /></div>
        <div className="hero-copy"><p className="eyebrow"><span className="eyebrow-line" />IT'S YOUR DAY</p><h1 id="birthday-title" className="hero-title">Happy Birthday</h1><span className="hero-name">Ariyan Shanto</span><p className="hero-note">Here's to a day filled with the kind of joy you bring to everyone around you.</p><div className="hero-meta"><span className="meta-rule" /><span>23/10/2009</span><span className="meta-dot">·</span><span>Made just for you</span></div>
          <button className="wish-button" type="button" onClick={openWish} data-testid="button-open-wish"><span className="button-icon"><Gift size={17} strokeWidth={1.8} /></span>Open your wish note<span className="button-arrow" aria-hidden="true">↗</span></button>
        </div>
        <div className="portrait-wrap"><div className="portrait-orbit orbit-one" aria-hidden="true" /><div className="portrait-orbit orbit-two" aria-hidden="true" /><button className="portrait-frame portrait-link" type="button" onClick={openWish} aria-label="Open Ariyan's wish note"><img src={birthdayPhoto} alt="Ariyan surrounded by bright flowers" className="portrait-photo" data-testid="img-birthday-photo" /></button><img className="birthday-sticker" src={birthdaySticker} alt="" aria-hidden="true" /><span className="photo-caption">Tap the photo to open a little more love</span></div>
        <button className="scroll-cue" type="button" onClick={openWish}><span>A little more</span><ArrowDown size={14} strokeWidth={1.6} /></button>
      </section>
      <footer className="birthday-footer birthday-footer-single"><p className="copyright-line">© 2026 All Right reserved • <a href="https://t.me/infinity_codex" target="_blank" rel="noopener noreferrer">—͟͞͞𝗬𝗨𝗧𝗧𝗔 ⸙</a></p><button className="replay-button" type="button" onClick={replay} data-testid="button-replay-intro"><RotateCcw size={14} /> Replay intro</button></footer>
    </div>
    {burstKey > 0 && <Confetti key={burstKey} />}
  </main>;
}

function WishPageBurst() {
  const colors = ['#ec6692', '#ffd978', '#9ddfc9', '#a9d6f1', '#ca3e70', '#f4a6bd'];
  return <div className="wish-page-burst" aria-hidden="true">
    {Array.from({ length: 42 }, (_, index) => {
      const angle = (Math.PI * 2 * index) / 42;
      const distance = 42 + (index % 5) * 7;
      const style = {
        '--burst-x': `${Math.cos(angle) * distance}vw`,
        '--burst-y': `${Math.sin(angle) * distance}vh`,
        '--burst-delay': `${(index % 8) * 24}ms`,
        '--burst-color': colors[index % colors.length],
        '--burst-rotate': `${(index % 2 ? 1 : -1) * (180 + index * 13)}deg`,
      } as CSSProperties;
      return <i className={`wish-burst-particle particle-${index % 4}`} style={style} key={index} />;
    })}
  </div>;
}

function WishPage() {
  const [, navigate] = useLocation();
  return <main className="wish-page"><WishPageBurst /><div className="wish-glow wish-glow-one" /><div className="wish-glow wish-glow-two" />
    <header className="wish-nav"><button type="button" className="back-button" onClick={() => navigate('/')}><ArrowLeft size={16} /> Back to celebration</button><span className="wish-nav-mark">A · 02</span></header>
    <section className="wish-intro"><p className="wish-kicker"><Sparkles size={15} /> A NOTE FROM THE HEART</p><h1>For you,<br /><em>Ariyan.</em></h1><p className="wish-lede"><TypingText text="A tiny page for the big, bright feeling of celebrating you." delay={380} speed={22} /></p></section>
    <section className="wish-grid" aria-label="Birthday wish and GIFs"><div className="wish-letter-card"><img className="wish-mini-gif" src="/peach-goma.gif" alt="Cute Peach and Goma cat animation" /><div className="letter-card-top"><Heart size={17} fill="currentColor" /> 23 · 10 · 2009</div><h2>Your day.<br /><em>Your kind of joy.</em></h2><p><TypingText text="A birthday is more than candles and cake. It is another year of stories, small wins, new beginnings, and all the beautiful possibilities waiting for you." delay={850} speed={18} /></p><p><TypingText text="May your mornings bring fresh reasons to smile, your plans turn into favourite memories, and the people you love stay close. Keep being exactly who you are — wonderful." delay={2700} speed={18} /></p><div className="letter-signoff"><span className="signoff-line" /><span>With so much love</span></div></div><div className="gif-gallery"><figure className="gif-card gif-card-main"><img src="/heart-kiss.gif" alt="A white cat surrounded by red hearts" /><figcaption>Sending you a pocketful of happy hearts</figcaption></figure><figure className="gif-card gif-card-cake"><img src="/birthday-cake.gif" alt="Animated birthday cake" /><figcaption>More cake. More wishes. More you.</figcaption></figure><div className="floating-heart heart-one">♥</div><div className="floating-heart heart-two">♥</div><div className="floating-heart heart-three">♥</div></div></section>
    <button type="button" className="wish-next" onClick={() => navigate('/')}><span>Keep this little wish close</span><ArrowRight size={16} /></button>
  </main>;
}

function Router() { return <RoutedErrorBoundary><Switch><Route path="/" component={Home} /><Route path="/wish" component={WishPage} /><Route component={NotFound} /></Switch></RoutedErrorBoundary>; }
function RoutedErrorBoundary({ children }: { children: ReactNode }) { const [location] = useLocation(); return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>; }
function App() { return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>; }
export default App;

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Menu, 
  X, 
  Info, 
  ShieldCheck, 
  Facebook, 
  Youtube, 
  Globe, 
  Phone, 
  Mail, 
  ArrowLeft,
  Radio as RadioIcon,
  Volume2,
  VolumeX,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
type Screen = 'home' | 'about' | 'privacy';

// --- Constants ---
const DEFAULT_STREAM_URL = "https://stream.zeno.fm/32mkn38u6whvv"; // Placeholder - User should replace with actual Zeno FM URL
const RADIO_NAME = "RÁDIO C. MW FM 92.5 MHz";
const RADIO_FULL_NAME = "Rádio Comunitária Mwana Wamudara";
const CONTACT_PHONE = "+2588640403000";
const CONTACT_EMAIL = "radiomwfm92.5@gmail.com";
const FACEBOOK_URL = "https://facebook.com/radiomwfm";
const YOUTUBE_URL = "https://youtube.com/radiomwfm";
const WEBSITE_URL = "https://radiomwfm.com";

// Image Assets - User should upload these files to the root directory
const LOGO_IMAGE = "/logo.png"; 
const BACKGROUND_IMAGE = "/backgroud.png"; // Matching the user's filename typo

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.9);
  const [showSplash, setShowSplash] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [streamUrl, setStreamUrl] = useState(DEFAULT_STREAM_URL);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load URL from localStorage if available
  useEffect(() => {
    const savedUrl = localStorage.getItem('radio_stream_url');
    if (savedUrl) {
      setStreamUrl(savedUrl);
    }
  }, []);

  // Splash Screen Timer
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Audio Handling
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.crossOrigin = "anonymous";
      audioRef.current.preload = "none";
    }

    const audio = audioRef.current;

    const handlePlay = () => {
      setIsPlaying(true);
      setIsLoading(false);
      setError(null);
    };
    const handlePause = () => setIsPlaying(false);
    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = (e: any) => {
      console.error("Audio Error Event:", e);
      setIsPlaying(false);
      setIsLoading(false);
      
      // Detailed error messages
      const errorCode = audio.error?.code;
      if (errorCode === 1) setError("Erro de conexão");
      else if (errorCode === 2) setError("Erro de conexão");
      else if (errorCode === 3) setError("Erro de conexão");
      else if (errorCode === 4) setError("Erro de conexão");
      else setError("Erro de conexão");
    };

    audio.addEventListener('playing', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('playing', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = "";
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      // Clear the source to stop downloading data
      audioRef.current.removeAttribute('src');
      audioRef.current.load();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      setError(null);
      
      try {
        // Zeno FM streams often work better with a semicolon or .mp3 suffix
        // We'll try to append a cache buster too
        const baseUrl = streamUrl.split('?')[0].split(';')[0];
        const finalUrl = `${baseUrl}${baseUrl.endsWith('/') ? '' : '/'}?t=${Date.now()}`;
        
        audioRef.current.src = finalUrl;
        audioRef.current.load();
        
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.error("Playback error:", err);
            setIsLoading(false);
            setIsPlaying(false);
            setError("Erro de conexão");
          });
        }
      } catch (e) {
        console.error("Toggle play error:", e);
        setIsLoading(false);
        setError("Erro inesperado ao conectar.");
      }
    }
  };

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen);
    setIsDrawerOpen(false);
  };

  const openExternal = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsDrawerOpen(false);
  };

  // --- Components ---

  const SplashScreen = () => (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-radio-dark"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-48 h-48 mb-6"
      >
        <div className="absolute inset-0 rounded-full bg-radio-red opacity-20 animate-ping"></div>
        <div className="relative z-10 w-full h-full rounded-full border-4 border-radio-red bg-white p-4 flex items-center justify-center overflow-hidden shadow-2xl shadow-radio-red/20">
          <img 
            src={LOGO_IMAGE} 
            alt="Logo" 
            className="w-full h-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://picsum.photos/seed/radio-logo/400/400";
            }}
            referrerPolicy="no-referrer"
          />
        </div>
      </motion.div>
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-2xl font-bold tracking-wider text-white"
      >
        {RADIO_NAME}
      </motion.h1>
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: 200 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="h-1 bg-radio-red mt-4 rounded-full overflow-hidden"
      >
        <div className="h-full bg-white w-1/3 animate-shimmer"></div>
      </motion.div>
    </motion.div>
  );

  const NavigationDrawer = () => (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 z-50 w-80 bg-white text-radio-black shadow-2xl"
          >
            <div className="h-48 bg-radio-red p-6 flex flex-col justify-end relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <button onClick={() => setIsDrawerOpen(false)} className="text-white/80 hover:text-white">
                  <X size={24} />
                </button>
              </div>
              <div className="w-16 h-16 rounded-lg bg-white p-2 mb-4 shadow-lg">
                <img 
                  src={LOGO_IMAGE} 
                  alt="Logo" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://picsum.photos/seed/radio-logo/200/200";
                  }}
                  referrerPolicy="no-referrer"
                />
              </div>
              <h2 className="text-white font-bold text-lg leading-tight">{RADIO_NAME}</h2>
              <p className="text-white/70 text-xs mt-1">Sintonize sua vida</p>
            </div>

            <nav className="py-4">
              <DrawerItem icon={<Phone size={20} />} label="Contate-nos" onClick={() => openExternal(`tel:${CONTACT_PHONE}`)} />
              <DrawerItem icon={<Globe size={20} />} label="Site oficial" onClick={() => openExternal(WEBSITE_URL)} />
              <DrawerItem icon={<Facebook size={20} />} label="Facebook" onClick={() => openExternal(FACEBOOK_URL)} />
              <DrawerItem icon={<Youtube size={20} />} label="YouTube" onClick={() => openExternal(YOUTUBE_URL)} />
              <div className="h-px bg-gray-100 my-2 mx-4" />
              <DrawerItem icon={<ShieldCheck size={20} />} label="Política de Privacidade" onClick={() => navigateTo('privacy')} />
              <DrawerItem icon={<Info size={20} />} label="Sobre a Rádio" onClick={() => navigateTo('about')} />
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-6 text-center text-gray-400 text-xs">
              Versão 1.0.0 &copy; 2024
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  const DrawerItem = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) => (
    <button 
      onClick={onClick}
      className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors text-left"
    >
      <span className="text-radio-red">{icon}</span>
      <span className="font-medium text-gray-700">{label}</span>
    </button>
  );

  const Header = ({ title, showBack = false }: { title: string, showBack?: boolean }) => (
    <header className="h-16 bg-radio-red flex items-center px-4 sticky top-0 z-30 shadow-md">
      {showBack ? (
        <button onClick={() => navigateTo('home')} className="p-2 -ml-2 text-white">
          <ArrowLeft size={24} />
        </button>
      ) : (
        <button onClick={() => setIsDrawerOpen(true)} className="p-2 -ml-2 text-white">
          <Menu size={24} />
        </button>
      )}
      <h1 className="ml-4 font-bold text-white truncate">{title}</h1>
      <div className="ml-auto flex gap-2">
        <button className="p-2 text-white/90">
          <Share2 size={20} />
        </button>
      </div>
    </header>
  );

  const HomeScreen = () => (
    <div className="flex flex-col min-h-[calc(100vh-64px)] relative">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        <img 
          src={BACKGROUND_IMAGE} 
          alt="Background" 
          className="w-full h-full object-cover opacity-60"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://picsum.photos/seed/radio-bg/1080/1920?blur=2";
          }}
          referrerPolicy="no-referrer"
        />
        {/* Subtle Logo in Background - Centered as requested */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
          <img 
            src={LOGO_IMAGE} 
            alt="" 
            className="w-3/4 object-contain"
            onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
          />
        </div>
        {/* "Black Part" - Stronger black overlay at top and bottom to match the user's image style */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center flex-grow p-8 text-center">
        {/* Logo Container */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-64 h-64 rounded-full border-8 border-white/10 bg-white p-6 shadow-2xl mb-12 relative"
        >
          <img 
            src={LOGO_IMAGE} 
            alt="Radio Logo" 
            className="w-full h-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://picsum.photos/seed/radio-logo/500/500";
            }}
            referrerPolicy="no-referrer"
          />
          {isPlaying && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-radio-red text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">
              No Ar
            </div>
          )}
        </motion.div>

        <h2 className="text-2xl font-black text-white mb-2 tracking-tight">{RADIO_NAME}</h2>
        <p className="text-radio-red font-medium mb-12 uppercase tracking-widest text-sm">92.5 MHz • Ao Vivo</p>

        {/* Player Controls */}
        <div className="flex flex-col items-center gap-8 w-full max-w-xs">
          <div className="relative">
            {isLoading && (
              <div className="absolute inset-0 rounded-full border-4 border-radio-red border-t-transparent animate-spin"></div>
            )}
            <button 
              onClick={togglePlay}
              disabled={isLoading}
              className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-95 ${
                isPlaying ? 'bg-white text-radio-red' : 'bg-radio-red text-white'
              } ${isLoading ? 'opacity-50' : 'opacity-100'}`}
            >
              {isPlaying ? <Pause size={48} fill="currentColor" /> : <Play size={48} fill="currentColor" className="ml-2" />}
            </button>
          </div>

          <div className="w-full space-y-4">
            <div className="flex items-center justify-between text-xs text-white/60 font-medium uppercase tracking-wider">
              <span>{isPlaying ? 'A reproduzir' : 'Parado'}</span>
              <span>Volume: {Math.round(volume * 100)}%</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button onClick={() => setIsMuted(!isMuted)} className="text-white/80 hover:text-white">
                {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="flex-grow accent-radio-red h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm"
          >
            {error}
          </motion.div>
        )}
      </div>

      {/* Mini Player / Status Bar */}
      <div className="relative z-10 bg-radio-black/90 backdrop-blur-md border-t border-white/5 p-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded bg-white p-1">
          <img 
            src={LOGO_IMAGE} 
            alt="Logo" 
            className="w-full h-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://picsum.photos/seed/radio-logo/100/100";
            }}
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex-grow overflow-hidden">
          <p className="text-white text-sm font-bold truncate">{RADIO_NAME}</p>
          <p className="text-white/50 text-xs truncate">Sintonize sua vida</p>
        </div>
        <div className="flex items-center gap-2">
          {isPlaying && (
            <div className="flex items-end gap-0.5 h-4">
              <div className="w-1 bg-radio-red animate-bounce" style={{ animationDelay: '0s', height: '60%' }}></div>
              <div className="w-1 bg-radio-red animate-bounce" style={{ animationDelay: '0.2s', height: '100%' }}></div>
              <div className="w-1 bg-radio-red animate-bounce" style={{ animationDelay: '0.1s', height: '40%' }}></div>
              <div className="w-1 bg-radio-red animate-bounce" style={{ animationDelay: '0.3s', height: '80%' }}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const AboutScreen = () => (
    <div className="p-6 space-y-8 bg-white text-gray-800 min-h-[calc(100vh-64px)]">
      <div className="text-center mb-8">
        <div className="w-24 h-24 rounded-2xl bg-radio-red/5 p-4 mx-auto mb-4 flex items-center justify-center">
          <RadioIcon size={48} className="text-radio-red" />
        </div>
        <h2 className="text-2xl font-bold text-radio-black">Sobre a Rádio</h2>
      </div>

      <section className="space-y-3">
        <div className="flex items-center gap-2 text-radio-red">
          <Info size={20} />
          <h3 className="font-bold uppercase tracking-wider text-sm">Quem somos</h3>
        </div>
        <p className="text-gray-600 leading-relaxed">
          A {RADIO_FULL_NAME} é uma emissora dedicada a informar, educar e entreter a comunidade local.
          Com uma programação variada, a rádio promove música, cultura, notícias, programas educativos e conteúdos de interesse social.
        </p>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2 text-radio-red">
          <Globe size={20} />
          <h3 className="font-bold uppercase tracking-wider text-sm">Missão</h3>
        </div>
        <p className="text-gray-600 leading-relaxed">
          Nossa missão é dar voz à comunidade, promover a cultura local e levar informação de qualidade, contribuindo para o desenvolvimento social e cultural.
        </p>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2 text-radio-red">
          <Phone size={20} />
          <h3 className="font-bold uppercase tracking-wider text-sm">Contato</h3>
        </div>
        <div className="space-y-2">
          <button 
            onClick={() => openExternal(`tel:${CONTACT_PHONE}`)}
            className="flex items-center gap-3 w-full p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
              <Phone size={16} />
            </div>
            <div className="text-left">
              <p className="text-[10px] text-gray-400 uppercase font-bold">Telefone / WhatsApp</p>
              <p className="text-sm font-medium">{CONTACT_PHONE}</p>
            </div>
          </button>
          
          <button 
            onClick={() => openExternal(`mailto:${CONTACT_EMAIL}`)}
            className="flex items-center gap-3 w-full p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600">
              <Mail size={16} />
            </div>
            <div className="text-left">
              <p className="text-[10px] text-gray-400 uppercase font-bold">E-mail</p>
              <p className="text-sm font-medium">{CONTACT_EMAIL}</p>
            </div>
          </button>
        </div>
      </section>

      <button 
        onClick={() => navigateTo('home')}
        className="w-full py-4 bg-radio-black text-white rounded-xl font-bold shadow-lg shadow-black/20 active:scale-95 transition-transform"
      >
        Voltar
      </button>
    </div>
  );

  const PrivacyScreen = () => (
    <div className="p-6 space-y-8 bg-white text-gray-800 min-h-[calc(100vh-64px)]">
      <div className="text-center mb-8">
        <div className="w-24 h-24 rounded-2xl bg-radio-red/5 p-4 mx-auto mb-4 flex items-center justify-center">
          <ShieldCheck size={48} className="text-radio-red" />
        </div>
        <h2 className="text-2xl font-bold text-radio-black">Política de Privacidade</h2>
      </div>

      <div className="space-y-6 text-gray-600 leading-relaxed text-sm">
        <p>
          Esta Política de Privacidade descreve como as informações são tratadas no aplicativo {RADIO_FULL_NAME}.
        </p>

        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="mt-1 text-radio-red"><ShieldCheck size={16} /></div>
            <p>O aplicativo <strong>não coleta, armazena ou compartilha</strong> dados pessoais dos usuários.</p>
          </div>
          <div className="flex gap-3">
            <div className="mt-1 text-radio-red"><ShieldCheck size={16} /></div>
            <p>O aplicativo apenas transmite áudio ao vivo por meio de streaming de rádio online.</p>
          </div>
          <div className="flex gap-3">
            <div className="mt-1 text-radio-red"><ShieldCheck size={16} /></div>
            <p>Nenhuma informação como nome, e-mail, localização ou dados do dispositivo é coletada.</p>
          </div>
          <div className="flex gap-3">
            <div className="mt-1 text-radio-red"><ShieldCheck size={16} /></div>
            <p>Links externos, como site, Facebook ou YouTube, podem abrir conteúdos de terceiros, que possuem suas próprias políticas de privacidade.</p>
          </div>
        </div>

        <p className="pt-4 border-t border-gray-100 italic">
          Ao utilizar este aplicativo, você concorda com esta Política de Privacidade.
        </p>
      </div>

      <button 
        onClick={() => navigateTo('home')}
        className="w-full py-4 bg-radio-black text-white rounded-xl font-bold shadow-lg shadow-black/20 active:scale-95 transition-transform"
      >
        Voltar
      </button>
    </div>
  );

  return (
    <div className="max-w-md mx-auto min-h-screen bg-radio-dark shadow-2xl relative overflow-hidden">
      <AnimatePresence>
        {showSplash && <SplashScreen key="splash" />}
      </AnimatePresence>

      <NavigationDrawer />

      <Header 
        title={currentScreen === 'home' ? RADIO_NAME : currentScreen === 'about' ? 'Sobre a Rádio' : 'Privacidade'} 
        showBack={currentScreen !== 'home'}
      />

      <main className="relative">
        <AnimatePresence mode="wait">
          {currentScreen === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <HomeScreen />
            </motion.div>
          )}
          {currentScreen === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <AboutScreen />
            </motion.div>
          )}
          {currentScreen === 'privacy' && (
            <motion.div
              key="privacy"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <PrivacyScreen />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

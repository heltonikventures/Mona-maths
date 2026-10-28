import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { soundManager } from '../../utils/sound';

export const PWAInstallButton: React.FC<{ variant?: 'header' | 'banner' }> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);
  const [guidePlatform, setGuidePlatform] = useState<'android' | 'ios'>('android');
  const [copied, setCopied] = useState(false);

  // The permanent shared link for installing on devices
  const sharedUrl = 'https://ais-pre-5jxazeukmvhk2gym37eysd-43240112854.europe-west2.run.app';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(sharedUrl)}&bgcolor=FFFFFF&color=1E1B4B`;

  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    soundManager.playClick();
    if (isInstallable) {
      const outcome = await install();
      if (!outcome) {
        setGuidePlatform(isIOS ? 'ios' : 'android');
        setShowGuide(true);
      }
    } else {
      setGuidePlatform(isIOS ? 'ios' : 'android');
      setShowGuide(true);
    }
  };

  const handleCopyLink = () => {
    soundManager.playSparkle();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(sharedUrl);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      {/* Primary Install Trigger Button */}
      <button
        onClick={handleInstallClick}
        title="Install Maths Adventure on Android, iPad or PC"
        className={`flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 font-black text-white shadow-md hover:brightness-110 active:scale-95 transition-all ${
          variant === 'header'
            ? 'px-3 py-1.5 text-xs sm:text-sm'
            : 'px-4 py-2 text-sm sm:text-base'
        }`}
      >
        <span className="text-base animate-bounce">📲</span>
        <span>Install App</span>
      </button>

      {/* Install on Device Guide Modal (Android & iOS + QR Code) */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs animate-pop-in select-none">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border-4 border-amber-300 text-center relative max-h-[92vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => {
                soundManager.playClick();
                setShowGuide(false);
              }}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-black flex items-center justify-center transition"
            >
              ✕
            </button>

            <div className="text-4xl mb-1">🤖📱</div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
              Install Maths Adventure
            </h3>
            <p className="text-xs font-bold text-slate-500 mb-4">
              Play full-screen offline anytime on phone or tablet!
            </p>

            {/* Platform Selector Tabs */}
            <div className="flex gap-2 p-1 bg-amber-100 rounded-2xl border border-amber-300 mb-4">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setGuidePlatform('android');
                }}
                className={`flex-1 py-1.5 rounded-xl text-xs font-black transition ${
                  guidePlatform === 'android'
                    ? 'bg-amber-400 text-amber-950 shadow-sm'
                    : 'text-amber-900 hover:text-amber-950'
                }`}
              >
                🤖 Android / Chrome
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setGuidePlatform('ios');
                }}
                className={`flex-1 py-1.5 rounded-xl text-xs font-black transition ${
                  guidePlatform === 'ios'
                    ? 'bg-amber-400 text-amber-950 shadow-sm'
                    : 'text-amber-900 hover:text-amber-950'
                }`}
              >
                🍎 iPhone / iPad
              </button>
            </div>

            {/* Android Instructions */}
            {guidePlatform === 'android' && (
              <div className="text-left bg-emerald-50 p-4 rounded-2xl border-2 border-emerald-200 text-xs sm:text-sm font-semibold text-emerald-950 space-y-2 mb-4 leading-relaxed">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <span>Open the link in <strong>Google Chrome</strong> on your Android device.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <span>Tap the green <strong>"Install App 📲"</strong> button at the top, or tap the <strong>Menu (⋮)</strong> at top-right.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <span>Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-white font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">4</span>
                  <span>Done! The app will install onto your home screen with its own full-screen app icon! 🎉</span>
                </div>
              </div>
            )}

            {/* iOS Instructions */}
            {guidePlatform === 'ios' && (
              <div className="text-left bg-amber-50 p-4 rounded-2xl border-2 border-amber-200 text-xs sm:text-sm font-semibold text-amber-950 space-y-2 mb-4 leading-relaxed">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <span>Open the link in <strong>Safari</strong> on iPhone or iPad.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <span>Tap the <strong>Share</strong> button (box with upward arrow) at bottom of screen.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <span>Scroll down and tap <strong>"Add to Home Screen ➕"</strong>.</span>
                </div>
              </div>
            )}

            {/* QR Code to scan with Android camera */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 mb-4 inline-block">
              <span className="text-xs font-black text-slate-700 block mb-2 uppercase tracking-wide">
                📷 Scan with Android Camera:
              </span>
              <img
                src={qrCodeUrl}
                alt="Scan to open on Android"
                className="w-36 h-36 mx-auto rounded-xl shadow-xs border-2 border-slate-300"
              />
            </div>

            {/* Direct Link Copy Box */}
            <div className="flex items-center gap-1.5 p-2 bg-slate-100 rounded-xl border border-slate-300 mb-4 text-xs font-mono">
              <input
                type="text"
                readOnly
                value={sharedUrl}
                className="flex-1 bg-transparent border-none text-[11px] text-slate-700 font-bold focus:outline-none truncate select-all"
              />
              <button
                onClick={handleCopyLink}
                className={`px-3 py-1 rounded-lg text-xs font-black transition shrink-0 ${
                  copied
                    ? 'bg-emerald-500 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {copied ? 'Copied! ✓' : 'Copy'}
              </button>
            </div>

            <button
              onClick={() => {
                soundManager.playClick();
                setShowGuide(false);
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-sm shadow-md hover:brightness-110 active:scale-95 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

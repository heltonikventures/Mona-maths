import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { soundManager } from '../../utils/sound';

export const PWAInstallButton: React.FC<{ variant?: 'header' | 'banner' }> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  const handleInstallClick = () => {
    soundManager.playClick();
    install();
  };

  if (isInstallable) {
    return (
      <button
        onClick={handleInstallClick}
        title="Install Maths Adventure on your device for offline play!"
        className={`flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 font-bold text-white shadow-md hover:brightness-110 active:scale-95 transition-all ${
          variant === 'header'
            ? 'px-3 py-1.5 text-xs sm:text-sm'
            : 'px-4 py-2 text-sm sm:text-base'
        }`}
      >
        <span className="text-base">📲</span>
        <span>Install App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => {
            soundManager.playClick();
            setShowIOSGuide(true);
          }}
          className="flex items-center gap-1.5 rounded-full bg-amber-100 border border-amber-300 px-3 py-1.5 text-xs font-bold text-amber-900 shadow-xs hover:bg-amber-200 transition"
        >
          <span>📲</span>
          <span>Install on iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-pop-in">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border-4 border-amber-300 text-center">
              <div className="text-4xl mb-2">📱</div>
              <h3 className="text-xl font-black text-slate-800 font-heading">Play Offline on iPad / iPhone!</h3>
              <p className="mt-3 text-sm font-semibold text-slate-600 text-left bg-amber-50 p-3.5 rounded-2xl border border-amber-200 leading-relaxed">
                1. Tap the <strong className="text-blue-600">Share button (square with arrow)</strong> at the bottom of Safari.<br />
                2. Scroll down and tap <strong className="text-emerald-700">Add to Home Screen ➕</strong>.<br />
                3. Open from your home screen anytime, even without Wi-Fi!
              </p>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setShowIOSGuide(false);
                }}
                className="mt-4 w-full rounded-2xl bg-amber-400 hover:bg-amber-500 py-2.5 font-black text-amber-950 shadow-md transition"
              >
                Got It! 👍
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};

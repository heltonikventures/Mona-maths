import React from 'react';
import { UserSettings } from '../../types';
import { soundManager } from '../../utils/sound';

interface SettingsModalProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  onClose: () => void;
  onRestartTutorial: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
  onRestartTutorial,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-pop-in select-none">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-300 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-black flex items-center justify-center transition"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 mx-auto flex items-center justify-center text-3xl shadow-sm mb-2">
            ⚙️
          </div>
          <h3 className="text-2xl font-black text-slate-900 font-heading">
            Game Settings & Accessibility
          </h3>
          <p className="text-xs font-bold text-slate-500">
            Tailor the sound, visuals, and reading experience
          </p>
        </div>

        <div className="space-y-4">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-amber-50 rounded-2xl border border-amber-200">
            <div>
              <h4 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                <span>🔊</span>
                <span>Sound Effects</span>
              </h4>
              <p className="text-xs font-semibold text-slate-500">
                Play pleasant chimes, fanfares, and clicks
              </p>
            </div>
            <button
              onClick={() => {
                soundManager.playClick();
                onUpdateSettings({ soundEnabled: !settings.soundEnabled });
              }}
              className={`w-12 h-7 rounded-full p-1 transition-colors ${
                settings.soundEnabled ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Large Text */}
          <div className="flex items-center justify-between p-3.5 bg-amber-50 rounded-2xl border border-amber-200">
            <div>
              <h4 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                <span>🔍</span>
                <span>Large Text Size</span>
              </h4>
              <p className="text-xs font-semibold text-slate-500">
                Enlarge reading fonts for easier touchscreen reading
              </p>
            </div>
            <button
              onClick={() => {
                soundManager.playClick();
                onUpdateSettings({ largeText: !settings.largeText });
              }}
              className={`w-12 h-7 rounded-full p-1 transition-colors ${
                settings.largeText ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.largeText ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between p-3.5 bg-amber-50 rounded-2xl border border-amber-200">
            <div>
              <h4 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                <span>👁️</span>
                <span>High Contrast Mode</span>
              </h4>
              <p className="text-xs font-semibold text-slate-500">
                Enhance edge clarity and color separation
              </p>
            </div>
            <button
              onClick={() => {
                soundManager.playClick();
                onUpdateSettings({ highContrast: !settings.highContrast });
              }}
              className={`w-12 h-7 rounded-full p-1 transition-colors ${
                settings.highContrast ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.highContrast ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between p-3.5 bg-amber-50 rounded-2xl border border-amber-200">
            <div>
              <h4 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                <span>🌿</span>
                <span>Reduced Motion</span>
              </h4>
              <p className="text-xs font-semibold text-slate-500">
                Minimize floating and bouncing animations
              </p>
            </div>
            <button
              onClick={() => {
                soundManager.playClick();
                onUpdateSettings({ reducedMotion: !settings.reducedMotion });
              }}
              className={`w-12 h-7 rounded-full p-1 transition-colors ${
                settings.reducedMotion ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.reducedMotion ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Friendly Leaderboard Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-amber-50 rounded-2xl border border-amber-200">
            <div>
              <h4 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                <span>🏆</span>
                <span>Friendly Leaderboard</span>
              </h4>
              <p className="text-xs font-semibold text-slate-500">
                Display encouraging peer improvement awards
              </p>
            </div>
            <button
              onClick={() => {
                soundManager.playClick();
                onUpdateSettings({ leaderboardEnabled: !settings.leaderboardEnabled });
              }}
              className={`w-12 h-7 rounded-full p-1 transition-colors ${
                settings.leaderboardEnabled ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.leaderboardEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Restart Tutorial */}
          <button
            onClick={() => {
              soundManager.playClick();
              onRestartTutorial();
              onClose();
            }}
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-2xl text-xs transition active:scale-95 border border-slate-300"
          >
            Replay Welcome Diagnostic & Avatar Setup 🔄
          </button>
        </div>

        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="mt-6 w-full py-3.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black rounded-2xl text-base shadow-md transition active:scale-95"
        >
          Save & Return to Adventure! 👍
        </button>
      </div>
    </div>
  );
};

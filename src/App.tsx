import React, { useState } from 'react';
import { AvatarShopModal } from './components/avatar/AvatarShopModal';
import { Header } from './components/common/Header';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { DailyChallengeModal } from './components/daily/DailyChallengeModal';
import { MathGameArena } from './components/game/MathGameArena';
import { HomeScreenDashboard } from './components/home/HomeScreenDashboard';
import { LeaderboardModal } from './components/leaderboard/LeaderboardModal';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { ParentTeacherModal } from './components/parent/ParentTeacherModal';
import { ProgressDashboard } from './components/progress/ProgressDashboard';
import { SettingsModal } from './components/settings/SettingsModal';
import { AdventureWorldMap } from './components/world/AdventureWorldMap';
import { GameProvider, useGame } from './context/GameContext';
import { GameMode, MathTopic } from './types';
import { soundManager } from './utils/sound';

function MainApp() {
  const {
    playerName,
    avatar,
    updateAvatar,
    guideCharacter,
    setGuideCharacter,
    isOnboarded,
    completeOnboarding,
    level,
    stars,
    coins,
    streak,
    addCoins,
    addStars,
    realmProgress,
    unlockLevel,
    stats,
    recordAnswer,
    badges,
    shopGear,
    buyShopItem,
    dailyQuests,
    claimDailyQuest,
    classroom,
    updateClassroom,
    settings,
    updateSettings,
    recentRewardModal,
    dismissRewardModal,
    resetAllData,
  } = useGame();

  // Active Main View: 'home' | 'map' | 'game'
  const [currentView, setCurrentView] = useState<'home' | 'map' | 'game'>('home');

  // Active Game Session Config
  const [activeGame, setActiveGame] = useState<{
    topic: MathTopic;
    mode: GameMode;
    levelIndex: number;
  }>({
    topic: 'addition',
    mode: 'adventure',
    levelIndex: 0,
  });

  // Modals state
  const [showShop, setShowShop] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [showParent, setShowParent] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showDaily, setShowDaily] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [forceShowOnboarding, setForceShowOnboarding] = useState(false);

  const handleStartGame = (topic: MathTopic, mode: GameMode = 'adventure', levelIndex = 0) => {
    setActiveGame({ topic, mode, levelIndex });
    setCurrentView('game');
  };

  const handleLevelComplete = (starsEarned: number, coinsEarned: number) => {
    unlockLevel(activeGame.topic, activeGame.levelIndex, starsEarned);
    addStars(starsEarned);
    addCoins(coinsEarned);
    setCurrentView('map');
  };

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/50 text-slate-800">
      {/* Top Header Bar */}
      <Header
        onGoHome={() => setCurrentView('home')}
        onOpenShop={() => setShowShop(true)}
        onOpenProgress={() => setShowProgress(true)}
        onOpenSettings={() => setShowSettings(true)}
        onOpenParent={() => setShowParent(true)}
        onOpenDaily={() => setShowDaily(true)}
      />

      {/* Main View Switcher */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeScreenDashboard
            playerName={playerName}
            avatar={avatar}
            guideCharacterId={guideCharacter}
            level={level}
            stars={stars}
            coins={coins}
            streak={streak}
            badgesCount={badges.filter((b) => b.unlockedAt).length}
            onPlayNow={() => handleStartGame('addition', 'adventure', 0)}
            onOpenMap={() => setCurrentView('map')}
            onOpenTrophies={() => setShowProgress(true)}
            onOpenProgress={() => setShowProgress(true)}
            onOpenShop={() => setShowShop(true)}
            onOpenSettings={() => setShowSettings(true)}
            onOpenDaily={() => setShowDaily(true)}
            onOpenLeaderboard={() => setShowLeaderboard(true)}
            onStartSpecific={(topic) => handleStartGame(topic, 'adventure', 0)}
          />
        )}

        {currentView === 'map' && (
          <AdventureWorldMap
            realmProgress={realmProgress}
            onStartGame={handleStartGame}
            onOpenQuickPlay={() => handleStartGame('addition', 'quickplay', 0)}
            onOpenDaily={() => setShowDaily(true)}
          />
        )}

        {currentView === 'game' && (
          <MathGameArena
            topic={activeGame.topic}
            mode={activeGame.mode}
            levelIndex={activeGame.levelIndex}
            onExit={() => setCurrentView('map')}
            onCompleteLevel={handleLevelComplete}
            playerAvatar={avatar}
            guideCharacterId={guideCharacter}
            currentLevel={level}
            recordAnswer={recordAnswer}
            addCoins={addCoins}
            addStars={addStars}
          />
        )}
      </main>

      {/* Offline Mode Banner */}
      <OfflineIndicator />

      {/* First-Time User Experience Onboarding */}
      {(!isOnboarded || forceShowOnboarding) && (
        <OnboardingModal
          onComplete={(name, age, startingLevel, initialAvatar, guide) => {
            completeOnboarding(name, age, startingLevel, initialAvatar);
            if (guide) setGuideCharacter(guide);
            setForceShowOnboarding(false);
          }}
        />
      )}

      {/* Avatar Wardrobe & Gear Shop Modal */}
      {showShop && (
        <AvatarShopModal
          avatar={avatar}
          onUpdateAvatar={updateAvatar}
          coins={coins}
          shopGear={shopGear}
          onBuyItem={buyShopItem}
          guideCharacterId={guideCharacter}
          onSelectGuide={setGuideCharacter}
          onClose={() => setShowShop(false)}
        />
      )}

      {/* Progress & Badges Dashboard Modal */}
      {showProgress && (
        <ProgressDashboard
          stats={stats}
          badges={badges}
          level={level}
          stars={stars}
          coins={coins}
          streak={streak}
          onClose={() => setShowProgress(false)}
        />
      )}

      {/* Parent / Teacher Dashboard with Grown-up PIN Gate */}
      {showParent && (
        <ParentTeacherModal
          stats={stats}
          level={level}
          streak={streak}
          classroom={classroom}
          onUpdateClassroom={updateClassroom}
          onClose={() => setShowParent(false)}
          onResetData={resetAllData}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={updateSettings}
          onClose={() => setShowSettings(false)}
          onRestartTutorial={() => setForceShowOnboarding(true)}
        />
      )}

      {/* Daily Quests Modal */}
      {showDaily && (
        <DailyChallengeModal
          quests={dailyQuests}
          onClaimQuest={claimDailyQuest}
          onClose={() => setShowDaily(false)}
          onOpenMysteryBox={() => {
            addCoins(40);
            addStars(3);
          }}
          coins={coins}
        />
      )}

      {/* Friendly Leaderboard Modal */}
      {showLeaderboard && (
        <LeaderboardModal
          onClose={() => setShowLeaderboard(false)}
          playerName={playerName}
          playerStars={stars}
          playerStreak={streak}
        />
      )}

      {/* Reward / Achievement Notification Toast Modal */}
      {recentRewardModal && recentRewardModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-pop-in select-none">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 border-4 border-amber-400 shadow-2xl text-center">
            <div className="text-5xl mb-2 animate-bounce">
              {recentRewardModal.icon}
            </div>
            <h3 className="text-xl font-black text-indigo-950 font-heading">
              {recentRewardModal.title}
            </h3>
            <p className="text-sm font-extrabold text-slate-700 mt-2 mb-4 bg-amber-50 p-3 rounded-2xl border border-amber-200">
              {recentRewardModal.rewardText}
            </p>
            <button
              onClick={() => {
                soundManager.playSparkle();
                dismissRewardModal();
              }}
              className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 font-black rounded-2xl shadow-md text-sm active:scale-95 transition"
            >
              Awesome! 🎉
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <MainApp />
    </GameProvider>
  );
}

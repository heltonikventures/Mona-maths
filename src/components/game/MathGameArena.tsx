import React, { useEffect, useState } from 'react';
import { REALMS } from '../../data/gameConstants';
import { GameMode, MathQuestion, MathTopic } from '../../types';
import { fireCelebrationConfetti, fireStarBurst } from '../../utils/confetti';
import { generateQuestion } from '../../utils/questionGenerator';
import { soundManager } from '../../utils/sound';
import { AvatarRenderer } from '../avatar/AvatarRenderer';
import { CharacterGuide } from '../common/CharacterGuide';
import { VisualMathAid } from './VisualMathAid';

interface MathGameArenaProps {
  topic: MathTopic;
  mode: GameMode;
  levelIndex?: number;
  onExit: () => void;
  onCompleteLevel?: (stars: number, coins: number) => void;
  playerAvatar: any;
  guideCharacterId: any;
  currentLevel: number;
  recordAnswer: (topic: MathTopic, isCorrect: boolean, timeSeconds?: number) => void;
  addCoins: (amount: number) => void;
  addStars: (amount: number) => void;
}

export const MathGameArena: React.FC<MathGameArenaProps> = ({
  topic,
  mode,
  levelIndex = 0,
  onExit,
  onCompleteLevel,
  playerAvatar,
  guideCharacterId,
  currentLevel,
  recordAnswer,
  addCoins,
  addStars,
}) => {
  const realm = REALMS.find((r) => r.id === topic) || REALMS[0];

  // Game state
  const [questionNumber, setQuestionNumber] = useState(1);
  const totalQuestions = mode === 'boss-battle' ? 5 : mode === 'time-challenge' ? 999 : 5;
  const [question, setQuestion] = useState<MathQuestion>(() =>
    generateQuestion(topic, currentLevel as any)
  );

  const [selectedOption, setSelectedOption] = useState<string | number | null>(null);
  const [answerState, setAnswerState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [score, setScore] = useState(0);
  const [roundCoins, setRoundCoins] = useState(0);
  const [speech, setSpeech] = useState<string>("You can do this! Take your time!");
  const [guideMood, setGuideMood] = useState<'happy' | 'thinking' | 'celebrating' | 'hint'>('happy');

  // Hint state
  const [hintStep, setHintStep] = useState(0);
  const [showHintModal, setShowHintModal] = useState(false);

  // Time Challenge specific state
  const [timeLeft, setTimeLeft] = useState(60);
  const [isGameOver, setIsGameOver] = useState(false);

  // Boss Battle state
  const [bossHp, setBossHp] = useState(5);

  // Number Race track position (0 to 100%)
  const [racePosition, setRacePosition] = useState(10);
  const [rivalPosition, setRivalPosition] = useState(15);

  // Memory Game state
  const [memoryCards, setMemoryCards] = useState<Array<{ id: number; text: string; matchId: number; flipped: boolean; matched: boolean }>>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);

  // Init Memory Game cards if mode === 'memory'
  useEffect(() => {
    if (mode === 'memory') {
      const pairs = [
        { q: '3 × 4', a: '12' },
        { q: '5 × 2', a: '10' },
        { q: '8 + 6', a: '14' },
        { q: '20 − 5', a: '15' },
      ];
      const cards: Array<{ id: number; text: string; matchId: number; flipped: boolean; matched: boolean }> = [];
      pairs.forEach((p, idx) => {
        cards.push({ id: idx * 2, text: p.q, matchId: idx, flipped: false, matched: false });
        cards.push({ id: idx * 2 + 1, text: p.a, matchId: idx, flipped: false, matched: false });
      });
      // Shuffle cards
      setMemoryCards(cards.sort(() => Math.random() - 0.5));
    }
  }, [mode]);

  // Timer for Time Challenge
  useEffect(() => {
    if (mode !== 'time-challenge' || isGameOver) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsGameOver(true);
          soundManager.playCelebration();
          fireCelebrationConfetti();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [mode, isGameOver]);

  // Rival movement in Number Race
  useEffect(() => {
    if (mode !== 'number-race' || isGameOver) return;
    const interval = setInterval(() => {
      setRivalPosition((prev) => {
        const next = prev + Math.floor(Math.random() * 4) + 1;
        if (next >= 100 && !isGameOver) {
          setIsGameOver(true);
          soundManager.playGentleBoop();
        }
        return Math.min(100, next);
      });
    }, 2800);
    return () => clearInterval(interval);
  }, [mode, isGameOver]);

  const handleSelectOption = (option: string | number) => {
    if (answerState !== 'idle' || isGameOver) return;
    setSelectedOption(option);

    const isCorrect = String(option).trim() === String(question.correctAnswer).trim();

    if (isCorrect) {
      setAnswerState('correct');
      soundManager.playCorrect();
      setScore((s) => s + 1);
      const earnedCoins = 10;
      setRoundCoins((c) => c + earnedCoins);
      addCoins(earnedCoins);
      recordAnswer(topic, true);

      // Encouraging praise
      const praises = [
        "Awesome! You got it!",
        "Super thinking!",
        "Brilliant calculation!",
        "You're becoming a Maths Hero!",
        "High five! That was spot on!",
      ];
      setSpeech(praises[Math.floor(Math.random() * praises.length)]);
      setGuideMood('celebrating');

      // Update mode-specific mechanics
      if (mode === 'boss-battle') {
        setBossHp((hp) => Math.max(0, hp - 1));
      }
      if (mode === 'number-race') {
        soundManager.playRaceZoom();
        setRacePosition((pos) => {
          const next = pos + 22;
          if (next >= 100) {
            setTimeout(() => {
              setIsGameOver(true);
              soundManager.playCelebration();
              fireCelebrationConfetti();
            }, 600);
          }
          return Math.min(100, next);
        });
      }

      // Next question transition
      setTimeout(() => {
        if (mode === 'boss-battle' && bossHp <= 1) {
          setIsGameOver(true);
          soundManager.playCelebration();
          fireCelebrationConfetti();
          return;
        }

        if (questionNumber >= totalQuestions && mode !== 'time-challenge') {
          setIsGameOver(true);
          soundManager.playCelebration();
          fireCelebrationConfetti();
        } else {
          setQuestionNumber((n) => n + 1);
          setQuestion(generateQuestion(topic, currentLevel as any));
          setSelectedOption(null);
          setAnswerState('idle');
          setHintStep(0);
          setGuideMood('happy');
          setSpeech("Keep going! You're doing amazing!");
        }
      }, 1200);
    } else {
      setAnswerState('wrong');
      soundManager.playGentleBoop();
      recordAnswer(topic, false);
      const encouragements = [
        "Almost there! Take another look!",
        "Good try! Check the clue or visual counters!",
        "You can do it! Think about the steps!",
        "Mistakes help our brain grow! Try once more!",
      ];
      setSpeech(encouragements[Math.floor(Math.random() * encouragements.length)]);
      setGuideMood('hint');

      setTimeout(() => {
        setAnswerState('idle');
        setSelectedOption(null);
      }, 1400);
    }
  };

  // Memory card click
  const handleMemoryCardClick = (cardId: number) => {
    if (selectedCards.length >= 2) return;
    const card = memoryCards.find((c) => c.id === cardId);
    if (!card || card.flipped || card.matched) return;

    soundManager.playClick();
    const nextFlipped = memoryCards.map((c) => (c.id === cardId ? { ...c, flipped: true } : c));
    setMemoryCards(nextFlipped);

    const nextSelected = [...selectedCards, cardId];
    setSelectedCards(nextSelected);

    if (nextSelected.length === 2) {
      const first = nextFlipped.find((c) => c.id === nextSelected[0])!;
      const second = nextFlipped.find((c) => c.id === nextSelected[1])!;

      if (first.matchId === second.matchId) {
        soundManager.playCorrect();
        fireStarBurst();
        addCoins(15);
        setRoundCoins((c) => c + 15);
        setTimeout(() => {
          setMemoryCards((cards) =>
            cards.map((c) =>
              c.id === first.id || c.id === second.id ? { ...c, matched: true } : c
            )
          );
          setSelectedCards([]);
          // Check if all matched
          const allMatched = nextFlipped.every((c) => c.matched || c.id === first.id || c.id === second.id);
          if (allMatched) {
            setIsGameOver(true);
            soundManager.playCelebration();
            fireCelebrationConfetti();
          }
        }, 600);
      } else {
        soundManager.playGentleBoop();
        setTimeout(() => {
          setMemoryCards((cards) =>
            cards.map((c) =>
              c.id === first.id || c.id === second.id ? { ...c, flipped: false } : c
            )
          );
          setSelectedCards([]);
        }, 1000);
      }
    }
  };

  const handleNextHint = () => {
    soundManager.playSparkle();
    setHintStep((h) => Math.min(question.hints.length - 1, h + 1));
  };

  const calculateStars = () => {
    if (mode === 'boss-battle') return 3;
    if (score >= 5) return 3;
    if (score >= 3) return 2;
    return 1;
  };

  return (
    <div className="relative min-h-[calc(100vh-70px)] bg-gradient-to-b from-amber-50 to-orange-50 pb-16 pt-4 px-3 sm:px-6">
      {/* Top Game Bar */}
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 bg-white/95 rounded-3xl p-3 sm:p-4 border-3 border-amber-200 shadow-md mb-4">
        {/* Exit / Back button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onExit();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm active:scale-95 transition"
        >
          <span>◀</span>
          <span className="hidden sm:inline">Map</span>
        </button>

        {/* Realm & Level Name */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-xl sm:text-2xl">{realm.icon}</span>
            <h2 className="text-base sm:text-xl font-black text-slate-800 font-heading">
              {mode === 'adventure' && `${realm.name} — Stage ${levelIndex + 1}`}
              {mode === 'quickplay' && `Quick Play: ${realm.name}`}
              {mode === 'time-challenge' && `Time Challenge: 60s Blitz!`}
              {mode === 'boss-battle' && `Boss Battle: ${realm.bossName}!`}
              {mode === 'memory' && `Memory Match: Cards`}
              {mode === 'number-race' && `Number Race Track!`}
            </h2>
          </div>
        </div>

        {/* Status / Coins in this session */}
        <div className="flex items-center gap-2">
          {mode === 'time-challenge' && (
            <div className={`px-3 py-1 rounded-full text-sm font-black text-white ${timeLeft <= 10 ? 'bg-red-500 animate-pulse' : 'bg-indigo-600'}`}>
              ⏱️ {timeLeft}s
            </div>
          )}
          {mode !== 'time-challenge' && mode !== 'memory' && (
            <div className="text-xs sm:text-sm font-black text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              Q {questionNumber} / {totalQuestions}
            </div>
          )}
          <div className="flex items-center gap-1 bg-yellow-100 px-2.5 py-1 rounded-full text-xs sm:text-sm font-black text-yellow-900 border border-yellow-300">
            <span>🪙</span>
            <span>+{roundCoins}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        {/* Boss Battle UI (if boss mode) */}
        {mode === 'boss-battle' && (
          <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-4 sm:p-5 shadow-xl border-4 border-purple-400 text-center animate-pop-in">
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl sm:text-5xl animate-bounce">👾</span>
              <div className="text-left">
                <h3 className="text-lg sm:text-2xl font-black font-heading text-purple-200">
                  {realm.bossName}
                </h3>
                <p className="text-xs font-bold text-purple-300">{realm.bossTitle}</p>
              </div>
            </div>
            {/* Boss Health Bar */}
            <div className="mt-3 max-w-sm mx-auto">
              <div className="flex justify-between text-xs font-black text-purple-200 mb-1">
                <span>Boss Energy</span>
                <span>{bossHp} / 5 Hearts</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-4 p-0.5 border border-purple-400">
                <div
                  className="bg-gradient-to-r from-red-500 to-pink-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(bossHp / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Number Race Track UI (if number race mode) */}
        {mode === 'number-race' && (
          <div className="bg-emerald-600 rounded-3xl p-4 sm:p-5 shadow-lg border-4 border-emerald-400 text-white">
            <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider mb-2">
              <span>🏁 Start Line</span>
              <span>Finish Trophy 🏆</span>
            </div>
            {/* Player Track */}
            <div className="relative bg-emerald-800/80 rounded-2xl h-14 border-2 border-emerald-300/50 p-1 flex items-center mb-3">
              <div
                className="absolute transition-all duration-500 ease-out flex items-center gap-1"
                style={{ left: `calc(${racePosition}% - 24px)` }}
              >
                <AvatarRenderer avatar={playerAvatar} size="sm" />
                <span className="text-[11px] font-black bg-white text-emerald-900 px-1.5 py-0.5 rounded-full shadow-xs">
                  You
                </span>
              </div>
            </div>
            {/* Rival Track */}
            <div className="relative bg-emerald-900/80 rounded-2xl h-12 border-2 border-emerald-300/50 p-1 flex items-center">
              <div
                className="absolute transition-all duration-700 ease-linear flex items-center gap-1"
                style={{ left: `calc(${rivalPosition}% - 24px)` }}
              >
                <span className="text-2xl animate-wiggle">🐢</span>
                <span className="text-[11px] font-black bg-white text-emerald-900 px-1.5 py-0.5 rounded-full shadow-xs">
                  Turbo Tortoise
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Memory Match Game Mode */}
        {mode === 'memory' && (
          <div className="bg-white rounded-3xl p-6 border-3 border-amber-300 shadow-xl text-center">
            <h3 className="text-xl font-black text-slate-800 font-heading mb-1">
              Maths Memory Pairs!
            </h3>
            <p className="text-sm font-bold text-slate-600 mb-6">
              Flip two cards to match each question with its correct answer!
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-xl mx-auto">
              {memoryCards.map((card) => {
                const isRevealed = card.flipped || card.matched;
                return (
                  <button
                    key={card.id}
                    onClick={() => handleMemoryCardClick(card.id)}
                    disabled={isRevealed}
                    className={`h-24 sm:h-28 rounded-2xl font-black text-lg sm:text-xl transition-all duration-300 flex items-center justify-center border-3 shadow-md select-none ${
                      card.matched
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-800 opacity-60'
                        : isRevealed
                        ? 'bg-amber-100 border-amber-400 text-indigo-900 scale-105'
                        : 'bg-gradient-to-tr from-indigo-500 to-purple-600 border-indigo-300 text-white hover:scale-105 active:scale-95'
                    }`}
                  >
                    {isRevealed ? card.text : '❓'}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Standard / Adventure / Blitz / Boss Question Card */}
        {mode !== 'memory' && (
          <div className="bg-white rounded-3xl p-5 sm:p-8 border-3 border-amber-300 shadow-xl relative overflow-hidden">
            {/* Story context badge */}
            {question.storyContext && (
              <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-xs sm:text-sm font-black px-3.5 py-1.5 rounded-full mb-3 border border-amber-300 shadow-xs">
                <span>📖</span>
                <span>{question.storyContext}</span>
              </div>
            )}

            {/* Question Text */}
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 leading-snug font-heading">
              {question.questionText}
            </h3>

            {/* Prominent Equation display if available */}
            {question.equationText && (
              <div className="my-4 p-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl text-center">
                <span className="text-2xl sm:text-4xl font-black text-indigo-900 tracking-wider">
                  {question.equationText}
                </span>
              </div>
            )}

            {/* Visual Learning Aid (Fruit counters, 100-grid, array, sharing plates) */}
            {question.visualAid && (
              <div className="my-4">
                <VisualMathAid data={question.visualAid} />
              </div>
            )}

            {/* Answer Options Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-6">
              {question.options.map((option, idx) => {
                const isSelected = selectedOption === option;
                let btnStyle = 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-slate-800';

                if (isSelected) {
                  if (answerState === 'correct') {
                    btnStyle = 'bg-emerald-500 border-emerald-600 text-white scale-105 shadow-lg';
                  } else if (answerState === 'wrong') {
                    btnStyle = 'bg-rose-500 border-rose-600 text-white animate-wiggle shadow-md';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(option)}
                    disabled={answerState !== 'idle'}
                    className={`btn-3d py-4 sm:py-5 px-3 rounded-2xl sm:rounded-3xl border-3 text-xl sm:text-3xl font-black shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {isSelected && answerState === 'correct' && <span>⭐</span>}
                  </button>
                );
              })}
            </div>

            {/* Hint Trigger Button */}
            <div className="mt-6 flex items-center justify-between pt-4 border-t-2 border-amber-100">
              <button
                type="button"
                onClick={() => {
                  soundManager.playSparkle();
                  setShowHintModal(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-black text-xs sm:text-sm border border-amber-300 active:scale-95 transition shadow-xs"
              >
                <span>💡</span>
                <span>Need a Hint?</span>
              </button>

              <span className="text-xs sm:text-sm font-bold text-slate-500">
                Difficulty: Level {currentLevel}
              </span>
            </div>
          </div>
        )}

        {/* Guide Character with speech feedback */}
        <div className="mt-4 flex justify-center sm:justify-start">
          <CharacterGuide
            guideId={guideCharacterId}
            speechText={speech}
            mood={guideMood}
          />
        </div>
      </div>

      {/* Hint Modal */}
      {showHintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-pop-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border-4 border-amber-300 shadow-2xl text-center">
            <div className="text-4xl mb-2">💡</div>
            <h4 className="text-xl font-black text-slate-800 font-heading">
              Helpful Clue #{hintStep + 1}
            </h4>

            <p className="mt-3 p-4 bg-amber-50 rounded-2xl border-2 border-amber-200 text-slate-800 font-extrabold text-base leading-relaxed text-left">
              {question.hints[hintStep] || question.hints[0]}
            </p>

            <div className="mt-5 flex gap-2">
              {hintStep < question.hints.length - 1 && (
                <button
                  type="button"
                  onClick={handleNextHint}
                  className="flex-1 py-3 bg-amber-100 hover:bg-amber-200 text-amber-950 font-black rounded-2xl border border-amber-300 active:scale-95 transition text-sm"
                >
                  Next Clue 🔍
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setShowHintModal(false);
                }}
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl shadow-md active:scale-95 transition text-sm"
              >
                I'm Ready to Solve! 🚀
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Over / Stage Cleared Modal */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-pop-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border-4 border-amber-400 shadow-2xl text-center">
            <div className="text-5xl mb-2 animate-bounce">🏆</div>
            <h3 className="text-2xl sm:text-3xl font-black text-indigo-950 font-heading">
              Adventure Completed!
            </h3>
            <p className="text-sm sm:text-base font-bold text-slate-600 mt-1">
              You showed true mathematical courage!
            </p>

            {/* Stars Won */}
            <div className="flex justify-center gap-2 my-4 text-4xl">
              {Array.from({ length: 3 }, (_, i) => (
                <span
                  key={i}
                  className={i < calculateStars() ? 'animate-wiggle text-amber-400' : 'opacity-30 text-slate-300'}
                >
                  ⭐
                </span>
              ))}
            </div>

            {/* Summary Box */}
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 mb-6 space-y-2">
              <div className="flex justify-between font-extrabold text-sm text-slate-700">
                <span>Score:</span>
                <span className="text-indigo-900 font-black">{score} Correct</span>
              </div>
              <div className="flex justify-between font-extrabold text-sm text-slate-700">
                <span>Coins Earned:</span>
                <span className="text-amber-800 font-black">+{roundCoins} 🪙</span>
              </div>
              <div className="flex justify-between font-extrabold text-sm text-slate-700">
                <span>Stars Earned:</span>
                <span className="text-yellow-600 font-black">+{calculateStars()} ⭐</span>
              </div>
            </div>

            {/* Next buttons */}
            <button
              onClick={() => {
                soundManager.playCelebration();
                if (onCompleteLevel) {
                  onCompleteLevel(calculateStars(), roundCoins);
                } else {
                  addStars(calculateStars());
                  onExit();
                }
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-lg shadow-lg hover:brightness-110 active:scale-95 transition"
            >
              Collect Rewards & Continue! 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

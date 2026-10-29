import React, { useState } from 'react';
import { fireCelebrationConfetti, fireStarBurst } from '../../utils/confetti';
import { soundManager } from '../../utils/sound';

interface TrickItem {
  id: string;
  title: string;
  tagline: string;
  emoji: string;
  difficulty: 'Easy' | 'Medium' | 'Mind Blowing';
  secretFormula: string;
  steps: string[];
  exampleProblem: string;
  interactiveDemo?: {
    label: string;
    placeholder: string;
    inputType: 'number' | 'two-numbers';
    calculate: (val1: number, val2?: number) => { calculation: string; answer: string; explanation: string };
  };
}

interface TopicTricks {
  topicId: string;
  topicName: string;
  topicIcon: string;
  color: string;
  tricks: TrickItem[];
}

const MATH_TRICKS_DATA: TopicTricks[] = [
  {
    topicId: 'addition',
    topicName: 'Addition Magic',
    topicIcon: '🍎',
    color: 'from-emerald-500 to-teal-600',
    tricks: [
      {
        id: 'add-make-10',
        title: 'The Bridge to 10',
        tagline: 'Always build a bridge to a nice round 10 first!',
        emoji: '🌉',
        difficulty: 'Easy',
        secretFormula: '8 + 7 ➔ (8 + 2) + 5 = 15',
        steps: [
          'Look at the bigger number (like 8). How many does it need to reach 10? Exactly 2!',
          'Borrow 2 from the other number (7 becomes 5).',
          'Now add 10 + 5 = 15! No finger counting needed!'
        ],
        exampleProblem: '9 + 6 = (9 + 1) + 5 = 15',
        interactiveDemo: {
          label: 'Try adding 8 to any single-digit number:',
          placeholder: 'Enter 1 to 9 (e.g. 7)',
          inputType: 'number',
          calculate: (n) => ({
            calculation: `8 + ${n} = (8 + 2) + (${n} - 2)`,
            answer: `${8 + n}`,
            explanation: `We borrow 2 to make 10, leaving ${n - 2}. 10 + ${n - 2} = ${8 + n}!`
          })
        }
      },
      {
        id: 'add-plus-9',
        title: 'Add 9 in a Flash (+10, -1)',
        tagline: '9 is secretly just 10 minus 1!',
        emoji: '⚡',
        difficulty: 'Easy',
        secretFormula: 'Any Number + 9 = (Number + 10) - 1',
        steps: [
          'Add 10 first (which is super easy, just increment the tens digit).',
          'Subtract 1 from the result.',
          'Example: 46 + 9 ➔ 46 + 10 = 56 ➔ 56 - 1 = 55!'
        ],
        exampleProblem: '78 + 9 = 88 - 1 = 87',
        interactiveDemo: {
          label: 'Test any 2-digit number + 9:',
          placeholder: 'Enter a number (e.g. 54)',
          inputType: 'number',
          calculate: (n) => ({
            calculation: `${n} + 10 - 1`,
            answer: `${n + 9}`,
            explanation: `${n} + 10 is ${n + 10}. Subtract 1 gives ${n + 9} instantly!`
          })
        }
      },
      {
        id: 'add-left-to-right',
        title: 'Left-to-Right Tens Adding',
        tagline: 'How mental math champions add 2-digit numbers instantly!',
        emoji: '🧠',
        difficulty: 'Medium',
        secretFormula: '47 + 35 ➔ (40 + 30) + (7 + 5) = 70 + 12 = 82',
        steps: [
          'Add the tens first: 40 + 30 = 70.',
          'Add the ones next: 7 + 5 = 12.',
          'Combine them: 70 + 12 = 82!'
        ],
        exampleProblem: '63 + 28 = 80 + 11 = 91'
      }
    ]
  },
  {
    topicId: 'subtraction',
    topicName: 'Subtraction Secrets',
    topicIcon: '🌲',
    color: 'from-amber-500 to-orange-600',
    tricks: [
      {
        id: 'sub-all-9-last-10',
        title: 'Subtract from 1,000 (All from 9, Last from 10)',
        tagline: 'Never borrow across zeros again! Ancient Vedic Math Secret.',
        emoji: '🪄',
        difficulty: 'Mind Blowing',
        secretFormula: '1000 - 357 ➔ (9-3)(9-5)(10-7) = 643',
        steps: [
          'Subtract every digit from 9, starting from left to right.',
          'Subtract the very last digit from 10!',
          'Let’s do 1,000 - 428: 9 - 4 = 5, 9 - 2 = 7, 10 - 8 = 2. Answer: 572! 🎉'
        ],
        exampleProblem: '1000 - 639 ➔ 9-6=3, 9-3=6, 10-9=1 ➔ 361!',
        interactiveDemo: {
          label: 'Subtract any 3-digit number from 1,000:',
          placeholder: 'Enter 100 to 999 (e.g. 472)',
          inputType: 'number',
          calculate: (n) => {
            const str = String(Math.abs(n)).padStart(3, '0').slice(-3);
            const d1 = parseInt(str[0], 10);
            const d2 = parseInt(str[1], 10);
            const d3 = parseInt(str[2], 10);
            const a1 = 9 - d1;
            const a2 = 9 - d2;
            const a3 = 10 - d3;
            const ans = 1000 - n;
            return {
              calculation: `(9 - ${d1}) (9 - ${d2}) (10 - ${d3})`,
              answer: `${ans}`,
              explanation: `All from 9: 9 - ${d1} = ${a1}, 9 - ${d2} = ${a2}. Last from 10: 10 - ${d3} = ${a3}. Combine: ${ans}!`
            };
          }
        }
      },
      {
        id: 'sub-counting-up',
        title: 'Counting Up (The Cashier Shortcut)',
        tagline: 'Turn hard subtraction into easy addition!',
        emoji: '🪙',
        difficulty: 'Easy',
        secretFormula: '100 - 74: 74 + 6 = 80, 80 + 20 = 100 ➔ 6 + 20 = 26',
        steps: [
          'Start at the smaller number: 74.',
          'Add a jump to reach the next ten: 74 + 6 = 80.',
          'Add another jump to reach the goal: 80 + 20 = 100.',
          'Total distance = 6 + 20 = 26!'
        ],
        exampleProblem: '60 - 38: 38 + 2 = 40, 40 + 20 = 60 ➔ 22'
      }
    ]
  },
  {
    topicId: 'multiplication',
    topicName: 'Multiplication Marvels',
    topicIcon: '⛰️',
    color: 'from-indigo-500 to-purple-600',
    tricks: [
      {
        id: 'mul-11-sandwich',
        title: 'The 11s Sandwich Trick',
        tagline: 'Multiply any 2-digit number by 11 in 2 seconds!',
        emoji: '🥪',
        difficulty: 'Mind Blowing',
        secretFormula: '35 × 11 ➔ Put (3 + 5) in the middle ➔ 385!',
        steps: [
          'Separate the two digits: 3 and 5.',
          'Add them together: 3 + 5 = 8.',
          'Sandwich the sum in between: 3 [8] 5 ➔ 385!',
          'If the middle sum is 10 or more, carry the 1 to the left digit: 75 × 11 ➔ 7+5=12 ➔ (7+1)[2]5 = 825!'
        ],
        exampleProblem: '43 × 11 = 4[4+3]3 = 473',
        interactiveDemo: {
          label: 'Multiply any 2-digit number by 11:',
          placeholder: 'Enter 10 to 99 (e.g. 52)',
          inputType: 'number',
          calculate: (n) => {
            const d1 = Math.floor(n / 10);
            const d2 = n % 10;
            const sum = d1 + d2;
            const ans = n * 11;
            return {
              calculation: `${d1} [${d1} + ${d2} = ${sum}] ${d2}`,
              answer: `${ans}`,
              explanation: sum >= 10
                ? `${d1}+${d2} = ${sum}. Keep ${sum % 10} in middle, carry 1 to ${d1} ➔ (${d1 + 1})[${sum % 10}]${d2} = ${ans}!`
                : `Sandwich ${sum} between ${d1} and ${d2} ➔ ${ans}!`
            };
          }
        }
      },
      {
        id: 'mul-9-fingers',
        title: 'The 9s Finger Magic',
        tagline: 'Your 10 fingers know the entire 9 times table!',
        emoji: '🖐️',
        difficulty: 'Easy',
        secretFormula: 'To do 9 × 4: Bend 4th finger. 3 fingers left, 6 fingers right ➔ 36!',
        steps: [
          'Hold both hands in front of you with palms facing you (fingers 1 to 10 from left to right).',
          'To calculate 9 × N, fold down finger number N.',
          'Count fingers to the LEFT of the bent finger (Tens).',
          'Count fingers to the RIGHT of the bent finger (Ones).',
          'Read them side by side! For 9 × 7: Bend finger 7. Left has 6, right has 3 ➔ 63!'
        ],
        exampleProblem: '9 × 3: Bend 3rd finger ➔ 2 on left, 7 on right ➔ 27!'
      },
      {
        id: 'mul-5-half-ten',
        title: 'Multiply by 5 is Half of 10',
        tagline: 'Multiplying by 5 is super easy: Cut in half, add a zero!',
        emoji: '✂️',
        difficulty: 'Medium',
        secretFormula: '48 × 5 ➔ (48 ÷ 2) × 10 = 24 × 10 = 240',
        steps: [
          'Take any number and divide it by 2 (cut in half).',
          'Multiply by 10 (add a zero at the end).',
          'Example: 36 × 5 ➔ Half of 36 is 18 ➔ 180!',
          'For odd numbers like 15 × 5: Half is 7.5 ➔ Move decimal ➔ 75!'
        ],
        exampleProblem: '64 × 5 = Half is 32 ➔ 320'
      },
      {
        id: 'mul-square-ending-5',
        title: 'Square Numbers Ending in 5',
        tagline: 'Square 25, 35, 65, 85 in your head!',
        emoji: '🎯',
        difficulty: 'Mind Blowing',
        secretFormula: '35 × 35 ➔ (3 × 4 = 12) attach 25 ➔ 1225',
        steps: [
          'Take the first digit (for 65, take 6).',
          'Multiply it by the very next counting number (6 × 7 = 42).',
          'Simply stick 25 on the end! 42 + 25 = 4225!'
        ],
        exampleProblem: '75 × 75 ➔ 7 × 8 = 56 ➔ 5625'
      }
    ]
  },
  {
    topicId: 'division',
    topicName: 'Division Dazzlers',
    topicIcon: '🏰',
    color: 'from-rose-500 to-pink-600',
    tricks: [
      {
        id: 'div-by-5-double-shift',
        title: 'Divide by 5 Quick Shortcut',
        tagline: 'Double the number, then move the decimal point left 1 spot!',
        emoji: '🚀',
        difficulty: 'Medium',
        secretFormula: '135 ÷ 5 ➔ (135 × 2) ÷ 10 = 270 ÷ 10 = 27',
        steps: [
          'Double the number (multiply by 2).',
          'Divide by 10 (move the decimal point one place to the left).',
          'Example: 85 ÷ 5 ➔ Double of 85 is 170 ➔ 170 ÷ 10 = 17!',
          'Works on ANY number: 42 ÷ 5 ➔ 42 × 2 = 84 ➔ 8.4!'
        ],
        exampleProblem: '240 ÷ 5 = Double is 480 ➔ 48',
        interactiveDemo: {
          label: 'Divide any number by 5:',
          placeholder: 'Enter a number (e.g. 175)',
          inputType: 'number',
          calculate: (n) => ({
            calculation: `(${n} × 2) ÷ 10 = ${n * 2} ÷ 10`,
            answer: `${(n / 5).toLocaleString()}`,
            explanation: `Double ${n} is ${n * 2}. Move the dot left one spot to get ${(n / 5).toLocaleString()}!`
          })
        }
      },
      {
        id: 'div-rule-of-3',
        title: 'The Divisibility Rule for 3',
        tagline: 'Know if any giant number divides by 3 without doing long division!',
        emoji: '🔍',
        difficulty: 'Easy',
        secretFormula: 'Add all digits: If sum divides by 3, the number does too!',
        steps: [
          'Take a big number like 5,421.',
          'Add all its digits together: 5 + 4 + 2 + 1 = 12.',
          'Does 12 divide by 3? YES (12 ÷ 3 = 4)!',
          'Therefore, 5,421 is completely divisible by 3!'
        ],
        exampleProblem: '7,113 ➔ 7+1+1+3 = 12 (Divisible by 3!)'
      },
      {
        id: 'div-by-4-half-twice',
        title: 'Dividing by 4 is Halving Twice',
        tagline: 'Cut in half once, then cut in half again!',
        emoji: '➗',
        difficulty: 'Easy',
        secretFormula: '124 ÷ 4 ➔ Half is 62 ➔ Half of 62 is 31!',
        steps: [
          'Find half of the number.',
          'Find half of that result.',
          'Done! Example: 180 ÷ 4 ➔ Half is 90 ➔ Half of 90 is 45!'
        ],
        exampleProblem: '96 ÷ 4 ➔ Half is 48 ➔ Half of 48 is 24!'
      }
    ]
  },
  {
    topicId: 'ratio',
    topicName: 'Ratio & Proportion Power',
    topicIcon: '🌊',
    color: 'from-cyan-500 to-blue-600',
    tricks: [
      {
        id: 'ratio-total-parts',
        title: 'The Total Parts Method',
        tagline: 'Share anything fairly like a maths master!',
        emoji: '🍰',
        difficulty: 'Medium',
        secretFormula: 'Ratio 2:3 with 20 items ➔ Total 5 parts ➔ 1 part = 4 ➔ (8 : 12)',
        steps: [
          'Step 1: Add the ratio numbers together to find Total Parts: 2 + 3 = 5 parts.',
          'Step 2: Divide the total amount by total parts: 20 ÷ 5 = 4 per part.',
          'Step 3: Multiply each part back: 2 × 4 = 8, and 3 × 4 = 12!',
          'Check: 8 + 12 = 20. Perfect match!'
        ],
        exampleProblem: 'Share $50 in ratio 3:2 ➔ 5 parts ➔ $10/part ➔ $30 and $20'
      },
      {
        id: 'ratio-cross-butterfly',
        title: 'The Butterfly Cross-Check',
        tagline: 'Compare any two ratios or fractions instantly!',
        emoji: '🦋',
        difficulty: 'Easy',
        secretFormula: 'Is 3/4 or 4/5 bigger? Cross multiply: 3×5=15 vs 4×4=16 ➔ 4/5 wins!',
        steps: [
          'Multiply top of left by bottom of right (3 × 5 = 15). Write 15 on top left.',
          'Multiply top of right by bottom of left (4 × 4 = 16). Write 16 on top right.',
          'Compare the two numbers! Since 16 > 15, 4/5 is greater than 3/4!'
        ],
        exampleProblem: '2/3 vs 5/8 ➔ 2×8=16 vs 3×5=15 ➔ 2/3 is bigger!'
      }
    ]
  },
  {
    topicId: 'percentage',
    topicName: 'Percentage Superpowers',
    topicIcon: '🏙️',
    color: 'from-violet-500 to-purple-700',
    tricks: [
      {
        id: 'pct-flip-symmetry',
        title: 'The Flip Secret (x% of y = y% of x)',
        tagline: 'The most powerful, mind-blowing percentage secret in mathematics!',
        emoji: '🔄',
        difficulty: 'Mind Blowing',
        secretFormula: '16% of 50 = 50% of 16 = 8!',
        steps: [
          'Trying to calculate 16% of 50 in your head feels impossible...',
          'Flip the numbers! 16% of 50 is the EXACT same as 50% of 16!',
          'What is 50% (half) of 16? It is 8!',
          'Therefore, 16% of 50 = 8! Instant genius moment! 🤯'
        ],
        exampleProblem: '8% of 25 = 25% of 8 = Quarter of 8 = 2!',
        interactiveDemo: {
          label: 'Test the Flip Secret: Pick any number for X% of 50:',
          placeholder: 'Enter an even number (e.g. 18)',
          inputType: 'number',
          calculate: (n) => ({
            calculation: `${n}% of 50 = 50% of ${n}`,
            answer: `${(n / 2).toLocaleString()}`,
            explanation: `50% just means half! Half of ${n} is ${(n / 2).toLocaleString()}, so ${n}% of 50 = ${(n / 2).toLocaleString()}!`
          })
        }
      },
      {
        id: 'pct-10-percent-rule',
        title: 'The 10% Dot Slide Building Block',
        tagline: '10% is just moving the dot 1 spot to the left!',
        emoji: '📍',
        difficulty: 'Easy',
        secretFormula: '10% of 240 = 24. 20% = 48. 5% = 12.',
        steps: [
          'To find 10%, slide decimal point 1 place left: 10% of 80 = 8.',
          'To find 20%: Just double 10% (8 × 2 = 16).',
          'To find 5%: Just cut 10% in half (8 ÷ 2 = 4).',
          'To find 15%: Add 10% + 5% (8 + 4 = 12)!'
        ],
        exampleProblem: '15% tip on $40 bill: 10% is $4, 5% is $2 ➔ Total = $6!'
      }
    ]
  }
];

interface MathsTricksModalProps {
  onClose: () => void;
  initialTopic?: string;
}

export const MathsTricksModal: React.FC<MathsTricksModalProps> = ({
  onClose,
  initialTopic = 'multiplication',
}) => {
  const [activeTopicId, setActiveTopicId] = useState<string>(initialTopic);
  const [activeTrickId, setActiveTrickId] = useState<string>('mul-11-sandwich');
  const [demoInput, setDemoInput] = useState<string>('42');

  const currentTopic =
    MATH_TRICKS_DATA.find((t) => t.topicId === activeTopicId) || MATH_TRICKS_DATA[0];

  const currentTrick =
    currentTopic.tricks.find((tr) => tr.id === activeTrickId) || currentTopic.tricks[0];

  const handleSelectTopic = (id: string) => {
    soundManager.playClick();
    setActiveTopicId(id);
    const newTopic = MATH_TRICKS_DATA.find((t) => t.topicId === id);
    if (newTopic && newTopic.tricks.length > 0) {
      setActiveTrickId(newTopic.tricks[0].id);
    }
  };

  const handleSelectTrick = (id: string) => {
    soundManager.playClick();
    setActiveTrickId(id);
  };

  const handleCelebrate = () => {
    soundManager.playCelebration();
    fireCelebrationConfetti();
    fireStarBurst();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-5 backdrop-blur-sm animate-pop-in select-none">
      <div className="w-full max-w-4xl bg-white rounded-3xl p-4 sm:p-6 border-4 border-amber-400 shadow-2xl relative max-h-[94vh] flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-amber-200">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl animate-bounce">✨</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading leading-tight">
                Maths Magic Tricks & Mental Shortcuts
              </h2>
              <p className="text-xs sm:text-sm font-bold text-amber-800">
                Secrets used by lightning calculators and math champions!
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-black flex items-center justify-center transition shadow-xs"
          >
            ✕
          </button>
        </div>

        {/* Topic Selector Tabs (Scrollable on mobile) */}
        <div className="flex gap-1.5 py-3 overflow-x-auto no-scrollbar shrink-0">
          {MATH_TRICKS_DATA.map((topic) => {
            const isSelected = topic.topicId === activeTopicId;
            return (
              <button
                key={topic.topicId}
                onClick={() => handleSelectTopic(topic.topicId)}
                className={`px-3 py-2 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition flex items-center gap-1.5 ${
                  isSelected
                    ? `bg-gradient-to-r ${topic.color} text-white shadow-md scale-102`
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{topic.topicIcon}</span>
                <span>{topic.topicName}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content Area: Left list of tricks, Right details & interactive box */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-4 pt-1">
          {/* Trick Navigator for active topic */}
          <div className="md:col-span-4 space-y-2">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
              Tricks in {currentTopic.topicName}:
            </span>
            <div className="space-y-1.5">
              {currentTopic.tricks.map((trick) => {
                const isActive = trick.id === currentTrick.id;
                return (
                  <button
                    key={trick.id}
                    onClick={() => handleSelectTrick(trick.id)}
                    className={`w-full text-left p-3 rounded-2xl border-2 transition-all flex items-start gap-2.5 ${
                      isActive
                        ? 'border-amber-400 bg-amber-50 shadow-md scale-101'
                        : 'border-slate-200 hover:border-amber-300 bg-white'
                    }`}
                  >
                    <span className="text-2xl shrink-0 mt-0.5">{trick.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs sm:text-sm font-black text-slate-900 truncate">
                          {trick.title}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 line-clamp-1">
                        {trick.tagline}
                      </span>
                      <span
                        className={`inline-block mt-1 text-[9px] font-black px-2 py-0.5 rounded-full ${
                          trick.difficulty === 'Mind Blowing'
                            ? 'bg-purple-100 text-purple-700'
                            : trick.difficulty === 'Medium'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {trick.difficulty}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trick Detail & Step-by-Step Viewer */}
          <div className="md:col-span-8 bg-slate-50 rounded-2xl p-4 sm:p-5 border-2 border-slate-200 flex flex-col justify-between">
            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-2">
                <span className="px-3 py-1 rounded-full bg-white border border-amber-300 text-amber-900 font-black text-xs shadow-xs flex items-center gap-1.5">
                  <span>{currentTrick.emoji}</span>
                  <span>{currentTrick.difficulty} Trick</span>
                </span>
                <button
                  onClick={handleCelebrate}
                  className="text-xs font-black px-3 py-1 rounded-full bg-amber-400 hover:bg-amber-500 text-amber-950 shadow-xs transition"
                >
                  🎉 Mastered It!
                </button>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-heading mb-1">
                {currentTrick.title}
              </h3>
              <p className="text-xs sm:text-sm font-bold text-slate-600 mb-3">
                {currentTrick.tagline}
              </p>

              {/* Secret Formula Card */}
              <div className="bg-gradient-to-r from-amber-400 to-amber-500 p-3.5 sm:p-4 rounded-2xl text-amber-950 font-black shadow-md mb-4 border-2 border-yellow-200 text-center">
                <span className="text-[10px] uppercase tracking-wider text-amber-900/80 block mb-0.5">
                  SECRET FORMULA
                </span>
                <span className="text-base sm:text-lg font-mono tracking-wide">
                  {currentTrick.secretFormula}
                </span>
              </div>

              {/* Step-by-Step Instructions */}
              <div className="space-y-2 mb-4">
                <span className="text-xs font-black text-slate-700 uppercase tracking-wide block">
                  How it Works (Step-by-Step):
                </span>
                {currentTrick.steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 bg-white p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 leading-snug"
                  >
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>

              {/* Example Problem Banner */}
              <div className="bg-emerald-50 border-2 border-emerald-300 p-3 rounded-xl text-emerald-950 text-xs sm:text-sm font-bold flex items-center gap-2 mb-4">
                <span className="text-lg">💡</span>
                <div>
                  <span className="text-[10px] uppercase text-emerald-700 font-black block">
                    Real Life Example:
                  </span>
                  <span>{currentTrick.exampleProblem}</span>
                </div>
              </div>

              {/* Interactive Try-It Calculator if available */}
              {currentTrick.interactiveDemo && (
                <div className="bg-white p-3.5 rounded-2xl border-2 border-indigo-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base">🧪</span>
                    <span className="text-xs font-black text-indigo-950">
                      Try It Yourself in Real Time!
                    </span>
                  </div>

                  <p className="text-[11px] font-semibold text-slate-600 mb-2">
                    {currentTrick.interactiveDemo.label}
                  </p>

                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="number"
                      value={demoInput}
                      onChange={(e) => setDemoInput(e.target.value)}
                      placeholder={currentTrick.interactiveDemo.placeholder}
                      className="w-28 px-3 py-1.5 text-sm font-mono font-black text-indigo-950 border-2 border-indigo-300 rounded-xl focus:outline-none focus:border-indigo-500 bg-indigo-50/50"
                    />
                    <button
                      onClick={() => {
                        soundManager.playSparkle();
                        // Random number tester
                        const rand = Math.floor(Math.random() * 80) + 12;
                        setDemoInput(String(rand));
                      }}
                      className="px-3 py-1.5 rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-black text-xs transition"
                    >
                      🎲 Random Number
                    </button>
                  </div>

                  {/* Real-time Calculation Result */}
                  {(() => {
                    const parsedNum = parseInt(demoInput, 10);
                    if (isNaN(parsedNum)) return null;
                    const res = currentTrick.interactiveDemo.calculate(parsedNum);
                    return (
                      <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-200 text-xs text-indigo-950 font-semibold space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs text-indigo-800">
                            Calculation: {res.calculation}
                          </span>
                          <span className="font-black text-emerald-600 text-sm bg-white px-2 py-0.5 rounded-lg border border-emerald-200">
                            Answer: {res.answer}
                          </span>
                        </div>
                        <p className="text-[11px] text-indigo-900">{res.explanation}</p>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Bottom Button */}
            <div className="pt-4 flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-500">
                Practicing mental tricks builds super-speed math confidence!
              </span>
              <button
                onClick={() => {
                  soundManager.playSparkle();
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs sm:text-sm shadow-md hover:brightness-105 active:scale-95 transition"
              >
                Go Play & Use Trick! 🚀
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

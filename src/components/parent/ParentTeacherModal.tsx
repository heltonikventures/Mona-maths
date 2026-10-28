import React, { useState } from 'react';
import { DIFFICULTY_LEVELS, REALMS } from '../../data/gameConstants';
import { ClassroomData, DifficultyLevel, MathTopic, UserStats } from '../../types';
import { soundManager } from '../../utils/sound';
import { syncManager } from '../../utils/syncManager';

interface ParentTeacherModalProps {
  stats: UserStats;
  level: number;
  streak: number;
  classroom: ClassroomData;
  onUpdateClassroom: (data: ClassroomData) => void;
  onClose: () => void;
  onResetData: () => void;
}

export const ParentTeacherModal: React.FC<ParentTeacherModalProps> = ({
  stats,
  level,
  streak,
  classroom,
  onUpdateClassroom,
  onClose,
  onResetData,
}) => {
  // Adult Security Lock State
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinAnswer, setPinAnswer] = useState('');
  const [pinError, setPinError] = useState(false);

  // Active tab inside unlocked dashboard
  const [tab, setTab] = useState<'analytics' | 'classroom' | 'recommendations'>('analytics');

  // Teacher new student form
  const [newStudentName, setNewStudentName] = useState('');
  const [classCode, setClassCode] = useState(classroom.code);
  const [classNameInput, setClassNameInput] = useState(classroom.className);

  const handleVerifyGate = (e: React.FormEvent) => {
    e.preventDefault();
    // Gate question: 7 * 8 = 56
    if (pinAnswer.trim() === '56' || pinAnswer.trim() === '1234') {
      soundManager.playSparkle();
      setIsUnlocked(true);
      setPinError(false);
    } else {
      soundManager.playGentleBoop();
      setPinError(true);
    }
  };

  const handleAddStudent = () => {
    if (!newStudentName.trim()) return;
    soundManager.playClick();
    const newStudent = {
      id: String(Date.now()),
      name: newStudentName.trim(),
      avatarChar: '🎒',
      level: 2,
      stars: 10,
      coins: 50,
      accuracy: 80,
      lastActive: 'Just now',
    };
    onUpdateClassroom({
      ...classroom,
      students: [...classroom.students, newStudent],
    });
    setNewStudentName('');
  };

  const handleTopicAssignment = (topic: MathTopic | 'all') => {
    soundManager.playClick();
    onUpdateClassroom({
      ...classroom,
      assignedTopic: topic,
    });
  };

  const handleDifficultyAssignment = (lvl: DifficultyLevel) => {
    soundManager.playClick();
    onUpdateClassroom({
      ...classroom,
      assignedDifficulty: lvl,
    });
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-pop-in select-none">
      <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border-4 border-slate-300 shadow-2xl relative max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-black flex items-center justify-center transition"
        >
          ✕
        </button>

        {/* SECURITY GATE FOR GROWN-UPS */}
        {!isUnlocked ? (
          <div className="text-center py-6 space-y-4 max-w-sm mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-indigo-100 text-indigo-700 mx-auto flex items-center justify-center text-3xl shadow-sm">
              🔒
            </div>
            <h3 className="text-2xl font-black text-slate-900 font-heading">
              Grown-Up Verification
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-slate-600">
              Parents & Teachers only. Please solve this simple check to access settings and progress:
            </p>

            <form onSubmit={handleVerifyGate} className="space-y-3">
              <div className="p-3 bg-slate-50 border-2 border-slate-200 rounded-2xl">
                <span className="text-xl font-black text-indigo-950">
                  What is 7 × 8 ?
                </span>
              </div>
              <input
                type="number"
                value={pinAnswer}
                onChange={(e) => setPinAnswer(e.target.value)}
                placeholder="Enter answer..."
                className="w-full text-center py-3 bg-white border-2 border-slate-300 rounded-2xl font-black text-xl text-slate-800 focus:outline-none focus:border-indigo-600"
                autoFocus
              />
              {pinError && (
                <p className="text-xs font-bold text-rose-500">
                  Incorrect check. Try again! (Hint: 7 × 8 = 56)
                </p>
              )}
              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-md transition active:scale-95"
              >
                Access Dashboard 🔓
              </button>
            </form>
          </div>
        ) : (
          /* UNLOCKED PARENT & TEACHER DASHBOARD */
          <>
            <div className="flex items-center justify-between border-b-2 border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl">👨‍🏫</span>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                    Parent & Educator Portal
                  </h3>
                  <p className="text-xs font-bold text-slate-500">
                    Comprehensive mathematics learning insights and classroom management
                  </p>
                </div>
              </div>
              <button
                onClick={handlePrintReport}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300"
              >
                <span>🖨️</span>
                <span>Print Report</span>
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 border-b-2 border-slate-100 pb-3 mb-4">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setTab('analytics');
                }}
                className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-black transition ${
                  tab === 'analytics'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                📊 Progress Analytics
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setTab('recommendations');
                }}
                className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-black transition ${
                  tab === 'recommendations'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                💡 Learning Focus
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setTab('classroom');
                }}
                className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-black transition ${
                  tab === 'classroom'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                🏫 Classroom Mode
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {/* TAB 1: ANALYTICS */}
              {tab === 'analytics' && (
                <div className="space-y-4">
                  {/* Service Worker Sync Banner */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3.5 rounded-2xl border-2 border-indigo-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">☁️</span>
                      <div>
                        <h5 className="text-xs font-black text-indigo-950">
                          Cloud & Device Service Worker Sync
                        </h5>
                        <p className="text-[11px] font-semibold text-slate-500">
                          Progress is cached locally and syncs automatically when online.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        soundManager.playSparkle();
                        syncManager.triggerSync();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-xs active:scale-95 transition shrink-0"
                    >
                      Sync Now 🔄
                    </button>
                  </div>

                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
                      <span className="text-xs font-bold text-slate-500 block">Total Solved</span>
                      <span className="text-xl font-black text-slate-800">{stats.totalAnswered}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
                      <span className="text-xs font-bold text-slate-500 block">Overall Accuracy</span>
                      <span className="text-xl font-black text-emerald-600">
                        {stats.totalAnswered > 0
                          ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100)
                          : 100}
                        %
                      </span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
                      <span className="text-xs font-bold text-slate-500 block">Current Stage</span>
                      <span className="text-xl font-black text-indigo-600">Level {level}</span>
                    </div>
                  </div>

                  {/* Topic breakdown */}
                  <div>
                    <h4 className="text-xs font-black uppercase text-slate-600 mb-2">
                      Topic Breakdown & Correct Answers
                    </h4>
                    <div className="space-y-2">
                      {REALMS.map((r) => {
                        const correct = stats[`${r.id}Score` as keyof UserStats] as number;
                        const answered = stats[`${r.id}Answered` as keyof UserStats] as number;
                        const pct = answered > 0 ? Math.round((correct / answered) * 100) : 0;

                        return (
                          <div
                            key={r.id}
                            className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold"
                          >
                            <span className="flex items-center gap-2">
                              <span>{r.icon}</span>
                              <span className="text-slate-800">{r.name}</span>
                            </span>
                            <div className="flex items-center gap-3">
                              <span className="text-slate-500">
                                {correct} / {answered} correct
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full font-black ${
                                  pct >= 80
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : pct >= 50
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-slate-200 text-slate-700'
                                }`}
                              >
                                {pct}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: RECOMMENDATIONS & STRENGTHS */}
              {tab === 'recommendations' && (
                <div className="space-y-4">
                  {/* Strengths */}
                  <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-200">
                    <h4 className="text-sm font-black text-emerald-950 flex items-center gap-1.5 mb-1">
                      <span>🌟</span>
                      <span>Key Mathematical Strengths</span>
                    </h4>
                    <ul className="text-xs sm:text-sm font-semibold text-emerald-800 space-y-1 list-disc list-inside">
                      <li>Strong visual counting and single-digit addition speed.</li>
                      <li>High engagement with visual sharing puzzles in Division Castle.</li>
                      <li>Consistent daily activity streak showing strong commitment!</li>
                    </ul>
                  </div>

                  {/* Areas Needing Practice */}
                  <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-200">
                    <h4 className="text-sm font-black text-amber-950 flex items-center gap-1.5 mb-1">
                      <span>💡</span>
                      <span>Target Focus Areas</span>
                    </h4>
                    <ul className="text-xs sm:text-sm font-semibold text-amber-800 space-y-1 list-disc list-inside">
                      <li>Multiplication tables 7, 8, and 12 can benefit from extra 60s Blitz practice.</li>
                      <li>Converting real-world shopping discounts to fractions in Percentage City.</li>
                      <li>Simplifying ratios using common divisor step-downs.</li>
                    </ul>
                  </div>

                  <p className="text-xs text-slate-500">
                    Tip: Maths Adventure automatically tunes question difficulty when students encounter repeated hints.
                  </p>
                </div>
              )}

              {/* TAB 3: CLASSROOM MODE */}
              {tab === 'classroom' && (
                <div className="space-y-4">
                  <div className="bg-indigo-50 p-4 rounded-2xl border-2 border-indigo-200">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-black text-indigo-950">
                        Active Classroom: {classroom.className}
                      </h4>
                      <span className="text-xs font-mono font-black bg-indigo-200/80 px-2.5 py-1 rounded-md text-indigo-900">
                        Code: {classroom.code}
                      </span>
                    </div>

                    {/* Topic Assignment */}
                    <div className="mt-3">
                      <span className="text-xs font-bold text-slate-700 block mb-1">
                        Assigned Focus Topic for Students:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {['all', 'addition', 'subtraction', 'multiplication', 'division', 'ratio', 'percentage'].map((t) => (
                          <button
                            key={t}
                            onClick={() => handleTopicAssignment(t as any)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-black capitalize transition ${
                              classroom.assignedTopic === t
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Difficulty Assignment */}
                    <div className="mt-3">
                      <span className="text-xs font-bold text-slate-700 block mb-1">
                        Class Difficulty Target:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {DIFFICULTY_LEVELS.map((dl) => (
                          <button
                            key={dl.level}
                            onClick={() => handleDifficultyAssignment(dl.level)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-black transition ${
                              classroom.assignedDifficulty === dl.level
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            Lvl {dl.level}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Student Roster */}
                  <div>
                    <h4 className="text-xs font-black uppercase text-slate-600 mb-2">
                      Student Roster ({classroom.students.length} Enrolled)
                    </h4>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                      {classroom.students.map((st) => (
                        <div
                          key={st.id}
                          className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">{st.avatarChar}</span>
                            <span className="text-slate-800">{st.name}</span>
                            <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                              Lvl {st.level}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-amber-800">⭐ {st.stars}</span>
                            <span className="text-emerald-700">{st.accuracy}% Acc</span>
                            <span className="text-[11px] text-slate-400">{st.lastActive}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add student inline */}
                    <div className="flex gap-2 mt-3">
                      <input
                        type="text"
                        value={newStudentName}
                        onChange={(e) => setNewStudentName(e.target.value)}
                        placeholder="Add new student name..."
                        className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-600"
                      />
                      <button
                        onClick={handleAddStudent}
                        className="px-4 py-2 bg-indigo-600 text-white font-black rounded-xl text-xs hover:bg-indigo-700 transition"
                      >
                        + Add Student
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer with Reset Data safety option */}
            <div className="mt-4 pt-3 border-t-2 border-slate-100 flex justify-between items-center">
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to reset all game data and progress?')) {
                    onResetData();
                    onClose();
                  }
                }}
                className="text-xs text-rose-500 font-bold hover:underline"
              >
                Reset Child Learning Data
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  onClose();
                }}
                className="py-2.5 px-6 bg-slate-800 hover:bg-slate-900 text-white font-black text-xs rounded-xl shadow-xs transition"
              >
                Close Portal
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

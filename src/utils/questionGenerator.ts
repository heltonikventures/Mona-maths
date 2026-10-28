import { DifficultyLevel, MathQuestion, MathTopic, VisualAidData } from '../types';

// Helper to pick random element from array
const pickRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Helper to shuffle array
const shuffle = <T>(arr: T[]): T[] => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

// Generates 3 distinct distractor options near the correct answer
function generateDistractors(correct: number, range: number = 3, allowNegative = false): number[] {
  const distractors = new Set<number>();
  let attempts = 0;
  
  while (distractors.size < 3 && attempts < 50) {
    attempts++;
    const offset = (Math.floor(Math.random() * range) + 1) * (Math.random() > 0.5 ? 1 : -1);
    const candidate = correct + offset;
    if (candidate !== correct && (allowNegative || candidate >= 0)) {
      distractors.add(candidate);
    }
  }

  // Fallback if needed
  let fallback = 1;
  while (distractors.size < 3) {
    if (correct + fallback !== correct && (allowNegative || correct + fallback >= 0)) {
      distractors.add(correct + fallback);
    }
    fallback++;
  }

  return Array.from(distractors);
}

// 1. ADDITION
function generateAdditionQuestion(difficulty: DifficultyLevel): MathQuestion {
  const fruits = ['🍎', '🍌', '🍓', '🍊', '🍇', '🍉', '🍍'];
  const fruit = pickRandom(fruits);
  let a = 1;
  let b = 1;

  if (difficulty === 1) {
    // Beginner: sums up to 10 with visual fruit basket
    a = Math.floor(Math.random() * 5) + 1;
    b = Math.floor(Math.random() * 5) + 1;
    const ans = a + b;
    const visual: VisualAidData = {
      type: 'fruit',
      itemEmoji: fruit,
      countA: a,
      countB: b,
      total: ans,
    };
    const options = shuffle([ans, ...generateDistractors(ans, 2)]);

    return {
      id: `add-${Date.now()}-${Math.random()}`,
      topic: 'addition',
      difficulty,
      questionText: `Fruit Basket: Count the delicious fruits! How many are there in total?`,
      equationText: `${fruit.repeat(a)} + ${fruit.repeat(b)} = ?`,
      storyContext: `Milo is gathering fruit for his tropical jungle picnic.`,
      visualAid: visual,
      options,
      correctAnswer: ans,
      hints: [
        `Count the first group of ${fruit} (${a}), then count on ${b} more!`,
        `Start at ${a} and say: ${Array.from({ length: b }, (_, i) => a + i + 1).join(', ')}!`,
      ],
      explanation: `${a} plus ${b} equals ${ans}! Delicious math!`,
      format: 'multiple-choice',
    };
  }

  if (difficulty === 2) {
    // Explorer: sums up to 20
    a = Math.floor(Math.random() * 9) + 4;
    b = Math.floor(Math.random() * 8) + 3;
    const ans = a + b;
    const options = shuffle([ans, ...generateDistractors(ans, 3)]);

    return {
      id: `add-${Date.now()}-${Math.random()}`,
      topic: 'addition',
      difficulty,
      questionText: `Number Balloons: Add the two balloons together!`,
      equationText: `${a} + ${b} = ?`,
      storyContext: `Luna is filling balloon rockets with math energy!`,
      visualAid: {
        type: 'counter-blocks',
        countA: a,
        countB: b,
        total: ans,
      },
      options,
      correctAnswer: ans,
      hints: [
        `Try making 10 first! How many from ${b} can we add to ${a} to reach 10?`,
        `${a} + ${10 - (a % 10 || 10)} gets us to a friendly round number!`,
      ],
      explanation: `${a} + ${b} = ${ans}. Great calculation!`,
      format: 'multiple-choice',
    };
  }

  if (difficulty === 3) {
    // Learner: Missing number puzzle e.g. 8 + ? = 15 or two digit
    const ans = Math.floor(Math.random() * 8) + 4;
    a = Math.floor(Math.random() * 9) + 3;
    const total = a + ans;
    const options = shuffle([ans, ...generateDistractors(ans, 3)]);

    return {
      id: `add-${Date.now()}-${Math.random()}`,
      topic: 'addition',
      difficulty,
      questionText: `Missing Number Detective: Find the missing magic number!`,
      equationText: `${a} + ❓ = ${total}`,
      storyContext: `Pip the friendly robot lost a number cog from his circuit board.`,
      visualAid: {
        type: 'counter-blocks',
        countA: a,
        total: total,
      },
      options,
      correctAnswer: ans,
      hints: [
        `Think: What number do you add to ${a} to reach ${total}?`,
        `You can also subtract: ${total} − ${a} gives the missing piece!`,
      ],
      explanation: `${a} + ${ans} = ${total}. You solved the puzzle!`,
      format: 'multiple-choice',
    };
  }

  if (difficulty >= 4 && difficulty <= 5) {
    // Two digit with carrying or story word problem
    a = Math.floor(Math.random() * 35) + 18;
    b = Math.floor(Math.random() * 35) + 15;
    const ans = a + b;
    const options = shuffle([ans, ...generateDistractors(ans, 4)]);

    return {
      id: `add-${Date.now()}-${Math.random()}`,
      topic: 'addition',
      difficulty,
      questionText: `Bobo has ${a} shiny gold coins and Zara brings him ${b} more. How many coins do they have together?`,
      equationText: `${a} + ${b} = ?`,
      storyContext: `Adventure Island treasure expedition!`,
      visualAid: {
        type: 'counter-blocks',
        countA: a,
        countB: b,
        total: ans,
      },
      options,
      correctAnswer: ans,
      hints: [
        `Add the tens first: ${Math.floor(a/10)*10} + ${Math.floor(b/10)*10} = ${Math.floor(a/10)*10 + Math.floor(b/10)*10}.`,
        `Now add the units: ${a % 10} + ${b % 10} = ${(a % 10) + (b % 10)}. Combine them!`,
      ],
      explanation: `${a} + ${b} = ${ans} coins in the treasure chest!`,
      format: 'multiple-choice',
    };
  }

  // Difficulty 6 - 7: Three digits / word problem
  a = Math.floor(Math.random() * 300) + 120;
  b = Math.floor(Math.random() * 300) + 115;
  const ans = a + b;
  const options = shuffle([ans, ...generateDistractors(ans, 10)]);

  return {
    id: `add-${Date.now()}-${Math.random()}`,
    topic: 'addition',
    difficulty,
    questionText: `Maths Hero Challenge: Milo hiked ${a} metres in the morning and ${b} metres up the mountain in the afternoon. What was his total distance?`,
    equationText: `${a} + ${b} = ?`,
    storyContext: `Epic mountain trek to the peak!`,
    options,
    correctAnswer: ans,
    hints: [
      `Add hundreds: ${Math.floor(a/100)*100} + ${Math.floor(b/100)*100}.`,
      `Add the remaining tens and ones together carefully!`,
    ],
    explanation: `${a} + ${b} = ${ans} metres travelled!`,
    format: 'multiple-choice',
  };
}

// 2. SUBTRACTION
function generateSubtractionQuestion(difficulty: DifficultyLevel): MathQuestion {
  if (difficulty === 1) {
    // Monster food: small numbers
    const total = Math.floor(Math.random() * 5) + 5; // 5-9
    const eaten = Math.floor(Math.random() * (total - 2)) + 1;
    const ans = total - eaten;
    const options = shuffle([ans, ...generateDistractors(ans, 2)]);

    return {
      id: `sub-${Date.now()}-${Math.random()}`,
      topic: 'subtraction',
      difficulty,
      questionText: `Monster Food: Grumble the friendly hungry monster had ${total} juicy apples 🍎 and ate ${eaten} of them. How many are left?`,
      equationText: `${total} − ${eaten} = ?`,
      storyContext: `Grumble loves snacking in the Subtraction Forest!`,
      visualAid: {
        type: 'fruit',
        itemEmoji: '🍎',
        total: total,
        countA: eaten,
        countB: ans,
      },
      options,
      correctAnswer: ans,
      hints: [
        `Imagine starting with ${total} apples. Take away ${eaten} one by one.`,
        `Count backwards from ${total}: ${Array.from({ length: eaten }, (_, i) => total - (i + 1)).join(', ')}!`,
      ],
      explanation: `${total} − ${eaten} = ${ans} apples remaining for Grumble!`,
      format: 'multiple-choice',
    };
  }

  if (difficulty === 2) {
    const total = 15;
    const eaten = Math.floor(Math.random() * 5) + 4; // 4 to 8
    const ans = total - eaten;
    const options = shuffle([ans, ...generateDistractors(ans, 3)]);

    return {
      id: `sub-${Date.now()}-${Math.random()}`,
      topic: 'subtraction',
      difficulty,
      questionText: `Balloon Popping: Pip had ${total} colorful balloons. A gentle breeze popped ${eaten}. How many balloons are still floating?`,
      equationText: `${total} − ${eaten} = ?`,
      storyContext: `Whimsical festival in Subtraction Forest!`,
      visualAid: {
        type: 'fruit',
        itemEmoji: '🎈',
        total: total,
        countA: eaten,
        countB: ans,
      },
      options,
      correctAnswer: ans,
      hints: [
        `Subtract down to 10 first: ${total} − 5 = 10.`,
        `Now subtract the rest of ${eaten}: 10 − ${eaten - 5} = ?`,
      ],
      explanation: `${total} − ${eaten} = ${ans}. Awesome popping!`,
      format: 'multiple-choice',
    };
  }

  if (difficulty === 3) {
    // Missing number: e.g. 18 - ? = 9
    const ans = Math.floor(Math.random() * 7) + 3;
    const total = Math.floor(Math.random() * 10) + ans + 5;
    const diff = total - ans;
    const options = shuffle([ans, ...generateDistractors(ans, 3)]);

    return {
      id: `sub-${Date.now()}-${Math.random()}`,
      topic: 'subtraction',
      difficulty,
      questionText: `Animal Rescue: Find how many cute woodland squirrels scampered up the oak tree!`,
      equationText: `${total} − ❓ = ${diff}`,
      storyContext: `Zara the clever fox is tracking squirrel footprints.`,
      options,
      correctAnswer: ans,
      hints: [
        `What do you take away from ${total} to be left with ${diff}?`,
        `You can find it by calculating: ${total} − ${diff} = ?`,
      ],
      explanation: `${total} − ${ans} = ${diff}. Mystery solved!`,
      format: 'multiple-choice',
    };
  }

  if (difficulty >= 4 && difficulty <= 5) {
    // Two digit with borrowing
    const b = Math.floor(Math.random() * 25) + 16;
    const ans = Math.floor(Math.random() * 25) + 12;
    const a = b + ans;
    const options = shuffle([ans, ...generateDistractors(ans, 4)]);

    return {
      id: `sub-${Date.now()}-${Math.random()}`,
      topic: 'subtraction',
      difficulty,
      questionText: `Luna packed ${a} berries in her exploration pouch. She shared ${b} berries with the baby birds. How many berries does she have left?`,
      equationText: `${a} − ${b} = ?`,
      storyContext: `Helping woodland creatures in the forest!`,
      options,
      correctAnswer: ans,
      hints: [
        `First subtract ${Math.floor(b/10)*10}: ${a} − ${Math.floor(b/10)*10} = ${a - Math.floor(b/10)*10}.`,
        `Then subtract the remaining ${b % 10} from ${a - Math.floor(b/10)*10}.`,
      ],
      explanation: `${a} − ${b} = ${ans} berries left!`,
      format: 'multiple-choice',
    };
  }

  // Difficulty 6 - 7: Three-digit subtraction
  const b = Math.floor(Math.random() * 180) + 120;
  const ans = Math.floor(Math.random() * 200) + 100;
  const a = b + ans;
  const options = shuffle([ans, ...generateDistractors(ans, 8)]);

  return {
    id: `sub-${Date.now()}-${Math.random()}`,
    topic: 'subtraction',
    difficulty,
    questionText: `Maths Master: The ancient castle gate needs ${a} energy sparks. Pip discharges ${b} sparks into the lock. How many sparks are still needed?`,
    equationText: `${a} − ${b} = ?`,
    storyContext: `Unlocking the ancient magical stone portal!`,
    options,
    correctAnswer: ans,
    hints: [
      `Break ${b} into ${Math.floor(b/100)*100} and ${b % 100}.`,
      `Subtract the hundreds first, then step down with the tens and ones.`,
    ],
    explanation: `${a} − ${b} = ${ans} sparks remaining!`,
    format: 'multiple-choice',
  };
}

// 3. MULTIPLICATION
function generateMultiplicationQuestion(difficulty: DifficultyLevel): MathQuestion {
  let a: number;
  let b: number;

  if (difficulty === 1 || difficulty === 2) {
    // 2, 5, or 10 times table with star/dot array
    a = pickRandom([2, 5, 10]);
    b = Math.floor(Math.random() * 6) + 1;
    const ans = a * b;
    const options = shuffle([ans, ...generateDistractors(ans, 4)]);

    return {
      id: `mul-${Date.now()}-${Math.random()}`,
      topic: 'multiplication',
      difficulty,
      questionText: `Multiplication Mountain: Climb higher! Count ${b} groups of ${a} shining stars ⭐!`,
      equationText: `${a} × ${b} = ?`,
      storyContext: `Bobo is leaping from rock to rock climbing the mountain!`,
      visualAid: {
        type: 'array',
        rows: Math.min(b, 6),
        cols: a,
        itemEmoji: '⭐',
        total: ans,
      },
      options,
      correctAnswer: ans,
      hints: [
        `Multiplication is repeated addition! Add ${a}, ${b} times.`,
        `Skip count by ${a}: ${Array.from({ length: b }, (_, i) => a * (i + 1)).join(', ')}!`,
      ],
      explanation: `${a} × ${b} = ${ans}! You leapt upward!`,
      format: 'multiple-choice',
    };
  }

  if (difficulty === 3) {
    // 3, 4, 6 times tables
    a = pickRandom([3, 4, 6]);
    b = Math.floor(Math.random() * 8) + 2;
    const ans = a * b;
    const options = shuffle([ans, ...generateDistractors(ans, 5)]);

    return {
      id: `mul-${Date.now()}-${Math.random()}`,
      topic: 'multiplication',
      difficulty,
      questionText: `Rocket Launch: Fuel the rocket engine with ${a} × ${b} power cells!`,
      equationText: `${a} × ${b} = ?`,
      storyContext: `Pip is preparing the cosmic explorer rocket.`,
      visualAid: {
        type: 'array',
        rows: Math.min(a, 6),
        cols: Math.min(b, 8),
        itemEmoji: '🔋',
        total: ans,
      },
      options,
      correctAnswer: ans,
      hints: [
        `Think of ${a} rows with ${b} power cells in each row.`,
        `If ${a} × ${b - 1} = ${a * (b - 1)}, just add ${a} one more time!`,
      ],
      explanation: `${a} × ${b} = ${ans} power cells loaded! Blast off!`,
      format: 'multiple-choice',
    };
  }

  if (difficulty === 4 || difficulty === 5) {
    // Tables 6, 7, 8, 9, 12!
    a = pickRandom([6, 7, 8, 9, 12]);
    b = Math.floor(Math.random() * 9) + 2;
    const ans = a * b;
    const options = shuffle([ans, ...generateDistractors(ans, 6)]);

    return {
      id: `mul-${Date.now()}-${Math.random()}`,
      topic: 'multiplication',
      difficulty,
      questionText: `Mountain Peak Challenge: What is ${a} multiplied by ${b}?`,
      equationText: `${a} × ${b} = ?`,
      storyContext: `Luna is near the snowy mountain summit!`,
      options,
      correctAnswer: ans,
      hints: [
        `Break down: ${a} × ${b} is the same as (${a} × 5) + (${a} × ${b - 5 > 0 ? b - 5 : 0})!`,
        `${a} × 10 = ${a * 10}. Adjust from there!`,
      ],
      explanation: `${a} × ${b} = ${ans}! Mountain conquered!`,
      format: 'multiple-choice',
    };
  }

  // Difficulty 6 - 7: Missing factor / multi-digit
  a = pickRandom([7, 8, 9, 11, 12]);
  const factor = Math.floor(Math.random() * 8) + 4;
  const product = a * factor;
  const options = shuffle([factor, ...generateDistractors(factor, 3)]);

  return {
    id: `mul-${Date.now()}-${Math.random()}`,
    topic: 'multiplication',
    difficulty,
    questionText: `Missing Factor Treasure: Find the magic multiplier to open the vault!`,
    equationText: `${a} × ❓ = ${product}`,
    storyContext: `Zara found an ancient chest etched with times table runes!`,
    options,
    correctAnswer: factor,
    hints: [
      `How many times does ${a} fit into ${product}?`,
      `Think about the ${a} times table or divide: ${product} ÷ ${a}.`,
    ],
    explanation: `${a} × ${factor} = ${product}! The vault opened!`,
    format: 'multiple-choice',
  };
}

// 4. DIVISION
function generateDivisionQuestion(difficulty: DifficultyLevel): MathQuestion {
  if (difficulty <= 2) {
    // Share the treasure: dividing small numbers equally e.g. 12 ÷ 3 = 4
    const divisor = pickRandom([2, 3, 4, 5]);
    const ans = Math.floor(Math.random() * 4) + 2; // 2 to 5
    const total = divisor * ans;
    const options = shuffle([ans, ...generateDistractors(ans, 2)]);

    return {
      id: `div-${Date.now()}-${Math.random()}`,
      topic: 'division',
      difficulty,
      questionText: `Share the Treasure: Milo has ${total} golden coins 🪙 and shares them equally among ${divisor} adventurer friends. How many coins does each friend receive?`,
      equationText: `${total} ÷ ${divisor} = ?`,
      storyContext: `Fair sharing in the grand Division Castle courtyard!`,
      visualAid: {
        type: 'sharing',
        total: total,
        groups: divisor,
        itemsPerGroup: ans,
        itemEmoji: '🪙',
      },
      options,
      correctAnswer: ans,
      hints: [
        `Divide ${total} items evenly into ${divisor} groups.`,
        `Ask yourself: What number times ${divisor} makes ${total}? (❓ × ${divisor} = ${total})`,
      ],
      explanation: `${total} ÷ ${divisor} = ${ans}! Everyone gets an equal share of ${ans} coins!`,
      format: 'multiple-choice',
    };
  }

  if (difficulty === 3) {
    // Cookie sharing e.g. 24 ÷ 6 = 4
    const divisor = pickRandom([3, 4, 6, 8]);
    const ans = Math.floor(Math.random() * 6) + 3;
    const total = divisor * ans;
    const options = shuffle([ans, ...generateDistractors(ans, 3)]);

    return {
      id: `div-${Date.now()}-${Math.random()}`,
      topic: 'division',
      difficulty,
      questionText: `Cookie Feast: Chef Bobo baked ${total} chocolate chip cookies 🍪. He plates them equally on ${divisor} royal plates. How many cookies go on each plate?`,
      equationText: `${total} ÷ ${divisor} = ?`,
      storyContext: `Royal bakery banquet in Division Castle!`,
      visualAid: {
        type: 'sharing',
        total: total,
        groups: divisor,
        itemsPerGroup: ans,
        itemEmoji: '🍪',
      },
      options,
      correctAnswer: ans,
      hints: [
        `Think in reverse: What times ${divisor} equals ${total}?`,
        `${divisor} × ${ans} = ${total}!`,
      ],
      explanation: `${total} ÷ ${divisor} = ${ans} delicious cookies per plate!`,
      format: 'multiple-choice',
    };
  }

  if (difficulty === 4 || difficulty === 5) {
    // Castle room doors: larger division facts (e.g. 56 ÷ 7, 72 ÷ 8, 84 ÷ 7)
    const divisor = pickRandom([6, 7, 8, 9]);
    const ans = Math.floor(Math.random() * 6) + 4;
    const total = divisor * ans;
    const options = shuffle([ans, ...generateDistractors(ans, 3)]);

    return {
      id: `div-${Date.now()}-${Math.random()}`,
      topic: 'division',
      difficulty,
      questionText: `Magical Castle Door: To enter the Secret Chamber of Knowledge, solve this division lock!`,
      equationText: `${total} ÷ ${divisor} = ?`,
      storyContext: `Luna is exploring the higher tower turrets!`,
      options,
      correctAnswer: ans,
      hints: [
        `Use your times table knowledge for ${divisor}!`,
        `${divisor} × 5 = ${divisor * 5}. How much further to ${total}?`,
      ],
      explanation: `${total} ÷ ${divisor} = ${ans}! The castle doors swing open!`,
      format: 'multiple-choice',
    };
  }

  // Difficulty 6 - 7: Remainder challenge or large division!
  const divisor = pickRandom([3, 4, 5, 6]);
  const quotient = Math.floor(Math.random() * 5) + 3;
  const remainder = Math.floor(Math.random() * (divisor - 1)) + 1;
  const total = divisor * quotient + remainder;

  const correctText = `${quotient} R ${remainder}`;
  const d1 = `${quotient + 1} R ${remainder}`;
  const d2 = `${quotient} R ${(remainder % divisor) + 1}`;
  const d3 = `${quotient - 1} R ${remainder}`;
  const options = shuffle([correctText, d1, d2, d3]);

  return {
    id: `div-${Date.now()}-${Math.random()}`,
    topic: 'division',
    difficulty,
    questionText: `Royal Remainder Mystery: ${total} gems are divided among ${divisor} treasure chests. How many gems go into each chest, and what is the remainder?`,
    equationText: `${total} ÷ ${divisor} = ?`,
    storyContext: `Sorting rare gems in the King's Armory!`,
    visualAid: {
      type: 'sharing',
      total: total,
      groups: divisor,
      itemsPerGroup: quotient,
      remainder: remainder,
      itemEmoji: '💎',
    },
    options,
    correctAnswer: correctText,
    hints: [
      `What is the largest multiple of ${divisor} that fits inside ${total}? (${divisor} × ${quotient} = ${divisor * quotient})`,
      `How many are left over? (${total} − ${divisor * quotient} = ${remainder})`,
    ],
    explanation: `${total} ÷ ${divisor} = ${quotient} with remainder ${remainder}!`,
    format: 'multiple-choice',
  };
}

// 5. RATIO
function generateRatioQuestion(difficulty: DifficultyLevel): MathQuestion {
  if (difficulty <= 2) {
    // Concrete visual ratio: blue balls to red balls 🔵🔵🔵 : 🔴🔴
    const countA = pickRandom([2, 3, 4]);
    const countB = pickRandom([1, 2, 3, 5]);
    const correctRatio = `${countA} : ${countB}`;
    const d1 = `${countB} : ${countA}`;
    const d2 = `${countA + 1} : ${countB}`;
    const d3 = `${countA} : ${countB + 1}`;
    const options = shuffle([correctRatio, d1, d2, d3]);

    return {
      id: `rat-${Date.now()}-${Math.random()}`,
      topic: 'ratio',
      difficulty,
      questionText: `Ratio River: Look at the colourful river stones! What is the ratio of Blue Stones 🔵 to Red Stones 🔴?`,
      equationText: `${'🔵'.repeat(countA)} : ${'🔴'.repeat(countB)}`,
      storyContext: `Milo and Pip are skipping magic river stones across Ratio River.`,
      visualAid: {
        type: 'ratio-bars',
        ratioA: { label: 'Blue Stones', count: countA, color: '#3B82F6', emoji: '🔵' },
        ratioB: { label: 'Red Stones', count: countB, color: '#EF4444', emoji: '🔴' },
      },
      options,
      correctAnswer: correctRatio,
      hints: [
        `Count how many blue stones first: ${countA}.`,
        `Then count how many red stones: ${countB}. Write it as Blue : Red!`,
      ],
      explanation: `There are ${countA} blue stones and ${countB} red stones, so the ratio is ${correctRatio}!`,
      format: 'multiple-choice',
    };
  }

  if (difficulty === 3 || difficulty === 4) {
    // Fruit or animal ratio with simplifying (e.g. 4 apples to 2 bananas -> 2 : 1)
    const factor = pickRandom([2, 3]);
    const baseA = pickRandom([1, 2, 3]);
    const baseB = pickRandom([1, 2, 4]);
    const countA = baseA * factor;
    const countB = baseB * factor;
    const simplified = `${baseA} : ${baseB}`;
    const unsimplified = `${countA} : ${countB}`;

    const d1 = `${baseB} : ${baseA}`;
    const d2 = `${baseA + 1} : ${baseB}`;
    const d3 = `${baseA} : ${baseB + 2}`;
    const options = shuffle([simplified, d1, d2, d3]);

    return {
      id: `rat-${Date.now()}-${Math.random()}`,
      topic: 'ratio',
      difficulty,
      questionText: `River Recipe: Bobo has ${countA} Apples 🍏 and ${countB} Oranges 🍊. What is the simplified ratio of Apples to Oranges?`,
      equationText: `${countA} : ${countB} in simplest form`,
      storyContext: `Brewing a delicious fruit smoothie by the riverbank!`,
      visualAid: {
        type: 'ratio-bars',
        ratioA: { label: 'Apples', count: countA, color: '#10B981', emoji: '🍏' },
        ratioB: { label: 'Oranges', count: countB, color: '#F97316', emoji: '🍊' },
      },
      options,
      correctAnswer: simplified,
      hints: [
        `The original ratio is ${unsimplified}. Both numbers can be divided by ${factor}!`,
        `Divide both sides: ${countA} ÷ ${factor} = ${baseA}, and ${countB} ÷ ${factor} = ${baseB}.`,
      ],
      explanation: `${countA} : ${countB} simplifies to ${simplified}! Excellent simplification!`,
      format: 'multiple-choice',
    };
  }

  // Difficulty 5 - 7: Equivalent ratio word problem
  // e.g. "If the ratio of toy cars to toy trucks is 3 : 2, and Zara has 9 cars, how many trucks does she have?"
  const rA = pickRandom([2, 3, 4]);
  const rB = pickRandom([1, 3, 5]);
  const multiplier = pickRandom([2, 3, 4]);
  const knownA = rA * multiplier;
  const correctTrucks = rB * multiplier;

  const options = shuffle([correctTrucks, ...generateDistractors(correctTrucks, 3)]);

  return {
    id: `rat-${Date.now()}-${Math.random()}`,
    topic: 'ratio',
    difficulty,
    questionText: `Ratio River Pro: In an animal sanctuary, the ratio of playful Otters to Turtles is ${rA} : ${rB}. If there are ${knownA} Otters, how many Turtles are there?`,
    equationText: `${rA} : ${rB} = ${knownA} : ❓`,
    storyContext: `Zara is counting wildlife swimming in the crystal clear river!`,
    options,
    correctAnswer: correctTrucks,
    hints: [
      `Find the scale factor: ${knownA} ÷ ${rA} = ${multiplier}. The otters were multiplied by ${multiplier}!`,
      `Multiply the turtles by the same number: ${rB} × ${multiplier} = ?`,
    ],
    explanation: `${rA} : ${rB} scaled by ${multiplier} gives ${knownA} Otters to ${correctTrucks} Turtles!`,
    format: 'multiple-choice',
  };
}

// 6. PERCENTAGE
function generatePercentageQuestion(difficulty: DifficultyLevel): MathQuestion {
  if (difficulty <= 2) {
    // Visual 100-grid or simple fraction equivalents (50%, 25%, 10%)
    const pct = pickRandom([50, 25, 75, 10, 20]);
    const correctStr = `${pct}%`;
    const options = shuffle([correctStr, `${(pct + 15) % 100}%`, `${Math.max(5, pct - 20)}%`, `${pct === 50 ? '30%' : '50%'}`]);

    let visualDesc = '';
    if (pct === 50) visualDesc = 'Half of the chocolate bar (1/2)';
    if (pct === 25) visualDesc = 'One quarter of the toy battery (1/4)';
    if (pct === 75) visualDesc = 'Three quarters of the quest map (3/4)';
    if (pct === 10) visualDesc = 'One tenth of the power grid (1/10)';
    if (pct === 20) visualDesc = 'One fifth of the energy cell (1/5)';

    return {
      id: `pct-${Date.now()}-${Math.random()}`,
      topic: 'percentage',
      difficulty,
      questionText: `Percentage City: Look at the power meter! ${visualDesc} is charged. What percentage is this?`,
      equationText: `${pct} out of 100 squares shaded`,
      storyContext: `Luna is recharging the city solar batteries.`,
      visualAid: {
        type: 'grid100',
        gridTotal: 100,
        gridShaded: pct,
      },
      options,
      correctAnswer: correctStr,
      hints: [
        `Remember that "Percent" means "out of 100"!`,
        `If ${pct} out of 100 blocks are lit, that equals exactly ${pct}%!`,
      ],
      explanation: `${pct} out of 100 is ${pct}%. City power restored!`,
      format: 'multiple-choice',
    };
  }

  if (difficulty === 3 || difficulty === 4) {
    // Pizza slice percentage or exam score
    // e.g. 4 slices out of 8 eaten = 50%, or 8 out of 10 correct = 80%
    const totalSlices = pickRandom([4, 5, 10]);
    let eaten = 0;
    let pct = 0;
    if (totalSlices === 4) {
      eaten = pickRandom([1, 2, 3]);
      pct = (eaten / 4) * 100;
    } else if (totalSlices === 5) {
      eaten = pickRandom([1, 2, 3, 4]);
      pct = (eaten / 5) * 100;
    } else {
      eaten = pickRandom([3, 7, 9]);
      pct = (eaten / 10) * 100;
    }

    const correctStr = `${pct}%`;
    const options = shuffle([correctStr, `${pct + 10}%`, `${Math.max(10, pct - 20)}%`, `${100 - pct}%`]);

    return {
      id: `pct-${Date.now()}-${Math.random()}`,
      topic: 'percentage',
      difficulty,
      questionText: `Pizza Percentages: Chef Pip baked a yummy pizza cut into ${totalSlices} equal slices 🍕. The team ate ${eaten} slices. What percentage of the pizza did they eat?`,
      equationText: `${eaten} / ${totalSlices} = ❓%`,
      storyContext: `Victory pizza party in Percentage City!`,
      visualAid: {
        type: 'grid100',
        gridTotal: 100,
        gridShaded: pct,
      },
      options,
      correctAnswer: correctStr,
      hints: [
        `Convert to a fraction out of 100. Multiply both top and bottom!`,
        `${eaten}/${totalSlices} = (${eaten} × ${100/totalSlices}) / 100.`,
      ],
      explanation: `${eaten} out of ${totalSlices} slices is equal to ${pct}%!`,
      format: 'multiple-choice',
    };
  }

  // Difficulty 5 - 7: Shopping discount in Naira / Dollars!
  // "A shop has a 20% discount. A toy costs ₦1,000. How much is the discount?"
  const basePrices = [1000, 2000, 500, 100, 200, 800];
  const discounts = [10, 20, 25, 50];
  const price = pickRandom(basePrices);
  const discountPct = pickRandom(discounts);
  const discountAmount = (price * discountPct) / 100;

  const currency = '₦'; // As specified in the user brief (₦1,000)
  const correctStr = `${currency}${discountAmount}`;
  const d1 = `${currency}${discountAmount + (discountAmount > 100 ? 50 : 10)}`;
  const d2 = `${currency}${Math.max(10, discountAmount - (discountAmount > 100 ? 50 : 10))}`;
  const d3 = `${currency}${price - discountAmount}`;
  const options = shuffle([correctStr, d1, d2, d3]);

  return {
    id: `pct-${Date.now()}-${Math.random()}`,
    topic: 'percentage',
    difficulty,
    questionText: `Shopping Spree: The Toy Emporium has a huge ${discountPct}% off sale! A magical robot kit costs ${currency}${price.toLocaleString()}. How much money is the discount?`,
    equationText: `${discountPct}% of ${currency}${price.toLocaleString()} = ?`,
    storyContext: `Saving money at the bustling Percentage City Mall!`,
    visualAid: {
      type: 'grid100',
      gridTotal: 100,
      gridShaded: discountPct,
    },
    options,
    correctAnswer: correctStr,
    hints: [
      `${discountPct}% is equal to ${discountPct} / 100.`,
      `To calculate: (${price} × ${discountPct}) ÷ 100.`,
    ],
    explanation: `${discountPct}% of ${currency}${price.toLocaleString()} is ${correctStr}! Huge savings!`,
    format: 'multiple-choice',
  };
}

// Master question generator function
export function generateQuestion(topic: MathTopic, difficulty: DifficultyLevel): MathQuestion {
  switch (topic) {
    case 'addition':
      return generateAdditionQuestion(difficulty);
    case 'subtraction':
      return generateSubtractionQuestion(difficulty);
    case 'multiplication':
      return generateMultiplicationQuestion(difficulty);
    case 'division':
      return generateDivisionQuestion(difficulty);
    case 'ratio':
      return generateRatioQuestion(difficulty);
    case 'percentage':
      return generatePercentageQuestion(difficulty);
    default:
      return generateAdditionQuestion(difficulty);
  }
}

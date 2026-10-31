// server/services/adaptiveMasteryEngine.js
// Adaptive Mastery Engine: 2-Parameter Logistic (2PL) IRT & FSRS / SM-2 Spaced Repetition

/**
 * 2PL IRT Probability Function
 * P(theta) = 1 / (1 + exp(-a * (theta - b)))
 * @param {number} theta - Student latent ability (-3.0 to +3.0)
 * @param {number} a - Discrimination parameter (default 1.0, typical 0.5 to 2.5)
 * @param {number} b - Difficulty parameter (-3.0 to +3.0)
 * @returns {number} Probability of correct answer (0 to 1)
 */
function calculate2PlProbability(theta, a = 1.0, b = 0.0) {
  const z = -a * (theta - b);
  if (z > 40) return 0;
  if (z < -40) return 1;
  return 1 / (1 + Math.exp(z));
}

/**
 * Updates student latent ability theta using empirical response observations.
 * Uses a regularized Newton-Raphson / Bayesian gradient update with a N(0, 1) prior.
 * @param {number} currentTheta - Current ability score
 * @param {Array<{ isCorrect: boolean, a?: number, b?: number }>} responses - Array of response items
 * @returns {{ newTheta: number, standardError: number }}
 */
function updateStudentAbility(currentTheta = 0.0, responses = []) {
  if (!responses || responses.length === 0) {
    return { newTheta: currentTheta, standardError: 1.0 };
  }

  let theta = currentTheta;
  const learningRate = 0.4;
  let totalInformation = 0.0;

  for (let iter = 0; iter < 5; iter++) {
    let scoreSum = 0.0;
    let infoSum = 0.0;

    for (const item of responses) {
      const a = item.a !== undefined ? item.a : 1.2;
      const b = item.b !== undefined ? item.b : 0.0;
      const u = item.isCorrect ? 1.0 : 0.0;

      const p = calculate2PlProbability(theta, a, b);
      const q = 1 - p;

      // First derivative with prior penalty (prior mean 0, variance 1)
      scoreSum += a * (u - p);
      // Fisher information
      infoSum += (a * a) * p * q;
    }

    // Include standard normal prior on ability: -theta
    const gradient = scoreSum - 0.2 * theta;
    const hessian = infoSum + 0.2;

    if (hessian > 1e-4) {
      const step = (gradient / hessian) * learningRate;
      theta += step;
      // Clamp theta between -3.5 and +3.5
      theta = Math.max(-3.5, Math.min(3.5, theta));
      if (Math.abs(step) < 1e-3) break;
    }
  }

  // Final information calculation
  for (const item of responses) {
    const a = item.a !== undefined ? item.a : 1.2;
    const b = item.b !== undefined ? item.b : 0.0;
    const p = calculate2PlProbability(theta, a, b);
    totalInformation += (a * a) * p * (1 - p);
  }

  const standardError = totalInformation > 0 ? Number((1 / Math.sqrt(totalInformation + 0.2)).toFixed(3)) : 1.0;

  return {
    newTheta: Number(theta.toFixed(3)),
    standardError
  };
}

/**
 * FSRS / SM-2 Spaced Repetition Scheduling Algorithm
 * Updates item stability, repetition interval, and next review date based on recall quality.
 * @param {Object} item - Current state: { intervalDays, repetitions, easinessFactor, lapses }
 * @param {number} quality - Quality of recall (1 to 5)
 * @returns {Object} Updated spaced repetition schedule
 */
function scheduleFsrsReview(item = {}, quality = 4) {
  const q = Math.max(1, Math.min(5, Math.round(quality)));

  let intervalDays = item.intervalDays || 1;
  let repetitions = item.repetitions || 0;
  let easinessFactor = item.easinessFactor || 2.5;
  let lapses = item.lapses || 0;

  // Update Easiness Factor according to SM-2 formula
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  easinessFactor = easinessFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (easinessFactor < 1.3) {
    easinessFactor = 1.3;
  }

  if (q < 3) {
    // Lapse / Recall Failure: Reset repetition count and interval to 1 day
    repetitions = 0;
    intervalDays = 1;
    lapses += 1;
  } else {
    // Successful Recall: Advance interval progression
    if (repetitions === 0) {
      intervalDays = 1;
    } else if (repetitions === 1) {
      intervalDays = 6;
    } else {
      intervalDays = Math.round(intervalDays * easinessFactor);
    }
    repetitions += 1;
  }

  const now = new Date();
  const nextReviewDate = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);

  return {
    intervalDays,
    repetitions,
    easinessFactor: Number(easinessFactor.toFixed(3)),
    lapses,
    isLapsed: q < 3,
    reviewedAt: now.toISOString(),
    nextReviewDate: nextReviewDate.toISOString().split("T")[0]
  };
}

/**
 * Analyzes candidate test attempts and review history to identify and rank top weak topics.
 * @param {Array<Object>} testAttempts - Array of past test evaluation results
 * @param {Array<Object>} fsrsItems - Array of spaced repetition items with lapses
 * @returns {Array<{ topic: string, subject: string, weaknessScore: number, accuracy: number, attempts: number, recommendation: string }>}
 */
function identifyTopWeakTopics(testAttempts = [], fsrsItems = []) {
  const topicStats = {};

  // Aggregate from mock test attempts
  (testAttempts || []).forEach((attempt) => {
    (attempt.questionEvaluations || []).forEach((q) => {
      const topicKey = `${q.subject || "General"}:::${q.topic || "Core"}`;
      if (!topicStats[topicKey]) {
        topicStats[topicKey] = {
          subject: q.subject || "General",
          topic: q.topic || "Core",
          totalQuestions: 0,
          attempted: 0,
          correct: 0,
          incorrect: 0,
          lapses: 0
        };
      }
      topicStats[topicKey].totalQuestions += 1;
      if (q.isAttempted) {
        topicStats[topicKey].attempted += 1;
        if (q.isCorrect) {
          topicStats[topicKey].correct += 1;
        } else {
          topicStats[topicKey].incorrect += 1;
        }
      }
    });
  });

  // Aggregate lapses from FSRS items
  (fsrsItems || []).forEach((item) => {
    if (item.topic) {
      const topicKey = `${item.subject || "General"}:::${item.topic}`;
      if (!topicStats[topicKey]) {
        topicStats[topicKey] = {
          subject: item.subject || "General",
          topic: item.topic,
          totalQuestions: 0,
          attempted: 0,
          correct: 0,
          incorrect: 0,
          lapses: 0
        };
      }
      topicStats[topicKey].lapses += (item.lapses || 0);
    }
  });

  const rankedTopics = Object.values(topicStats).map((stat) => {
    const accuracy = stat.attempted > 0 ? (stat.correct / stat.attempted) : 0.5;
    // Weakness formula: penalizes low accuracy, high attempts with mistakes, and frequent lapses
    const failureRate = 1 - accuracy;
    const attemptWeight = Math.log(1 + stat.incorrect);
    const lapseWeight = stat.lapses * 0.75;
    const weaknessScore = Number(((failureRate * 50) + (attemptWeight * 15) + (lapseWeight * 10)).toFixed(2));

    let recommendation = "Review standard textbook definitions and practice sectional quizzes.";
    if (accuracy < 0.4) {
      recommendation = "Critical Weakness: Watch foundational NPTEL lectures, solve 1-mark PYQs, and review key formulas.";
    } else if (stat.lapses > 2) {
      recommendation = "Retention Decay: Practice daily spaced repetition flashcards for core formulas in this topic.";
    }

    return {
      subject: stat.subject,
      topic: stat.topic,
      attempted: stat.attempted,
      correct: stat.correct,
      incorrect: stat.incorrect,
      lapses: stat.lapses,
      accuracy: Number((accuracy * 100).toFixed(1)),
      weaknessScore,
      recommendation
    };
  });

  return rankedTopics.sort((a, b) => b.weaknessScore - a.weaknessScore);
}

module.exports = {
  calculate2PlProbability,
  updateStudentAbility,
  scheduleFsrsReview,
  identifyTopWeakTopics
};

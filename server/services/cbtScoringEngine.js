// server/services/cbtScoringEngine.js
// Authentic CBT Mock Examination Scoring & Telemetry Engine
// Strict TCS iON / GATE / NTA evaluation standard:
// - MCQ (1/3 or 2/3 negative marks for GATE; proportional for SSC/UPSC)
// - MSQ (exact match required, zero partial credit, zero negative marks)
// - NAT (tolerance range validation, zero negative marks)
// - TCS iON Invariant: ANSWERED_AND_MARKED_FOR_REVIEW is EVALUATED FOR SCORE.

const CBT_STATES = {
  NOT_VISITED: "NOT_VISITED",
  NOT_ANSWERED: "NOT_ANSWERED",
  ANSWERED: "ANSWERED",
  MARKED_FOR_REVIEW: "MARKED_FOR_REVIEW",
  ANSWERED_AND_MARKED_FOR_REVIEW: "ANSWERED_AND_MARKED_FOR_REVIEW"
};

/**
 * Evaluates candidate responses against authentic examination marking schemes.
 * @param {Object} test - The mock test object with questions, marks, and negative marking rules
 * @param {Object} candidateAnswers - Map of questionId -> { state, selectedOption, selectedOptions, numericAnswer, timeSpentSeconds }
 * @returns {Object} Comprehensive evaluation telemetry report
 */
function evaluateCbtAttempt(test, candidateAnswers = {}) {
  const isGate = test.examId && (test.examId.toLowerCase().includes("gate") || test.title.toLowerCase().includes("gate"));
  const defaultPositive = test.positiveMarks || 1.0;
  const defaultNegative = test.negativeMarks !== undefined ? test.negativeMarks : 0.33;

  let rawScore = 0;
  let maxScore = 0;
  let negativePenaltyTotal = 0;
  let timeWastedOnIncorrectSeconds = 0;
  let totalTimeSpentSeconds = 0;

  let attemptedCount = 0;
  let answeredAndMarkedCount = 0;
  let markedForReviewOnlyCount = 0;
  let unattemptedCount = 0;
  let correctCount = 0;
  let incorrectCount = 0;

  const questionEvaluations = [];
  const subjectAggregates = {};

  (test.questions || []).forEach((q) => {
    const qMarks = q.marks !== undefined ? q.marks : defaultPositive;
    maxScore += qMarks;

    const ans = candidateAnswers[q.id] || {
      state: CBT_STATES.NOT_VISITED,
      timeSpentSeconds: 0
    };

    const state = ans.state || CBT_STATES.NOT_VISITED;
    const timeSpent = ans.timeSpentSeconds || 0;
    totalTimeSpentSeconds += timeSpent;

    const qType = (q.type || "MCQ").toUpperCase();
    const subject = q.subject || test.subject || "General";
    const topic = q.topic || "Core Syllabus";

    if (!subjectAggregates[subject]) {
      subjectAggregates[subject] = {
        subject,
        totalQuestions: 0,
        attempted: 0,
        correct: 0,
        incorrect: 0,
        scoreEarned: 0,
        maxScore: 0,
        negativePenalty: 0,
        timeSpentSeconds: 0,
        topics: {}
      };
    }
    const subjAcc = subjectAggregates[subject];
    subjAcc.totalQuestions += 1;
    subjAcc.maxScore += qMarks;
    subjAcc.timeSpentSeconds += timeSpent;

    if (!subjAcc.topics[topic]) {
      subjAcc.topics[topic] = {
        topic,
        total: 0,
        attempted: 0,
        correct: 0,
        incorrect: 0
      };
    }
    subjAcc.topics[topic].total += 1;

    // Check state according to TCS iON rules
    // ANSWERED and ANSWERED_AND_MARKED_FOR_REVIEW MUST be evaluated.
    // MARKED_FOR_REVIEW without an answer receives 0 with NO penalty.
    const isEvaluatedState = (state === CBT_STATES.ANSWERED || state === CBT_STATES.ANSWERED_AND_MARKED_FOR_REVIEW);

    if (state === CBT_STATES.ANSWERED_AND_MARKED_FOR_REVIEW) {
      answeredAndMarkedCount += 1;
    } else if (state === CBT_STATES.MARKED_FOR_REVIEW) {
      markedForReviewOnlyCount += 1;
    } else if (state === CBT_STATES.NOT_VISITED || state === CBT_STATES.NOT_ANSWERED) {
      unattemptedCount += 1;
    }

    if (!isEvaluatedState) {
      // Unattempted or marked for review without selection
      questionEvaluations.push({
        questionId: q.id,
        qType,
        subject,
        topic,
        marksAllocated: qMarks,
        marksAwarded: 0,
        isCorrect: false,
        isAttempted: false,
        state,
        timeSpentSeconds: timeSpent,
        explanation: q.explanation || ""
      });
      return;
    }

    // Attempted question
    attemptedCount += 1;
    subjAcc.attempted += 1;
    subjAcc.topics[topic].attempted += 1;

    let isCorrect = false;
    let marksAwarded = 0;
    let penalty = 0;

    if (qType === "MCQ") {
      // Single Choice MCQ
      const selected = ans.selectedOption;
      const correct = q.correctOptionIndex !== undefined ? q.correctOptionIndex : q.correctOption;

      if (selected !== undefined && selected !== null && Number(selected) === Number(correct)) {
        isCorrect = true;
        marksAwarded = qMarks;
      } else {
        isCorrect = false;
        // In GATE, 1-mark MCQ carries -1/3 penalty, 2-mark carries -2/3 penalty
        if (isGate) {
          penalty = qMarks === 2 ? (2 / 3) : (1 / 3);
        } else {
          penalty = q.negativeMarks !== undefined ? q.negativeMarks : defaultNegative;
        }
        marksAwarded = -penalty;
        negativePenaltyTotal += penalty;
        timeWastedOnIncorrectSeconds += timeSpent;
      }
    } else if (qType === "MSQ") {
      // Multiple Select Question
      // Exact match required. Zero partial credit. Zero negative marking.
      const selected = Array.isArray(ans.selectedOptions)
        ? ans.selectedOptions.map(Number).sort((a, b) => a - b)
        : (ans.selectedOption !== undefined && ans.selectedOption !== null ? [Number(ans.selectedOption)] : []);

      const correct = Array.isArray(q.correctOptionIndices)
        ? q.correctOptionIndices.map(Number).sort((a, b) => a - b)
        : (Array.isArray(q.correctOptions) ? q.correctOptions.map(Number).sort((a, b) => a - b) : []);

      const isExactMatch = selected.length === correct.length &&
        selected.every((val, idx) => val === correct[idx]);

      if (isExactMatch && selected.length > 0) {
        isCorrect = true;
        marksAwarded = qMarks;
      } else {
        isCorrect = false;
        marksAwarded = 0; // Zero negative marking for MSQ
        timeWastedOnIncorrectSeconds += timeSpent;
      }
    } else if (qType === "NAT") {
      // Numerical Answer Type
      // Zero negative marking. Tolerant range check.
      const candidateVal = parseFloat(ans.numericAnswer);
      if (!isNaN(candidateVal)) {
        let inRange = false;
        if (q.toleranceMin !== undefined && q.toleranceMax !== undefined) {
          inRange = candidateVal >= q.toleranceMin && candidateVal <= q.toleranceMax;
        } else if (q.correctValue !== undefined) {
          const tol = q.tolerance !== undefined ? q.tolerance : 0.01;
          inRange = Math.abs(candidateVal - q.correctValue) <= tol;
        } else if (q.correctAnswer !== undefined) {
          inRange = Math.abs(candidateVal - parseFloat(q.correctAnswer)) <= 0.01;
        }

        if (inRange) {
          isCorrect = true;
          marksAwarded = qMarks;
        } else {
          isCorrect = false;
          marksAwarded = 0; // Zero negative marking for NAT
          timeWastedOnIncorrectSeconds += timeSpent;
        }
      } else {
        isCorrect = false;
        marksAwarded = 0;
      }
    }

    if (isCorrect) {
      correctCount += 1;
      subjAcc.correct += 1;
      subjAcc.topics[topic].correct += 1;
    } else {
      incorrectCount += 1;
      subjAcc.incorrect += 1;
      subjAcc.topics[topic].incorrect += 1;
      subjAcc.negativePenalty += penalty;
    }

    rawScore += marksAwarded;
    subjAcc.scoreEarned += marksAwarded;

    questionEvaluations.push({
      questionId: q.id,
      qType,
      subject,
      topic,
      marksAllocated: qMarks,
      marksAwarded: Number(marksAwarded.toFixed(3)),
      isCorrect,
      isAttempted: true,
      state,
      timeSpentSeconds: timeSpent,
      penaltyIncurred: Number(penalty.toFixed(3)),
      explanation: q.explanation || ""
    });
  });

  const roundedRawScore = Number(rawScore.toFixed(3));
  const roundedMaxScore = Number(maxScore.toFixed(3));
  const percentage = maxScore > 0 ? Number(((roundedRawScore / roundedMaxScore) * 100).toFixed(2)) : 0;
  const accuracyRate = attemptedCount > 0 ? Number(((correctCount / attemptedCount) * 100).toFixed(2)) : 0;

  // Format subject breakdown
  const formattedSubjects = Object.values(subjectAggregates).map((s) => ({
    subject: s.subject,
    totalQuestions: s.totalQuestions,
    attempted: s.attempted,
    correct: s.correct,
    incorrect: s.incorrect,
    scoreEarned: Number(s.scoreEarned.toFixed(3)),
    maxScore: Number(s.maxScore.toFixed(3)),
    negativePenalty: Number(s.negativePenalty.toFixed(3)),
    timeSpentSeconds: s.timeSpentSeconds,
    accuracy: s.attempted > 0 ? Number(((s.correct / s.attempted) * 100).toFixed(1)) : 0,
    weakTopics: Object.values(s.topics)
      .filter((t) => t.attempted > 0 && (t.correct / t.attempted) < 0.6)
      .map((t) => ({ topic: t.topic, accuracy: Number(((t.correct / t.attempted) * 100).toFixed(1)) }))
  }));

  return {
    testId: test.id,
    examId: test.examId,
    title: test.title,
    evaluatedAt: new Date().toISOString(),
    isGate,
    summary: {
      totalQuestions: test.questions ? test.questions.length : 0,
      attemptedCount,
      answeredAndMarkedCount,
      markedForReviewOnlyCount,
      unattemptedCount,
      correctCount,
      incorrectCount,
      rawScore: roundedRawScore,
      maxScore: roundedMaxScore,
      percentage,
      accuracyRate,
      negativePenaltyTotal: Number(negativePenaltyTotal.toFixed(3)),
      timeWastedOnIncorrectSeconds,
      totalTimeSpentSeconds
    },
    questionEvaluations,
    subjectBreakdown: formattedSubjects
  };
}

module.exports = {
  CBT_STATES,
  evaluateCbtAttempt
};

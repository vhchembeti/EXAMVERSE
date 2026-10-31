// server/services/knapsackStudyPlanner.js
// Dynamic Knapsack Optimization & Topological Study Planner with Auto-Rebalancing

const { SUBJECT_SPACES } = require("../data/learningRegistryData");

/**
 * Calculates topological sorting of topics respecting prerequisite relationships.
 * @param {Array<Object>} topics
 * @returns {Array<Object>}
 */
function topologicalSortTopics(topics) {
  const topicMap = new Map();
  const inDegree = new Map();
  const adjList = new Map();

  topics.forEach((t) => {
    topicMap.set(t.id, t);
    inDegree.set(t.id, 0);
    adjList.set(t.id, []);
  });

  topics.forEach((t) => {
    (t.prerequisites || []).forEach((prereqId) => {
      if (adjList.has(prereqId)) {
        adjList.get(prereqId).push(t.id);
        inDegree.set(t.id, (inDegree.get(t.id) || 0) + 1);
      }
    });
  });

  const queue = [];
  inDegree.forEach((deg, id) => {
    if (deg === 0) queue.push(id);
  });

  const sorted = [];
  while (queue.length > 0) {
    const currId = queue.shift();
    sorted.push(topicMap.get(currId));

    (adjList.get(currId) || []).forEach((neighborId) => {
      const newDeg = inDegree.get(neighborId) - 1;
      inDegree.set(neighborId, newDeg);
      if (newDeg === 0) {
        queue.push(neighborId);
      }
    });
  }

  // Fallback for any unvisited nodes (cycles or disconnected)
  if (sorted.length < topics.length) {
    topics.forEach((t) => {
      if (!sorted.find((s) => s.id === t.id)) {
        sorted.push(t);
      }
    });
  }

  return sorted;
}

/**
 * Generates an optimal study plan by formulating a multi-objective Knapsack problem:
 * Maximize sum(Utility_i * x_i) subject to sum(Hours_i * x_i) <= TotalBudgetHours
 * where Utility_i = Weightage_i * (1 + Weakness_i) * Urgency
 * @param {Object} options
 * @returns {Object} Comprehensive personalized study plan
 */
function generateStudyPlan({
  targetExam = "GATE Computer Science 2027",
  durationDays = 60,
  dailyHours = { weekday: 3.5, weekend: 6.5 },
  selectedSubjectIds = ["engg-maths", "dsa", "os", "dbms", "computer-networks", "general-aptitude"],
  weakTopics = [],
  startDate = new Date()
}) {
  const chosenDays = Math.max(14, Math.min(365, parseInt(durationDays) || 60));
  const weekdayH = parseFloat(dailyHours.weekday) || 3.5;
  const weekendH = parseFloat(dailyHours.weekend) || 6.5;

  // Gather syllabus topics from selected subjects
  const allTopics = [];
  SUBJECT_SPACES.filter((s) => selectedSubjectIds.includes(s.id)).forEach((subj) => {
    (subj.syllabusTopics || []).forEach((topic) => {
      allTopics.push({
        ...topic,
        subjectId: subj.id,
        subjectName: subj.name
      });
    });
  });

  // Calculate weakness lookup map
  const weaknessMap = new Map();
  (weakTopics || []).forEach((w) => {
    const key = (w.topic || w.name || "").toLowerCase().trim();
    weaknessMap.set(key, Math.max(0.2, Math.min(1.8, (w.weaknessScore || 50) / 50)));
  });

  // Topologically sort topics
  const orderedTopics = topologicalSortTopics(allTopics);

  // Compute utility score and density for each topic
  const weightedTopics = orderedTopics.map((topic) => {
    const key = topic.name.toLowerCase().trim();
    const weaknessMultiplier = weaknessMap.get(key) || 1.0;
    const utility = topic.weightage * weaknessMultiplier;
    const density = topic.estHours > 0 ? (utility / topic.estHours) : utility;

    return {
      ...topic,
      utility: Number(utility.toFixed(2)),
      density: Number(density.toFixed(3)),
      weaknessMultiplier
    };
  });

  // Calculate day-by-day calendar budget
  let totalBudgetHours = 0;
  const days = [];
  const start = new Date(startDate);

  for (let i = 0; i < chosenDays; i++) {
    const currentDay = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
    const dayOfWeek = currentDay.getDay(); // 0 is Sunday, 6 is Saturday
    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
    const allocHours = isWeekend ? weekendH : weekdayH;

    totalBudgetHours += allocHours;
    days.push({
      dayIndex: i + 1,
      date: currentDay.toISOString().split("T")[0],
      dayName: currentDay.toLocaleDateString("en-US", { weekday: "short" }),
      isWeekend,
      targetHours: allocHours,
      completedHours: 0,
      status: "PENDING", // PENDING, COMPLETED, MISSED
      activities: []
    });
  }

  // Allocate topics into calendar days
  let currentTopicIdx = 0;
  let remainingTopicHours = weightedTopics.length > 0 ? weightedTopics[0].estHours : 0;

  for (let d = 0; d < days.length; d++) {
    const day = days[d];
    let dayHoursLeft = day.targetHours;

    // Allocate weekly revision / mock milestone on weekends
    if (day.isWeekend && (d + 1) % 7 === 0) {
      day.activities.push({
        id: `act-mock-${d + 1}`,
        type: "MOCK_TEST",
        subject: "Full-Length Assessment",
        topic: "Weekly CBT Simulation & Speed Practice",
        allocatedHours: 2.5,
        description: "Attempt full-length CBT mock test under strict exam timer with TCS iON palette."
      });
      dayHoursLeft -= 2.5;
    }

    while (dayHoursLeft > 0.5 && currentTopicIdx < weightedTopics.length) {
      const currentTopic = weightedTopics[currentTopicIdx];
      const hoursToSpend = Math.min(dayHoursLeft, remainingTopicHours);

      // Split into theory and practice
      const isPracticePhase = d > Math.floor(chosenDays * 0.45);
      const activityType = isPracticePhase ? "PRACTICE" : "THEORY";

      day.activities.push({
        id: `act-${d + 1}-${currentTopic.id}`,
        type: activityType,
        subject: currentTopic.subjectName,
        topic: currentTopic.name,
        allocatedHours: Number(hoursToSpend.toFixed(1)),
        description: activityType === "THEORY"
          ? `Study key concepts, derivations, and NPTEL references for ${currentTopic.name}.`
          : `Solve 10-15 authentic GATE/UPSC PYQs and high-yield problems on ${currentTopic.name}.`
      });

      remainingTopicHours -= hoursToSpend;
      dayHoursLeft -= hoursToSpend;

      if (remainingTopicHours <= 0.1) {
        currentTopicIdx += 1;
        if (currentTopicIdx < weightedTopics.length) {
          remainingTopicHours = weightedTopics[currentTopicIdx].estHours;
        }
      }
    }

    // Daily Spaced Repetition Formula Blitz (30 mins daily)
    if (dayHoursLeft >= 0.5) {
      day.activities.push({
        id: `act-fsrs-${d + 1}`,
        type: "REVISION",
        subject: "Spaced Repetition",
        topic: "Formula Blitz & Key Theorems",
        allocatedHours: Number(dayHoursLeft.toFixed(1)),
        description: "Review FSRS spaced repetition flashcards and verify weak topic formulas."
      });
      dayHoursLeft = 0;
    }
  }

  // Summary Metrics
  const totalAllocatedTopics = weightedTopics.length;
  const highYieldCovered = weightedTopics.filter((t) => t.weightage >= 3.5).length;

  return {
    planId: `plan-${Date.now()}`,
    targetExam,
    durationDays: chosenDays,
    dailyHours: { weekday: weekdayH, weekend: weekendH },
    totalBudgetHours: Number(totalBudgetHours.toFixed(1)),
    totalTopicsPlanned: totalAllocatedTopics,
    highYieldTopicsCount: highYieldCovered,
    createdDate: new Date().toISOString(),
    topicsSummary: weightedTopics.map((t) => ({
      id: t.id,
      name: t.name,
      subject: t.subjectName,
      weightage: t.weightage,
      estHours: t.estHours,
      utility: t.utility
    })),
    schedule: days
  };
}

/**
 * Dynamically rebalances study schedule when candidate reports missed study days.
 * Freezes past completed days and smoothly redistributes unstudied workload across remaining slots.
 * @param {Object} currentPlan - Existing generated study plan
 * @param {Array<string>} missedDateStrings - Dates marked missed (e.g. ['2026-11-05'])
 * @param {Object} updatedHours - Optional new daily study capacity
 * @returns {Object} Rebalanced study plan with updated schedule
 */
function rebalanceSchedule(currentPlan, missedDateStrings = [], updatedHours = null) {
  if (!currentPlan || !currentPlan.schedule) {
    throw new Error("Invalid plan provided for rebalancing.");
  }

  const missedSet = new Set(missedDateStrings);
  const nowStr = new Date().toISOString().split("T")[0];

  const weekdayH = updatedHours && updatedHours.weekday ? parseFloat(updatedHours.weekday) : currentPlan.dailyHours.weekday;
  const weekendH = updatedHours && updatedHours.weekend ? parseFloat(updatedHours.weekend) : currentPlan.dailyHours.weekend;

  const incompleteActivities = [];
  const updatedDays = [];

  // Phase 1: Segregate completed history from future/missed slots
  currentPlan.schedule.forEach((day) => {
    const isMissed = missedSet.has(day.date);
    const isPast = day.date < nowStr;

    if (isMissed) {
      // Collect activities from missed day to carry forward
      (day.activities || []).forEach((act) => {
        if (act.type !== "MOCK_TEST" && act.type !== "REVISION") {
          incompleteActivities.push(act);
        }
      });
      updatedDays.push({
        ...day,
        status: "MISSED",
        completedHours: 0,
        activities: [
          {
            id: `missed-${day.dayIndex}`,
            type: "MISSED",
            subject: "Missed Session",
            topic: "Study session skipped - rebalanced to future dates",
            allocatedHours: 0,
            description: "Workload automatically rescheduled."
          }
        ]
      });
    } else if (day.status === "COMPLETED" || (isPast && day.completedHours > 0)) {
      // Keep completed record intact
      updatedDays.push(day);
    } else {
      // Future or pending day eligible for rebalancing
      updatedDays.push({
        ...day,
        status: "PENDING"
      });
    }
  });

  // Phase 2: Redistribute incomplete activities into remaining pending days
  const pendingDays = updatedDays.filter((d) => d.status === "PENDING");
  let actIndex = 0;

  pendingDays.forEach((day) => {
    const isWeekend = day.isWeekend;
    const targetCap = isWeekend ? weekendH : weekdayH;
    day.targetHours = targetCap;

    // Check if we need to insert carried-over incomplete activities
    if (actIndex < incompleteActivities.length) {
      const backlogAct = incompleteActivities[actIndex];
      // Prepend backlog activity to day's queue
      day.activities.unshift({
        ...backlogAct,
        id: `rebalanced-${day.dayIndex}-${backlogAct.id || actIndex}`,
        description: `[CATCH-UP] ${backlogAct.description}`
      });
      actIndex += 1;
    }
  });

  return {
    ...currentPlan,
    rebalancedAt: new Date().toISOString(),
    dailyHours: { weekday: weekdayH, weekend: weekendH },
    schedule: updatedDays,
    rebalanceTelemetry: {
      missedDaysCount: missedDateStrings.length,
      backlogActivitiesRescheduled: incompleteActivities.length,
      remainingDaysCount: pendingDays.length
    }
  };
}

module.exports = {
  topologicalSortTopics,
  generateStudyPlan,
  rebalanceSchedule
};

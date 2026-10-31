// server/services/eligibilityEngine.js
// Statutory Examination Eligibility Verification Engine for EXAMVERSE
// Evaluates Age, Date of Birth, Qualification Level, Degree, Subject Specialization,
// Category Relaxations, Graduation Status, Minimum Aggregate %, Domicile, and Language Rules.
// NEVER assumes eligibility based only on degree information.

const examinations = require('../data/examsData');

/**
 * Calculate age in completed years from Date of Birth string (YYYY-MM-DD)
 * as of statutory examination reference cutoff date (default: August 1 of current year)
 */
function calculateAgeFromDOB(dobString, referenceDate = new Date(2026, 7, 1)) {
  if (!dobString) return null;
  const dob = new Date(dobString);
  if (isNaN(dob.getTime())) return null;

  let age = referenceDate.getFullYear() - dob.getFullYear();
  const monthDiff = referenceDate.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

function evaluateEligibility(studentProfile = {}, exam) {
  const reasons = [];
  const criteriaStatus = {
    age: "PENDING",
    qualification: "PENDING",
    degree: "PENDING",
    specialization: "PENDING",
    graduationStatus: "PENDING",
    percentage: "PENDING",
    domicile: "PENDING"
  };

  let isEligible = true;
  let verificationRequired = false;

  const rules = exam.eligibility || {};
  const category = studentProfile.category || "General";
  const qual = studentProfile.educationalQualification || studentProfile.qualification || "";
  const degree = (studentProfile.degree || "").trim();
  const specialization = (studentProfile.specialization || "").trim();
  const graduationStatus = studentProfile.graduationStatus || "";
  const state = ((studentProfile.domicileState || studentProfile.state) || "").trim().toUpperCase();
  const percentage = studentProfile.percentage !== undefined && studentProfile.percentage !== null
    ? parseFloat(studentProfile.percentage)
    : null;

  // Resolve Student Age (From DOB or explicit Age field)
  let studentAge = null;
  const dobVal = studentProfile.dateOfBirth || studentProfile.dob;
  if (dobVal) {
    studentAge = calculateAgeFromDOB(dobVal);
  } else if (studentProfile.age !== undefined && studentProfile.age !== null && !isNaN(Number(studentProfile.age))) {
    studentAge = Number(studentProfile.age);
  }

  // =========================================================================
  // 1. AGE & DATE OF BIRTH CHECK (With Statutory Category Relaxations)
  // =========================================================================
  if (studentAge === null) {
    // Statutory Rule: Never assume age eligibility if age or DOB is omitted!
    verificationRequired = true;
    criteriaStatus.age = "UNVERIFIED";
    reasons.push(
      `Age / Date of Birth not provided. Official eligibility mandates statutory age verification (${rules.minAge || 'N/A'} to ${rules.maxAge || 'N/A'} years).`
    );
  } else {
    let effectiveMaxAge = rules.maxAge;
    let effectiveMinAge = rules.minAge;

    // Apply statutory reservation category relaxations
    if (rules.maxAge && rules.ageRelaxation) {
      if ((category === "SC" || category === "ST") && rules.ageRelaxation.SC_ST) {
        effectiveMaxAge += rules.ageRelaxation.SC_ST;
      } else if (category === "OBC" && rules.ageRelaxation.OBC) {
        effectiveMaxAge += rules.ageRelaxation.OBC;
      } else if (category === "PwD" && rules.ageRelaxation.PwD) {
        effectiveMaxAge += rules.ageRelaxation.PwD;
      }
      if (studentProfile.isPwD && rules.ageRelaxation.PwD && category !== "PwD") {
        effectiveMaxAge += rules.ageRelaxation.PwD;
      }
      if (studentProfile.isExServiceman && rules.ageRelaxation.ExServicemen) {
        effectiveMaxAge += rules.ageRelaxation.ExServicemen;
      }
    }

    if (effectiveMinAge && studentAge < effectiveMinAge) {
      isEligible = false;
      criteriaStatus.age = "FAILED";
      reasons.push(`Underage: Minimum statutory age is ${effectiveMinAge} years as of cutoff date. (Your age: ${studentAge} yrs).`);
    } else if (effectiveMaxAge && studentAge > effectiveMaxAge) {
      isEligible = false;
      criteriaStatus.age = "FAILED";
      const catText = category !== "General" ? ` (after ${category} relaxation: max ${effectiveMaxAge} yrs)` : "";
      reasons.push(`Overage: Maximum statutory limit is ${rules.maxAge} years${catText}. (Your age: ${studentAge} yrs).`);
    } else {
      criteriaStatus.age = "SATISFIED";
      reasons.push(`Age Verified: ${studentAge} years satisfies statutory criteria (${effectiveMinAge || 'No min'} - ${effectiveMaxAge || 'No max'} yrs for ${category}).`);
    }
  }

  // =========================================================================
  // 2. EDUCATIONAL QUALIFICATION LEVEL HIERARCHY
  // =========================================================================
  function getQualRank(q) {
    if (!q) return 0;
    const s = q.toLowerCase();
    if (s.includes("phd") || s.includes("doctor")) return 5;
    if (s.includes("post") || s.includes("master") || s.includes("m.sc") || s.includes("m.a") || s.includes("m.com") || s.includes("m.tech") || s.includes("mba") || s.includes("mca")) return 4;
    if (s.includes("bachelor") || s.includes("undergraduate") || s.includes("graduat") || s.includes("b.tech") || s.includes("b.e") || s.includes("b.sc") || s.includes("b.a") || s.includes("b.com") || s.includes("bba") || s.includes("bca") || s.includes("mbbs") || s.includes("degree")) return 3;
    if (s.includes("diploma")) return 2.5;
    if (s.includes("12") || s.includes("intermediate") || s.includes("10+2") || s.includes("hsc") || s.includes("senior secondary")) return 2;
    if (s.includes("10") || s.includes("ssc") || s.includes("matric")) return 1;
    return 0;
  }

  function getExamMinRank(minQ) {
    if (!minQ) return 0;
    const s = minQ.toLowerCase();
    if (s.includes("10th") || s.includes("matric") || s.includes("ssc")) return 1;
    if (s.includes("12th") || s.includes("intermediate") || s.includes("10+2") || s.includes("hsc")) return 2;
    if (s.includes("diploma")) return 2.5;
    if (s.includes("b.tech") || s.includes("b.e") || s.includes("bachelor") || s.includes("graduat") || s.includes("degree") || s.includes("undergraduate")) return 3;
    if (s.includes("post") || s.includes("master") || s.includes("m.sc") || s.includes("m.tech") || s.includes("mca")) return 4;
    if (s.includes("phd") || s.includes("doctor")) return 5;
    return 0;
  }

  const studentLevel = getQualRank(qual) || getQualRank(degree);
  const examLevel = getExamMinRank(rules.minQualification);

  if (!qual || studentLevel === 0) {
    verificationRequired = true;
    criteriaStatus.qualification = "UNVERIFIED";
    reasons.push(`Qualification unverified: Requires minimum '${rules.minQualification || "Specified Level"}'.`);
  } else if (examLevel > 0 && studentLevel < examLevel) {
    isEligible = false;
    criteriaStatus.qualification = "FAILED";
    reasons.push(`Qualification deficient: Minimum statutory qualification required is '${rules.minQualification}'. You specified '${qual}'.`);
  } else {
    criteriaStatus.qualification = "SATISFIED";
    reasons.push(`Base educational level satisfied (${rules.minQualification || 'Level satisfied'} or higher).`);
  }

  // =========================================================================
  // 3. DEGREE & SUBJECT SPECIALIZATION CHECK
  // =========================================================================
  const studentDegree = (degree || qual || "").trim();

  if (rules.allowedDegrees && rules.allowedDegrees.length > 0) {
    const allowsAny = rules.allowedDegrees.some(d => {
      const lower = d.toLowerCase();
      return (
        lower.includes("any bachelor") ||
        lower.includes("any degree") ||
        lower.includes("in any discipline") ||
        lower.includes("any university") ||
        lower.includes("bachelor's degree of any") ||
        lower.includes("bachelor degree of any") ||
        (lower.includes("bachelor") && lower.includes("any"))
      );
    });

    if (allowsAny) {
      criteriaStatus.degree = "SATISFIED";
      criteriaStatus.specialization = "SATISFIED";
      reasons.push(`Degree Requirement: Accepts any recognized Bachelor's Degree in any discipline.`);
    } else {
      if (!studentDegree) {
        verificationRequired = true;
        criteriaStatus.degree = "UNVERIFIED";
        reasons.push(`Degree unspecified: Official ordinance mandates one of: ${rules.allowedDegrees.join(", ")}.`);
      } else {
        const lowerDeg = studentDegree.toLowerCase();
        const degreeMatches = rules.allowedDegrees.some(d => {
          const lowerD = d.toLowerCase();
          return (
            lowerD.includes(lowerDeg) ||
            lowerDeg.includes(lowerD) ||
            (lowerDeg.includes("b.tech") && (lowerD.includes("engineering") || lowerD.includes("b.tech") || lowerD.includes("b.e") || lowerD.includes("degree"))) ||
            (lowerDeg.includes("b.e") && (lowerD.includes("engineering") || lowerD.includes("b.e") || lowerD.includes("degree"))) ||
            ((lowerDeg.includes("12") || lowerDeg.includes("intermediate") || studentLevel === 2) && (lowerD.includes("10+2") || lowerD.includes("12") || lowerD.includes("intermediate") || lowerD.includes("senior secondary") || lowerD.includes("physics & mathematics"))) ||
            (lowerDeg.includes("diploma") && lowerD.includes("diploma")) ||
            (lowerDeg.includes("graduation") && (lowerD.includes("bachelor") || lowerD.includes("degree") || lowerD.includes("graduation"))) ||
            (lowerDeg.includes("post") && (lowerD.includes("master") || lowerD.includes("post graduate") || lowerD.includes("m.sc") || lowerD.includes("m.a") || lowerD.includes("m.com") || lowerD.includes("equivalent")))
          );
        });

        if (!degreeMatches && examLevel > 2) {
          isEligible = false;
          criteriaStatus.degree = "FAILED";
          reasons.push(`Ineligible Degree: Must hold one of [${rules.allowedDegrees.join(", ")}]. Your degree: '${studentDegree}'.`);
        } else {
          criteriaStatus.degree = "SATISFIED";
          reasons.push(`Degree Matched: '${studentDegree}' recognized for this examination.`);
        }
      }

      // Check Subject Specialization (Branch / Major)
      if (rules.specializations && rules.specializations.length > 0) {
        const specAllowsAny = rules.specializations.some(s => s.toLowerCase().includes("any"));
        if (!specAllowsAny) {
          if (!specialization) {
            verificationRequired = true;
            criteriaStatus.specialization = "UNVERIFIED";
            reasons.push(`Specialization unspecified: Must specialize in [${rules.specializations.join(", ")}].`);
          } else {
            const lowerSpec = specialization.toLowerCase();
            const specMatches = rules.specializations.some(s => {
              const lowerS = s.toLowerCase();
              return (
                lowerS.includes(lowerSpec) ||
                lowerSpec.includes(lowerS) ||
                (lowerSpec.includes("pcm") && (lowerS.includes("physics") || lowerS.includes("mathematics") || lowerS.includes("science"))) ||
                (lowerSpec.includes("mechanical") && lowerS.includes("mechanical")) ||
                (lowerSpec.includes("computer") && (lowerS.includes("computer") || lowerS.includes("cs") || lowerS.includes("it"))) ||
                (lowerSpec.includes("chemistry") && lowerS.includes("chemical")) ||
                (lowerSpec.includes("science") && lowerS.includes("science"))
              );
            });

            if (!specMatches) {
              isEligible = false;
              criteriaStatus.specialization = "FAILED";
              reasons.push(`Specialization mismatch: Requires specialization in [${rules.specializations.join(", ")}]. Your branch: '${specialization}'.`);
            } else {
              criteriaStatus.specialization = "SATISFIED";
              reasons.push(`Specialization Matched: '${specialization}' eligible.`);
            }
          }
        } else {
          criteriaStatus.specialization = "SATISFIED";
          reasons.push(`Branch: Accepts all specializations.`);
        }
      }
    }
  }

  // =========================================================================
  // 4. GRADUATION STATUS (Completed vs Final Year / Pursuing)
  // =========================================================================
  if (examLevel <= 2 || (rules.minQualification && (rules.minQualification.includes("12") || rules.minQualification.includes("10")))) {
    criteriaStatus.graduationStatus = "SATISFIED";
    reasons.push(`School / 10+2 Level Examination: University graduation status not applicable.`);
  } else if (!graduationStatus) {
    if (studentLevel >= 3) {
      criteriaStatus.graduationStatus = "SATISFIED";
      reasons.push(`Graduation Status: Degree successfully completed.`);
    } else {
      verificationRequired = true;
      criteriaStatus.graduationStatus = "UNVERIFIED";
      reasons.push(`Graduation status unconfirmed: Please verify if degree is completed or currently appearing.`);
    }
  } else if (graduationStatus === "Final Year") {
    if (rules.finalYearEligible === false) {
      isEligible = false;
      criteriaStatus.graduationStatus = "FAILED";
      reasons.push(`Degree Incomplete: Candidates must possess original degree certificate on or before the closing date. Final year appearing candidates are NOT eligible.`);
    } else {
      criteriaStatus.graduationStatus = "SATISFIED";
      reasons.push(`Final year appearing students are permitted to appear conditionally.`);
    }
  } else if (graduationStatus === "Pursuing") {
    if (studentLevel <= examLevel) {
      verificationRequired = true;
      criteriaStatus.graduationStatus = "UNVERIFIED";
      reasons.push(`Currently pursuing degree. Eligibility requires passing or entering final semester by the gazette cutoff date.`);
    }
  } else if (graduationStatus === "Completed") {
    criteriaStatus.graduationStatus = "SATISFIED";
    reasons.push(`Graduation Status: Degree successfully completed.`);
  }

  // =========================================================================
  // 5. MINIMUM PERCENTAGE CONDITION
  // =========================================================================
  if (rules.minPercentage) {
    const reqPercent = parseFloat(rules.minPercentage) || 50;
    if (percentage === null || isNaN(percentage)) {
      verificationRequired = true;
      criteriaStatus.percentage = "UNVERIFIED";
      reasons.push(`Aggregate Marks: Requires minimum aggregate of ${rules.minPercentage}%. Please input your graduation score to verify.`);
    } else if (percentage < reqPercent) {
      isEligible = false;
      criteriaStatus.percentage = "FAILED";
      reasons.push(`Percentage Below Cutoff: Minimum ${rules.minPercentage}% aggregate required. (Your score: ${percentage}%).`);
    } else {
      criteriaStatus.percentage = "SATISFIED";
      reasons.push(`Academic Marks Satisfied: ${percentage}% >= ${rules.minPercentage}%.`);
    }
  } else {
    criteriaStatus.percentage = "SATISFIED";
  }

  // =========================================================================
  // 6. STATE DOMICILE & STATUTORY LOCAL LANGUAGE RULES
  // =========================================================================
  if (exam.scope === "State" && exam.stateCode) {
    if (!state) {
      verificationRequired = true;
      criteriaStatus.domicile = "UNVERIFIED";
      reasons.push(`Domicile unverified for State Examination (${exam.stateCode}).`);
    } else if (state === exam.stateCode.toUpperCase()) {
      criteriaStatus.domicile = "SATISFIED";
      reasons.push(`State Domicile Matched: Full local reservation cadre and fee concessions applicable in ${exam.stateCode}.`);
    } else {
      // Non-local state candidate applying to another state PSC
      if (rules.strictLocalOnly) {
        isEligible = false;
        criteriaStatus.domicile = "FAILED";
        reasons.push(`Domicile Restriction: Recruitment strictly restricted to permanent residents/domiciles of ${exam.stateCode}.`);
      } else {
        verificationRequired = true;
        criteriaStatus.domicile = "NON_LOCAL_OPEN_QUOTA";
        reasons.push(
          `Non-Local Candidate: You can compete exclusively under Open / Unreserved category in ${exam.stateCode}. Local reservation does not apply. Mandatory state language proficiency test must be cleared prior to appointment.`
        );
      }
    }
  } else {
    criteriaStatus.domicile = "ALL_INDIA";
  }

  // =========================================================================
  // FINAL STATUS RESOLUTION:
  // "Never show Eligible based only on degree information."
  // =========================================================================
  let finalStatus = "ELIGIBLE";
  if (!isEligible) {
    finalStatus = "NOT_ELIGIBLE";
  } else if (verificationRequired) {
    finalStatus = "VERIFICATION_REQUIRED";
  }

  return {
    examId: exam.id,
    examTitle: exam.title,
    examCode: exam.code,
    category: exam.category,
    status: finalStatus,
    criteriaStatus,
    reasons,
    officialWebsite: exam.officialWebsite,
    notificationUrl: exam.officialNotificationUrl
  };
}

function checkAllExaminations(studentProfile, examsList = examinations) {
  return examsList.map(exam => {
    const evaluation = evaluateEligibility(studentProfile, exam);
    return {
      ...exam,
      eligibilityResult: evaluation
    };
  });
}

module.exports = {
  calculateAgeFromDOB,
  evaluateEligibility,
  checkAllExaminations
};

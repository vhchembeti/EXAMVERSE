// server/services/salaryExplorerEngine.js
// Authoritative 7th CPC Central Pay Matrix & PSU IDA Compensation Engine
// Computes exact Basic, DA, HRA (X/Y/Z), TA, and statutory NPS/PF deductions.

const {
  CENTRAL_PAY_MATRIX_LEVELS,
  PSU_IDA_PAY_SCALES,
  CITY_CLASSIFICATIONS,
  OFFICIAL_SERVICE_BONDS
} = require('../data/payMatrix7thCpcData');

class SalaryExplorerEngine {
  /**
   * Computes comprehensive Central Government 7th CPC Salary Breakdown.
   * @param {Object} options
   * @param {number} options.level - Pay matrix level (1 to 14)
   * @param {'X'|'Y'|'Z'} [options.cityClass='X'] - City tier
   * @param {number} [options.daPercent=50] - Dearness Allowance percentage
   * @param {number} [options.customBasic] - Optional custom basic pay
   */
  calculate7thCpcSalary({ level = 10, cityClass = 'X', daPercent = 50, customBasic = null }) {
    const levelInfo = CENTRAL_PAY_MATRIX_LEVELS.find(l => l.level === Number(level));
    if (!levelInfo) {
      throw new Error(`Invalid Pay Level '${level}'. Valid central pay levels are 1 to 14.`);
    }

    const cityInfo = CITY_CLASSIFICATIONS[cityClass.toUpperCase()] || CITY_CLASSIFICATIONS.X;
    const basicPay = customBasic && customBasic >= levelInfo.startingBasic ? customBasic : levelInfo.startingBasic;

    // 1. Dearness Allowance (DA)
    const daAmount = Number((basicPay * (daPercent / 100)).toFixed(2));

    // 2. House Rent Allowance (HRA)
    const rawHra = basicPay * (cityInfo.hraRatePercent / 100);
    const hraAmount = Number(Math.max(rawHra, cityInfo.minHraAmount).toFixed(2));

    // 3. Transport Allowance (TA) + DA on TA
    let baseTa = 0;
    if (cityInfo.tptaHigher) {
      if (levelInfo.tptaCategory === 'LEVEL_9_PLUS') baseTa = 7200;
      else if (levelInfo.tptaCategory === 'LEVEL_3_8') baseTa = 3600;
      else baseTa = 1350;
    } else {
      if (levelInfo.tptaCategory === 'LEVEL_9_PLUS') baseTa = 3600;
      else if (levelInfo.tptaCategory === 'LEVEL_3_8') baseTa = 1800;
      else baseTa = 900;
    }
    const daOnTa = baseTa * (daPercent / 100);
    const totalTa = Number((baseTa + daOnTa).toFixed(2));

    // 4. Gross Monthly Pay
    const grossMonthly = Number((basicPay + daAmount + hraAmount + totalTa).toFixed(2));

    // 5. Statutory Deductions
    // NPS Tier 1: 10% of (Basic + DA)
    const npsEmployee = Number(((basicPay + daAmount) * 0.10).toFixed(2));
    const npsGovtContribution = Number(((basicPay + daAmount) * 0.14).toFixed(2));

    // CGEGIS (Group Insurance)
    let cgegis = 30;
    if (levelInfo.level >= 10) cgegis = 120;
    else if (levelInfo.level >= 6) cgegis = 60;

    // CGHS (Central Government Health Scheme)
    let cghs = 250;
    if (levelInfo.level >= 12) cghs = 1000;
    else if (levelInfo.level >= 7) cghs = 650;
    else if (levelInfo.level === 6) cghs = 450;

    const totalDeductions = Number((npsEmployee + cgegis + cghs).toFixed(2));

    // 6. Net Take-Home (In-Hand Monthly)
    const netInHandMonthly = Number((grossMonthly - totalDeductions).toFixed(2));

    // 7. Annual Equivalent CTC
    const annualGross = Number((grossMonthly * 12).toFixed(2));
    const annualCtcEquivalent = Number(((grossMonthly + npsGovtContribution) * 12).toFixed(2));

    return {
      success: true,
      cadreType: "CENTRAL_7TH_CPC",
      payLevel: levelInfo.level,
      classification: levelInfo.classification,
      designationExamples: levelInfo.designationExamples,
      cityClassification: {
        tier: cityClass.toUpperCase(),
        label: cityInfo.label,
        hraRatePercent: cityInfo.hraRatePercent
      },
      rates: {
        daPercent,
        hraPercent: cityInfo.hraRatePercent
      },
      earnings: {
        basicPay,
        dearnessAllowance: daAmount,
        houseRentAllowance: hraAmount,
        transportAllowance: totalTa,
        grossMonthly
      },
      deductions: {
        npsEmployeeTier1: npsEmployee,
        cgegisInsurance: cgegis,
        cghsHealthScheme: cghs,
        totalDeductions
      },
      netMonthlyInHand: netInHandMonthly,
      employerBenefits: {
        npsGovernmentCoContribution14Pct: npsGovtContribution,
        annualGross,
        annualCtcEquivalent
      },
      statutoryCitation: "7th Central Pay Commission Gazette Notification & Ministry of Finance O.M. No. 2/5/2017-E.II(B)"
    };
  }

  /**
   * Computes PSU Industrial Dearness Allowance (IDA) Scale Breakdown.
   */
  calculatePsuIdaSalary({ grade = 'E2', cityClass = 'X', idaPercent = 43.8, customBasic = null }) {
    const scale = PSU_IDA_PAY_SCALES.find(s => s.grade === grade.toUpperCase()) || PSU_IDA_PAY_SCALES[1];
    const cityInfo = CITY_CLASSIFICATIONS[cityClass.toUpperCase()] || CITY_CLASSIFICATIONS.X;
    const basicPay = customBasic && customBasic >= scale.minBasic ? customBasic : scale.minBasic;

    const idaAmount = Number((basicPay * (idaPercent / 100)).toFixed(2));
    const hraAmount = Number((basicPay * (cityInfo.hraRatePercent / 100)).toFixed(2));
    const cafeteriaPerks = Number((basicPay * 0.35).toFixed(2)); // Standard 35% cafeteria perks

    const grossMonthly = Number((basicPay + idaAmount + hraAmount + cafeteriaPerks).toFixed(2));

    // Deductions: PF (12% of Basic + IDA) + Gratuity/Superannuation
    const epfEmployee = Number(((basicPay + idaAmount) * 0.12).toFixed(2));
    const prpBonusEstimateAnnual = Number((basicPay * 12 * 0.40).toFixed(2)); // ~40% PRP in Maharatnas
    const netInHandMonthly = Number((grossMonthly - epfEmployee).toFixed(2));

    return {
      success: true,
      cadreType: "PSU_IDA",
      grade: scale.grade,
      designation: scale.designation,
      scaleRange: scale.scaleRange,
      cityClassification: cityInfo.label,
      earnings: {
        basicPay,
        industrialDearnessAllowance: idaAmount,
        houseRentAllowance: hraAmount,
        cafeteriaPerks35Pct: cafeteriaPerks,
        grossMonthly
      },
      deductions: {
        epfEmployee12Pct: epfEmployee,
        totalDeductions: epfEmployee
      },
      netMonthlyInHand: netInHandMonthly,
      annualPerksAndPrp: {
        estimatedPerformanceRelatedPayAnnual: prpBonusEstimateAnnual,
        typicalAnnualCtc: scale.typicalAnnualCTC
      },
      sampleOrganizations: scale.sampleOrganizations,
      statutoryCitation: "Department of Public Enterprises (DPE) 3rd Pay Revision Committee (PRC) Guidelines"
    };
  }

  /**
   * Computes HYPOTHETICAL 8th CPC Salary Projection.
   * MANDATORY: Must be labeled HYPOTHETICAL as 8th CPC has not yet been notified by the Govt of India.
   */
  calculate8thCpcHypothetical({ level = 10, cityClass = 'X', fitmentFactor = 2.15 }) {
    const cpc7 = this.calculate7thCpcSalary({ level, cityClass, daPercent: 50 });
    const factor = Math.max(1.85, Math.min(3.0, Number(fitmentFactor) || 2.15));
    const projectedBasic = Math.round(cpc7.earnings.basicPay * factor / 100) * 100;
    const projectedGross = Math.round(projectedBasic * 1.35); // Estimated DA reset + revised HRA/TA
    const projectedNet = Math.round(projectedGross * 0.85);

    return {
      success: true,
      cadreType: "8TH_CPC_HYPOTHETICAL",
      status: "HYPOTHETICAL",
      isHypothetical: true,
      disclaimer: "HYPOTHETICAL PROJECTION: The 8th Central Pay Commission recommendations have NOT been officially notified by the Government of India. Figures shown are speculative projections based on historical fitment factors for academic and planning purposes only.",
      verificationNotice: "7th CPC figures are currently the sole legally active and gazetted pay rates.",
      fitmentFactor: factor,
      payLevel: level,
      current7thCpcBasic: cpc7.earnings.basicPay,
      projected8thCpcBasic: projectedBasic,
      projectedGrossMonthly: projectedGross,
      projectedNetMonthly: projectedNet
    };
  }

  /**
   * Returns official service bond and probation condition for an organization
   */
  getServiceBonds(organizationQuery = null) {
    if (!organizationQuery) return OFFICIAL_SERVICE_BONDS;
    const q = organizationQuery.toLowerCase();
    return OFFICIAL_SERVICE_BONDS.filter(b =>
      b.organization.toLowerCase().includes(q) ||
      b.cadre.toLowerCase().includes(q)
    );
  }

  /**
   * Returns all central pay matrix levels
   */
  getAllPayMatrixLevels() {
    return CENTRAL_PAY_MATRIX_LEVELS;
  }
}

const defaultSalaryEngine = new SalaryExplorerEngine();
defaultSalaryEngine.SalaryExplorerEngine = SalaryExplorerEngine;

module.exports = defaultSalaryEngine;

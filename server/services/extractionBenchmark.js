// server/services/extractionBenchmark.js
// Statutory Document Extraction Benchmark Runner
// Runs golden set evaluation measuring Precision, Recall, and F1 across all key metadata fields.

const goldenNotificationSet = require('../data/goldenNotificationSet');
const documentIntelligenceService = require('./documentIntelligenceService');

class ExtractionBenchmarkService {
  constructor() {
    this.fieldsToTrack = [
      'advtNumber',
      'registrationStartDate',
      'registrationEndDate',
      'examDate',
      'totalVacancies',
      'minAge',
      'maxAge'
    ];
  }

  /**
   * Normalize field values for accurate equivalence checking
   */
  normalizeValue(val) {
    if (val === null || val === undefined) return null;
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
      return val.trim().toLowerCase().replace(/[\s\-_/.]/g, '');
    }
    return val;
  }

  /**
   * Check if extracted value matches ground truth
   */
  isFieldMatch(fieldName, extractedVal, groundTruthVal) {
    if (groundTruthVal === null || groundTruthVal === undefined) {
      // If ground truth is null (e.g. entrance exam has no vacancies), extracted should be null
      return extractedVal === null || extractedVal === undefined;
    }

    if (extractedVal === null || extractedVal === undefined) {
      return false;
    }

    if (fieldName.includes('Age') || fieldName.includes('Vacancies')) {
      return Number(extractedVal) === Number(groundTruthVal);
    }

    const normExtracted = this.normalizeValue(extractedVal);
    const normGT = this.normalizeValue(groundTruthVal);
    return normExtracted.includes(normGT) || normGT.includes(normExtracted);
  }

  /**
   * Run the full extraction benchmark across all golden set gazettes
   */
  async runBenchmark(options = { mode: 'AUTO' }) {
    const results = [];
    const fieldMetrics = {};
    for (const f of this.fieldsToTrack) {
      fieldMetrics[f] = { tp: 0, fp: 0, fn: 0 };
    }

    for (const item of goldenNotificationSet) {
      let extracted;
      if (options.mode === 'DETERMINISTIC_ONLY') {
        extracted = documentIntelligenceService.extractDeterministically(item.documentText);
      } else {
        extracted = await documentIntelligenceService.extractNotificationData(item.documentText, {
          authority: item.authority,
          examTitle: item.name
        });
      }

      // Map extracted fields to benchmark schema
      const mapped = {
        advtNumber: extracted.advt_number,
        registrationStartDate: extracted.application_start,
        registrationEndDate: extracted.application_end,
        examDate: extracted.exam_date,
        totalVacancies: extracted.total_vacancies,
        minAge: extracted.age_limits ? extracted.age_limits.min_age : null,
        maxAge: extracted.age_limits ? extracted.age_limits.max_age : null
      };

      const itemFieldResults = {};
      let itemCorrect = 0;
      let itemTotal = 0;

      for (const field of this.fieldsToTrack) {
        const gtVal = item.groundTruth[field];
        const extVal = mapped[field];
        const match = this.isFieldMatch(field, extVal, gtVal);

        itemFieldResults[field] = {
          extracted: extVal,
          groundTruth: gtVal,
          matched: match
        };

        if (gtVal !== null && gtVal !== undefined) {
          itemTotal++;
          if (match) {
            itemCorrect++;
            fieldMetrics[field].tp++;
          } else {
            if (extVal !== null && extVal !== undefined) {
              fieldMetrics[field].fp++;
            } else {
              fieldMetrics[field].fn++;
            }
          }
        } else {
          // Ground truth is null
          if (extVal === null || extVal === undefined) {
            // Correctly omitted/null
            itemTotal++;
            itemCorrect++;
          } else {
            // Hallucinated or false extraction
            fieldMetrics[field].fp++;
          }
        }
      }

      results.push({
        id: item.id,
        name: item.name,
        authority: item.authority,
        methodUsed: extracted.extraction_method || 'DETERMINISTIC_RULE_FALLBACK',
        accuracyScore: Number((itemCorrect / itemTotal).toFixed(3)),
        fields: itemFieldResults
      });
    }

    // Compute Precision, Recall, F1 per field and overall
    let totalTP = 0, totalFP = 0, totalFN = 0;
    const summaryPerField = {};

    for (const field of this.fieldsToTrack) {
      const { tp, fp, fn } = fieldMetrics[field];
      totalTP += tp;
      totalFP += fp;
      totalFN += fn;

      const precision = (tp + fp) > 0 ? tp / (tp + fp) : 1.0;
      const recall = (tp + fn) > 0 ? tp / (tp + fn) : 1.0;
      const f1 = (precision + recall) > 0 ? (2 * precision * recall) / (precision + recall) : 0;

      summaryPerField[field] = {
        truePositives: tp,
        falsePositives: fp,
        falseNegatives: fn,
        precision: Number(precision.toFixed(3)),
        recall: Number(recall.toFixed(3)),
        f1Score: Number(f1.toFixed(3))
      };
    }

    const overallPrecision = (totalTP + totalFP) > 0 ? totalTP / (totalTP + totalFP) : 1.0;
    const overallRecall = (totalTP + totalFN) > 0 ? totalTP / (totalTP + totalFN) : 1.0;
    const overallF1 = (overallPrecision + overallRecall) > 0
      ? (2 * overallPrecision * overallRecall) / (overallPrecision + overallRecall)
      : 0;

    return {
      timestamp: new Date().toISOString(),
      benchmarkSetSize: goldenNotificationSet.length,
      overallPrecision: Number(overallPrecision.toFixed(3)),
      overallRecall: Number(overallRecall.toFixed(3)),
      overallF1Score: Number(overallF1.toFixed(3)),
      targetPassingThreshold: 0.85,
      passed: overallF1 >= 0.85,
      fieldMetrics: summaryPerField,
      gazetteResults: results
    };
  }
}

module.exports = new ExtractionBenchmarkService();

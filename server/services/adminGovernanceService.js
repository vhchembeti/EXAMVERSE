// server/services/adminGovernanceService.js
// Risk-Based Governance & Admin Review Queue Management
// Enforces Two-Person Approval for high-impact gazette modifications and maintains cryptographic audit integrity.

const db = require('../db');
const changeDiffingService = require('./changeDiffingService');

class AdminGovernanceService {
  /**
   * Assess the risk level of an incoming change or extracted notification
   */
  assessRisk(change) {
    const highRiskTypes = ['DEADLINE_EXTENDED', 'EXAM_DATE_RESCHEDULED', 'VACANCY_REVISED', 'ELIGIBILITY_CHANGE', 'EXAM_CANCELLED'];
    const changeType = (change.changeType || change.type || '').toUpperCase();
    const confidence = Number(change.confidence || change.extraction_confidence || 0.9);

    if (changeType === 'EXAM_CANCELLED' || changeType === 'EXAM_DATE_RESCHEDULED') {
      return {
        riskLevel: 'CRITICAL',
        requiresTwoPersonApproval: true,
        reason: 'Statutory examination schedule modifications directly impact student travel and preparation.'
      };
    }

    if (highRiskTypes.includes(changeType) || confidence < 0.95) {
      return {
        riskLevel: 'HIGH',
        requiresTwoPersonApproval: true,
        reason: confidence < 0.95
          ? `Extraction confidence (${(confidence * 100).toFixed(1)}%) is below 95% threshold for auto-approval.`
          : `High-impact statutory change detected (${changeType}).`
      };
    }

    return {
      riskLevel: 'LOW',
      requiresTwoPersonApproval: false,
      reason: 'Routine administrative update meeting automated safety criteria.'
    };
  }

  /**
   * Process a human review decision on a verification queue item
   * Decisions: 'APPROVE', 'EDIT_AND_APPROVE', 'REJECT', 'MERGE_DUPLICATE'
   */
  recordDecision({ itemId, decision, reviewerEmail, reviewerRole = 'admin', notes = '', edits = null }) {
    if (!itemId) throw new Error("Item ID is required");
    if (!reviewerEmail) throw new Error("Reviewer email is required");

    const queue = db.getVerificationQueue();
    const item = queue.find(q => q.id === itemId);
    if (!item) throw new Error(`Queue item '${itemId}' not found`);

    const normalizedDecision = decision.toUpperCase();
    const actor = reviewerEmail.trim().toLowerCase();

    // Prevent duplicate approvals by the same reviewer
    const existingApproval = (item.approvals || []).find(a => a.reviewer.toLowerCase() === actor);
    if (existingApproval && (normalizedDecision === 'APPROVE' || normalizedDecision === 'EDIT_AND_APPROVE')) {
      throw new Error(`Reviewer '${reviewerEmail}' has already signed off on this item.`);
    }

    // 1. Rejection Path
    if (normalizedDecision === 'REJECT') {
      const updated = db.updateVerificationQueueItem(itemId, {
        status: 'REJECTED',
        rejectedBy: actor,
        rejectedAt: new Date().toISOString(),
        rejectionNotes: notes
      });

      db.logAudit("VERIFICATION_QUEUE_REJECTED", actor, {
        itemId,
        examId: item.examId,
        changeType: item.changeType,
        notes
      });

      return {
        success: true,
        status: 'REJECTED',
        item: updated,
        message: `Notification revision for ${item.examTitle || item.examId} has been rejected.`
      };
    }

    // 2. Duplicate Resolution Path
    if (normalizedDecision === 'MERGE_DUPLICATE') {
      const updated = db.updateVerificationQueueItem(itemId, {
        status: 'MERGED_DUPLICATE',
        mergedBy: actor,
        mergedAt: new Date().toISOString(),
        mergeNotes: notes
      });

      db.logAudit("VERIFICATION_QUEUE_MERGED", actor, {
        itemId,
        examId: item.examId,
        notes
      });

      return {
        success: true,
        status: 'MERGED_DUPLICATE',
        item: updated,
        message: `Item marked as duplicate and suppressed.`
      };
    }

    // 3. Approval Path (Single or Two-Person)
    const newApproval = {
      reviewer: actor,
      role: reviewerRole,
      approvedAt: new Date().toISOString(),
      notes,
      edits
    };

    const currentApprovals = [...(item.approvals || []), newApproval];

    // Check if Two-Person Approval is required
    if (item.requiresTwoPersonApproval && currentApprovals.length < 2) {
      const updated = db.updateVerificationQueueItem(itemId, {
        status: 'PENDING_SECOND_APPROVAL',
        approvals: currentApprovals
      });

      db.logAudit("VERIFICATION_FIRST_APPROVAL", actor, {
        itemId,
        examId: item.examId,
        changeType: item.changeType,
        pendingApprovalsCount: 1
      });

      return {
        success: true,
        status: 'PENDING_SECOND_APPROVAL',
        item: updated,
        message: `First sign-off recorded by ${actor}. Item requires a second independent administrator approval before publishing.`
      };
    }

    // Final Approval (Either single-person approved or second approval received)
    const finalExtracted = edits ? { ...item.extractedFields, ...edits } : item.extractedFields;
    const finalStatus = edits ? 'EDITED_AND_APPROVED' : 'VERIFIED_PUBLISHED';

    const updated = db.updateVerificationQueueItem(itemId, {
      status: finalStatus,
      approvals: currentApprovals,
      extractedFields: finalExtracted,
      publishedAt: new Date().toISOString()
    });

    // Record into Change Timeline as official verified corrigendum / update
    changeDiffingService.recordChange({
      examId: item.examId,
      examTitle: item.examTitle,
      authorityId: item.authority,
      changeType: item.changeType,
      title: `${item.authority} Official Update: ${finalExtracted.field || item.changeType}`,
      summary: finalExtracted.justification || item.documentSnippet,
      sourceUrl: item.officialUrl,
      fieldsDiff: {
        field: finalExtracted.field,
        previous: finalExtracted.previousValue,
        revised: finalExtracted.proposedValue
      },
      verifiedBy: currentApprovals.map(a => a.reviewer).join(', ')
    });

    db.logAudit("VERIFICATION_FINAL_PUBLISHED", actor, {
      itemId,
      examId: item.examId,
      changeType: item.changeType,
      signOffs: currentApprovals.map(a => a.reviewer),
      status: finalStatus
    });

    return {
      success: true,
      status: finalStatus,
      item: updated,
      message: `Verified and published official update for ${item.examTitle}. Student-facing notification timeline updated.`
    };
  }

  /**
   * Summary metrics for Admin Workbench Dashboard
   */
  getQueueMetrics() {
    const queue = db.getVerificationQueue();
    const pending = queue.filter(q => q.status === 'AI_EXTRACTED_PENDING_REVIEW');
    const pendingSecond = queue.filter(q => q.status === 'PENDING_SECOND_APPROVAL');
    const published = queue.filter(q => q.status === 'VERIFIED_PUBLISHED' || q.status === 'EDITED_AND_APPROVED');
    const rejected = queue.filter(q => q.status === 'REJECTED');
    const duplicates = queue.filter(q => q.status === 'MERGED_DUPLICATE');

    return {
      totalItems: queue.length,
      pendingReview: pending.length,
      pendingSecondApproval: pendingSecond.length,
      verifiedPublished: published.length,
      rejected: rejected.length,
      mergedDuplicates: duplicates.length,
      twoPersonApprovalRequired: queue.filter(q => q.requiresTwoPersonApproval && (q.status === 'AI_EXTRACTED_PENDING_REVIEW' || q.status === 'PENDING_SECOND_APPROVAL')).length
    };
  }
}

module.exports = new AdminGovernanceService();

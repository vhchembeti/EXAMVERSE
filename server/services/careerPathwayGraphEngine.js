// server/services/careerPathwayGraphEngine.js
// Career Pathway Graph Engine: Kahn's Topological Sort & Dijkstra Multi-Criteria Path Ranker
// Provides deterministic traversal, prerequisite validation, and optimal career roadmapping.

const { PATHWAY_NODES, PATHWAY_EDGES, EPISTEMIC_BADGE } = require('../data/careerPathwayGraphData');

class CareerPathwayGraphEngine {
  constructor(nodes = PATHWAY_NODES, edges = PATHWAY_EDGES) {
    this.nodes = new Map();
    this.adj = new Map();
    this.reverseAdj = new Map();
    this.inDegree = new Map();

    this.initializeGraph(nodes, edges);
  }

  /**
   * Builds adjacency lists and degree tracking from nodes and directed edges
   */
  initializeGraph(nodes, edges) {
    this.nodes.clear();
    this.adj.clear();
    this.reverseAdj.clear();
    this.inDegree.clear();

    nodes.forEach(node => {
      this.nodes.set(node.id, { ...node });
      this.adj.set(node.id, []);
      this.reverseAdj.set(node.id, []);
      this.inDegree.set(node.id, 0);
    });

    edges.forEach(edge => {
      if (this.nodes.has(edge.from) && this.nodes.has(edge.to)) {
        this.adj.get(edge.from).push({ to: edge.to, ...edge });
        this.reverseAdj.get(edge.to).push({ from: edge.from, ...edge });
        this.inDegree.set(edge.to, (this.inDegree.get(edge.to) || 0) + 1);
      }
    });
  }

  /**
   * Kahn's Topological Sort Algorithm:
   * Validates DAG properties, determines canonical prerequisite sequence, and detects cycles.
   * @param {Array<string>} [subsetNodeIds] - Optional subset of node IDs to evaluate
   * @returns {{ isDAG: boolean, sortedNodeIds: string[], hasCycle: boolean, cycleNodes?: string[] }}
   */
  kahnTopologicalSort(subsetNodeIds = null) {
    const targetNodes = subsetNodeIds ? new Set(subsetNodeIds) : new Set(this.nodes.keys());
    const currentInDegree = new Map();

    targetNodes.forEach(id => {
      currentInDegree.set(id, 0);
    });

    // Calculate in-degrees within targetNodes
    targetNodes.forEach(fromId => {
      const neighbors = this.adj.get(fromId) || [];
      neighbors.forEach(edge => {
        if (targetNodes.has(edge.to)) {
          currentInDegree.set(edge.to, (currentInDegree.get(edge.to) || 0) + 1);
        }
      });
    });

    // Enqueue all nodes with in-degree 0
    const queue = [];
    currentInDegree.forEach((degree, id) => {
      if (degree === 0) queue.push(id);
    });

    const sortedNodeIds = [];

    while (queue.length > 0) {
      const current = queue.shift();
      sortedNodeIds.push(current);

      const neighbors = this.adj.get(current) || [];
      neighbors.forEach(edge => {
        if (targetNodes.has(edge.to)) {
          const newDegree = currentInDegree.get(edge.to) - 1;
          currentInDegree.set(edge.to, newDegree);
          if (newDegree === 0) {
            queue.push(edge.to);
          }
        }
      });
    }

    const hasCycle = sortedNodeIds.length !== targetNodes.size;
    let cycleNodes = [];
    if (hasCycle) {
      currentInDegree.forEach((degree, id) => {
        if (degree > 0) cycleNodes.push(id);
      });
    }

    return {
      isDAG: !hasCycle,
      hasCycle,
      sortedNodeIds,
      cycleNodes: hasCycle ? cycleNodes : undefined
    };
  }

  /**
   * Computes edge weight based on the requested optimization objective.
   */
  getEdgeWeight(edge, objective = 'FASTEST') {
    const years = edge.weightYears || 1;
    const cost = edge.applicationCost || 0;
    const overlap = edge.syllabusOverlapRatio !== undefined ? edge.syllabusOverlapRatio : 0.7;

    switch (objective) {
      case 'LOWEST_COST':
        // Cost factored in thousands of rupees + nominal time penalty
        return (cost / 1000) + (years * 1.5);
      case 'HIGHEST_SYNERGY':
        // Lower weight for high synergy (2.0 - overlap reduces weight from 2.0 to 1.0)
        return years * (2.0 - overlap);
      case 'FASTEST':
      default:
        return years;
    }
  }

  /**
   * Dijkstra's Shortest Path Algorithm:
   * Finds the optimal path from startNodeId to targetNodeId according to the selected objective.
   * @param {string} startNodeId
   * @param {string} targetNodeId
   * @param {'FASTEST'|'LOWEST_COST'|'HIGHEST_SYNERGY'} [objective='FASTEST']
   * @returns {Object} Optimal path result with step-by-step nodes, metrics, and educational guidance badge
   */
  findOptimalPathway(startNodeId, targetNodeId, objective = 'FASTEST') {
    if (!this.nodes.has(startNodeId)) {
      return { success: false, error: `Start node '${startNodeId}' not found in career graph.` };
    }
    if (!this.nodes.has(targetNodeId)) {
      return { success: false, error: `Target node '${targetNodeId}' not found in career graph.` };
    }

    const distances = new Map();
    const previous = new Map();
    const edgeUsed = new Map();
    const unvisited = new Set(this.nodes.keys());

    this.nodes.forEach((_, id) => {
      distances.set(id, Infinity);
    });
    distances.set(startNodeId, 0);

    while (unvisited.size > 0) {
      // Find unvisited node with smallest distance
      let current = null;
      let minDistance = Infinity;

      unvisited.forEach(id => {
        const d = distances.get(id);
        if (d < minDistance) {
          minDistance = d;
          current = id;
        }
      });

      if (current === null || minDistance === Infinity) {
        break; // No reachable remaining nodes
      }

      if (current === targetNodeId) {
        break; // Destination reached
      }

      unvisited.delete(current);

      const neighbors = this.adj.get(current) || [];
      neighbors.forEach(edge => {
        if (unvisited.has(edge.to)) {
          const weight = this.getEdgeWeight(edge, objective);
          const alt = distances.get(current) + weight;
          if (alt < distances.get(edge.to)) {
            distances.set(edge.to, alt);
            previous.set(edge.to, current);
            edgeUsed.set(edge.to, edge);
          }
        }
      });
    }

    // Reconstruct path
    const pathNodes = [];
    const pathEdges = [];
    let curr = targetNodeId;

    if (distances.get(targetNodeId) === Infinity) {
      return {
        success: false,
        found: false,
        startNode: this.nodes.get(startNodeId),
        targetNode: this.nodes.get(targetNodeId),
        message: `No feasible directed educational pathway exists from '${startNodeId}' to '${targetNodeId}'. Lateral entry or bridging degrees may be required.`
      };
    }

    while (curr) {
      pathNodes.unshift(this.nodes.get(curr));
      const p = previous.get(curr);
      if (p) {
        pathEdges.unshift(edgeUsed.get(curr));
      }
      curr = p;
    }

    const totalYears = pathEdges.reduce((acc, e) => acc + (e.weightYears || 0), 0);
    const totalCost = pathEdges.reduce((acc, e) => acc + (e.applicationCost || 0), 0) +
      pathNodes.reduce((acc, n) => acc + (n.typicalCost || 0), 0);
    const avgSynergy = pathEdges.length > 0
      ? Number((pathEdges.reduce((acc, e) => acc + (e.syllabusOverlapRatio || 0.7), 0) / pathEdges.length).toFixed(2))
      : 1.0;

    return {
      success: true,
      found: true,
      objective,
      startNode: this.nodes.get(startNodeId),
      targetNode: this.nodes.get(targetNodeId),
      totalEstimatedYears: totalYears,
      totalEstimatedCostINR: totalCost,
      averageSyllabusOverlap: avgSynergy,
      hopCount: pathEdges.length,
      pathNodes,
      pathEdges,
      epistemicHonestyBadge: EPISTEMIC_BADGE
    };
  }

  /**
   * Ranks alternative pathways comparing FASTEST, LOWEST_COST, and HIGHEST_SYNERGY.
   */
  rankAlternativePathways(startNodeId, targetNodeId) {
    const fastest = this.findOptimalPathway(startNodeId, targetNodeId, 'FASTEST');
    const lowestCost = this.findOptimalPathway(startNodeId, targetNodeId, 'LOWEST_COST');
    const highestSynergy = this.findOptimalPathway(startNodeId, targetNodeId, 'HIGHEST_SYNERGY');

    return {
      startNodeId,
      targetNodeId,
      alternatives: {
        fastest: fastest.found ? fastest : null,
        lowestCost: lowestCost.found ? lowestCost : null,
        highestSynergy: highestSynergy.found ? highestSynergy : null
      },
      epistemicHonestyBadge: EPISTEMIC_BADGE
    };
  }

  /**
   * Retrieves full graph or filtered stream view
   */
  getGraph(streamFilter = null) {
    let filteredNodes = Array.from(this.nodes.values());
    if (streamFilter && streamFilter !== 'ALL') {
      filteredNodes = filteredNodes.filter(n => n.stream === streamFilter);
    }
    const nodeIds = new Set(filteredNodes.map(n => n.id));

    const filteredEdges = [];
    PATHWAY_EDGES.forEach(edge => {
      if (nodeIds.has(edge.from) && nodeIds.has(edge.to)) {
        filteredEdges.push({ ...edge });
      }
    });

    return {
      nodes: filteredNodes,
      edges: filteredEdges,
      streamFilter: streamFilter || 'ALL',
      epistemicHonestyBadge: EPISTEMIC_BADGE
    };
  }
}

const defaultPathwayEngine = new CareerPathwayGraphEngine();
defaultPathwayEngine.CareerPathwayGraphEngine = CareerPathwayGraphEngine;

module.exports = defaultPathwayEngine;

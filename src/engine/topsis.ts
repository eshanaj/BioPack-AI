import { PackagingMaterial, TopsisPriority } from '../types/index.ts';

export interface TopsisWeights {
  otr: number; // cost criterion
  wvtr: number; // cost criterion
  cost: number; // cost criterion
  sustainability: number; // benefit criterion
  tensile: number; // benefit criterion
}

export function getTopsisWeights(priority: TopsisPriority): TopsisWeights {
  switch (priority) {
    case 'barrier':
      return { otr: 0.40, wvtr: 0.35, cost: 0.10, sustainability: 0.10, tensile: 0.05 };
    case 'budget':
      return { otr: 0.20, wvtr: 0.20, cost: 0.45, sustainability: 0.10, tensile: 0.05 };
    case 'sustainability':
      return { otr: 0.20, wvtr: 0.20, cost: 0.15, sustainability: 0.40, tensile: 0.05 };
    case 'balanced':
    default:
      return { otr: 0.25, wvtr: 0.25, cost: 0.25, sustainability: 0.20, tensile: 0.05 };
  }
}

export interface TopsisRankedResult {
  material: PackagingMaterial;
  closenessScore: number; // Ci* between 0.0 and 1.0
  dPlus: number;
  dMinus: number;
  normalizedVector: {
    otr: number;
    wvtr: number;
    cost: number;
    sustainability: number;
    tensile: number;
  };
}

export function rankMaterialsTopsis(
  candidates: PackagingMaterial[],
  priority: TopsisPriority = 'balanced'
): TopsisRankedResult[] {
  if (candidates.length === 0) {
    return [];
  }

  if (candidates.length === 1) {
    return [
      {
        material: candidates[0],
        closenessScore: 1.0,
        dPlus: 0,
        dMinus: 1.0,
        normalizedVector: { otr: 1, wvtr: 1, cost: 1, sustainability: 1, tensile: 1 }
      }
    ];
  }

  const weights = getTopsisWeights(priority);

  // 1. Calculate quadratic sum for vector normalization: sqrt(sum(x_ij^2))
  let sumSqOtr = 0;
  let sumSqWvtr = 0;
  let sumSqCost = 0;
  let sumSqSust = 0;
  let sumSqTensile = 0;

  for (const m of candidates) {
    // For OTR & WVTR, use log scale or bound to prevent single huge values (like 28000 cc) from vanishing others
    const boundedOtr = Math.max(0.01, Math.min(m.otr, 5000));
    const boundedWvtr = Math.max(0.01, Math.min(m.wvtr, 100));
    sumSqOtr += boundedOtr * boundedOtr;
    sumSqWvtr += boundedWvtr * boundedWvtr;
    sumSqCost += m.costIndex * m.costIndex;
    sumSqSust += m.sustainabilityScore * m.sustainabilityScore;
    sumSqTensile += m.tensileStrengthMpa * m.tensileStrengthMpa;
  }

  const normOtr = Math.sqrt(sumSqOtr) || 1;
  const normWvtr = Math.sqrt(sumSqWvtr) || 1;
  const normCost = Math.sqrt(sumSqCost) || 1;
  const normSust = Math.sqrt(sumSqSust) || 1;
  const normTensile = Math.sqrt(sumSqTensile) || 1;

  // 2. Build weighted normalized decision matrix
  interface WeightedRow {
    material: PackagingMaterial;
    vOtr: number;
    vWvtr: number;
    vCost: number;
    vSust: number;
    vTensile: number;
    rOtr: number;
    rWvtr: number;
    rCost: number;
    rSust: number;
    rTensile: number;
  }

  const weightedRows: WeightedRow[] = candidates.map(m => {
    const bOtr = Math.max(0.01, Math.min(m.otr, 5000));
    const bWvtr = Math.max(0.01, Math.min(m.wvtr, 100));
    const rOtr = bOtr / normOtr;
    const rWvtr = bWvtr / normWvtr;
    const rCost = m.costIndex / normCost;
    const rSust = m.sustainabilityScore / normSust;
    const rTensile = m.tensileStrengthMpa / normTensile;

    return {
      material: m,
      vOtr: rOtr * weights.otr,
      vWvtr: rWvtr * weights.wvtr,
      vCost: rCost * weights.cost,
      vSust: rSust * weights.sustainability,
      vTensile: rTensile * weights.tensile,
      rOtr,
      rWvtr,
      rCost,
      rSust,
      rTensile
    };
  });

  // 3. Determine Positive Ideal Solution (A+) and Negative Ideal Solution (A-)
  // Cost criteria (lower is better): ideal is min, anti-ideal is max
  // Benefit criteria (higher is better): ideal is max, anti-ideal is min
  const idealOtr = Math.min(...weightedRows.map(r => r.vOtr));
  const antiIdealOtr = Math.max(...weightedRows.map(r => r.vOtr));

  const idealWvtr = Math.min(...weightedRows.map(r => r.vWvtr));
  const antiIdealWvtr = Math.max(...weightedRows.map(r => r.vWvtr));

  const idealCost = Math.min(...weightedRows.map(r => r.vCost));
  const antiIdealCost = Math.max(...weightedRows.map(r => r.vCost));

  const idealSust = Math.max(...weightedRows.map(r => r.vSust));
  const antiIdealSust = Math.min(...weightedRows.map(r => r.vSust));

  const idealTensile = Math.max(...weightedRows.map(r => r.vTensile));
  const antiIdealTensile = Math.min(...weightedRows.map(r => r.vTensile));

  // 4. Calculate Euclidean separation measures & closeness coefficient
  const results: TopsisRankedResult[] = weightedRows.map(row => {
    const dPlus = Math.sqrt(
      Math.pow(row.vOtr - idealOtr, 2) +
      Math.pow(row.vWvtr - idealWvtr, 2) +
      Math.pow(row.vCost - idealCost, 2) +
      Math.pow(row.vSust - idealSust, 2) +
      Math.pow(row.vTensile - idealTensile, 2)
    );

    const dMinus = Math.sqrt(
      Math.pow(row.vOtr - antiIdealOtr, 2) +
      Math.pow(row.vWvtr - antiIdealWvtr, 2) +
      Math.pow(row.vCost - antiIdealCost, 2) +
      Math.pow(row.vSust - antiIdealSust, 2) +
      Math.pow(row.vTensile - antiIdealTensile, 2)
    );

    const sumDist = dPlus + dMinus;
    const closenessScore = sumDist > 0 ? dMinus / sumDist : 0.5;

    return {
      material: row.material,
      closenessScore: Number(closenessScore.toFixed(4)),
      dPlus: Number(dPlus.toFixed(4)),
      dMinus: Number(dMinus.toFixed(4)),
      normalizedVector: {
        otr: Number(row.rOtr.toFixed(4)),
        wvtr: Number(row.rWvtr.toFixed(4)),
        cost: Number(row.rCost.toFixed(4)),
        sustainability: Number(row.rSust.toFixed(4)),
        tensile: Number(row.rTensile.toFixed(4))
      }
    };
  });

  // Sort descending by closeness score (highest closeness to ideal solution wins)
  results.sort((a, b) => b.closenessScore - a.closenessScore);

  return results;
}

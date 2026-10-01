export interface DatasetManifest {
  manifestId: string;
  version: string;
  sha256Checksum: string;
  totalVerifiedRecords: number;
  commoditiesCount: number;
  materialsCount: number;
  sourcesCount: number;
  dataSufficiencyGateStatus: 'DATA_GATED' | 'ELIGIBLE_FOR_ML';
  gateRationale: string;
  leakagePreventionRules: string[];
  evaluationReadiness: {
    groupAwareCV: string;
    targetMetrics: string[];
    syntheticDataAllowed: boolean;
  };
}

export const CURRENT_DATASET_MANIFEST: DatasetManifest = {
  manifestId: 'BIOPACK-MANIFEST-2026.04-V1',
  version: '1.4.0',
  sha256Checksum: '8f4a7c2b5e91d302a66e41b9d08e5621437ac978df0b55ec7469a4c8714e823b',
  totalVerifiedRecords: 48,
  commoditiesCount: 16,
  materialsCount: 13,
  sourcesCount: 9,
  dataSufficiencyGateStatus: 'DATA_GATED',
  gateRationale:
    'Insufficient verified empirical shelf-life samples (N = 48 < 500 threshold across food categories). High risk of spurious correlation and severe out-of-distribution hallucinations. Supervised regression is safely GATED; deterministic biophysical rules and vector-normalized TOPSIS are active.',
  leakagePreventionRules: [
    'Strict separation of input biophysical factors from shelf-life target',
    'Packaging thickness excluded as independent target to prevent inverted barrier leakage',
    'Group-aware splitting by commodity category to prevent intra-cluster leakage',
    'Zero synthetic data injection — only certified ASTM/literature data accepted'
  ],
  evaluationReadiness: {
    groupAwareCV: '5-Fold GroupKFold stratified by food matrix category',
    targetMetrics: ['MAE (Days)', 'RMSE', 'Monotonicity Sanity Ratio (100%)', 'Zero-Constraint Violation Rate'],
    syntheticDataAllowed: false
  }
};

export function getMlStatus() {
  return {
    status: CURRENT_DATASET_MANIFEST.dataSufficiencyGateStatus,
    manifest: CURRENT_DATASET_MANIFEST,
    badgeText: 'ML STATUS: DATA_GATED',
    description: CURRENT_DATASET_MANIFEST.gateRationale
  };
}

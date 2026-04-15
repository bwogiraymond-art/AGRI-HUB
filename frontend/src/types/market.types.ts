// ─── Produce & Registration ───────────────────────────────────────────────

export type QualityGrade = 'A' | 'B' | 'C' | 'F';  // F = rejected
export type ProduceStatus = 'pending' | 'verified' | 'flagged' | 'rejected' | 'sold';
export type SupplyLevel  = 'Low' | 'Moderate' | 'High' | 'Surplus';
export type TransportMethod = 'Boda boda' | 'Pickup truck' | 'Bus/taxi' | 'Own vehicle' | 'Other';

export interface Produce {
  ref: string;             // e.g. NKS-KM82-7741
  farmerId: string;        // e.g. NKS-F-00142
  farmerName: string;
  crop: string;            // e.g. Maize, Beans
  quantityKg: number;
  sourceDistrict: string;
  sourceVillage?: string;
  selfGrade: QualityGrade;
  officialGrade?: QualityGrade;
  askingPricePerKg: number;  // UGX
  transport?: TransportMethod;
  notes?: string;
  status: ProduceStatus;
  submittedAt: string;       // ISO date string
  verifiedAt?: string;
  officialNotes?: string;
  officialId?: string;
}

// ─── Prices ───────────────────────────────────────────────────────────────

export type PriceUnit = 'per kg' | 'per bunch' | 'per bag (100kg)' | 'per crate';

export interface PriceRecord {
  id: string;
  crop: string;
  unit: PriceUnit;
  minPrice: number;   // UGX
  maxPrice: number;   // UGX
  avgPrice: number;   // UGX
  prevAvgPrice: number;
  volumeKg: number;
  supplyLevel: SupplyLevel;
  loggedAt: string;   // ISO date string
  officialId: string;
  notes?: string;
}

export interface PriceTrend {
  crop: string;
  data: number[];     // 7 daily avg prices, oldest → newest
  dates: string[];
}

// ─── Transactions ─────────────────────────────────────────────────────────

export type TransactionStatus = 'completed' | 'pending' | 'disputed';

export interface Transaction {
  id: string;
  produceRef: string;
  crop: string;
  quantityKg: number;
  pricePerKg: number;    // UGX — agreed sale price
  totalValue: number;    // UGX
  farmerId: string;
  traderId: string;
  status: TransactionStatus;
  createdAt: string;
}

// ─── Verification Queue ───────────────────────────────────────────────────

export interface QueueItem extends Produce {
  arrivalTime: string;   // HH:MM
}

// ─── Analytics ────────────────────────────────────────────────────────────

export interface MarketSummary {
  totalTransactions: number;
  totalVolumeTonnes: number;
  weeklyTurnoverUGX: number;
  activeFarmers: number;
  pendingVerifications: number;
  verifiedToday: number;
  flaggedToday: number;
  pricesLoggedToday: number;
  totalCommodities: number;
}

export interface DistrictSupply {
  district: string;
  percentage: number;
}

export interface CommodityVolume {
  crop: string;
  volumeTonnes: number;
  color: string;
}

// ─── Users ────────────────────────────────────────────────────────────────

export interface FarmerProfile {
  id: string;           // NKS-F-#####
  name: string;
  district: string;
  registeredAt: string;
  totalSubmissions: number;
  totalEarningsUGX: number;
  primaryCrop: string;
}

export interface OfficialProfile {
  id: string;           // KCCA-OFF-###
  name: string;
  initials: string;
  department: string;
  verifiedToday: number;
  isActive: boolean;
}

// ─── Reports ──────────────────────────────────────────────────────────────

export interface KPI {
  label: string;
  value: string;
  target: string;
  onTarget: boolean;
}

export interface ActivityLog {
  text: string;
  time: string;         // HH:MM
  color: string;        // hex
}

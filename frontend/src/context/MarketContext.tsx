import { createContext, useContext, useState, ReactNode } from 'react';
import type {
  PriceRecord, PriceTrend, QueueItem, ActivityLog, MarketSummary,
} from '../types/market.types';

// ─── Seed data (swap with API calls) ─────────────────────────────────────
const SEED_PRICES: PriceRecord[] = [
  { id:'p1', crop:'Maize',       unit:'per kg', minPrice:900,  maxPrice:1500, avgPrice:1200, prevAvgPrice:1100, volumeKg:2400, supplyLevel:'Moderate', loggedAt: new Date().toISOString(), officialId:'KCCA-OFF-019' },
  { id:'p2', crop:'Beans',       unit:'per kg', minPrice:3000, maxPrice:4000, avgPrice:3500, prevAvgPrice:3600, volumeKg:1800, supplyLevel:'Low',      loggedAt: new Date().toISOString(), officialId:'KCCA-OFF-019' },
  { id:'p3', crop:'Tomatoes',    unit:'per kg', minPrice:2200, maxPrice:3200, avgPrice:2800, prevAvgPrice:2400, volumeKg:900,  supplyLevel:'High',     loggedAt: new Date().toISOString(), officialId:'KCCA-OFF-007' },
  { id:'p4', crop:'Cassava',     unit:'per kg', minPrice:700,  maxPrice:900,  avgPrice:800,  prevAvgPrice:800,  volumeKg:3200, supplyLevel:'High',     loggedAt: new Date().toISOString(), officialId:'KCCA-OFF-007' },
  { id:'p5', crop:'Onions',      unit:'per kg', minPrice:3800, maxPrice:4600, avgPrice:4200, prevAvgPrice:4000, volumeKg:600,  supplyLevel:'Moderate', loggedAt: new Date().toISOString(), officialId:'KCCA-OFF-019' },
  { id:'p6', crop:'Groundnuts',  unit:'per kg', minPrice:5000, maxPrice:6000, avgPrice:5500, prevAvgPrice:5800, volumeKg:400,  supplyLevel:'Low',      loggedAt: new Date().toISOString(), officialId:'KCCA-OFF-023' },
];

const SEED_TRENDS: PriceTrend[] = [
  { crop:'Maize',    data:[1050,1100,1080,1150,1100,1180,1200], dates:[] },
  { crop:'Beans',    data:[3700,3650,3600,3550,3580,3500,3500], dates:[] },
  { crop:'Tomatoes', data:[2200,2300,2500,2600,2700,2750,2800], dates:[] },
  { crop:'Cassava',  data:[800, 810, 790, 800, 800, 800, 800],  dates:[] },
  { crop:'Onions',   data:[3900,4000,4050,4100,4000,4150,4200], dates:[] },
];

const SEED_QUEUE: QueueItem[] = [
  { ref:'NKS-KM82-7741', farmerId:'NKS-F-00142', farmerName:'Lwanga Cyrus',   crop:'Beans',      quantityKg:150, sourceDistrict:'Wakiso', selfGrade:'A', askingPricePerKg:3500, status:'pending',  submittedAt:new Date().toISOString(), arrivalTime:'07:30' },
  { ref:'NKS-AB31-2290', farmerId:'NKS-F-00089', farmerName:'Taka Erina',     crop:'Tomatoes',   quantityKg:80,  sourceDistrict:'Mukono', selfGrade:'A', askingPricePerKg:2800, status:'pending',  submittedAt:new Date().toISOString(), arrivalTime:'07:45' },
  { ref:'NKS-XR55-8831', farmerId:'NKS-F-00201', farmerName:'Bwogi Raymond',  crop:'Maize',      quantityKg:300, sourceDistrict:'Masaka', selfGrade:'B', askingPricePerKg:1100, status:'pending',  submittedAt:new Date().toISOString(), arrivalTime:'08:00' },
  { ref:'NKS-QT20-4412', farmerId:'NKS-F-00317', farmerName:'Nadundu Sarah',  crop:'Cassava',    quantityKg:200, sourceDistrict:'Mpigi',  selfGrade:'B', askingPricePerKg:800,  status:'flagged',  submittedAt:new Date().toISOString(), arrivalTime:'08:15' },
  { ref:'NKS-PL66-9923', farmerId:'NKS-F-00055', farmerName:'Okello James',   crop:'Groundnuts', quantityKg:60,  sourceDistrict:'Lira',   selfGrade:'A', askingPricePerKg:5500, status:'pending',  submittedAt:new Date().toISOString(), arrivalTime:'08:30' },
  { ref:'NKS-WN44-3301', farmerId:'NKS-F-00178', farmerName:'Namusoke Ruth',  crop:'Onions',     quantityKg:120, sourceDistrict:'Jinja',  selfGrade:'A', askingPricePerKg:4200, status:'pending',  submittedAt:new Date().toISOString(), arrivalTime:'08:45' },
];

const SEED_ACTIVITY: ActivityLog[] = [
  { text:'Verified Beans 150kg — Grade A (NKS-F-00142)',         time:'08:42', color:'#3B6D11' },
  { text:'Price logged: Maize at UGX 1,200/kg',                  time:'08:55', color:'#185FA5' },
  { text:'Verified Tomatoes 80kg — Grade B (NKS-F-00089)',       time:'09:10', color:'#3B6D11' },
  { text:'Flagged Cassava 200kg — moisture concern',             time:'09:28', color:'#854F0B' },
  { text:'Price logged: Beans at UGX 3,500/kg',                  time:'09:45', color:'#185FA5' },
];

const SEED_SUMMARY: MarketSummary = {
  totalTransactions: 2847,
  totalVolumeTonnes: 142,
  weeklyTurnoverUGX: 84_000_000,
  activeFarmers: 341,
  pendingVerifications: 6,
  verifiedToday: 9,
  flaggedToday: 1,
  pricesLoggedToday: 5,
  totalCommodities: 11,
};

// ─── Context shape ────────────────────────────────────────────────────────
interface MarketContextValue {
  prices:      PriceRecord[];
  trends:      PriceTrend[];
  queue:       QueueItem[];
  activityLog: ActivityLog[];
  summary:     MarketSummary;
  addPrice:    (record: PriceRecord) => void;
  updateQueueItem: (ref: string, updates: Partial<QueueItem>) => void;
  addActivity: (log: ActivityLog) => void;
}

const MarketContext = createContext<MarketContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────
export function MarketProvider({ children }: { children: ReactNode }) {
  const [prices, setPrices]           = useState<PriceRecord[]>(SEED_PRICES);
  const [trends]                      = useState<PriceTrend[]>(SEED_TRENDS);
  const [queue, setQueue]             = useState<QueueItem[]>(SEED_QUEUE);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>(SEED_ACTIVITY);
  const [summary, setSummary]         = useState<MarketSummary>(SEED_SUMMARY);

  const addPrice = (record: PriceRecord) => {
    setPrices(prev => {
      const idx = prev.findIndex(p => p.crop === record.crop);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = record;
        return updated;
      }
      return [...prev, record];
    });
    setSummary(s => ({ ...s, pricesLoggedToday: s.pricesLoggedToday + 1 }));
  };

  const updateQueueItem = (ref: string, updates: Partial<QueueItem>) => {
    setQueue(prev => prev.map(item => item.ref === ref ? { ...item, ...updates } : item));
    if (updates.status === 'verified') {
      setSummary(s => ({
        ...s,
        pendingVerifications: Math.max(0, s.pendingVerifications - 1),
        verifiedToday: s.verifiedToday + 1,
      }));
    }
    if (updates.status === 'rejected' || updates.status === 'flagged') {
      setSummary(s => ({
        ...s,
        pendingVerifications: Math.max(0, s.pendingVerifications - 1),
        flaggedToday: s.flaggedToday + 1,
      }));
    }
  };

  const addActivity = (log: ActivityLog) => {
    setActivityLog(prev => [...prev, log]);
  };

  return (
    <MarketContext.Provider value={{
      prices, trends, queue, activityLog, summary,
      addPrice, updateQueueItem, addActivity,
    }}>
      {children}
    </MarketContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────
export function useMarket(): MarketContextValue {
  const ctx = useContext(MarketContext);
  if (!ctx) throw new Error('useMarket must be used inside <MarketProvider>');
  return ctx;
}

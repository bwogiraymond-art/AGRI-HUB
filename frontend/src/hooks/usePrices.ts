import { useMarket } from '../context/MarketContext';
import { pctChange } from '../utils/formatters';

export function usePrices() {
  const { prices, trends, addPrice } = useMarket();

  const getPriceByCrop = (crop: string) =>
    prices.find(p => p.crop === crop) ?? null;

  const getTrendByCrop = (crop: string) =>
    trends.find(t => t.crop === crop) ?? null;

  const getPriceChange = (crop: string): number => {
    const p = getPriceByCrop(crop);
    if (!p) return 0;
    return pctChange(p.avgPrice, p.prevAvgPrice);
  };

  return { prices, trends, addPrice, getPriceByCrop, getTrendByCrop, getPriceChange };
}

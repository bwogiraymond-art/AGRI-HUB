import SparkBar from './SparkBar';
import { formatUGX, pctChange } from '../../utils/formatters';
import type { PriceRecord, PriceTrend } from '../../types/market.types';

interface PriceRowProps {
  price: PriceRecord;
  trend?: PriceTrend;
  dotColor?: string;
}

export default function PriceRow({ price, trend, dotColor = '#639922' }: PriceRowProps) {
  const chg = pctChange(price.avgPrice, price.prevAvgPrice);
  const chgLabel = (chg > 0 ? '+' : '') + chg + '%';
  const chgColor = chg > 0 ? '#3B6D11' : chg < 0 ? '#A32D2D' : 'var(--color-text-secondary)';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '9px 0',
      borderBottom: '0.5px solid var(--color-border-tertiary)',
      fontSize: 13,
    }}>
      {/* Colour dot */}
      <div style={{
        width: 8, height: 8,
        borderRadius: '50%',
        background: dotColor,
        flexShrink: 0,
      }} />

      {/* Name + unit */}
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{price.crop}</div>
        <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{price.unit}</div>
      </div>

      {/* Sparkbar */}
      {trend && (
        <SparkBar
          data={trend.data}
          color={dotColor + '66'}
          highlightColor={dotColor}
        />
      )}

      {/* Price + change */}
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>
          {formatUGX(price.avgPrice)}
        </div>
        <div style={{ fontSize: 11, color: chgColor }}>{chgLabel}</div>
      </div>
    </div>
  );
}

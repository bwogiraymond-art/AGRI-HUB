interface SparkBarProps {
  data: number[];
  color?: string;
  highlightColor?: string;
  height?: number;
}

export default function SparkBar({
  data,
  color = '#C0DD97',
  highlightColor = '#3B6D11',
  height = 24,
}: SparkBarProps) {
  if (!data.length) return null;
  const max = Math.max(...data);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-end',
      gap: 2,
      height,
      width: 64,
      flexShrink: 0,
    }}>
      {data.map((val, i) => (
        <div
          key={i}
          style={{
            width: 7,
            height: Math.round((val / max) * height),
            borderRadius: '2px 2px 0 0',
            background: i === data.length - 1 ? highlightColor : color,
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
}

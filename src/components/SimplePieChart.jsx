import { useMemo } from 'react';

function SimplePieChart({ data, colors }) {
  const total = useMemo(() => {
    return data.reduce((sum, item) => sum + item.value, 0);
  }, [data]);

  const segments = useMemo(() => {
    let currentAngle = -90; // Start from top
    return data.map((item, index) => {
      const percentage = (item.value / total) * 100;
      const angle = (item.value / total) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle = endAngle;

      // Calculate path for pie segment
      const radius = 70;
      const centerX = 100;
      const centerY = 100;

      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const x1 = centerX + radius * Math.cos(startRad);
      const y1 = centerY + radius * Math.sin(startRad);
      const x2 = centerX + radius * Math.cos(endRad);
      const y2 = centerY + radius * Math.sin(endRad);

      const largeArc = angle > 180 ? 1 : 0;

      const path = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

      return {
        path,
        color: colors[index % colors.length],
        percentage: percentage.toFixed(1),
        ...item
      };
    });
  }, [data, total, colors]);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <svg viewBox="0 0 200 200" style={{ width: '200px', height: '200px', maxWidth: '100%' }}>
        {segments.map((segment, index) => (
          <g key={index}>
            <path
              d={segment.path}
              fill={segment.color}
              stroke="white"
              strokeWidth="2"
            />
          </g>
        ))}
      </svg>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {segments.map((segment, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '12px', height: '12px', background: segment.color, borderRadius: '2px' }}></div>
            <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>
              {segment.name}: {segment.value} ({segment.percentage}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SimplePieChart;

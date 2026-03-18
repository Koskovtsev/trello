import React, { useMemo } from 'react';

interface HatchProps {
  color: string;
}

export function RenderBackground({ color = '#555' }: HatchProps): JSX.Element {
  const strokeWidth = 0.2;
  const gap = 4.5;
  const width = 150;
  const height = 150;

  const paths = useMemo(() => {
    const lines: string[] = [];
    const jitter = 0.8;
    const step = gap;

    for (let i = -width; i < height + width; i += step) {
      let x = width;
      let y = i;
      let linePath = `M ${x} ${y}`;

      while (x > 0 && y < height) {
        const nextX = x - 10;
        const nextY = y + 10;

        const cX = x - 5 + (Math.random() - 0.5) * jitter * 4;
        const cY = y + 5 + (Math.random() - 0.5) * jitter * 4;

        linePath += ` Q ${cX} ${cY}, ${nextX} ${nextY}`;
        x = nextX;
        y = nextY;

        if (Math.random() > 0.97) {
          x -= 2;
          y += 2;
          linePath += ` M ${x} ${y}`;
        }
      }
      lines.push(linePath);
    }
    return lines;
  }, [gap]);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    >
      <defs>
        <filter id="pencil">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="1" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="1" />
        </filter>
      </defs>
      <g filter="url(#pencil)" stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" opacity="0.6">
        {paths.map((lineData) => (
          <path key={lineData.substring(0, 40)} d={lineData} />
        ))}
      </g>
    </svg>
  );
}

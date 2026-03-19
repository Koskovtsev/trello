import React, { useMemo } from 'react';

interface BorderProps {
  color: string;
  strokeWidth: number;
}

// THIS FUNCTION WAS GENERETED BY GEMINI
export function RenderBorders(props: BorderProps): JSX.Element {
  const { color = '#333', strokeWidth = 1.0 } = props;

  const width = 100;
  const height = 100;

  const paths = useMemo(() => {
    const lines: string[] = [];
    const jitter = 0.5;
    const overlap = 5;
    function drawHandDrawnLine(startX: number, startY: number, endX: number, endY: number): string {
      let d = `M ${startX} ${startY}`;
      const segments = 5;

      for (let i = 1; i <= segments; i++) {
        const t = i / segments;
        const idealX = startX + (endX - startX) * t;
        const idealY = startY + (endY - startY) * t;

        const currentX = idealX + (Math.random() - 0.5) * jitter * 2;
        const currentY = idealY + (Math.random() - 0.5) * jitter * 2;

        const ctrlX = idealX - (endX - startX) / (segments * 2) + (Math.random() - 0.5) * jitter * 4;
        const ctrlY = idealY - (endY - startY) / (segments * 2) + (Math.random() - 0.5) * jitter * 4;

        d += ` Q ${ctrlX} ${ctrlY}, ${currentX} ${currentY}`;
      }
      return d;
    }

    lines.push(drawHandDrawnLine(-overlap, 0, width + overlap, 0));
    lines.push(drawHandDrawnLine(width, -overlap, width, height + overlap));
    lines.push(drawHandDrawnLine(width + overlap, height, -overlap, height));
    lines.push(drawHandDrawnLine(0, height + overlap, 0, -overlap));

    return lines;
  }, []);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        filter: 'url(#pencil-border) brightness(0.7) contrast(1.2)',
      }}
    >
      <defs>
        <filter id="pencil-border">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="1" />
        </filter>
      </defs>
      <g stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round">
        {paths.map((d) => (
          <path key={d.substring(0, 35)} d={d} />
        ))}
      </g>
    </svg>
  );
}

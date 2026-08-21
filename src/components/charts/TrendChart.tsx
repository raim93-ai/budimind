'use client';

import { useMemo } from 'react';

// Dimension color mapping using the washi/tatami theme
const DIMENSION_COLORS: Record<string, string> = {
  depression: 'hsl(120, 30%, 38%)', // celadon green
  anxiety: 'hsl(150, 25%, 40%)',    // muted green
  stress: 'hsl(30, 50%, 55%)',     // washi ochre
  'well-being': 'hsl(160, 40%, 45%)', // soft teal
  PTSD: 'hsl(0, 50%, 50%)',        // vermillion
  ADHD: 'hsl(200, 40%, 55%)',     // soft blue
  sleep: 'hsl(220, 30%, 60%)',    // indigo
  OCD: 'hsl(280, 30%, 55%)',      // purple
  cognitive: 'hsl(30, 30%, 60%)', // warm tan
  default: 'hsl(150, 30%, 40%)',
};

export interface TrendPoint {
  date: string;
  dimension: string;
  score: number;
  severity_level?: string | null;
  assessment_type?: string;
}

interface TrendChartProps {
  data: TrendPoint[];
  dimensions?: string[];          // Which dimensions to show (default: all)
  width?: number;                 // Chart width in px (default: responsive)
  height?: number;                // Chart height in px (default: 300)
  showPoints?: boolean;           // Show data point dots (default: true)
  showTooltips?: boolean;         // Show hover tooltips (default: true)
  showGrid?: boolean;             // Show grid lines (default: true)
  pointRadius?: number;           // Data point radius (default: 4)
  strokeWidth?: number;           // Line stroke width (default: 2)
  className?: string;
  showLegend?: boolean;           // Show legend (default: true)
}

export default function TrendChart({
  data,
  dimensions = [],
  width,
  height = 300,
  showPoints = true,
  showTooltips = true,
  showGrid = true,
  pointRadius = 4,
  strokeWidth = 2,
  className = '',
  showLegend = true,
}: TrendChartProps) {
  // Filter dimensions if specified
  const filteredData = useMemo(() => {
    if (dimensions.length === 0) return data;
    return data.filter((d) => dimensions.includes(d.dimension));
  }, [data, dimensions]);

  // Get unique dimensions and dates
  const allDimensions = useMemo(
    () => Array.from(new Set(filteredData.map((d) => d.dimension))),
    [filteredData],
  );

  const allDates = useMemo(() => {
    const dates = Array.from(new Set(filteredData.map((d) => d.date)));
    return dates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  }, [filteredData]);

  // Chart dimensions
  const margin = { top: 20, right: showLegend ? 120 : 30, bottom: 40, left: 50 };
  const chartWidth = (width || 600) - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Y scale (0-100)
  const yScale = (value: number) =>
    chartHeight - (value / 100) * chartHeight;

  // X scale (dates)
  const xScale = (dateIndex: number) =>
    (dateIndex / Math.max(allDates.length - 1, 1)) * chartWidth;

  // Generate SVG path for a dimension's trend line
  const generatePath = (dimension: string) => {
    const points = allDates.map((date, i) => {
      const matching = filteredData.filter(
        (d) => d.dimension === dimension && d.date === date,
      );
      const avgScore =
        matching.length > 0
          ? matching.reduce((sum, d) => sum + d.score, 0) / matching.length
          : null;
      return {
        x: xScale(i),
        y: avgScore !== null ? yScale(avgScore) : null,
      };
    });

    // Filter out null y values for path generation
    const validPoints = points.map((p, i) => ({ ...p, i }));

    if (validPoints.filter((p) => p.y !== null).length === 0) return '';

    let path = '';
    let started = false;

    for (let i = 0; i < validPoints.length; i++) {
      const p = validPoints[i];
      if (p.y === null) {
        if (started) {
          // Draw to the end of the null gap at y=null, then lift
          started = false;
        }
        continue;
      }
      if (!started) {
        path += `M ${p.x + margin.left} ${p.y + margin.top}`;
        started = true;
      } else {
        path += ` L ${p.x + margin.left} ${p.y + margin.top}`;
      }
    }

    return path;
  };

  // Get color for a dimension
  const getDimensionColor = (dim: string) =>
    DIMENSION_COLORS[dim] || DIMENSION_COLORS.default;

  // Y-axis labels (0, 25, 50, 75, 100)
  const yAxisLabels = [0, 25, 50, 75, 100];

  // X-axis labels (show up to 7 dates)
  const xAxisDates = allDates.length <= 7
    ? allDates
    : allDates.filter((_, i) => i % Math.ceil(allDates.length / 7) === 0);

  return (
    <div
      className={`relative bg-gradient-to-b from-[var(--muted)] to-[var(--muted)]/80 rounded-xl p-4 washi-paper ${className}`}
      style={{ width: width || '100%', height: height + 40 }}
    >
      <svg
        width={width || '100%'}
        height={height}
        viewBox={`0 0 ${
          (width || 600) - margin.left - margin.right + margin.left + margin.right
        } ${height}`}
        className="w-full h-full"
      >
        {/* Grid lines */}
        {showGrid && (
          <>
            {yAxisLabels.map((label) => (
              <line
                key={label}
                x1={margin.left}
                y1={yScale(label) + margin.top}
                x2={(width || 600) - margin.right}
                y2={yScale(label) + margin.top}
                stroke="hsl(var(--border))"
                strokeWidth={1}
                strokeDasharray="4 2"
                opacity={0.3}
              />
            ))}
          </>
        )}

        {/* Y-axis */}
        <line
          x1={margin.left}
          y1={margin.top}
          x2={margin.left}
          y2={margin.top + chartHeight}
          stroke="hsl(var(--muted-foreground))"
          strokeWidth={1}
        />

        {/* X-axis */}
        <line
          x1={margin.left}
          y1={margin.top + chartHeight}
          x2={(width || 600) - margin.right}
          y2={margin.top + chartHeight}
          stroke="hsl(var(--muted-foreground))"
          strokeWidth={1}
        />

        {/* Y-axis labels */}
        {yAxisLabels.map((label) => (
          <text
            key={label}
            x={margin.left - 10}
            y={yScale(label) + margin.top + 4}
            textAnchor="end"
            fill="hsl(var(--muted-foreground))"
            fontSize={11}
            className="font-mono"
          >
            {label}
          </text>
        ))}

        {/* X-axis labels */}
        {xAxisDates.map((date, i) => {
          const dateIndex = allDates.indexOf(date);
          return (
            <text
              key={date}
              x={xScale(dateIndex) + margin.left}
              y={margin.top + chartHeight + 18}
              textAnchor="middle"
              fill="hsl(var(--muted-foreground))"
              fontSize={10}
              className="font-mono"
            >
              {new Date(date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </text>
          );
        })}

        {/* Dimension lines */}
        {allDimensions.map((dim) => {
          const path = generatePath(dim);
          if (!path) return null;
          const color = getDimensionColor(dim);

          return (
            <g key={dim}>
              {/* Line */}
              <path
                d={path}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-300"
              />

              {/* Data points */}
              {showPoints &&
                (() => {
                  const points = allDates.map((date, i) => {
                    const matching = filteredData.filter(
                      (d) => d.dimension === dim && d.date === date,
                    );
                    const score =
                      matching.length > 0
                        ? matching.reduce((sum, d) => sum + d.score, 0) /
                          matching.length
                        : null;
                    return {
                      x: xScale(i) + margin.left,
                      y: score !== null ? yScale(score) + margin.top : null,
                      score,
                    };
                  });

                  return points
                    .filter((p) => p.y !== null)
                    .map((p, idx) => (
                      <circle
                        key={idx}
                        cx={p.x}
                        cy={p.y!}
                        r={pointRadius}
                        fill={color}
                        stroke="hsl(var(--background))"
                        strokeWidth={1.5}
                        className="transition-all duration-200 hover:r-6"
                      />
                    ));
                })()}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      {showLegend && allDimensions.length > 0 && (
        <div className="absolute top-2 right-2 space-y-1 max-w-[140px]">
          {allDimensions.map((dim) => (
            <div
              key={dim}
              className="flex items-center gap-2 text-xs"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getDimensionColor(dim) }}
              />
              <span className="text-[var(--muted-foreground)] truncate">
                {dim}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

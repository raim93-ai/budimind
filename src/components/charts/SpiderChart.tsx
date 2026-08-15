'use client';

import * as React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip } from 'recharts';

type SpiderChartProps = {
  data: number[];
  labels: string[];
  width?: number;
  height?: number;
};

export default function SpiderChart({
  data,
  labels,
  width = 300,
  height = 300,
}: SpiderChartProps) {
  const chartData = labels.map((label, index) => ({
    label,
    value: data[index] ?? 0,
  }));

  return (
    <div className="relative w-full h-[{height}px]">
      <RadarChart
        width={width}
        height={height}
        data={chartData}
        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
      >
        <PolarGrid
          strokeDasharray="3 3"
          strokeOpacity={0.5}
          stroke="#D4C5B2"
        />
        <PolarAngleAxis
          dataKey="label"
          stroke="#D4C5B2"
          tickLine={false}
          tick={{
            fill: '#6B6358',
            fontSize: 12,
          }}
        />
        <PolarRadiusAxis
          domain={[0, 100]}
          stroke="#D4C5B2"
          tickLine={false}
          tick={{
            fill: '#6B6358',
            fontSize: 10,
          }}
        />
        <Tooltip
          formatter={(value: number) => `${value}%`}
          contentStyle={{
            background: 'rgba(245, 240, 232, 0.9)',
            border: '1px solid #D4C5B2',
            borderRadius: '8px',
            padding: '8px',
          }}
          labelStyle={{
            color: '#2C2416',
            fontWeight: 600,
          }}
        />
        <Radar
          dataKey="value"
          stroke="#4A7C59"
          strokeWidth={2}
          fillOpacity={0.1}
          fill="#4A7C59"
        />
      </RadarChart>
    </div>
  );
}
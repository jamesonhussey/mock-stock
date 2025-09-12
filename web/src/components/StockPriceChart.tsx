import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export type PricePoint = { time: string; price: number };

export default function StockPriceChart({ data }: { data: PricePoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
        <XAxis dataKey="time" minTickGap={24} tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} domain={['auto', 'auto']} />
        <Tooltip formatter={(v: number) => `$${v.toFixed(2)}`} labelFormatter={l => l} />
        <Line type="monotone" dataKey="price" stroke="#1976d2" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

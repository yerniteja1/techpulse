"use client";

import { useEffect, useState } from "react";

interface TickerItem {
  title: string;
  source: string;
  time: string;
}

export function LiveTicker({ items }: { items: TickerItem[] }) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setOffset((prev) => (prev + 1) % items.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [items.length]);

  if (items.length === 0) return null;

  return (
    <div className="overflow-hidden border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-8 max-w-6xl items-center gap-3 px-4">
        <span className="shrink-0 rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">
          Breaking
        </span>
        <div className="relative flex-1 overflow-hidden">
          <div
            className="flex gap-8 transition-transform duration-500"
            style={{ transform: `translateX(-${offset * 100}%)` }}
          >
            {items.map((item, i) => (
              <div
                key={i}
                className="flex shrink-0 items-center gap-2 whitespace-nowrap text-sm"
              >
                <span className="font-medium text-gray-900">{item.title}</span>
                <span className="text-gray-400">&middot;</span>
                <span className="text-gray-500">{item.source}</span>
                <span className="text-gray-400">&middot;</span>
                <span className="text-gray-400">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

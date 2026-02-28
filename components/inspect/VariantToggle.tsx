"use client";

import { useState } from "react";
import type { VariantToggleItem } from "@/lib/types";

type VariantToggleProps = {
  item: VariantToggleItem;
  isEmpty?: boolean;
};

export function VariantToggle({ item, isEmpty = false }: VariantToggleProps) {
  const [isOn, setIsOn] = useState(item.value);

  if (isEmpty) {
    return (
      <div className="flex items-center justify-between py-1.5 px-3 opacity-30">
        <div className="h-2 rounded-full" style={{ width: "64px", backgroundColor: "#2c2c33" }} />
        <div className="w-8 h-[18px] rounded-full" style={{ backgroundColor: "#2c2c33" }} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-1.5 px-3 rounded-md transition-colors"
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.04)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLElement).style.backgroundColor = "transparent")
      }
    >
      <span className="text-[11px] font-medium" style={{ color: "#8a8a96" }}>
        {item.label}
      </span>

      <button
        role="switch"
        aria-checked={isOn}
        onClick={() => setIsOn((v) => !v)}
        className="w-8 h-[18px] rounded-full flex items-center transition-colors cursor-pointer"
        style={{
          backgroundColor: isOn ? "#5b6af5" : "#2c2c33",
          padding: "2px",
        }}
      >
        <span
          className="block w-[14px] h-[14px] rounded-full bg-white transition-transform duration-150"
          style={{ transform: isOn ? "translateX(14px)" : "translateX(0)" }}
        />
      </button>
    </div>
  );
}

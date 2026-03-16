"use client";

import { useState, useEffect, useRef } from "react";
import type { ComponentControlValues } from "@/lib/types";
import type { ReactNode } from "react";
import { useAppStore } from "@/lib/store";

// ─── Custom SVG icons (from Figma export) ────────────────────────────────────────
function LightningSvg() {
  return (
    <svg width="8" height="10" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.0877 7.83235L4.30073 15.8314C4.21821 15.9158 4.10929 15.9722 3.99039 15.9921C3.8715 16.0119 3.74909 15.9942 3.64164 15.9415C3.53418 15.8889 3.44751 15.8041 3.39471 15.7001C3.3419 15.596 3.32583 15.4783 3.34891 15.3648L4.36817 10.4767L0.361345 9.03421C0.275293 9.00335 0.198554 8.95253 0.137985 8.8863C0.077416 8.82006 0.034903 8.74048 0.014244 8.65465C-0.00641506 8.56882 -0.00457645 8.47942 0.0195954 8.39444C0.0437672 8.30946 0.0895193 8.23154 0.152764 8.16765L7.93976 0.168641C8.02228 0.0842083 8.13121 0.0277992 8.2501 0.00792545C8.36899 -0.0119483 8.4914 0.00579185 8.59886 0.0584688C8.70631 0.111146 8.79298 0.195901 8.84579 0.299946C8.89859 0.40399 8.91466 0.521678 8.89158 0.635249L7.86954 5.52864L11.8764 6.96913C11.9618 7.0002 12.0379 7.05096 12.098 7.11693C12.1581 7.1829 12.2003 7.26204 12.2209 7.34737C12.2416 7.4327 12.2399 7.52159 12.2162 7.60617C12.1925 7.69076 12.1474 7.76844 12.0849 7.83235H12.0877Z" fill="#052942"/>
    </svg>
  );
}

function FolderPlusSvg() {
  return (
    <svg width="12" height="10" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.1 2H9.5L7.6 0H1.9C0.8455 0 0.00949999 0.89 0.00949999 2L0 14C0 15.11 0.8455 16 1.9 16H17.1C18.1545 16 19 15.11 19 14V4C19 2.89 18.1545 2 17.1 2ZM16.15 10H13.3V13H11.4V10H8.55V8H11.4V5H13.3V8H16.15V10Z" fill="#052942"/>
    </svg>
  );
}

function Dots2Svg({ color }: { color: string }) {
  return (
    <svg width="16" height="4" viewBox="0 0 16 4" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.375 1.50727C9.375 1.80538 9.28702 2.09679 9.1222 2.34466C8.95738 2.59253 8.72311 2.78572 8.44902 2.89981C8.17494 3.01389 7.87334 3.04374 7.58236 2.98558C7.29139 2.92742 7.02412 2.78386 6.81434 2.57307C6.60456 2.36227 6.4617 2.0937 6.40382 1.80132C6.34594 1.50894 6.37565 1.20588 6.48918 0.930463C6.60271 0.655045 6.79497 0.419642 7.04164 0.254021C7.28832 0.0883999 7.57833 0 7.875 0C8.27282 0 8.65435 0.158801 8.93566 0.441469C9.21696 0.724137 9.375 1.10752 9.375 1.50727ZM1.5 0C1.20333 0 0.913319 0.0883999 0.666645 0.254021C0.419972 0.419642 0.227713 0.655045 0.114181 0.930463C0.000649929 1.20588 -0.0290551 1.50894 0.0288227 1.80132C0.0867006 2.0937 0.229562 2.36227 0.43934 2.57307C0.649119 2.78386 0.916394 2.92742 1.20737 2.98558C1.49834 3.04374 1.79994 3.01389 2.07403 2.89981C2.34811 2.78572 2.58238 2.59253 2.7472 2.34466C2.91203 2.09679 3 1.80538 3 1.50727C3 1.10752 2.84196 0.724137 2.56066 0.441469C2.27936 0.158801 1.89783 0 1.5 0ZM14.25 0C13.9533 0 13.6633 0.0883999 13.4166 0.254021C13.17 0.419642 12.9777 0.655045 12.8642 0.930463C12.7506 1.20588 12.7209 1.50894 12.7788 1.80132C12.8367 2.0937 12.9796 2.36227 13.1893 2.57307C13.3991 2.78386 13.6664 2.92742 13.9574 2.98558C14.2483 3.04374 14.5499 3.01389 14.824 2.89981C15.0981 2.78572 15.3324 2.59253 15.4972 2.34466C15.662 2.09679 15.75 1.80538 15.75 1.50727C15.75 1.10752 15.592 0.724137 15.3107 0.441469C15.0294 0.158801 14.6478 0 14.25 0Z" fill={color}/>
    </svg>
  );
}

function LibrarySvg() {
  return (
    <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.4135 15.9515H13.2461C13.9792 15.9515 14.3677 15.5569 14.3677 14.8537V5.18801L15.4819 15.0115C15.5552 15.7147 15.9804 16.0735 16.7061 15.9874L19.0006 15.686C19.7263 15.5999 20.0635 15.1837 19.9902 14.4805L18.6853 2.93485C18.612 2.23164 18.1869 1.87285 17.4612 1.95896L15.1594 2.26034C14.8002 2.29622 14.5363 2.42538 14.3677 2.6263V1.09788C14.3677 0.394662 13.9792 0 13.2461 0H11.4135C10.6878 0 10.2993 0.394662 10.2993 1.09788V14.8537C10.2993 15.5569 10.6878 15.9515 11.4135 15.9515ZM1.12156 15.9515H2.33842C3.07146 15.9515 3.45998 15.5569 3.45998 14.8537V3.12142C3.45998 2.4182 3.07146 2.02354 2.33842 2.02354H1.12156C0.388514 2.02354 0 2.4182 0 3.12142V14.8537C0 15.5569 0.388514 15.9515 1.12156 15.9515ZM5.44653 15.9515H8.30541C9.03846 15.9515 9.42697 15.5569 9.42697 14.8537V5.66879C9.42697 4.96557 9.03846 4.57808 8.30541 4.57808H5.44653C4.72082 4.57808 4.3323 4.96557 4.3323 5.66879V14.8537C4.3323 15.5569 4.72082 15.9515 5.44653 15.9515ZM6.02564 7.26179C5.73975 7.26179 5.52717 7.04651 5.52717 6.77384C5.52717 6.50834 5.73975 6.30024 6.02564 6.30024H7.7483C8.02685 6.30024 8.23944 6.50834 8.23944 6.77384C8.23944 7.04651 8.02685 7.26179 7.7483 7.26179H6.02564ZM6.02564 14.2294C5.73975 14.2294 5.52717 14.0213 5.52717 13.7486C5.52717 13.4759 5.73975 13.2678 6.02564 13.2678H7.7483C8.02685 13.2678 8.23944 13.4759 8.23944 13.7486C8.23944 14.0213 8.02685 14.2294 7.7483 14.2294H6.02564Z" fill="#052942"/>
    </svg>
  );
}

function Folder2Svg({ selected }: { selected: boolean }) {
  return (
    <svg width="23" height="18" viewBox="0 0 23 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.2 0H2.3C1.035 0 0.0115 1.0125 0.0115 2.25L0 15.75C0 16.9875 1.035 18 2.3 18H20.7C21.965 18 23 16.9875 23 15.75V4.5C23 3.2625 21.965 2.25 20.7 2.25H11.5L9.2 0Z" fill={selected ? "#052942" : "#D5D6D6"}/>
    </svg>
  );
}

function TrashSvg() {
  return (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.8967 3.71673H14.305V3.08442C14.305 2.58133 14.078 2.09884 13.6738 1.7431C13.2697 1.38735 12.7215 1.1875 12.15 1.1875H7.84C7.26846 1.1875 6.72033 1.38735 6.31618 1.7431C5.91204 2.09884 5.685 2.58133 5.685 3.08442V3.71673H2.09333C1.90282 3.71673 1.72011 3.78335 1.5854 3.90193C1.45068 4.02051 1.375 4.18134 1.375 4.34904C1.375 4.51674 1.45068 4.67757 1.5854 4.79615C1.72011 4.91473 1.90282 4.98135 2.09333 4.98135H2.81167V16.3629C2.81167 16.6983 2.96303 17.0199 3.23246 17.2571C3.50188 17.4943 3.86731 17.6275 4.24833 17.6275H15.7417C16.1227 17.6275 16.4881 17.4943 16.7575 17.2571C17.027 17.0199 17.1783 16.6983 17.1783 16.3629V4.98135H17.8967C18.0872 4.98135 18.2699 4.91473 18.4046 4.79615C18.5393 4.67757 18.615 4.51674 18.615 4.34904C18.615 4.18134 18.5393 4.02051 18.4046 3.90193C18.2699 3.78335 18.0872 3.71673 17.8967 3.71673ZM8.55833 13.2013C8.55833 13.369 8.48265 13.5299 8.34794 13.6485C8.21322 13.767 8.03051 13.8337 7.84 13.8337C7.64949 13.8337 7.46677 13.767 7.33206 13.6485C7.19735 13.5299 7.12167 13.369 7.12167 13.2013V8.14288C7.12167 7.97519 7.19735 7.81436 7.33206 7.69578C7.46677 7.5772 7.64949 7.51058 7.84 7.51058C8.03051 7.51058 8.21322 7.5772 8.34794 7.69578C8.48265 7.81436 8.55833 7.97519 8.55833 8.14288V13.2013ZM12.8683 13.2013C12.8683 13.369 12.7927 13.5299 12.6579 13.6485C12.5232 13.767 12.3405 13.8337 12.15 13.8337C11.9595 13.8337 11.7768 13.767 11.6421 13.6485C11.5073 13.5299 11.4317 13.369 11.4317 13.2013V8.14288C11.4317 7.97519 11.5073 7.81436 11.6421 7.69578C11.7768 7.5772 11.9595 7.51058 12.15 7.51058C12.3405 7.51058 12.5232 7.5772 12.6579 7.69578C12.7927 7.81436 12.8683 7.97519 12.8683 8.14288V13.2013ZM12.8683 3.71673H7.12167V3.08442C7.12167 2.91672 7.19735 2.75589 7.33206 2.63731C7.46677 2.51873 7.64949 2.45212 7.84 2.45212H12.15C12.3405 2.45212 12.5232 2.51873 12.6579 2.63731C12.7927 2.75589 12.8683 2.91672 12.8683 3.08442V3.71673Z" fill="#052942"/>
    </svg>
  );
}

// ─── Context menu icons ───────────────────────────────────────────────────────
function DuplicateSvg() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.8333 2.70833V12.4583C10.8333 12.602 10.7763 12.7398 10.6747 12.8414C10.5731 12.9429 10.4353 13 10.2917 13H0.541667C0.398008 13 0.260233 12.9429 0.158651 12.8414C0.0570684 12.7398 0 12.602 0 12.4583V2.70833C0 2.56467 0.0570684 2.4269 0.158651 2.32532C0.260233 2.22374 0.398008 2.16667 0.541667 2.16667H10.2917C10.4353 2.16667 10.5731 2.22374 10.6747 2.32532C10.7763 2.4269 10.8333 2.56467 10.8333 2.70833ZM12.4583 0H2.70833C2.56467 0 2.4269 0.0570684 2.32532 0.158651C2.22374 0.260233 2.16667 0.398008 2.16667 0.541667C2.16667 0.685326 2.22374 0.823101 2.32532 0.924683C2.4269 1.02627 2.56467 1.08333 2.70833 1.08333H11.9167V10.2917C11.9167 10.4353 11.9737 10.5731 12.0753 10.6747C12.1769 10.7763 12.3147 10.8333 12.4583 10.8333C12.602 10.8333 12.7398 10.7763 12.8414 10.6747C12.9429 10.5731 13 10.4353 13 10.2917V0.541667C13 0.398008 12.9429 0.260233 12.8414 0.158651C12.7398 0.0570684 12.602 0 12.4583 0Z" fill="#052942"/>
    </svg>
  );
}

function PencilSvg() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.2883 4.29913L10.6759 1.68116C10.5891 1.59408 10.4859 1.525 10.3724 1.47788C10.259 1.43075 10.1373 1.40649 10.0145 1.40649C9.89163 1.40649 9.76999 1.43075 9.6565 1.47788C9.54301 1.525 9.43989 1.59408 9.35304 1.68116L2.14477 8.90635C2.05754 8.99309 1.98838 9.09635 1.94132 9.21011C1.89425 9.32388 1.87022 9.44589 1.87061 9.56905V12.1876C1.87061 12.4362 1.96915 12.6747 2.14455 12.8505C2.31996 13.0263 2.55786 13.1251 2.80591 13.1251H12.6266C12.7506 13.1251 12.8696 13.0757 12.9573 12.9878C13.045 12.8999 13.0943 12.7807 13.0943 12.6564C13.0943 12.532 13.045 12.4128 12.9573 12.3249C12.8696 12.237 12.7506 12.1876 12.6266 12.1876H6.7412L13.2883 5.6251C13.3752 5.53804 13.4441 5.43469 13.4911 5.32093C13.5381 5.20717 13.5623 5.08525 13.5623 4.96211C13.5623 4.83898 13.5381 4.71706 13.4911 4.6033C13.4441 4.48954 13.3752 4.38618 13.2883 4.29913ZM11.2236 6.36866L8.61181 3.7501L10.0148 2.34385L12.6266 4.96241L11.2236 6.36866Z" fill="#052942"/>
    </svg>
  );
}

function TrashFillSvg() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.6562 2.8125H10.3125V2.34375C10.3125 1.97079 10.1643 1.6131 9.90062 1.34938C9.6369 1.08566 9.27921 0.9375 8.90625 0.9375H6.09375C5.72079 0.9375 5.3631 1.08566 5.09938 1.34938C4.83566 1.6131 4.6875 1.97079 4.6875 2.34375V2.8125H2.34375C2.21943 2.8125 2.1002 2.86189 2.01229 2.94979C1.92439 3.0377 1.875 3.15693 1.875 3.28125C1.875 3.40557 1.92439 3.5248 2.01229 3.61271C2.1002 3.70061 2.21943 3.75 2.34375 3.75H2.8125V12.1875C2.8125 12.4361 2.91127 12.6746 3.08709 12.8504C3.2629 13.0262 3.50136 13.125 3.75 13.125H11.25C11.4986 13.125 11.7371 13.0262 11.9129 12.8504C12.0887 12.6746 12.1875 12.4361 12.1875 12.1875V3.75H12.6562C12.7806 3.75 12.8998 3.70061 12.9877 3.61271C13.0756 3.5248 13.125 3.40557 13.125 3.28125C13.125 3.15693 13.0756 3.0377 12.9877 2.94979C12.8998 2.86189 12.7806 2.8125 12.6562 2.8125ZM6.5625 9.84375C6.5625 9.96807 6.51311 10.0873 6.42521 10.1752C6.3373 10.2631 6.21807 10.3125 6.09375 10.3125C5.96943 10.3125 5.8502 10.2631 5.76229 10.1752C5.67439 10.0873 5.625 9.96807 5.625 9.84375V6.09375C5.625 5.96943 5.67439 5.8502 5.76229 5.76229C5.8502 5.67439 5.96943 5.625 6.09375 5.625C6.21807 5.625 6.3373 5.67439 6.42521 5.76229C6.51311 5.8502 6.5625 5.96943 6.5625 6.09375V9.84375ZM9.375 9.84375C9.375 9.96807 9.32561 10.0873 9.23771 10.1752C9.1498 10.2631 9.03057 10.3125 8.90625 10.3125C8.78193 10.3125 8.6627 10.2631 8.57479 10.1752C8.48689 10.0873 8.4375 9.96807 8.4375 9.84375V6.09375C8.4375 5.96943 8.48689 5.8502 8.57479 5.76229C8.6627 5.67439 8.78193 5.625 8.90625 5.625C9.03057 5.625 9.1498 5.67439 9.23771 5.76229C9.32561 5.8502 9.375 5.96943 9.375 6.09375V9.84375ZM9.375 2.8125H5.625V2.34375C5.625 2.21943 5.67439 2.1002 5.76229 2.01229C5.8502 1.92439 5.96943 1.875 6.09375 1.875H8.90625C9.03057 1.875 9.1498 1.92439 9.23771 2.01229C9.32561 2.1002 9.375 2.21943 9.375 2.34375V2.8125Z" fill="#052942"/>
    </svg>
  );
}

// ─── Folder data ─────────────────────────────────────────────────────────────────

type FolderItem = {
  id:    string;
  label: string;
  count: number;
  icon:  "library" | "folder" | "trash";
};

const FOLDERS: FolderItem[] = [
  { id: "all-tests",  label: "All tests",      count: 456, icon: "library" },
  { id: "navigation", label: "Navigation",      count:  32, icon: "folder"  },
  { id: "contact",    label: "Contact",         count: 128, icon: "folder"  },
  { id: "payment",    label: "Payment",         count:  12, icon: "folder"  },
  { id: "internal",   label: "Internal",        count:   4, icon: "folder"  },
  { id: "checkout",   label: "Checkout Det...", count: 231, icon: "folder"  },
  { id: "deleted",    label: "Deleted",         count:  57, icon: "trash"   },
];

const MENU_ITEMS = [
  { id: "duplicate", label: "Duplicate", Icon: DuplicateSvg },
  { id: "edit",      label: "Edit",      Icon: PencilSvg    },
  { id: "delete",    label: "Delete",    Icon: TrashFillSvg },
] as const;

// ─── Design tokens ───────────────────────────────────────────────────────────────
const SELECTED_BG    = "#E0E5ED";
const SELECTED_COLOR = "#052942";
const DEFAULT_COLOR  = "#525151";
const COUNT_DEFAULT  = "#9CA3AF";
const BTN_SHADOW     = "0 1px 4px 0 rgba(0,0,0,0.16)";

function RowIcon({ type, isSelected }: { type: FolderItem["icon"]; isSelected: boolean }) {
  switch (type) {
    case "library": return <LibrarySvg />;
    case "trash":   return <TrashSvg />;
    default:        return <Folder2Svg selected={isSelected} />;
  }
}

// ─── EuFolderContainer ───────────────────────────────────────────────────────────

export type EuFolderContainerProps = {
  selected?: string;
};

export function EuFolderContainer({ selected = "contact" }: EuFolderContainerProps) {
  const { selectedComponentId, setControlValue } = useAppStore();
  const [mounted, setMounted]       = useState(false);
  const [hoveredId, setHoveredId]   = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuHoverId, setMenuHoverId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  // Close menu on outside click
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  function handleRowClick(id: string) {
    if (!selectedComponentId) return;
    setControlValue(selectedComponentId, "selected", id);
  }

  return (
    <div
      ref={containerRef}
      style={{
        width:           "200px",
        backgroundColor: "#FFFFFF",
        borderRadius:    "10px",
        // overflow visible so the context menu can escape the card bounds
        boxShadow:       "0 1px 4px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.06)",
        fontFamily:      "var(--font-figtree), sans-serif",
        opacity:         mounted ? 1 : 0,
        transform:       mounted ? "translateY(0)" : "translateY(6px)",
        transition:      "opacity 220ms ease, transform 220ms ease",
      }}
    >
      {/* ── Header ────────────────────────────────────────────────── */}
      <div
        style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          padding:        "10px 12px 6px",
        }}
      >
        <span
          style={{
            fontSize:      "12px",
            fontWeight:    500,
            letterSpacing: "0.06em",
            color:         "#949494",
            textTransform: "uppercase",
            fontFamily:    "inherit",
          }}
        >
          Folders
        </span>

        <div style={{ display: "flex", gap: "6px" }}>
          <button
            style={{
              display:         "inline-flex",
              alignItems:      "center",
              gap:             "5px",
              padding:         "0 8px",
              height:          "26px",
              backgroundColor: "#FFFFFF",
              borderRadius:    "6px",
              border:          "none",
              cursor:          "pointer",
              outline:         "none",
              boxShadow:       BTN_SHADOW,
            }}
          >
            <LightningSvg />
            <FolderPlusSvg />
          </button>

          <button
            style={{
              display:         "inline-flex",
              alignItems:      "center",
              justifyContent:  "center",
              padding:         "0 8px",
              height:          "26px",
              backgroundColor: "#FFFFFF",
              borderRadius:    "6px",
              border:          "none",
              cursor:          "pointer",
              outline:         "none",
              boxShadow:       BTN_SHADOW,
            }}
          >
            <FolderPlusSvg />
          </button>
        </div>
      </div>

      {/* ── Folder rows ───────────────────────────────────────────── */}
      <div style={{ padding: "2px 6px 8px", display: "flex", flexDirection: "column", gap: "6px" }}>
        {FOLDERS.map((f, i) => {
          const isSelected  = f.id === selected;
          const isHovered   = hoveredId === f.id;
          const menuOpen    = openMenuId === f.id;
          const showDots    = isHovered || menuOpen;
          const dotsColor   = isSelected ? SELECTED_COLOR : DEFAULT_COLOR;

          return (
            <div key={f.id} style={{ position: "relative" }}>
              <button
                onClick={() => handleRowClick(f.id)}
                onMouseEnter={() => setHoveredId(f.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  display:         "flex",
                  alignItems:      "center",
                  width:           "100%",
                  gap:             "8px",
                  padding:         "5px 10px",
                  minHeight:       "28px",
                  backgroundColor: isSelected ? SELECTED_BG : "transparent",
                  color:           isSelected ? SELECTED_COLOR : DEFAULT_COLOR,
                  borderRadius:    "6px",
                  border:          "none",
                  cursor:          "pointer",
                  fontFamily:      "inherit",
                  fontSize:        "14px",
                  fontWeight:      isSelected ? 600 : 400,
                  textAlign:       "left",
                  outline:         "none",
                  opacity:         mounted ? 1 : 0,
                  transform:       mounted ? "translateX(0)" : "translateX(-4px)",
                  transition:      `background-color 120ms ease, color 120ms ease, opacity 180ms ease ${i * 35}ms, transform 180ms ease ${i * 35}ms`,
                }}
              >
                {/* Icon */}
                <span style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
                  <RowIcon type={f.icon} isSelected={isSelected} />
                </span>

                {/* Label */}
                <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {f.label}
                </span>

                {/* Count / dots trigger */}
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(menuOpen ? null : f.id);
                  }}
                  style={{
                    width:          "24px",
                    flexShrink:     0,
                    display:        "flex",
                    alignItems:     "center",
                    justifyContent: "flex-end",
                    fontSize:       "12px",
                    fontWeight:     isSelected ? 600 : 400,
                    color:          isSelected ? SELECTED_COLOR : COUNT_DEFAULT,
                    cursor:         "pointer",
                  }}
                >
                  {showDots
                    ? <Dots2Svg color={dotsColor} />
                    : f.count
                  }
                </span>
              </button>

              {/* ── Context menu ──────────────────────────────────── */}
              {menuOpen && (
                <div
                  style={{
                    position:     "absolute",
                    top:          "calc(100% + 4px)",
                    right:        "-4px",
                    zIndex:       50,
                    width:        "170px",
                    backgroundColor: "#FFFFFF",
                    borderRadius: "10px",
                    boxShadow:    "0 4px 20px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)",
                    padding:      "4px",
                    fontFamily:   "inherit",
                  }}
                >
                  {MENU_ITEMS.map(({ id, label, Icon }) => (
                    <button
                      key={id}
                      onMouseEnter={() => setMenuHoverId(id)}
                      onMouseLeave={() => setMenuHoverId(null)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(null);
                      }}
                      style={{
                        display:         "flex",
                        alignItems:      "center",
                        gap:             "12px",
                        width:           "100%",
                        padding:         "9px 12px",
                        backgroundColor: menuHoverId === id ? "#F3F4F6" : "transparent",
                        border:          "none",
                        borderRadius:    "7px",
                        cursor:          "pointer",
                        fontFamily:      "inherit",
                        fontSize:        "14px",
                        fontWeight:      400,
                        color:           "#3B3B3B",
                        textAlign:       "left",
                        outline:         "none",
                        transition:      "background-color 80ms ease",
                      }}
                    >
                      <span style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
                        <Icon />
                      </span>
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Renderer ───────────────────────────────────────────────────────────────────

export function EuFolderContainerRenderer(values: ComponentControlValues): ReactNode {
  return (
    <EuFolderContainer
      selected={(values.selected as string) ?? "contact"}
    />
  );
}

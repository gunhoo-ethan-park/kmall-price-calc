"use client";

import { useState } from "react";
import { calcLogistics, formatNumber } from "@/lib/calculations";
import ExportButton from "@/components/ExportButton";

interface Row {
  id: number;
  name: string;
  width: string;
  length: string;
  height: string;
  weight: string;
  method: "air" | "sea";
  rate: string;
}

const emptyRow = (id: number): Row => ({
  id,
  name: "",
  width: "",
  length: "",
  height: "",
  weight: "",
  method: "air",
  rate: "",
});

export default function LogisticsPage() {
  const [rows, setRows] = useState<Row[]>([emptyRow(1)]);

  function updateRow(id: number, field: keyof Row, value: string) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  }

  function addRow() {
    setRows((prev) => [...prev, emptyRow(Date.now())]);
  }

  function removeRow(id: number) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  function getResult(row: Row) {
    const n = (v: string) => parseFloat(v) || 0;
    return calcLogistics({
      width: n(row.width),
      length: n(row.length),
      height: n(row.height),
      weight: n(row.weight),
      method: row.method,
      rate: n(row.rate),
    });
  }

  const exportData = rows.map((row) => {
    const r = getResult(row);
    return {
      "제품명": row.name,
      "가로(cm)": row.width,
      "세로(cm)": row.length,
      "높이(cm)": row.height,
      "실중량(kg)": row.weight,
      "배송방식": row.method === "air" ? "항공" : "해상",
      "단가": row.rate,
      "CBM": r.cbm.toFixed(4),
      "과금중량": row.method === "air" ? r.chargeableWeight.toFixed(2) + "kg" : r.chargeableWeight.toFixed(4) + "CBM",
      "물류비(원)": Math.round(r.cost),
    };
  });

  const totalCost = rows.reduce((sum, row) => sum + getResult(row).cost, 0);

  const thClass = "px-3 py-2 text-xs font-semibold text-gray-600 bg-gray-100 border border-gray-200 whitespace-nowrap";
  const tdClass = "px-2 py-1 border border-gray-200";
  const inputClass = "w-full text-sm border-0 focus:outline-none focus:ring-1 focus:ring-blue-400 rounded px-1 py-0.5";
  const resultClass = "px-3 py-2 text-sm text-right font-medium text-blue-700 border border-gray-200 bg-blue-50 whitespace-nowrap";

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">물류비 계산기</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            항공: 부피중량 vs 실중량 중 높은 값 적용 | 해상: CBM 기준
          </p>
        </div>
        <ExportButton data={exportData} filename="물류비계산" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className={thClass}>제품명</th>
              <th className={thClass}>가로(cm)</th>
              <th className={thClass}>세로(cm)</th>
              <th className={thClass}>높이(cm)</th>
              <th className={thClass}>실중량(kg)</th>
              <th className={thClass}>배송방식</th>
              <th className={thClass}>단가</th>
              <th className={thClass}>CBM</th>
              <th className={thClass}>과금중량</th>
              <th className={thClass}>물류비(원)</th>
              <th className={thClass}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const r = getResult(row);
              return (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className={tdClass}>
                    <input className={inputClass} value={row.name} onChange={(e) => updateRow(row.id, "name", e.target.value)} placeholder="제품명" />
                  </td>
                  <td className={tdClass}>
                    <input type="number" className={inputClass} value={row.width} onChange={(e) => updateRow(row.id, "width", e.target.value)} placeholder="0" />
                  </td>
                  <td className={tdClass}>
                    <input type="number" className={inputClass} value={row.length} onChange={(e) => updateRow(row.id, "length", e.target.value)} placeholder="0" />
                  </td>
                  <td className={tdClass}>
                    <input type="number" className={inputClass} value={row.height} onChange={(e) => updateRow(row.id, "height", e.target.value)} placeholder="0" />
                  </td>
                  <td className={tdClass}>
                    <input type="number" className={inputClass} value={row.weight} onChange={(e) => updateRow(row.id, "weight", e.target.value)} placeholder="0" />
                  </td>
                  <td className={tdClass}>
                    <select
                      className={`${inputClass} bg-white`}
                      value={row.method}
                      onChange={(e) => updateRow(row.id, "method", e.target.value)}
                    >
                      <option value="air">항공</option>
                      <option value="sea">해상</option>
                    </select>
                  </td>
                  <td className={tdClass}>
                    <input type="number" className={inputClass} value={row.rate} onChange={(e) => updateRow(row.id, "rate", e.target.value)} placeholder={row.method === "air" ? "원/kg" : "원/CBM"} />
                  </td>
                  <td className={resultClass}>{r.cbm.toFixed(4)}</td>
                  <td className={resultClass}>
                    {row.method === "air"
                      ? `${r.chargeableWeight.toFixed(2)}kg`
                      : `${r.chargeableWeight.toFixed(4)}CBM`}
                  </td>
                  <td className={resultClass}>{formatNumber(Math.round(r.cost))}원</td>
                  <td className="px-2 py-1 border border-gray-200 text-center">
                    <button onClick={() => removeRow(row.id)} className="text-gray-400 hover:text-red-500 text-xs font-bold">✕</button>
                  </td>
                </tr>
              );
            })}
            <tr className="bg-gray-50 font-semibold">
              <td colSpan={9} className="px-3 py-2 border border-gray-200 text-right text-sm text-gray-600">합계</td>
              <td className="px-3 py-2 border border-gray-200 text-right text-sm text-blue-700">{formatNumber(Math.round(totalCost))}원</td>
              <td className="border border-gray-200"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <button
        onClick={addRow}
        className="mt-3 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
      >
        <span className="text-lg leading-none">+</span> 행 추가
      </button>
    </div>
  );
}

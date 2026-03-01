"use client";

import { useState } from "react";
import { calcMargin, formatNumber } from "@/lib/calculations";
import ExportButton from "@/components/ExportButton";

interface Row {
  id: number;
  name: string;
  cost: string;
  logistics: string;
  salesPrice: string;
  commissionRate: string;
}

const emptyRow = (id: number): Row => ({
  id,
  name: "",
  cost: "",
  logistics: "",
  salesPrice: "",
  commissionRate: "",
});

export default function MarginPage() {
  const [rows, setRows] = useState<Row[]>([emptyRow(1)]);

  function updateRow(id: number, field: keyof Row, value: string) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }

  function addRow() {
    setRows((prev) => [...prev, emptyRow(Date.now())]);
  }

  function removeRow(id: number) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  function getResult(row: Row) {
    const n = (v: string) => parseFloat(v) || 0;
    return calcMargin({
      cost: n(row.cost),
      logistics: n(row.logistics),
      salesPrice: n(row.salesPrice),
      commissionRate: n(row.commissionRate),
    });
  }

  const exportData = rows.map((row) => {
    const r = getResult(row);
    return {
      "제품명": row.name,
      "원가(원)": row.cost,
      "물류비(원)": row.logistics,
      "판매가(원)": row.salesPrice,
      "수수료율(%)": row.commissionRate,
      "마진금액(원)": Math.round(r.marginAmount),
      "마진율(%)": r.marginRate.toFixed(2),
    };
  });

  const thClass = "px-3 py-2 text-xs font-semibold text-gray-600 bg-gray-100 border border-gray-200 whitespace-nowrap";
  const tdClass = "px-2 py-1 border border-gray-200";
  const inputClass = "w-full text-sm border-0 focus:outline-none focus:ring-1 focus:ring-blue-400 rounded px-1 py-0.5";
  const resultClass = "px-3 py-2 text-sm text-right font-medium text-blue-700 border border-gray-200 bg-blue-50 whitespace-nowrap";

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">마진 계산기</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            마진율 = (판매가 - 원가 - 물류비 - 수수료) ÷ 판매가 × 100
          </p>
        </div>
        <ExportButton data={exportData} filename="마진계산" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className={thClass}>제품명</th>
              <th className={thClass}>원가(원)</th>
              <th className={thClass}>물류비(원)</th>
              <th className={thClass}>판매가(원)</th>
              <th className={thClass}>수수료율(%)</th>
              <th className={thClass}>마진금액(원)</th>
              <th className={thClass}>마진율(%)</th>
              <th className={thClass}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const r = getResult(row);
              const isNegative = r.marginAmount < 0;
              return (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className={tdClass}>
                    <input className={inputClass} value={row.name} onChange={(e) => updateRow(row.id, "name", e.target.value)} placeholder="제품명" />
                  </td>
                  <td className={tdClass}>
                    <input type="number" className={inputClass} value={row.cost} onChange={(e) => updateRow(row.id, "cost", e.target.value)} placeholder="0" />
                  </td>
                  <td className={tdClass}>
                    <input type="number" className={inputClass} value={row.logistics} onChange={(e) => updateRow(row.id, "logistics", e.target.value)} placeholder="0" />
                  </td>
                  <td className={tdClass}>
                    <input type="number" className={inputClass} value={row.salesPrice} onChange={(e) => updateRow(row.id, "salesPrice", e.target.value)} placeholder="0" />
                  </td>
                  <td className={tdClass}>
                    <input type="number" className={inputClass} value={row.commissionRate} onChange={(e) => updateRow(row.id, "commissionRate", e.target.value)} placeholder="예: 10" />
                  </td>
                  <td className={`${resultClass} ${isNegative ? "text-red-600 bg-red-50" : ""}`}>
                    {formatNumber(Math.round(r.marginAmount))}원
                  </td>
                  <td className={`${resultClass} ${isNegative ? "text-red-600 bg-red-50" : ""}`}>
                    {r.marginRate.toFixed(2)}%
                  </td>
                  <td className="px-2 py-1 border border-gray-200 text-center">
                    <button onClick={() => removeRow(row.id)} className="text-gray-400 hover:text-red-500 text-xs font-bold">✕</button>
                  </td>
                </tr>
              );
            })}
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

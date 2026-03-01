// 물류비 계산
export interface LogisticsInput {
  width: number;  // cm
  length: number; // cm
  height: number; // cm
  weight: number; // kg (실중량)
  method: "air" | "sea";
  rate: number;   // 단가 (항공: 원/kg, 해상: 원/CBM)
}

export interface LogisticsResult {
  cbm: number;
  volumeWeight: number;
  chargeableWeight: number;
  cost: number;
}

export function calcLogistics(input: LogisticsInput): LogisticsResult {
  const cbm = (input.width * input.length * input.height) / 1_000_000;

  if (input.method === "air") {
    const volumeWeight = (input.width * input.length * input.height) / 6000;
    const chargeableWeight = Math.max(volumeWeight, input.weight);
    return {
      cbm,
      volumeWeight,
      chargeableWeight,
      cost: chargeableWeight * input.rate,
    };
  } else {
    // 해상
    return {
      cbm,
      volumeWeight: cbm * 1000, // 참고용
      chargeableWeight: cbm,
      cost: cbm * input.rate,
    };
  }
}

// 판매가 계산
export interface SalesPriceInput {
  cost: number;         // 원가 (원)
  logistics: number;    // 물류비 (원)
  commissionRate: number; // 플랫폼 수수료율 (%)
  marginRate: number;   // 목표 마진율 (%)
}

export interface SalesPriceResult {
  salesPrice: number;
  marginAmount: number;
}

export function calcSalesPrice(input: SalesPriceInput): SalesPriceResult {
  const divisor = 1 - input.commissionRate / 100 - input.marginRate / 100;
  if (divisor <= 0) return { salesPrice: 0, marginAmount: 0 };
  const salesPrice = (input.cost + input.logistics) / divisor;
  const commission = salesPrice * (input.commissionRate / 100);
  const marginAmount = salesPrice - input.cost - input.logistics - commission;
  return { salesPrice, marginAmount };
}

// 마진 계산
export interface MarginInput {
  cost: number;         // 원가
  logistics: number;    // 물류비
  salesPrice: number;   // 판매가
  commissionRate: number; // 수수료율 (%)
}

export interface MarginResult {
  marginAmount: number;
  marginRate: number;
}

export function calcMargin(input: MarginInput): MarginResult {
  if (input.salesPrice <= 0) return { marginAmount: 0, marginRate: 0 };
  const commission = input.salesPrice * (input.commissionRate / 100);
  const marginAmount = input.salesPrice - input.cost - input.logistics - commission;
  const marginRate = (marginAmount / input.salesPrice) * 100;
  return { marginAmount, marginRate };
}

// 영업이익 계산
export interface ProfitInput {
  quantity: number;     // 판매수량
  salesPrice: number;   // 판매가
  cost: number;         // 원가
  logistics: number;    // 물류비
  otherCost: number;    // 기타비용 (건당)
}

export interface ProfitResult {
  totalRevenue: number;
  totalCost: number;
  operatingProfit: number;
  profitRate: number;
}

export function calcProfit(input: ProfitInput): ProfitResult {
  const totalRevenue = input.salesPrice * input.quantity;
  const totalCost = (input.cost + input.logistics + input.otherCost) * input.quantity;
  const operatingProfit = totalRevenue - totalCost;
  const profitRate = totalRevenue > 0 ? (operatingProfit / totalRevenue) * 100 : 0;
  return { totalRevenue, totalCost, operatingProfit, profitRate };
}

// 숫자 포맷 (천 단위 콤마)
export function formatNumber(value: number, decimals = 0): string {
  if (!isFinite(value)) return "-";
  return value.toLocaleString("ko-KR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

import Link from "next/link";

const tools = [
  {
    href: "/logistics",
    title: "물류비 계산기",
    description: "제품 부피/무게와 배송방식(항공/해상)에 따른 물류비를 계산합니다.",
    icon: "🚚",
    color: "bg-orange-50 border-orange-200 hover:border-orange-400",
    iconBg: "bg-orange-100",
  },
  {
    href: "/sales-price",
    title: "판매가 계산기",
    description: "원가·물류비·수수료·목표마진을 입력하면 최적 판매가를 계산합니다.",
    icon: "🏷️",
    color: "bg-blue-50 border-blue-200 hover:border-blue-400",
    iconBg: "bg-blue-100",
  },
  {
    href: "/margin",
    title: "마진 계산기",
    description: "판매가와 원가·물류비·수수료를 기반으로 실제 마진율을 계산합니다.",
    icon: "📊",
    color: "bg-green-50 border-green-200 hover:border-green-400",
    iconBg: "bg-green-100",
  },
  {
    href: "/profit",
    title: "영업이익 계산기",
    description: "수량·판매가·원가·물류비·기타비용으로 영업이익과 이익률을 계산합니다.",
    icon: "💰",
    color: "bg-purple-50 border-purple-200 hover:border-purple-400",
    iconBg: "bg-purple-100",
  },
];

export default function HomePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">KMall 통합 계산기</h1>
        <p className="text-gray-500 mt-1">업무에 필요한 계산 도구를 한 곳에서 사용하세요.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5 max-w-3xl">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className={`block border-2 rounded-xl p-6 transition-all ${tool.color}`}
          >
            <div className={`w-12 h-12 ${tool.iconBg} rounded-xl flex items-center justify-center text-2xl mb-4`}>
              {tool.icon}
            </div>
            <h2 className="text-base font-semibold text-gray-800 mb-1">{tool.title}</h2>
            <p className="text-sm text-gray-500 leading-relaxed">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

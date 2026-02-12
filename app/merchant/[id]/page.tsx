import { mockMerchants } from '@/lib/mock-data';
import MerchantDetailContent from './MerchantDetailContent';

// 为静态导出生成所有商家页面的参数
export function generateStaticParams() {
  return mockMerchants.map((merchant) => ({
    id: merchant.id,
  }));
}

export default async function MerchantDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const merchant = mockMerchants.find(m => m.id === id);

  // 在静态导出模式下，所有路由都应该通过 generateStaticParams 生成
  // 如果找不到商家，返回 null 让 Next.js 处理
  if (!merchant) {
    return null;
  }

  return <MerchantDetailContent merchant={merchant} />;
}

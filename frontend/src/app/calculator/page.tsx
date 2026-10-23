'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CalculatorIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/calculator/route');
  }, [router]);

  return (
    <div className="flex items-center justify-center p-12 text-[#777C72] font-mono text-[13px]">
      Loading onboarding setup...
    </div>
  );
}

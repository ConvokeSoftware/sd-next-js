import HomePageComponent from '@/components/page/HomePageComponent';
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={null}>
      <HomePageComponent />
    </Suspense>
  );
}

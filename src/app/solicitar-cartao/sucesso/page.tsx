import { Suspense } from 'react';
import SucessoClient from './SucessoClient';

export default function SucessoPage() {
  return (
    <Suspense>
      <SucessoClient />
    </Suspense>
  );
}

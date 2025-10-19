import { Suspense } from 'react';
import SucessoClient from './SucessoClient';

export default function SucessoPage() {
  return (
    <Suspense fallback={<p>Carregando...</p>}>
      <SucessoClient />
    </Suspense>
  );
}

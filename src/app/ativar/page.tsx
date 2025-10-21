// app/ativar/page.tsx
import AtivacaoCliente from './AtivacaoCliente';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default async function AtivarCartaoPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const token = typeof params.token === 'string' ? params.token : null;
  const uid = typeof params.uid === 'string' ? params.uid : null;
  const giftId = typeof params.giftId === 'string' ? params.giftId : null;

 
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow px-4 sm:px-6 lg:px-8 py-6 pt-24 sm:pt-28 pb-12">
          <div className="min-h-screen flex flex-col items-center bg-gray-50 px-4 py-12">
           <AtivacaoCliente token={token} uid={uid} giftId={giftId} />;
          </div>
        </main>
        <Footer />
      </div>
    );
}
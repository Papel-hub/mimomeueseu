// app/agendar/page.tsx
import AgendarForm from './AgendarForm';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default async function AgendarPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Aguarde a resolução dos parâmetros
  const params = await searchParams;

  const nomeEmpresa = typeof params.nomeEmpresa === 'string' ? params.nomeEmpresa : '';
  const email = typeof params.email === 'string' ? params.email : '';
  const contato = typeof params.contato === 'string' ? params.contato : '';
  const produto = typeof params.produto === 'string' ? params.produto : '';

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow px-4 sm:px-6 lg:px-8 py-6 pt-24 sm:pt-28 pb-12">
        <div className="min-h-screen flex flex-col items-center bg-gray-50 px-4 py-12">
          <AgendarForm
            nomeEmpresa={nomeEmpresa}
            email={email}
            contato={contato}
            produto={produto}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
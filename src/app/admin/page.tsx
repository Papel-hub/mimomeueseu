// app/approvals/page.tsx
import ApprovalCard from '@/components/ApprovalCard';
import HeaderAdm from '@/components/HeaderAdm';
import Footer from '@/components/Footer';
// Dados mockados (substitua por chamada à API em produção)
const mockApprovals = [
  {
    id: '1',    categoria:'parceiro',
    customerName: 'Ana Silva',
    productName: 'Cesta ',
    amount: 'R$ 3.299,00',
    date: '12 abr. 2024',
    imageUrl: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',    categoria:'parceiro',
    customerName: 'Carlos Mendes',
    productName: 'Amigos',
    amount: 'R$ 8.999,00',
    date: '11 abr. 2024',
    imageUrl: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: '3',    categoria:'parceiro',
    customerName: 'Juliana Costa',
    productName: 'Cesta & Familia',
    amount: 'R$ 499,00',
    date: '10 abr. 2024',
    imageUrl: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: '4',    categoria:'parceiro',
    customerName: 'Romance',
    productName: 'Cesta"',
    amount: 'R$ 2.799,00',
    date: '09 abr. 2024',
    imageUrl: 'https://i.pravatar.cc/150?img=4',
  },
  {
    id: '5',    categoria:'parceiro',
    customerName: 'Mariana Souza',
    productName: 'Cesta',
    amount: 'R$ 4.199,00',
    date: '08 abr. 2024',
    imageUrl: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: '6',
    categoria:'parceiro',
    customerName: 'Lucas Ferreira',
    productName: 'Cesta',
    amount: 'R$ 1.899,00',
    date: '07 abr. 2024',
    imageUrl: 'https://i.pravatar.cc/150?img=6',
  },
];

export default function AdminPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header fixo */}
        <HeaderAdm />
            {/* Conteúdo principal */}
        <main className="flex-grow sm:px-16 px-8 pt-24 pb-8 sm:pt-28 sm:pb-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Aprovações Manuais</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockApprovals.map((approval) => (
          <ApprovalCard key={approval.id} {...approval} />
        ))}
        </div>
        </main>

        {/* Footer */}
        <Footer />
    </div>
  );
}
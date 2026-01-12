import { FaBox } from 'react-icons/fa';
import { FormatoValido } from '@/types/format';

interface FormatSelectorProps {
  selectedFormat: FormatoValido;
  setSelectedFormat: (format: FormatoValido) => void;
  // Adicionamos o "?" para indicar que as opções podem ser parciais ou nulas
  formatOptions?: {
    cesta?: number;
    maleta?: number;
    bandeja?: number;
    caixa?: number;
  };
}

export default function FormatSelector({ 
  selectedFormat, 
  setSelectedFormat, 
  formatOptions 
}: FormatSelectorProps) {
  
  const formatos: FormatoValido[] = ['cesta', 'maleta', 'bandeja', 'caixa'];
  
  const labels: Record<FormatoValido, string> = {
    cesta: 'Cesta',
    maleta: 'Maleta',
    bandeja: 'Bandeja',
    caixa: 'Caixa Mimo',
  };

  return (
    <div className="space-y-4">
      <h2 className="font-bold text-gray-800">Escolha o formato:</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {formatos.map((format) => {
          // Usamos o operador ?? para garantir que, se for undefined, o valor seja 0
          const extra = formatOptions?.[format] ?? 0;
          const isSelected = selectedFormat === format;

          return (
            <label
              key={format}
              className={`relative flex flex-col items-center p-3 border-2 rounded-2xl cursor-pointer transition-all ${
                isSelected ? 'border-red-600 bg-red-50' : 'border-gray-200 bg-white'
              }`}
            >
              <input
                type="radio"
                className="sr-only"
                checked={isSelected}
                onChange={() => setSelectedFormat(format)}
              />
              {format === 'caixa' && <FaBox className={`mb-1 ${isSelected ? 'text-red-600' : 'text-gray-400'}`} />}
              <span className="text-[11px] font-bold text-center uppercase tracking-tighter">
                {labels[format]}
              </span>
              {extra > 0 && (
                <span className="text-[10px] font-bold text-green-600 mt-1">
                  +R$ {extra.toFixed(2)}
                </span>
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
}
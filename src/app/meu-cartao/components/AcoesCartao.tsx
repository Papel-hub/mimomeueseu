'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,       
  faInfoCircle,  
  faPlus,        
  faShareAlt,     
  faIdCard,       
} from '@fortawesome/free-solid-svg-icons';

export default function AcoesCartao({
  onShowDetails,
  onAction,
}: {
  onShowDetails: () => void;
  onAction: (action: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {/* Visualizar */}
      <button
        onClick={() => onAction('visualizar')}
        className="flex items-center gap-3 px-4 py-3 w-full rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-sm"
      >
        <FontAwesomeIcon icon={faEye} className="w-5 h-5" />
        <span className="truncate">Visualizar</span>
      </button>

      {/* Detalhes */}
      <button
        onClick={onShowDetails}
        className="flex items-center gap-3 px-4 py-3 w-full rounded-full bg-rose-600 text-white font-medium hover:bg-rose-700 transition shadow-sm"
      >
        <FontAwesomeIcon icon={faInfoCircle} className="w-5 h-5" />
        <span className="truncate">Detalhes</span>
      </button>

      {/* Recarregar */}
      <button
        onClick={() => onAction('recarregar')}
        className="flex items-center gap-3 px-4 py-3 w-full rounded-full bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition shadow-sm"
      >
        <FontAwesomeIcon icon={faPlus} className="w-5 h-5" />
        <span className="truncate">Recarregar</span>
      </button>

      {/* Compartilhar */}
      <button
        onClick={() => onAction('compartilhar')}
        className="flex items-center gap-3 px-4 py-3 w-full rounded-full bg-violet-600 text-white font-medium hover:bg-violet-700 transition shadow-sm"
      >
        <FontAwesomeIcon icon={faShareAlt} className="w-5 h-5" />
        <span className="truncate">Compartilhar</span>
      </button>

      {/* Solicitar Cartão Físico */}
      <button
        onClick={() => onAction('solicitar-fisico')}
        className="flex items-center gap-3 px-4 py-3 w-full rounded-full bg-amber-600 text-white font-medium hover:bg-amber-700 transition shadow-sm"
      >
        <FontAwesomeIcon icon={faIdCard} className="w-5 h-5" />
        <span className="truncate">Cartão Físico</span>
      </button>
    </div>
  );
}
import { Dispatch, SetStateAction } from 'react';

type ViewMode = 'descricao' | 'mapa' | 'como-funciona';

interface Props {
  viewMode: ViewMode;
  setViewMode: Dispatch<SetStateAction<ViewMode>>;
}

const tabLabels: Record<ViewMode, string> = {
  descricao: 'Descrição',
  mapa: 'Ver mapa',
  'como-funciona': 'Como funciona',
};

export default function EventTabs({ viewMode, setViewMode }: Props) {
  const tabs: ViewMode[] = ['descricao', 'mapa', 'como-funciona'];

  return (
    <div role="tablist" className="flex flex-wrap gap-2 mb-6">
      {tabs.map((mode) => (
        <button
          key={mode}
          role="tab"
          aria-selected={viewMode === mode}
          onClick={() => setViewMode(mode)}
          className={`px-4 py-2 rounded-md capitalize transition-colors ${
            viewMode === mode
              ? 'bg-red-900 text-white'
              : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {tabLabels[mode]}
        </button>
      ))}
    </div>
  );
}
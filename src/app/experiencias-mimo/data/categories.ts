export interface CategoryData {
  id: number;
  link: string;
  name: string;
  description: string;
  image: string;
  experienceCount: number;
  priceRange: string;
}

export const categories: CategoryData[] = [
  {
    id: 1,
    link: 'viagens-exploracoes',
    name: 'Viagens & Explorações',
    description:
      'Presentes mágicos para tornar o Natal inesquecível. Escolha entre experiências emocionantes, relaxantes ou personalizadas para surpreender quem ama.',
    image: '/images/cartaouser.svg',
    experienceCount: 48,
    priceRange: '25,00 – 1000,00',
  },
  {
    id: 2,
    link: 'passeios-aventuras',
    name: 'Passeios & Aventuras',
    description:
      'Agarre o volante e acelere numa das nossas experiências de condução e velocidade. Escolha o seu carro super desportivo preferido e realize um sonho.',
    image: '/images/cartaouser.svg',
    experienceCount: 32,
    priceRange: '250,00 – 7200,00',
  },
  {
    id: 3,
    link: 'esportes-movimento',
    name: 'Esportes & Movimento',
    description:
      'Viva emoções fortes com experiências que desafiam os seus limites: paraquedismo, bungee jumping e muito mais.',
    image: '/images/cartaouser.svg',
    experienceCount: 20,
    priceRange: '99,00 – 3500,00',
  },
  {
    id: 4,
    link: 'entretenimento-cultura',
    name: 'Entretenimento & Cultura',
    description:
      'Experiências culturais emocionantes, desde concertos até visitas guiadas exclusivas.',
    image: '/images/cartaouser.svg',
    experienceCount: 28,
    priceRange: '99,00 – 3500,00',
  },
  {
    id: 5,
    link: 'networking-profissoes',
    name: 'Networking & Profissões',
    description:
      'Workshops, mentorias e experiências focadas na evolução pessoal e profissional.',
    image: '/images/cartaouser.svg',
    experienceCount: 21,
    priceRange: '99,00 – 3500,00',
  },
  {
    id: 6,
    link: 'experiencias-afetivas-especiais',
    name: 'Experiências Afetivas & Especiais',
    description:
      'Momentos únicos para fortalecer laços afetivos com quem você ama.',
    image: '/images/cartaouser.svg',
    experienceCount: 16,
    priceRange: '99,00 – 3500,00',
  },
  {
    id: 7,
    link: 'entretenimento-online',
    name: 'Entretenimento Online',
    description:
      'Experiências virtuais incríveis para aproveitar sem sair de casa.',
    image: '/images/cartaouser.svg',
    experienceCount: 48,
    priceRange: '99,00 – 3500,00',
  },
  {
    id: 8,
    link: 'conhecimento-profissoes',
    name: 'Conhecimento & Profissões',
    description:
      'Cursos, formações e experiências educativas para expandir horizontes.',
    image: '/images/skydiving.jpg',
    experienceCount: 48,
    priceRange: '99,00 – 3500,00',
  },
  {
    id: 9,
    link: 'experiencias-virtuais-afetivas',
    name: 'Experiências Afetivas Virtuais',
    description:
      'Conexões especiais em formato digital, perfeitas para longas distâncias.',
    image: '/images/cartaouser.svg',

    experienceCount: 48,
    priceRange: '99,00 – 3500,00',
  },
  {
    id: 10,
    link: 'saude-bemestar-lifestyle',
    name: 'Saúde, Bem-estar & Lifestyle',
    description:
      'Relaxamento, saúde e cuidados pessoais para transformar rotinas.',
    image: '/images/cartaouser.svg',
    experienceCount: 48,
    priceRange: '99,00 – 3500,00',
  },
  {
    id: 11,
    link: 'conexoes-diversao',
    name: 'Conexões & Diversão',
    description:
      'Momentos leves, divertidos e perfeitos para criar novas memórias.',
    image: '/images/cartaouser.svg',
    experienceCount: 48,
    priceRange: '99,00 – 3500,00',
  },
];

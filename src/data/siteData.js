// =====================================================================
//  EDITE AQUI: todos os textos e links da página ficam neste arquivo.
//  Os itens marcados com "TROCAR" são provisórios.
// =====================================================================

export const site = {
  name: 'Aurenir Terto',
  crp: 'CRP 00/00000', // TROCAR
  // Número com DDI+DDD, só dígitos. Ex.: '5561999999999'.
  // Se ficar vazio, o formulário mostra a mensagem pronta para copiar e enviar pelo Instagram.
  whatsapp: '', // TROCAR
  social: {
    instagram: 'https://www.instagram.com/aurenirterto/',
    telegram: 'https://t.me/joinchat/EA0mZb5-O2raSOMP',
    youtube: 'https://www.youtube.com/channel/UCJWXSo8oPNvf7HB3ehUmorg',
  },
  session: {
    duration: '50 minutos', // TROCAR se for diferente
    format: 'Videochamada',
  },
  about: {
    // TROCAR: texto na voz da psicóloga
    paragraphs: [
      'Sou psicóloga e acredito que cuidar da saúde mental começa por ser ouvido sem julgamento. Na terapia, o ritmo é o seu.',
      'Atendo online, com sigilo e ética profissional, pessoas que buscam lidar melhor com estresse, ansiedade, depressão e experiências traumáticas.',
      'Também compartilho conteúdo sobre saúde emocional no Instagram, no Telegram e no YouTube.',
    ],
    details: [
      { label: 'Registro', value: 'CRP 00/00000' }, // TROCAR
      { label: 'Abordagem', value: 'Informe a abordagem teórica' }, // TROCAR
      { label: 'Atendimento', value: 'Online, por videochamada' },
    ],
  },
}

export const topics = [
  {
    id: 'estresse',
    name: 'Estresse',
    tagline: 'Quando o corpo e a mente ficam em alerta o tempo todo',
    what: 'O estresse é a resposta natural do organismo às exigências e pressões do dia a dia. Em momentos curtos, ajuda a reagir. Quando se prolonga, desgasta o corpo e a mente.',
    signs: [
      'Cansaço constante, mesmo depois de dormir',
      'Irritabilidade e pouca paciência',
      'Dificuldade para relaxar ou para dormir',
      'Tensão muscular, dores de cabeça',
      'Dificuldade de concentração',
    ],
    help: 'Na terapia, você identifica o que está sobrecarregando, aprende a colocar limites e constrói formas de desacelerar que cabem na sua rotina.',
  },
  {
    id: 'ansiedade',
    name: 'Ansiedade',
    tagline: 'Preocupação que não desliga e antecipa o pior',
    what: 'Sentir ansiedade diante de algo incerto é comum. Quando ela é intensa, frequente e começa a atrapalhar o trabalho, os estudos ou as relações, vale buscar ajuda profissional.',
    signs: [
      'Preocupação excessiva e difícil de controlar',
      'Coração acelerado, falta de ar, aperto no peito',
      'Pensamentos que antecipam situações ruins',
      'Evitar lugares, pessoas ou tarefas por medo',
      'Inquietação e sensação de estar no limite',
    ],
    help: 'A terapia ajuda a entender o que alimenta a ansiedade e oferece ferramentas para lidar com os pensamentos e as sensações do corpo.',
  },
  {
    id: 'depressao',
    name: 'Depressão',
    tagline: 'Mais do que tristeza: um peso que dura semanas',
    what: 'A depressão é uma condição de saúde que afeta o humor, a energia e a forma de enxergar a vida. Não é fraqueza nem falta de força de vontade, e tem tratamento.',
    signs: [
      'Tristeza ou vazio na maior parte dos dias',
      'Perda de interesse no que antes dava prazer',
      'Mudanças no sono e no apetite',
      'Cansaço e falta de energia',
      'Sentimentos de culpa ou de inutilidade',
    ],
    help: 'O acompanhamento psicológico oferece um espaço seguro para falar do que sente. Em alguns casos, o cuidado também envolve avaliação médica, e isso é conversado com você.',
    alert: 'Se você está pensando em se machucar ou em acabar com a própria vida, procure ajuda agora: ligue 188 (CVV, 24 horas, gratuito) ou 192 (SAMU).',
  },
  {
    id: 'traumas',
    name: 'Traumas',
    tagline: 'Marcas de experiências muito difíceis que ainda doem',
    what: 'Um trauma pode surgir depois de situações que ameaçaram a segurança ou o bem-estar emocional. As reações variam de pessoa para pessoa e podem aparecer muito tempo depois.',
    signs: [
      'Lembranças ou pesadelos que se repetem',
      'Evitar lugares, assuntos ou pessoas que lembram o ocorrido',
      'Susto fácil e sensação de perigo constante',
      'Sentir-se distante de si mesmo ou dos outros',
      'Dificuldade de confiar',
    ],
    help: 'O trabalho é feito com cuidado, no seu tempo e sem pressa para contar o que você não quer contar. Primeiro vem a segurança, depois o processamento.',
  },
]

// Materiais indicados (seção "Materiais"). Para adicionar outro, copie um bloco e
// coloque a capa em public/materiais/.
export const products = [
  {
    id: 'mentalidade-de-vencedor',
    title: 'Mentalidade de Vencedor',
    image: '/materiais/mentalidade-de-vencedor.png',
    link: 'https://chk.eduzz.com/39YBPNQ3WO',
  },
  {
    id: 'segredos-da-aprendizagem-pnl',
    title: 'E-book: Os Segredos da Aprendizagem Revelados pela PNL Aplicados à Educação',
    image: '/materiais/segredos-da-aprendizagem-pnl.png',
    link: 'https://sun.eduzz.com/1743870',
  },
  {
    id: 'oficina-de-acolhida',
    title: 'Oficina de Acolhida para Estudantes',
    image: '/materiais/oficina-de-acolhida.png',
    link: 'https://chk.eduzz.com/1755020',
  },
]

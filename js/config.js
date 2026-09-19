/* =========================================================
   CONFIGURAÇÃO DA LOJA — edite só este arquivo para trocar
   nome, contatos, frete e produtos.
   ========================================================= */

const LOJA = {
  nome: "Laura Store",
  usuario: "@laurastore",
  verificado: true,
  bio: "Acessórios, beleza e moda com carinho ✨ Entregamos na cidade toda. Peça pelo site e finalize no WhatsApp.",
  cidade: "Sapucaia do Sul, RS",
  desde: "Na loja desde março de 2024",
  avatar: "",   // ex: "img/logo.jpg"  (vazio = mostra a inicial)
  banner: "",   // ex: "img/banner.jpg" (vazio = gradiente)
  numeros: [
    { valor: "2,4 mil", rotulo: "Clientes" },
    { valor: "4,9 ★", rotulo: "Avaliação" },
  ],

  // Post fixado no topo (estilo X). Deixe null para esconder.
  fixado: {
    texto: "Frete GRÁTIS em compras acima de R$ 150 🛍️ Válido para toda a cidade até o fim do mês!",
    data: "12 set",
  },

  contato: {
    whatsapp: "5551999999999",           // só números, com 55 + DDD
    telefone: "(51) 99999-9999",
    instagram: "laurastore",
    email: "contato@laurastore.com.br",
    endereco: "Rua Exemplo, 123 — Centro, Sapucaia do Sul/RS",
    horario: [
      ["Seg a Sex", "09h às 19h"],
      ["Sábado", "09h às 14h"],
      ["Domingo", "Fechado"],
    ],
  },

  entrega: {
    taxa: 10,          // taxa de entrega em R$
    gratisAcima: 150,  // 0 = nunca grátis
    retirada: true,    // permite "retirar na loja"
  },

  pagamentos: ["Pix", "Cartão na entrega", "Dinheiro"],

  faq: [
    ["Como funciona o pedido?", "Você monta o carrinho aqui no site e, ao finalizar, o pedido vai pronto para o nosso WhatsApp. A gente confirma por lá."],
    ["Qual o prazo de entrega?", "Pedidos confirmados até 16h saem no mesmo dia. Depois disso, no próximo dia útil."],
    ["Posso trocar um produto?", "Sim! Você tem até 7 dias após o recebimento, com a peça sem uso e na embalagem."],
  ],
};

/* Categorias viram as abas da página inicial (estilo X). */
const CATEGORIAS = ["Acessórios", "Bolsas", "Calçados", "Beleza", "Roupas"];

/* ---------------------------------------------------------
   PRODUTOS
   - imagem: foto com fundo transparente (PNG) gira em 3D.
   - fotos360: se tiver as fotos tiradas em volta do produto
     (ex.: 24 ou 36 fotos), coloque aqui na ordem — o giro
     passa a usar as fotos reais.
   - emoji: só um marcador provisório até ter as fotos.
   - tags: "destaque", "novo", "promo"
   --------------------------------------------------------- */
const PRODUTOS = [
  { id: 1,  nome: "Anel Solitário Prata 925", categoria: "Acessórios", preco: 89.9,  precoAntigo: 119.9, emoji: "💍", cor: "#e9e4ff", tags: ["destaque", "promo"],
    descricao: "Anel em prata 925 com zircônia central. Acabamento polido e antialérgico.",
    opcoes: { nome: "Aro", valores: ["12", "14", "16", "18", "20"] } },
  { id: 2,  nome: "Relógio Minimal Dourado", categoria: "Acessórios", preco: 249.9, emoji: "⌚", cor: "#fff1d6", tags: ["destaque", "novo"],
    descricao: "Caixa de 36 mm, pulseira de aço e resistência à água 3 ATM." },
  { id: 3,  nome: "Óculos de Sol Gatinho", categoria: "Acessórios", preco: 129.9, emoji: "🕶️", cor: "#dff3ff", tags: ["novo"],
    descricao: "Proteção UV400, armação leve em acetato e estojo incluso." },
  { id: 4,  nome: "Bolsa Tiracolo Couro", categoria: "Bolsas", preco: 199.9, precoAntigo: 259.9, emoji: "👜", cor: "#ffe3d9", tags: ["destaque", "promo"],
    descricao: "Couro legítimo, alça regulável e dois compartimentos internos.",
    opcoes: { nome: "Cor", valores: ["Caramelo", "Preta", "Off-white"] } },
  { id: 5,  nome: "Mochila Urbana", categoria: "Bolsas", preco: 179.9, emoji: "🎒", cor: "#e2f5e6", tags: [],
    descricao: "Espaço para notebook de até 15\", tecido impermeável e bolso antifurto." },
  { id: 6,  nome: "Tênis Casual Branco", categoria: "Calçados", preco: 229.9, emoji: "👟", cor: "#eef0f3", tags: ["destaque"],
    descricao: "Cabedal em material sintético, palmilha macia e solado de borracha.",
    opcoes: { nome: "Tamanho", valores: ["34", "35", "36", "37", "38", "39"] } },
  { id: 7,  nome: "Scarpin Vermelho", categoria: "Calçados", preco: 189.9, emoji: "👠", cor: "#ffe0e3", tags: ["novo"],
    descricao: "Salto 9 cm, bico fino e forro acolchoado.",
    opcoes: { nome: "Tamanho", valores: ["34", "35", "36", "37", "38"] } },
  { id: 8,  nome: "Batom Matte Rosé", categoria: "Beleza", preco: 39.9, precoAntigo: 49.9, emoji: "💄", cor: "#ffe4f1", tags: ["promo"],
    descricao: "Alta cobertura, longa duração e fórmula que não resseca." },
  { id: 9,  nome: "Hidratante Corporal", categoria: "Beleza", preco: 59.9, emoji: "🧴", cor: "#e3f7f5", tags: ["novo"],
    descricao: "Fragrância floral suave, absorção rápida. 400 ml." },
  { id: 10, nome: "Vestido Midi Floral", categoria: "Roupas", preco: 159.9, emoji: "👗", cor: "#e7f0ff", tags: ["destaque"],
    descricao: "Tecido leve de viscose, decote V e amarração na cintura.",
    opcoes: { nome: "Tamanho", valores: ["P", "M", "G", "GG"] } },
  { id: 11, nome: "Camisa de Linho", categoria: "Roupas", preco: 139.9, emoji: "👚", cor: "#f3ecdf", tags: [],
    descricao: "Linho puro, caimento soltinho e botões de madrepérola.",
    opcoes: { nome: "Tamanho", valores: ["P", "M", "G"] } },
  { id: 12, nome: "Laço de Cabelo Cetim", categoria: "Acessórios", preco: 24.9, emoji: "🎀", cor: "#ffe6ea", tags: ["promo"], precoAntigo: 34.9,
    descricao: "Laço grande em cetim com presilha de metal." },
];

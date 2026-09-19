/* =========================================================
   CONFIGURAÇÃO DA LOJA — edite só este arquivo para trocar
   nome, contatos, frete e produtos.
   ========================================================= */

const LOJA = {
  nome: "Laura Store",
  usuario: "@laurastore",
  verificado: true,
  bio: "produtos\nEntregamos na cidade toda. Peça pelo site e finalize no WhatsApp.",
  cidade: "Sapucaia do Sul, RS",
  desde: "",   // ex: "Na loja desde março de 2024" (vazio = esconde)
  avatar: "",   // ex: "img/logo.jpg"  (vazio = mostra a inicial)
  banner: "",   // ex: "img/banner.jpg" (vazio = gradiente)
  numeros: [
    { valor: "2", rotulo: "Clientes" },
  ],

  // Post fixado no topo (estilo X). Deixe null para esconder.
  fixado: {
    texto: "fomitoss!!!",
    data: "12 set",
  },

  contato: {
    whatsapp: "5551999999999",           // só números, com 55 + DDD
    telefone: "(51) 99999-9999",
    instagram: "_laura.godinh0",
    email: "contato@laurastore.com.br",
    endereco: "Rua Exemplo, 123 — Centro, Sapucaia do Sul/RS",
    horario: [
      ["Seg a Sexta", "13:30 às 18:15"],
      ["Sáb e Dom", "Fechado"],
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
    ["Qual o prazo de entrega?", ""],
    ["Posso trocar um produto?", ""],
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
    descricao: "Laura",
    opcoes: { nome: "Aro", valores: ["12", "14", "16", "18", "20"] } },
  { id: 2,  nome: "Relógio Minimal Dourado", categoria: "Acessórios", preco: 249.9, emoji: "⌚", cor: "#fff1d6", tags: ["destaque", "novo"],
    descricao: "Paulo" },
  { id: 3,  nome: "Óculos de Sol Gatinho", categoria: "Acessórios", preco: 129.9, emoji: "🕶️", cor: "#dff3ff", tags: ["novo"],
    descricao: "Nicolly" },
  { id: 4,  nome: "Bolsa Tiracolo Couro", categoria: "Bolsas", preco: 199.9, precoAntigo: 259.9, emoji: "👜", cor: "#ffe3d9", tags: ["destaque", "promo"],
    descricao: "Thales",
    opcoes: { nome: "Cor", valores: ["Caramelo", "Preta", "Off-white"] } },
  { id: 5,  nome: "Mochila Urbana", categoria: "Bolsas", preco: 179.9, emoji: "🎒", cor: "#e2f5e6", tags: [],
    descricao: "Samuel" },
  { id: 6,  nome: "Tênis Casual Branco", categoria: "Calçados", preco: 229.9, emoji: "👟", cor: "#eef0f3", tags: ["destaque"],
    descricao: "Iam",
    opcoes: { nome: "Tamanho", valores: ["34", "35", "36", "37", "38", "39"] } },
  { id: 7,  nome: "Scarpin Vermelho", categoria: "Calçados", preco: 189.9, emoji: "👠", cor: "#ffe0e3", tags: ["novo"],
    descricao: "Mãe Tina",
    opcoes: { nome: "Tamanho", valores: ["34", "35", "36", "37", "38"] } },
  { id: 8,  nome: "Batom Matte Rosé", categoria: "Beleza", preco: 39.9, precoAntigo: 49.9, emoji: "💄", cor: "#ffe4f1", tags: ["promo"],
    descricao: "Mãe Nic" },
  { id: 9,  nome: "Hidratante Corporal", categoria: "Beleza", preco: 59.9, emoji: "🧴", cor: "#e3f7f5", tags: ["novo"],
    descricao: "Enzo" },
  { id: 10, nome: "Vestido Midi Floral", categoria: "Roupas", preco: 159.9, emoji: "👗", cor: "#e7f0ff", tags: ["destaque"],
    descricao: "Leo",
    opcoes: { nome: "Tamanho", valores: ["P", "M", "G", "GG"] } },
  { id: 11, nome: "Camisa de Linho", categoria: "Roupas", preco: 139.9, emoji: "👚", cor: "#f3ecdf", tags: [],
    descricao: "Isabele",
    opcoes: { nome: "Tamanho", valores: ["P", "M", "G"] } },
  { id: 12, nome: "Laço de Cabelo Cetim", categoria: "Acessórios", preco: 24.9, emoji: "🎀", cor: "#ffe6ea", tags: ["promo"], precoAntigo: 34.9,
    descricao: "Livia" },
];

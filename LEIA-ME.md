# Laura Store — base do site

Topo estilo perfil do X, menu de baixo estilo iFood, produtos girando em 360° e pedido finalizado pelo WhatsApp.

## Como ver no computador

Abra a pasta num servidor local (abrir o `index.html` direto com dois cliques pode bloquear partes do site):

```bash
python3 -m http.server 5173
```

Depois acesse http://localhost:5173

## O que editar

Quase tudo fica em **`js/config.js`**:

| O quê | Onde |
|---|---|
| Nome, @, bio, cidade, logo, banner | `LOJA` |
| WhatsApp que recebe os pedidos | `LOJA.contato.whatsapp` (só números: 55 + DDD + número) |
| Taxa de entrega / frete grátis / retirada | `LOJA.entrega` |
| Formas de pagamento, horários, dúvidas | `LOJA.pagamentos`, `LOJA.contato.horario`, `LOJA.faq` |
| Abas da página inicial | `CATEGORIAS` |
| Produtos | `PRODUTOS` |

Cores: no começo de `css/style.css` (`--accent` é o vermelho dos botões, `--blue` é o azul do X).

## Fotos dos produtos (giro 360°)

Hoje os produtos usam emoji só como exemplo. Existem dois jeitos de colocar as fotos:

1. **Uma foto só** → `imagem: "img/anel.png"`
   Use PNG **com fundo transparente**. O site gira a foto em 3D.
2. **360° de verdade** → `fotos360: ["img/anel/01.jpg", "img/anel/02.jpg", ...]`
   Tire de 24 a 36 fotos girando o produto (um prato giratório ajuda), sempre no mesmo lugar e com a mesma luz.
   O card gira sozinho e, na tela do produto, o cliente arrasta com o dedo para girar.

## Como funcionam os pedidos

- Carrinho, pedidos, favoritos e dados do cliente ficam salvos **no próprio celular do cliente** (`localStorage`).
- Ao finalizar, o site abre o WhatsApp da loja já com a mensagem do pedido (itens, total, endereço e pagamento).
- O CEP preenche o endereço sozinho (ViaCEP).

**Limites desta versão:** não tem painel da loja nem banco de dados, então a loja não muda o status do pedido pelo site, e o pagamento é combinado pelo WhatsApp. Se precisar disso depois: backend (ex.: Firebase ou Supabase) + Pix/Mercado Pago.

## Como publicar (grátis)

- **Netlify Drop**: acesse app.netlify.com/drop e arraste a pasta inteira.
- **GitHub Pages** ou **Vercel** também funcionam (é um site estático, não precisa de servidor).

Depois de atualizar os arquivos, aumente o `?v=2` no `index.html` (para `?v=3` e assim por diante). Assim o celular dos clientes baixa a versão nova.

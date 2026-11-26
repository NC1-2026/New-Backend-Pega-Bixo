import 'dotenv/config';
import prisma from '../src/core/database/prisma.client.js';

// Bytes 0x80-0x9F que o Windows-1252 mapeia pra outros caracteres (€, ‚, ƒ, ‰...)
const decoder = new TextDecoder('windows-1252');
const paraByte = new Map();
for (let b = 0x80; b <= 0x9f; b++) paraByte.set(decoder.decode(Uint8Array.of(b)), b);

function corrigir(texto) {
  if (typeof texto !== 'string' || !/[ÃÂ]/.test(texto)) return texto;

  const bytes = [];
  for (const ch of texto) {
    const c = ch.codePointAt(0);
    if (c < 0x100) bytes.push(c);
    else if (paraByte.has(ch)) bytes.push(paraByte.get(ch));
    else return texto; // caractere inesperado: não mexe
  }

  const resultado = Buffer.from(bytes).toString('utf8');
  // Se a conversão gerou caractere inválido, o texto original estava certo
  return resultado.includes('\uFFFD') ? texto : resultado;
}

const aplicar = process.argv.includes('--aplicar');
const camposTexto = ['nome', 'nomeCientifico', 'comportamento', 'descricaoAlimentacao'];
const camposLista = ['nomesRegionais', 'informacoesAdicionais'];

const animais = await prisma.animal.findMany();
let alterados = 0;

for (const a of animais) {
  const dados = {};

  for (const campo of camposTexto) {
    const novo = corrigir(a[campo]);
    if (novo !== a[campo]) dados[campo] = novo;
  }
  for (const campo of camposLista) {
    const novo = a[campo].map(corrigir);
    if (novo.some((v, i) => v !== a[campo][i])) dados[campo] = novo;
  }

  if (Object.keys(dados).length === 0) continue;

  alterados++;
  console.log(`#${a.id} ${a.nome}`, dados);
  if (aplicar) await prisma.animal.update({ where: { id: a.id }, data: dados });
}

console.log(
  aplicar
    ? `${alterados} animais corrigidos.`
    : `${alterados} animais seriam corrigidos. Rode com --aplicar para gravar.`
);

await prisma.$disconnect();
import { buscarPorTermo } from '../repositories/animal.repository.js';

const MIN_CARACTERES = 2;
const MAX_CARACTERES = 50;
const LIMITE_PADRAO = 8;
const LIMITE_MAXIMO = 20;

export async function sugerirAnimais(termo, limite) {
  // 1. Normalizar o texto: remover espaços das pontas e repetidos no meio
  const texto = String(termo ?? '').trim().replace(/\s+/g, ' ');

  // 2. Regra: texto curto demais não vale uma consulta ao banco
  if (texto.length < MIN_CARACTERES) return [];

  // 3. Regra: texto longo demais é rejeitado
  if (texto.length > MAX_CARACTERES) {
    const erro = new Error(`O termo deve ter no máximo ${MAX_CARACTERES} caracteres`);
    erro.status = 400;
    throw erro;
  }

  // 4. Regra: limitar a quantidade de resultados
  const limiteFinal = Math.min(Number(limite) || LIMITE_PADRAO, LIMITE_MAXIMO);

  // 5. Delegar a consulta ao repository
  return buscarPorTermo(texto, limiteFinal);
}
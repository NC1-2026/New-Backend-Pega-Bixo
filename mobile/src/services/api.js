const BASE_URL = 'https://new-backend-pega-bixo.onrender.com';
const ROTA_LISTA = '/listanimais';   // ajuste se o time mudar a rota

export async function listarAnimais({ busca, tipoAlimentacao, statusConservacao, pagina = 1, limite = 50 } = {}) {
  const params = new URLSearchParams({ pagina: String(pagina), limite: String(limite) });
  if (busca) params.append('busca', busca);
  if (tipoAlimentacao) params.append('tipoAlimentacao', tipoAlimentacao);
  if (statusConservacao) params.append('statusConservacao', statusConservacao);

  const resposta = await fetch(`${BASE_URL}${ROTA_LISTA}?${params}`);
  if (!resposta.ok) throw new Error(`Erro ${resposta.status} ao buscar animais`);
  return resposta.json();
}
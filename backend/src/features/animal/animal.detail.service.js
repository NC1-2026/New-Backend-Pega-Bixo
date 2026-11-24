import { buscarAnimalPorId } from '../../shared/animal/repository/animais.repository.js';

function erro(status, mensagem) {
  const e = new Error(mensagem);
  e.status = status;
  return e;
}

export async function detalharAnimal(idRecebido) {
  const id = Number(idRecebido);

  if (!Number.isInteger(id) || id <= 0) {
    throw erro(400, 'Esse código de animal não parece válido. Use um número, como 1 ou 2.');
  }

  const animal = await buscarAnimalPorId(id);

  if (!animal) {
    throw erro(404, 'Não encontramos nenhum bichinho com esse código. Será que ele fugiu? 🐾');
  }

  return animal;
}
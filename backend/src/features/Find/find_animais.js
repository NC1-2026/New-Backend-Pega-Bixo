import prisma from '../../core/database/prisma.client.js';

export async function buscarAnimalPorId(id) {
  // 1. Validar: o id precisa ser um inteiro positivo
  const idNumero = Number(id);
  if (!Number.isInteger(idNumero) || idNumero <= 0) {
    const erro = new Error('ID inválido');
    erro.status = 400;
    throw erro;
  }

  // 2. Buscar no banco
  const animal = await prisma.animal.findUnique({
    where: { id: idNumero },
  });

  // 3. Animal inexistente vira erro 404
  if (!animal) {
    const erro = new Error('Animal não encontrado');
    erro.status = 404;
    throw erro;
  }

  return animal;
}
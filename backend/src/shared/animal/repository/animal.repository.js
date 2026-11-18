import prisma from '../../../core/database/prisma.client.js';

export async function criarAnimal({ nome, descricao }) {
  return prisma.animal.create({
    data: { nome, descricao: { create: descricao } },
    include: { descricao: true },
  });
}

export async function buscarAnimalPorNome(nome) {
  return prisma.animal.findFirst({
    where: { nome: { equals: nome, mode: 'insensitive' } },
  });
}

export async function buscarAnimalPorId(id) {
  return prisma.animal.findUnique({
    where: { id },
    include: { descricao: true },
  });
}
import prisma from '../../core/database/prisma.client.js';

export async function listarAnimais(filtros = {}) {
  const {
    busca,
    tipoAlimentacao,
    statusConservacao,
    pagina = 1,
    limite = 20,
  } = filtros;

  const where = {
    ...(tipoAlimentacao && { tipoAlimentacao }),
    ...(statusConservacao && { statusConservacao }),
    ...(busca && {
      OR: [
        { nome: { contains: busca, mode: 'insensitive' } },
        { nomeCientifico: { contains: busca, mode: 'insensitive' } },
        { nomesRegionais: { has: busca } },
      ],
    }),
  };

  const [animais, total] = await Promise.all([
    prisma.animal.findMany({
      where,
      orderBy: { nome: 'asc' },
      skip: (pagina - 1) * limite,
      take: limite,
    }),
    prisma.animal.count({ where }),
  ]);

  return { animais, total, pagina, limite };
}
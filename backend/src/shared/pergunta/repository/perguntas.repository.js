// importa o prisma que a gente ja tem configurado no core
import prisma from '../../../core/database/prisma.client.js';

// repositorio de perguntas do quiz
// aqui fica so a parte do banco de dados
const PerguntasRepository = {
  // cria a pergunta ja com as respostas dela
  async criar({ pergunta, respostas = [] }) {
    return prisma.pergunta.create({
      data: {
        pergunta,
        respostas: {
          create: respostas,
        },
      },
      include: { respostas: true },
    });
  },

  // lista todas as perguntas com as respostas
  async listar() {
    return prisma.pergunta.findMany({
      include: { respostas: true },
      orderBy: { id: 'asc' },
    });
  },

  // busca uma pergunta so, pelo id
  async buscarPorId(id) {
    return prisma.pergunta.findUnique({
      where: { id: Number(id) },
      include: { respostas: true },
    });
  },

  // deleta uma pergunta pelo id
  async deletar(id) {
    return prisma.pergunta.delete({
      where: { id: Number(id) },
    });
  },
};

export default PerguntasRepository;
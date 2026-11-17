// importa o prisma que a gente já tem configurado no core
import prisma from '../../../core/database/prisma.client.js';

// Leonardo  repositorio de respostas do quiz
// aqui fica só a parte do banco de dados das respostas
const RespostasRepository = {
    // cria uma resposta avulsa e vincula a uma pergunta existente
    async criar({ texto, correta = false, perguntaId }) {
        return prisma.resposta.create({
            data: {
                texto,
                correta, // booleano indicando se é a resposta certa
                perguntaId, // ID da pergunta à qual essa resposta pertence
            },
        });
    },

    // lista todas as respostas de uma pergunta específica
    async listarPorPergunta(perguntaId) {
        return prisma.resposta.findMany({
            where: {
                perguntaId: perguntaId,
            },
            orderBy: { id: 'asc' },
        });
    },

    // atualiza uma resposta (ex: corrigir erro de português ou alterar qual é a correta)
    async atualizar(id, { texto, correta }) {
        return prisma.resposta.update({
            where: { id },
            data: {
                ...(texto !== undefined && { texto }),
                ...(correta !== undefined && { correta }),
            },
        });
    },

    // deleta uma resposta específica
    async deletar(id) {
        return prisma.resposta.delete({
            where: { id },
        });
    },
};

export default RespostasRepository;
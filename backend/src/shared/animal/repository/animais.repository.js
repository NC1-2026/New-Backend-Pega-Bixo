import prisma from '../../../core/database/prisma.client.js';
//animal
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


//caracteristicas



const AnimaisRepository = {
    async criar({
        nome,
        nomesRegionais = [],
        nomeCientifico,
        comportamento,
        tipoAlimentacao,
        descricaoAlimentacao,
        statusConservacao,
        informacoesAdicionais = [],
        imagemUrl = null,
    }) {
        return prisma.animal.create({
            data: {
                nome,
                nomesRegionais,
                nomeCientifico,
                comportamento,
                tipoAlimentacao,
                descricaoAlimentacao,
                statusConservacao,
                informacoesAdicionais,
                imagemUrl,
                atualizadoEm: new Date(),
            },
        });
    },

    // Lista todos os animais, por alimentação ou status de conservação
    async listar({ tipoAlimentacao, statusConservacao } = {}) {
        return prisma.animal.findMany({
            where: {
                ...(tipoAlimentacao && { tipoAlimentacao }),
                ...(statusConservacao && { statusConservacao }),
            },
            orderBy: { nome: 'asc' },
        });
    },

    // Busca um animal específico pelo ID
    async buscarPorId(id) {
        return prisma.animal.findUnique({
            where: { id },
        });
    },

    // Busca um animal pelo nome científico
    async buscarPorNomeCientifico(nomeCientifico) {
        return prisma.animal.findUnique({
            where: { nomeCientifico },
        });
    },

    // Atualiza os dados e características de um animal existente
    async atualizar(
        id,
        {
            nome,
            nomesRegionais,
            nomeCientifico,
            comportamento,
            tipoAlimentacao,
            descricaoAlimentacao,
            statusConservacao,
            informacoesAdicionais,
            imagemUrl,
        }
    ) {
        return prisma.animal.update({
            where: { id },
            data: {
                ...(nome !== undefined && { nome }),
                ...(nomesRegionais !== undefined && { nomesRegionais }),
                ...(nomeCientifico !== undefined && { nomeCientifico }),
                ...(comportamento !== undefined && { comportamento }),
                ...(tipoAlimentacao !== undefined && { tipoAlimentacao }),
                ...(descricaoAlimentacao !== undefined && { descricaoAlimentacao }),
                ...(statusConservacao !== undefined && { statusConservacao }),
                ...(informacoesAdicionais !== undefined && { informacoesAdicionais }),
                ...(imagemUrl !== undefined && { imagemUrl }),
                atualizadoEm: new Date(),
            },
        });
    },

    // Adiciona uma nova característica
    async adicionarCaracteristicaAdicional(id, novaInformacao) {
        return prisma.animal.update({
            where: { id },
            data: {
                informacoesAdicionais: {
                    push: novaInformacao,
                },
                atualizadoEm: new Date(),
            },
        });
    },

    // Adiciona um novo nome regional sem apagar os anteriores
    async adicionarNomeRegional(id, novoNomeRegional) {
        return prisma.animal.update({
            where: { id },
            data: {
                nomesRegionais: {
                    push: novoNomeRegional,
                },
                atualizadoEm: new Date(),
            },
        });
    },

    // Deleta um animal específico pelo Id
    async deletar(id) {
        return prisma.animal.delete({
            where: { id },
        });
    },
};

export default AnimaisRepositor
import prisma from '../../../core/database/prisma.client.js';
//animal
export async function criarAnimal({ data }) { 
   prisma.animal.create({
        data,
        select: {
                id : true,
                nome:true,
                nomesRegionais: true,
                nomeCientifico: true,
                comportamento: true,
                tipoAlimentacao: true,
                descricaoAlimentacao: true,
                statusConservacao: true,
                informacoesAdicionais: true,
                imagemUrl: true,
                atualizadoEm: true,
        },
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


    // Lista todos os animais, por alimentação ou status de conservação
export async function listar({ tipoAlimentacao, statusConservacao } = {}) {
        return prisma.animal.findMany({
            where: {
                ...(tipoAlimentacao && { tipoAlimentacao }),
                ...(statusConservacao && { statusConservacao }),
            },
            orderBy: { nome: 'asc' },
        });
    }

    // Busca um animal específico pelo ID
    export async function buscarPorId(id) {
        return prisma.animal.findUnique({
            where: { id },
        });
    }

    // Busca um animal pelo nome científico
    export async function buscarPorNomeCientifico(nomeCientifico) {
        return prisma.animal.findUnique({
            where: { nomeCientifico },
        });
    }

    // Atualiza os dados e características de um animal existente
    export async function atualizar(
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


};

export { criarAnimal, buscarAnimalPorNome, buscarAnimalPorId, listar, buscarPorId, buscarPorNomeCientifico, atualizar }
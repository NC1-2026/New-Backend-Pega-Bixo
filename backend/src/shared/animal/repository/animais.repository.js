import prisma from '../../core/database/prisma.client.js';
//animal
function criarAnimal({ data }) { 
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

function buscarAnimalPorNome(nome) {
  return prisma.animal.findFirst({
    where: { nome: { equals: nome, mode: 'insensitive' } },
  });
}

function buscarAnimalPorId(id) {
  return prisma.animal.findUnique({
    where: { id },
    include: { descricao: true },
  });
}


    // Lista todos os animais, por alimentação ou status de conservação
function listar({ tipoAlimentacao, statusConservacao } = {}) {
        return prisma.animal.findMany({
            where: {
                ...(tipoAlimentacao && { tipoAlimentacao }),
                ...(statusConservacao && { statusConservacao }),
            },
            orderBy: { nome: 'asc' },
        });
    }

    // Busca um animal específico pelo ID
function buscarPorId(id) {
        return prisma.animal.findUnique({
            where: { id },
        });
    }

    // Busca um animal pelo nome científic
function buscarPorNomeCientifico(nomeCientifico) {
        return prisma.animal.findUnique({
            where: { nomeCientifico },
        });
    }



export { criarAnimal, buscarAnimalPorNome, buscarAnimalPorId, listar, buscarPorId, buscarPorNomeCientifico }
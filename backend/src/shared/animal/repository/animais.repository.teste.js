import { beforeEach, describe, expect, it, jest } from "@jest/globals";

const mockPrisma = {
    animal: {
        create: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
};

jest.unstable_mockModule("../../../src/core/database/prisma.client.js", () => ({
    default: mockPrisma,
}));

const {
    criarAnimal,
    buscarAnimalPorNome,
    buscarAnimalPorId,
    default: AnimaisRepository,
} = await import("../../../src/shared/animal/repository/animal.repository.js");

const descricaoMock = {
    especie: "Panthera onca",
    habitats: "Floresta amazônica",
    foto: "https://site.com/onca.jpg",
    alimentacao: "Carnívora",
    conservacao: "Quase ameaçada",
};

describe("funções nomeadas do repositório de animais", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("criarAnimal", () => {
        it("deve criar o animal junto com a descrição", async () => {
            const criado = { id: 1, nome: "Onça-pintada", descricao: descricaoMock };
            mockPrisma.animal.create.mockResolvedValue(criado);

            const result = await criarAnimal({ nome: "Onça-pintada", descricao: descricaoMock });

            expect(mockPrisma.animal.create).toHaveBeenCalledWith({
                data: { nome: "Onça-pintada", descricao: { create: descricaoMock } },
                include: { descricao: true },
            });
            expect(result).toEqual(criado);
        });
    });

    describe("buscarAnimalPorNome", () => {
        it("deve buscar pelo nome ignorando maiúsculas e minúsculas", async () => {
            const animal = { id: 1, nome: "Onça-pintada" };
            mockPrisma.animal.findFirst.mockResolvedValue(animal);

            const result = await buscarAnimalPorNome("onça-pintada");

            expect(mockPrisma.animal.findFirst).toHaveBeenCalledWith({
                where: { nome: { equals: "onça-pintada", mode: "insensitive" } },
            });
            expect(result).toEqual(animal);
        });

        it("deve retornar null quando não encontrar", async () => {
            mockPrisma.animal.findFirst.mockResolvedValue(null);

            const result = await buscarAnimalPorNome("Dragão");

            expect(result).toBeNull();
        });
    });

    describe("buscarAnimalPorId", () => {
        it("deve buscar o animal pelo id incluindo a descrição", async () => {
            const animal = { id: 1, nome: "Onça-pintada", descricao: descricaoMock };
            mockPrisma.animal.findUnique.mockResolvedValue(animal);

            const result = await buscarAnimalPorId(1);

            expect(mockPrisma.animal.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
                include: { descricao: true },
            });
            expect(result).toEqual(animal);
        });

        it("deve retornar null quando o animal não existir", async () => {
            mockPrisma.animal.findUnique.mockResolvedValue(null);

            const result = await buscarAnimalPorId(999);

            expect(result).toBeNull();
        });
    });
});

describe("AnimaisRepository", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("criar", () => {
        const dadosCompletos = {
            nome: "Onça-pintada",
            nomesRegionais: ["Jaguar"],
            nomeCientifico: "Panthera onca",
            comportamento: "Solitária",
            tipoAlimentacao: "CARNIVORO",
            descricaoAlimentacao: "Caça mamíferos de médio porte",
            statusConservacao: "QUASE_AMEACADA",
            informacoesAdicionais: ["Excelente nadadora"],
            imagemUrl: "https://site.com/onca.jpg",
        };

        it("deve criar o animal com todos os campos", async () => {
            mockPrisma.animal.create.mockResolvedValue({ id: 1, ...dadosCompletos });

            const result = await AnimaisRepository.criar(dadosCompletos);

            expect(mockPrisma.animal.create).toHaveBeenCalledWith({
                data: { ...dadosCompletos, atualizadoEm: expect.any(Date) },
            });
            expect(result).toEqual({ id: 1, ...dadosCompletos });
        });

        it("deve usar os valores padrão quando os campos opcionais não forem enviados", async () => {
            mockPrisma.animal.create.mockResolvedValue({ id: 1 });

            await AnimaisRepository.criar({
                nome: "Onça-pintada",
                nomeCientifico: "Panthera onca",
                comportamento: "Solitária",
                tipoAlimentacao: "CARNIVORO",
                descricaoAlimentacao: "Caça mamíferos",
                statusConservacao: "QUASE_AMEACADA",
            });

            expect(mockPrisma.animal.create).toHaveBeenCalledWith({
                data: expect.objectContaining({
                    nomesRegionais: [],
                    informacoesAdicionais: [],
                    imagemUrl: null,
                }),
            });
        });
    });

    describe("listar", () => {
        it("deve listar todos os animais em ordem alfabética sem filtros", async () => {
            mockPrisma.animal.findMany.mockResolvedValue([{ id: 1 }, { id: 2 }]);

            const result = await AnimaisRepository.listar();

            expect(mockPrisma.animal.findMany).toHaveBeenCalledWith({
                where: {},
                orderBy: { nome: "asc" },
            });
            expect(result).toEqual([{ id: 1 }, { id: 2 }]);
        });

        it("deve filtrar por tipo de alimentação", async () => {
            mockPrisma.animal.findMany.mockResolvedValue([]);

            await AnimaisRepository.listar({ tipoAlimentacao: "CARNIVORO" });

            expect(mockPrisma.animal.findMany).toHaveBeenCalledWith({
                where: { tipoAlimentacao: "CARNIVORO" },
                orderBy: { nome: "asc" },
            });
        });

        it("deve filtrar por status de conservação", async () => {
            mockPrisma.animal.findMany.mockResolvedValue([]);

            await AnimaisRepository.listar({ statusConservacao: "EM_PERIGO" });

            expect(mockPrisma.animal.findMany).toHaveBeenCalledWith({
                where: { statusConservacao: "EM_PERIGO" },
                orderBy: { nome: "asc" },
            });
        });

        it("deve combinar os dois filtros", async () => {
            mockPrisma.animal.findMany.mockResolvedValue([]);

            await AnimaisRepository.listar({
                tipoAlimentacao: "HERBIVORO",
                statusConservacao: "EM_PERIGO",
            });

            expect(mockPrisma.animal.findMany).toHaveBeenCalledWith({
                where: { tipoAlimentacao: "HERBIVORO", statusConservacao: "EM_PERIGO" },
                orderBy: { nome: "asc" },
            });
        });
    });

    describe("buscarPorId", () => {
        it("deve buscar o animal pelo id", async () => {
            mockPrisma.animal.findUnique.mockResolvedValue({ id: 1 });

            const result = await AnimaisRepository.buscarPorId(1);

            expect(mockPrisma.animal.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result).toEqual({ id: 1 });
        });
    });

    describe("buscarPorNomeCientifico", () => {
        it("deve buscar o animal pelo nome científico", async () => {
            mockPrisma.animal.findUnique.mockResolvedValue({ id: 1 });

            const result = await AnimaisRepository.buscarPorNomeCientifico("Panthera onca");

            expect(mockPrisma.animal.findUnique).toHaveBeenCalledWith({
                where: { nomeCientifico: "Panthera onca" },
            });
            expect(result).toEqual({ id: 1 });
        });
    });

    describe("atualizar", () => {
        it("deve atualizar apenas os campos enviados", async () => {
            mockPrisma.animal.update.mockResolvedValue({ id: 1, nome: "Novo nome" });

            const result = await AnimaisRepository.atualizar(1, { nome: "Novo nome" });

            expect(mockPrisma.animal.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { nome: "Novo nome", atualizadoEm: expect.any(Date) },
            });
            expect(result).toEqual({ id: 1, nome: "Novo nome" });
        });

        it("deve atualizar vários campos de uma vez", async () => {
            mockPrisma.animal.update.mockResolvedValue({ id: 1 });

            await AnimaisRepository.atualizar(1, {
                comportamento: "Noturna",
                statusConservacao: "EM_PERIGO",
            });

            expect(mockPrisma.animal.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: {
                    comportamento: "Noturna",
                    statusConservacao: "EM_PERIGO",
                    atualizadoEm: expect.any(Date),
                },
            });
        });

        it("deve permitir limpar a imagem enviando null", async () => {
            mockPrisma.animal.update.mockResolvedValue({ id: 1 });

            await AnimaisRepository.atualizar(1, { imagemUrl: null });

            expect(mockPrisma.animal.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { imagemUrl: null, atualizadoEm: expect.any(Date) },
            });
        });

        it("deve só atualizar a data quando nenhum campo for enviado", async () => {
            mockPrisma.animal.update.mockResolvedValue({ id: 1 });

            await AnimaisRepository.atualizar(1, {});

            expect(mockPrisma.animal.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { atualizadoEm: expect.any(Date) },
            });
        });
    });

    describe("adicionarCaracteristicaAdicional", () => {
        it("deve adicionar a informação sem apagar as anteriores", async () => {
            mockPrisma.animal.update.mockResolvedValue({ id: 1 });

            await AnimaisRepository.adicionarCaracteristicaAdicional(1, "Excelente nadadora");

            expect(mockPrisma.animal.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: {
                    informacoesAdicionais: { push: "Excelente nadadora" },
                    atualizadoEm: expect.any(Date),
                },
            });
        });
    });

    describe("adicionarNomeRegional", () => {
        it("deve adicionar o nome regional sem apagar os anteriores", async () => {
            mockPrisma.animal.update.mockResolvedValue({ id: 1 });

            await AnimaisRepository.adicionarNomeRegional(1, "Jaguar");

            expect(mockPrisma.animal.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: {
                    nomesRegionais: { push: "Jaguar" },
                    atualizadoEm: expect.any(Date),
                },
            });
        });
    });

    describe("deletar", () => {
        it("deve deletar o animal pelo id", async () => {
            mockPrisma.animal.delete.mockResolvedValue({ id: 1 });

            const result = await AnimaisRepository.deletar(1);

            expect(mockPrisma.animal.delete).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result).toEqual({ id: 1 });
        });
    });
});
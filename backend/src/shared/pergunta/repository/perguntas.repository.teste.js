import { beforeEach, describe, expect, it, jest } from "@jest/globals";

const mockPrisma = {
    pergunta: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        delete: jest.fn(),
    },
};

jest.unstable_mockModule("../../../src/core/database/prisma.client.js", () => ({
    default: mockPrisma,
}));

const { default: PerguntasRepository } = await import(
    "../../../src/shared/pergunta/repository/perguntas.repository.js"
);

const respostasMock = [
    { texto: "Brasília", correta: true },
    { texto: "São Paulo", correta: false },
];

describe("PerguntasRepository", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("criar", () => {
        it("deve criar a pergunta junto com as respostas", async () => {
            const criada = { id: 1, texto: "Qual é a capital do Brasil?", respostas: respostasMock };
            mockPrisma.pergunta.create.mockResolvedValue(criada);

            const result = await PerguntasRepository.criar({
                texto: "Qual é a capital do Brasil?",
                respostas: respostasMock,
            });

            expect(mockPrisma.pergunta.create).toHaveBeenCalledWith({
                data: {
                    texto: "Qual é a capital do Brasil?",
                    respostas: { create: respostasMock },
                },
                include: { respostas: true },
            });
            expect(result).toEqual(criada);
        });

        it("deve usar lista vazia quando as respostas não forem enviadas", async () => {
            mockPrisma.pergunta.create.mockResolvedValue({ id: 1 });

            await PerguntasRepository.criar({ texto: "Pergunta" });

            expect(mockPrisma.pergunta.create).toHaveBeenCalledWith({
                data: {
                    texto: "Pergunta",
                    respostas: { create: [] },
                },
                include: { respostas: true },
            });
        });
    });

    describe("listar", () => {
        it("deve listar as perguntas com as respostas em ordem de id", async () => {
            const perguntas = [{ id: 1 }, { id: 2 }];
            mockPrisma.pergunta.findMany.mockResolvedValue(perguntas);

            const result = await PerguntasRepository.listar();

            expect(mockPrisma.pergunta.findMany).toHaveBeenCalledWith({
                include: { respostas: true },
                orderBy: { id: "asc" },
            });
            expect(result).toEqual(perguntas);
        });

        it("deve retornar lista vazia quando não houver perguntas", async () => {
            mockPrisma.pergunta.findMany.mockResolvedValue([]);

            const result = await PerguntasRepository.listar();

            expect(result).toEqual([]);
        });
    });

    describe("buscarPorId", () => {
        it("deve buscar a pergunta pelo id incluindo as respostas", async () => {
            const pergunta = { id: 1, texto: "Pergunta", respostas: respostasMock };
            mockPrisma.pergunta.findUnique.mockResolvedValue(pergunta);

            const result = await PerguntasRepository.buscarPorId(1);

            expect(mockPrisma.pergunta.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
                include: { respostas: true },
            });
            expect(result).toEqual(pergunta);
        });

        it("deve converter o id recebido como texto para número", async () => {
            mockPrisma.pergunta.findUnique.mockResolvedValue(null);

            await PerguntasRepository.buscarPorId("1");

            expect(mockPrisma.pergunta.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
                include: { respostas: true },
            });
        });

        it("deve retornar null quando a pergunta não existir", async () => {
            mockPrisma.pergunta.findUnique.mockResolvedValue(null);

            const result = await PerguntasRepository.buscarPorId(999);

            expect(result).toBeNull();
        });
    });

    describe("deletar", () => {
        it("deve deletar a pergunta pelo id", async () => {
            mockPrisma.pergunta.delete.mockResolvedValue({ id: 1 });

            const result = await PerguntasRepository.deletar(1);

            expect(mockPrisma.pergunta.delete).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result).toEqual({ id: 1 });
        });

        it("deve converter o id recebido como texto para número", async () => {
            mockPrisma.pergunta.delete.mockResolvedValue({ id: 1 });

            await PerguntasRepository.deletar("1");

            expect(mockPrisma.pergunta.delete).toHaveBeenCalledWith({ where: { id: 1 } });
        });
    });
});
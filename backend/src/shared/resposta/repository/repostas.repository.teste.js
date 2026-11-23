import { beforeEach, describe, expect, it, jest } from "@jest/globals";

const mockPrisma = {
    resposta: {
        create: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
};

jest.unstable_mockModule("../../../src/core/database/prisma.client.js", () => ({
    default: mockPrisma,
}));

const { default: RespostasRepository } = await import(
    "../../../src/shared/resposta/repository/respostas.repository.js"
);

describe("RespostasRepository", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("criar", () => {
        it("deve criar a resposta vinculada a uma pergunta", async () => {
            const criada = { id: 1, texto: "Brasília", correta: true, perguntaId: 5 };
            mockPrisma.resposta.create.mockResolvedValue(criada);

            const result = await RespostasRepository.criar({
                texto: "Brasília",
                correta: true,
                perguntaId: 5,
            });

            expect(mockPrisma.resposta.create).toHaveBeenCalledWith({
                data: { texto: "Brasília", correta: true, perguntaId: 5 },
            });
            expect(result).toEqual(criada);
        });

        it("deve usar correta = false quando não for informado", async () => {
            mockPrisma.resposta.create.mockResolvedValue({ id: 1 });

            await RespostasRepository.criar({ texto: "São Paulo", perguntaId: 5 });

            expect(mockPrisma.resposta.create).toHaveBeenCalledWith({
                data: { texto: "São Paulo", correta: false, perguntaId: 5 },
            });
        });
    });

    describe("listarPorPergunta", () => {
        it("deve listar as respostas da pergunta em ordem de id", async () => {
            const respostas = [
                { id: 1, texto: "Brasília", correta: true, perguntaId: 5 },
                { id: 2, texto: "São Paulo", correta: false, perguntaId: 5 },
            ];
            mockPrisma.resposta.findMany.mockResolvedValue(respostas);

            const result = await RespostasRepository.listarPorPergunta(5);

            expect(mockPrisma.resposta.findMany).toHaveBeenCalledWith({
                where: { perguntaId: 5 },
                orderBy: { id: "asc" },
            });
            expect(result).toEqual(respostas);
        });

        it("deve retornar lista vazia quando a pergunta não tiver respostas", async () => {
            mockPrisma.resposta.findMany.mockResolvedValue([]);

            const result = await RespostasRepository.listarPorPergunta(999);

            expect(result).toEqual([]);
        });
    });

    describe("atualizar", () => {
        it("deve atualizar o texto e a correta", async () => {
            mockPrisma.resposta.update.mockResolvedValue({ id: 1 });

            await RespostasRepository.atualizar(1, { texto: "Novo texto", correta: true });

            expect(mockPrisma.resposta.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { texto: "Novo texto", correta: true },
            });
        });

        it("deve atualizar só o texto quando a correta não for enviada", async () => {
            mockPrisma.resposta.update.mockResolvedValue({ id: 1 });

            await RespostasRepository.atualizar(1, { texto: "Novo texto" });

            expect(mockPrisma.resposta.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { texto: "Novo texto" },
            });
        });

        it("deve atualizar só a correta quando o texto não for enviado", async () => {
            mockPrisma.resposta.update.mockResolvedValue({ id: 1 });

            await RespostasRepository.atualizar(1, { correta: true });

            expect(mockPrisma.resposta.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { correta: true },
            });
        });

        it("deve permitir mudar a correta para false", async () => {
            mockPrisma.resposta.update.mockResolvedValue({ id: 1 });

            await RespostasRepository.atualizar(1, { correta: false });

            expect(mockPrisma.resposta.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { correta: false },
            });
        });

        it("deve mandar data vazio quando nenhum campo for enviado", async () => {
            mockPrisma.resposta.update.mockResolvedValue({ id: 1 });

            await RespostasRepository.atualizar(1, {});

            expect(mockPrisma.resposta.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: {},
            });
        });
    });

    describe("deletar", () => {
        it("deve deletar a resposta pelo id", async () => {
            mockPrisma.resposta.delete.mockResolvedValue({ id: 1 });

            const result = await RespostasRepository.deletar(1);

            expect(mockPrisma.resposta.delete).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result).toEqual({ id: 1 });
        });
    });
});
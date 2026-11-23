import { beforeEach, describe, expect, it, jest } from "@jest/globals";

const mockCriar = jest.fn();
const mockListar = jest.fn();
const mockBuscarPorId = jest.fn();
const mockDeletar = jest.fn();

jest.unstable_mockModule("../../../src/shared/pergunta/perguntas.repository.js", () => ({
    default: {
        criar: mockCriar,
        listar: mockListar,
        buscarPorId: mockBuscarPorId,
        deletar: mockDeletar,
    },
}));

const { default: PerguntasService } = await import("../../../src/features/pergunta/perguntas.service.js");

const respostasValidas = () => [
    { texto: "Brasília", correta: true },
    { texto: "São Paulo", correta: false },
    { texto: "Rio de Janeiro", correta: false },
];

const perguntaMock = {
    id: 1,
    texto: "Qual é a capital do Brasil?",
    respostas: [
        { id: 10, texto: "Brasília", correta: true },
        { id: 11, texto: "São Paulo", correta: false },
        { id: 12, texto: "Rio de Janeiro", correta: false },
    ],
};

describe("PerguntasService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("criar", () => {
        it("deve criar uma pergunta válida", async () => {
            mockCriar.mockImplementation(async (dados) => ({ id: 1, ...dados }));

            const result = await PerguntasService.criar({
                texto: "Qual é a capital do Brasil?",
                respostas: respostasValidas(),
            });

            expect(mockCriar).toHaveBeenCalledWith({
                texto: "Qual é a capital do Brasil?",
                respostas: respostasValidas(),
            });
            expect(result).toEqual({
                id: 1,
                texto: "Qual é a capital do Brasil?",
                respostas: respostasValidas(),
            });
        });

        it("deve remover os espaços do texto e das respostas", async () => {
            mockCriar.mockResolvedValue({ id: 1 });

            await PerguntasService.criar({
                texto: "  Qual é a capital do Brasil?  ",
                respostas: [
                    { texto: "  Brasília  ", correta: true },
                    { texto: "  São Paulo  ", correta: false },
                ],
            });

            expect(mockCriar).toHaveBeenCalledWith({
                texto: "Qual é a capital do Brasil?",
                respostas: [
                    { texto: "Brasília", correta: true },
                    { texto: "São Paulo", correta: false },
                ],
            });
        });

        it("deve transformar o campo correta em true ou false", async () => {
            mockCriar.mockResolvedValue({ id: 1 });

            await PerguntasService.criar({
                texto: "Pergunta",
                respostas: [
                    { texto: "A", correta: true },
                    { texto: "B" },
                ],
            });

            expect(mockCriar).toHaveBeenCalledWith({
                texto: "Pergunta",
                respostas: [
                    { texto: "A", correta: true },
                    { texto: "B", correta: false },
                ],
            });
        });

        it.each(["", "   ", undefined, null])(
            "deve lançar erro quando o texto for inválido (%p)",
            async (texto) => {
                await expect(
                    PerguntasService.criar({ texto, respostas: respostasValidas() })
                ).rejects.toThrow("A pergunta precisa ter um texto.");
            }
        );

        it("deve lançar erro quando tiver menos de 2 respostas", async () => {
            await expect(
                PerguntasService.criar({
                    texto: "Pergunta",
                    respostas: [{ texto: "A", correta: true }],
                })
            ).rejects.toThrow("A pergunta precisa ter pelo menos 2 respostas.");
        });

        it("deve lançar erro quando as respostas não forem uma lista", async () => {
            await expect(
                PerguntasService.criar({ texto: "Pergunta", respostas: "texto" })
            ).rejects.toThrow("A pergunta precisa ter pelo menos 2 respostas.");
        });

        it("deve lançar erro quando não receber respostas", async () => {
            await expect(
                PerguntasService.criar({ texto: "Pergunta" })
            ).rejects.toThrow("A pergunta precisa ter pelo menos 2 respostas.");
        });

        it.each(["", "   ", undefined])(
            "deve lançar erro quando uma resposta tiver texto inválido (%p)",
            async (textoResposta) => {
                await expect(
                    PerguntasService.criar({
                        texto: "Pergunta",
                        respostas: [
                            { texto: "A", correta: true },
                            { texto: textoResposta, correta: false },
                        ],
                    })
                ).rejects.toThrow("Todas as respostas precisam ter texto.");
            }
        );

        it("deve lançar erro quando nenhuma resposta for correta", async () => {
            await expect(
                PerguntasService.criar({
                    texto: "Pergunta",
                    respostas: [
                        { texto: "A", correta: false },
                        { texto: "B", correta: false },
                    ],
                })
            ).rejects.toThrow("A pergunta precisa ter exatamente 1 resposta correta.");
        });

        it("deve lançar erro quando mais de uma resposta for correta", async () => {
            await expect(
                PerguntasService.criar({
                    texto: "Pergunta",
                    respostas: [
                        { texto: "A", correta: true },
                        { texto: "B", correta: true },
                    ],
                })
            ).rejects.toThrow("A pergunta precisa ter exatamente 1 resposta correta.");
        });

        it("não deve chamar o repositório quando a validação falhar", async () => {
            await expect(
                PerguntasService.criar({ texto: "", respostas: respostasValidas() })
            ).rejects.toThrow();

            expect(mockCriar).not.toHaveBeenCalled();
        });
    });

    describe("listar", () => {
        it("deve retornar todas as perguntas", async () => {
            mockListar.mockResolvedValue([perguntaMock]);

            const result = await PerguntasService.listar();

            expect(mockListar).toHaveBeenCalledTimes(1);
            expect(result).toEqual([perguntaMock]);
        });

        it("deve retornar lista vazia quando não houver perguntas", async () => {
            mockListar.mockResolvedValue([]);

            const result = await PerguntasService.listar();

            expect(result).toEqual([]);
        });
    });

    describe("buscarPorId", () => {
        it("deve retornar a pergunta quando ela existir", async () => {
            mockBuscarPorId.mockResolvedValue(perguntaMock);

            const result = await PerguntasService.buscarPorId(1);

            expect(mockBuscarPorId).toHaveBeenCalledWith(1);
            expect(result).toEqual(perguntaMock);
        });

        it("deve lançar erro quando a pergunta não existir", async () => {
            mockBuscarPorId.mockResolvedValue(null);

            await expect(PerguntasService.buscarPorId(999)).rejects.toThrow(
                "Pergunta nao encontrada."
            );
        });
    });

    describe("verificarResposta", () => {
        it("deve indicar que acertou quando a resposta for a correta", async () => {
            mockBuscarPorId.mockResolvedValue(perguntaMock);

            const result = await PerguntasService.verificarResposta(1, 10);

            expect(mockBuscarPorId).toHaveBeenCalledWith(1);
            expect(result).toEqual({ acertou: true, respostaCorretaId: 10 });
        });

        it("deve indicar que errou e devolver qual era a correta", async () => {
            mockBuscarPorId.mockResolvedValue(perguntaMock);

            const result = await PerguntasService.verificarResposta(1, 11);

            expect(result).toEqual({ acertou: false, respostaCorretaId: 10 });
        });

        it("deve aceitar o id da resposta como texto", async () => {
            mockBuscarPorId.mockResolvedValue(perguntaMock);

            const result = await PerguntasService.verificarResposta(1, "10");

            expect(result.acertou).toBe(true);
        });

        it("deve lançar erro quando a resposta não pertencer à pergunta", async () => {
            mockBuscarPorId.mockResolvedValue(perguntaMock);

            await expect(PerguntasService.verificarResposta(1, 999)).rejects.toThrow(
                "Essa resposta nao pertence a essa pergunta."
            );
        });

        it("deve lançar erro quando a pergunta não existir", async () => {
            mockBuscarPorId.mockResolvedValue(null);

            await expect(PerguntasService.verificarResposta(999, 10)).rejects.toThrow(
                "Pergunta nao encontrada."
            );
        });
    });

    describe("deletar", () => {
        it("deve deletar a pergunta quando ela existir", async () => {
            mockBuscarPorId.mockResolvedValue(perguntaMock);
            mockDeletar.mockResolvedValue(perguntaMock);

            const result = await PerguntasService.deletar(1);

            expect(mockBuscarPorId).toHaveBeenCalledWith(1);
            expect(mockDeletar).toHaveBeenCalledWith(1);
            expect(result).toEqual(perguntaMock);
        });

        it("deve lançar erro e não deletar quando a pergunta não existir", async () => {
            mockBuscarPorId.mockResolvedValue(null);

            await expect(PerguntasService.deletar(999)).rejects.toThrow(
                "Pergunta nao encontrada."
            );

            expect(mockDeletar).not.toHaveBeenCalled();
        });
    });
});
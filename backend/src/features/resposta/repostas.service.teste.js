import { beforeEach, describe, expect, it, jest } from "@jest/globals";

const mockCriar = jest.fn();
const mockListarPorPergunta = jest.fn();
const mockAtualizar = jest.fn();
const mockDeletar = jest.fn();
const mockBuscarPerguntaPorId = jest.fn();

jest.unstable_mockModule("../../../src/shared/resposta/repository/respostas.repository.js", () => ({
    default: {
        criar: mockCriar,
        listarPorPergunta: mockListarPorPergunta,
        atualizar: mockAtualizar,
        deletar: mockDeletar,
    },
}));

jest.unstable_mockModule("../../../src/shared/pergunta/repository/perguntas.repository.js", () => ({
    default: {
        buscarPorId: mockBuscarPerguntaPorId,
    },
}));

const { default: RespostasService } = await import("../../../src/features/resposta/respostas.service.js");

// pergunta sem nenhuma resposta correta ainda
const perguntaSemCorreta = () => ({
    id: 5,
    texto: "Qual é a capital do Brasil?",
    respostas: [{ id: 1, texto: "São Paulo", correta: false }],
});

// pergunta que ja tem uma resposta correta
const perguntaComCorreta = () => ({
    id: 5,
    texto: "Qual é a capital do Brasil?",
    respostas: [
        { id: 1, texto: "São Paulo", correta: false },
        { id: 2, texto: "Brasília", correta: true },
    ],
});

// erro parecido com o do Prisma quando nao acha o registro
const erroPrisma = (code) => Object.assign(new Error("erro do prisma"), { code });

describe("RespostasService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("criar", () => {
        it("deve criar uma resposta vinculada a uma pergunta existente", async () => {
            mockBuscarPerguntaPorId.mockResolvedValue(perguntaSemCorreta());
            mockCriar.mockImplementation(async (dados) => ({ id: 10, ...dados }));

            const result = await RespostasService.criar({
                texto: "Brasília",
                correta: true,
                perguntaId: 5,
            });

            expect(mockBuscarPerguntaPorId).toHaveBeenCalledWith(5);
            expect(mockCriar).toHaveBeenCalledWith({
                texto: "Brasília",
                correta: true,
                perguntaId: 5,
            });
            expect(result).toEqual({ id: 10, texto: "Brasília", correta: true, perguntaId: 5 });
        });

        it("deve usar correta = false quando não for informado", async () => {
            mockBuscarPerguntaPorId.mockResolvedValue(perguntaSemCorreta());
            mockCriar.mockResolvedValue({ id: 10 });

            await RespostasService.criar({ texto: "Rio de Janeiro", perguntaId: 5 });

            expect(mockCriar).toHaveBeenCalledWith({
                texto: "Rio de Janeiro",
                correta: false,
                perguntaId: 5,
            });
        });

        it("deve remover os espaços do texto", async () => {
            mockBuscarPerguntaPorId.mockResolvedValue(perguntaSemCorreta());
            mockCriar.mockResolvedValue({ id: 10 });

            await RespostasService.criar({ texto: "  Brasília  ", perguntaId: 5 });

            expect(mockCriar).toHaveBeenCalledWith({
                texto: "Brasília",
                correta: false,
                perguntaId: 5,
            });
        });

        it("deve converter o id da pergunta recebido como texto para número", async () => {
            mockBuscarPerguntaPorId.mockResolvedValue(perguntaSemCorreta());
            mockCriar.mockResolvedValue({ id: 10 });

            await RespostasService.criar({ texto: "Brasília", perguntaId: "5" });

            expect(mockBuscarPerguntaPorId).toHaveBeenCalledWith(5);
            expect(mockCriar).toHaveBeenCalledWith(expect.objectContaining({ perguntaId: 5 }));
        });

        it("deve salvar correta como false quando o valor não for exatamente true", async () => {
            mockBuscarPerguntaPorId.mockResolvedValue(perguntaComCorreta());
            mockCriar.mockResolvedValue({ id: 10 });

            await RespostasService.criar({ texto: "Brasília", correta: "true", perguntaId: 5 });

            expect(mockCriar).toHaveBeenCalledWith(expect.objectContaining({ correta: false }));
        });

        it.each(["", "   ", undefined, null, 123])(
            "deve lançar erro 400 quando o texto for inválido (%p)",
            async (texto) => {
                await expect(
                    RespostasService.criar({ texto, perguntaId: 5 })
                ).rejects.toMatchObject({
                    status: 400,
                    message: "A resposta precisa ter um texto.",
                });
            }
        );

        it.each(["abc", 0, -1, 1.5, "1.5", undefined, null, ""])(
            "deve lançar erro 400 quando o id da pergunta for inválido (%p)",
            async (perguntaId) => {
                await expect(
                    RespostasService.criar({ texto: "Brasília", perguntaId })
                ).rejects.toMatchObject({
                    status: 400,
                    message: "O id da pergunta precisa ser um numero valido.",
                });
            }
        );

        it("deve lançar erro 404 quando a pergunta não existir", async () => {
            mockBuscarPerguntaPorId.mockResolvedValue(null);

            await expect(
                RespostasService.criar({ texto: "Brasília", perguntaId: 999 })
            ).rejects.toMatchObject({
                status: 404,
                message: "Pergunta nao encontrada.",
            });
        });

        it("deve lançar erro 409 quando a pergunta já tiver uma resposta correta", async () => {
            mockBuscarPerguntaPorId.mockResolvedValue(perguntaComCorreta());

            await expect(
                RespostasService.criar({ texto: "Outra", correta: true, perguntaId: 5 })
            ).rejects.toMatchObject({
                status: 409,
                message: "Essa pergunta ja tem uma resposta correta.",
            });
        });

        it("deve permitir criar uma resposta errada mesmo quando a pergunta já tem a correta", async () => {
            mockBuscarPerguntaPorId.mockResolvedValue(perguntaComCorreta());
            mockCriar.mockResolvedValue({ id: 10 });

            await RespostasService.criar({ texto: "Salvador", correta: false, perguntaId: 5 });

            expect(mockCriar).toHaveBeenCalledTimes(1);
        });

        it("não deve buscar a pergunta nem criar quando o texto for inválido", async () => {
            await expect(
                RespostasService.criar({ texto: "", perguntaId: 5 })
            ).rejects.toMatchObject({ status: 400 });

            expect(mockBuscarPerguntaPorId).not.toHaveBeenCalled();
            expect(mockCriar).not.toHaveBeenCalled();
        });

        it("não deve criar quando a pergunta não existir ou já tiver correta", async () => {
            mockBuscarPerguntaPorId.mockResolvedValue(null);
            await expect(
                RespostasService.criar({ texto: "A", perguntaId: 999 })
            ).rejects.toMatchObject({ status: 404 });

            mockBuscarPerguntaPorId.mockResolvedValue(perguntaComCorreta());
            await expect(
                RespostasService.criar({ texto: "B", correta: true, perguntaId: 5 })
            ).rejects.toMatchObject({ status: 409 });

            expect(mockCriar).not.toHaveBeenCalled();
        });
    });

    describe("listarPorPergunta", () => {
        it("deve listar as respostas de uma pergunta existente", async () => {
            const respostas = [
                { id: 1, texto: "São Paulo", correta: false, perguntaId: 5 },
                { id: 2, texto: "Brasília", correta: true, perguntaId: 5 },
            ];
            mockBuscarPerguntaPorId.mockResolvedValue(perguntaComCorreta());
            mockListarPorPergunta.mockResolvedValue(respostas);

            const result = await RespostasService.listarPorPergunta(5);

            expect(mockBuscarPerguntaPorId).toHaveBeenCalledWith(5);
            expect(mockListarPorPergunta).toHaveBeenCalledWith(5);
            expect(result).toEqual(respostas);
        });

        it("deve converter o id recebido como texto para número", async () => {
            mockBuscarPerguntaPorId.mockResolvedValue(perguntaComCorreta());
            mockListarPorPergunta.mockResolvedValue([]);

            await RespostasService.listarPorPergunta("5");

            expect(mockListarPorPergunta).toHaveBeenCalledWith(5);
        });

        it.each(["abc", 0, -1, 1.5, undefined])(
            "deve lançar erro 400 quando o id da pergunta for inválido (%p)",
            async (id) => {
                await expect(RespostasService.listarPorPergunta(id)).rejects.toMatchObject({
                    status: 400,
                    message: "O id da pergunta precisa ser um numero valido.",
                });

                expect(mockBuscarPerguntaPorId).not.toHaveBeenCalled();
            }
        );

        it("deve lançar erro 404 quando a pergunta não existir", async () => {
            mockBuscarPerguntaPorId.mockResolvedValue(null);

            await expect(RespostasService.listarPorPergunta(999)).rejects.toMatchObject({
                status: 404,
                message: "Pergunta nao encontrada.",
            });

            expect(mockListarPorPergunta).not.toHaveBeenCalled();
        });
    });

    describe("atualizar", () => {
        it("deve atualizar o texto e a correta", async () => {
            mockAtualizar.mockResolvedValue({ id: 1, texto: "Novo texto", correta: true });

            const result = await RespostasService.atualizar(1, { texto: "Novo texto", correta: true });

            expect(mockAtualizar).toHaveBeenCalledWith(1, { texto: "Novo texto", correta: true });
            expect(result).toEqual({ id: 1, texto: "Novo texto", correta: true });
        });

        it("deve atualizar só o texto quando a correta não for enviada", async () => {
            mockAtualizar.mockResolvedValue({ id: 1 });

            await RespostasService.atualizar(1, { texto: "Novo texto" });

            expect(mockAtualizar).toHaveBeenCalledWith(1, { texto: "Novo texto" });
        });

        it("deve atualizar só a correta quando o texto não for enviado", async () => {
            mockAtualizar.mockResolvedValue({ id: 1 });

            await RespostasService.atualizar(1, { correta: true });

            expect(mockAtualizar).toHaveBeenCalledWith(1, { correta: true });
        });

        it("deve permitir mudar a correta para false", async () => {
            mockAtualizar.mockResolvedValue({ id: 1 });

            await RespostasService.atualizar(1, { correta: false });

            expect(mockAtualizar).toHaveBeenCalledWith(1, { correta: false });
        });

        it("deve remover os espaços do texto", async () => {
            mockAtualizar.mockResolvedValue({ id: 1 });

            await RespostasService.atualizar(1, { texto: "  Novo texto  " });

            expect(mockAtualizar).toHaveBeenCalledWith(1, { texto: "Novo texto" });
        });

        it("deve converter o id recebido como texto para número", async () => {
            mockAtualizar.mockResolvedValue({ id: 1 });

            await RespostasService.atualizar("1", { texto: "Novo texto" });

            expect(mockAtualizar).toHaveBeenCalledWith(1, { texto: "Novo texto" });
        });

        it.each(["abc", 0, -1, 1.5, undefined])(
            "deve lançar erro 400 quando o id da resposta for inválido (%p)",
            async (id) => {
                await expect(
                    RespostasService.atualizar(id, { texto: "Novo texto" })
                ).rejects.toMatchObject({
                    status: 400,
                    message: "O id da resposta precisa ser um numero valido.",
                });

                expect(mockAtualizar).not.toHaveBeenCalled();
            }
        );

        it("deve lançar erro 400 quando nenhum campo for enviado", async () => {
            await expect(RespostasService.atualizar(1, {})).rejects.toMatchObject({
                status: 400,
                message: "Envie o texto ou o campo correta para atualizar.",
            });

            await expect(RespostasService.atualizar(1)).rejects.toMatchObject({
                status: 400,
                message: "Envie o texto ou o campo correta para atualizar.",
            });

            expect(mockAtualizar).not.toHaveBeenCalled();
        });

        it.each(["", "   ", null, 123])(
            "deve lançar erro 400 quando o texto for inválido (%p)",
            async (texto) => {
                await expect(RespostasService.atualizar(1, { texto })).rejects.toMatchObject({
                    status: 400,
                    message: "A resposta precisa ter um texto.",
                });

                expect(mockAtualizar).not.toHaveBeenCalled();
            }
        );

        it.each(["true", 1, null])(
            "deve lançar erro 400 quando a correta não for booleano (%p)",
            async (correta) => {
                await expect(RespostasService.atualizar(1, { correta })).rejects.toMatchObject({
                    status: 400,
                    message: "O campo correta precisa ser true ou false.",
                });

                expect(mockAtualizar).not.toHaveBeenCalled();
            }
        );

        it("deve lançar erro 404 quando o Prisma não achar a resposta (P2025)", async () => {
            mockAtualizar.mockRejectedValue(erroPrisma("P2025"));

            await expect(
                RespostasService.atualizar(999, { texto: "Novo texto" })
            ).rejects.toMatchObject({
                status: 404,
                message: "Resposta nao encontrada.",
            });
        });

        it("deve repassar outros erros sem alterar", async () => {
            const erroInesperado = erroPrisma("P1001");
            mockAtualizar.mockRejectedValue(erroInesperado);

            await expect(
                RespostasService.atualizar(1, { texto: "Novo texto" })
            ).rejects.toBe(erroInesperado);
        });
    });

    describe("deletar", () => {
        it("deve deletar a resposta pelo id", async () => {
            mockDeletar.mockResolvedValue({ id: 1 });

            const result = await RespostasService.deletar(1);

            expect(mockDeletar).toHaveBeenCalledWith(1);
            expect(result).toEqual({ id: 1 });
        });

        it("deve converter o id recebido como texto para número", async () => {
            mockDeletar.mockResolvedValue({ id: 1 });

            await RespostasService.deletar("1");

            expect(mockDeletar).toHaveBeenCalledWith(1);
        });

        it.each(["abc", 0, -1, 1.5, undefined])(
            "deve lançar erro 400 quando o id for inválido (%p)",
            async (id) => {
                await expect(RespostasService.deletar(id)).rejects.toMatchObject({
                    status: 400,
                    message: "O id da resposta precisa ser um numero valido.",
                });

                expect(mockDeletar).not.toHaveBeenCalled();
            }
        );

        it("deve lançar erro 404 quando o Prisma não achar a resposta (P2025)", async () => {
            mockDeletar.mockRejectedValue(erroPrisma("P2025"));

            await expect(RespostasService.deletar(999)).rejects.toMatchObject({
                status: 404,
                message: "Resposta nao encontrada.",
            });
        });

        it("deve repassar outros erros sem alterar", async () => {
            const erroInesperado = erroPrisma("P1001");
            mockDeletar.mockRejectedValue(erroInesperado);

            await expect(RespostasService.deletar(1)).rejects.toBe(erroInesperado);
        });
    });
});
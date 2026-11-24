import { beforeEach, describe, expect, it, jest } from "@jest/globals";

const mockCriarAnimal = jest.fn();
const mockBuscarAnimalPorNome = jest.fn();

jest.unstable_mockModule("../../../src/shared/animal/repository/animal.repository.js", () => ({
    criarAnimal: mockCriarAnimal,
    buscarAnimalPorNome: mockBuscarAnimalPorNome,
}));

const { cadastrarAnimal } = await import("../../../src/features/animal/animal.service.js");

const animalValido = () => ({
    nome: "Onça-pintada",
    descricao: {
        especie: "Panthera onca",
        habitats: "Floresta amazônica",
        foto: "https://site.com/onca.jpg",
        alimentacao: "Carnívora",
        conservacao: "Quase ameaçada",
    },
});

describe("cadastrarAnimal", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockBuscarAnimalPorNome.mockResolvedValue(null);
        mockCriarAnimal.mockImplementation(async (dados) => ({ id: 1, ...dados }));
    });

    it("deve cadastrar um animal válido", async () => {
        const result = await cadastrarAnimal(animalValido());

        expect(mockBuscarAnimalPorNome).toHaveBeenCalledWith("Onça-pintada");
        expect(mockCriarAnimal).toHaveBeenCalledWith(animalValido());
        expect(result).toEqual({ id: 1, ...animalValido() });
    });

    it("deve remover os espaços do nome e dos campos da descrição", async () => {
        const dados = animalValido();
        dados.nome = "  Onça-pintada  ";
        dados.descricao.especie = "  Panthera onca  ";

        await cadastrarAnimal(dados);

        expect(mockBuscarAnimalPorNome).toHaveBeenCalledWith("Onça-pintada");
        expect(mockCriarAnimal).toHaveBeenCalledWith(animalValido());
    });

    it("deve lançar erro 400 quando não receber dados", async () => {
        await expect(cadastrarAnimal(undefined)).rejects.toMatchObject({ status: 400 });
        await expect(cadastrarAnimal(null)).rejects.toMatchObject({ status: 400 });
    });

    it.each(["", "   ", undefined, null, 123])(
        "deve lançar erro 400 quando o nome for inválido (%p)",
        async (nome) => {
            const dados = animalValido();
            dados.nome = nome;

            await expect(cadastrarAnimal(dados)).rejects.toMatchObject({
                status: 400,
                message: "Ops! Esqueceu de dar um nome para o bicho.",
            });
        }
    );

    it.each([undefined, null, "texto"])(
        "deve lançar erro 400 quando a descrição for inválida (%p)",
        async (descricao) => {
            const dados = animalValido();
            dados.descricao = descricao;

            await expect(cadastrarAnimal(dados)).rejects.toMatchObject({
                status: 400,
                message: "Faltou a descrição do animal.",
            });
        }
    );

    it.each([
        ["especie", "a espécie"],
        ["habitats", "os habitats"],
        ["foto", "o link da foto"],
        ["alimentacao", "a alimentação"],
        ["conservacao", "o estado de conservação"],
    ])("deve lançar erro 400 quando faltar %s", async (campo, rotulo) => {
        const dados = animalValido();
        delete dados.descricao[campo];

        await expect(cadastrarAnimal(dados)).rejects.toMatchObject({
            status: 400,
            message: `Faltou informar ${rotulo} do animal.`,
        });
    });

    it("deve lançar erro 400 quando um campo da descrição tiver só espaços", async () => {
        const dados = animalValido();
        dados.descricao.habitats = "   ";

        await expect(cadastrarAnimal(dados)).rejects.toMatchObject({ status: 400 });
    });

    it("deve lançar erro 400 quando o link da foto for inválido", async () => {
        const dados = animalValido();
        dados.descricao.foto = "isso nao eh um link";

        await expect(cadastrarAnimal(dados)).rejects.toMatchObject({
            status: 400,
            message: "O link da foto não parece válido. Use algo como https://site.com/foto.jpg",
        });
    });

    it("deve lançar erro 409 quando o animal já estiver cadastrado", async () => {
        mockBuscarAnimalPorNome.mockResolvedValue({ id: 5, nome: "Onça-pintada" });

        await expect(cadastrarAnimal(animalValido())).rejects.toMatchObject({
            status: 409,
            message: 'Já temos um(a) "Onça-pintada" cadastrado(a) por aqui.',
        });
    });

    it("não deve chamar criarAnimal quando a validação falhar", async () => {
        const dados = animalValido();
        dados.nome = "";

        await expect(cadastrarAnimal(dados)).rejects.toMatchObject({ status: 400 });
        expect(mockCriarAnimal).not.toHaveBeenCalled();
    });

    it("não deve chamar criarAnimal quando o animal já existir", async () => {
        mockBuscarAnimalPorNome.mockResolvedValue({ id: 5, nome: "Onça-pintada" });

        await expect(cadastrarAnimal(animalValido())).rejects.toMatchObject({ status: 409 });
        expect(mockCriarAnimal).not.toHaveBeenCalled();
    });
});
import { beforeEach, describe, expect, it, jest } from "@jest/globals";

const mockBuscarAnimalPorId = jest.fn();

jest.unstable_mockModule("../../../src/shared/animal/repository/animal.repository.js", () => ({
    buscarAnimalPorId: mockBuscarAnimalPorId,
}));

const { detalharAnimal } = await import("../../../src/features/animal/animal.detail.service.js");

const animalMock = {
    id: 1,
    nome: "Onça-pintada",
    descricao: {
        especie: "Panthera onca",
        habitats: "Floresta amazônica",
        foto: "https://site.com/onca.jpg",
        alimentacao: "Carnívora",
        conservacao: "Quase ameaçada",
    },
};

describe("detalharAnimal", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve retornar o animal quando o id for válido", async () => {
        mockBuscarAnimalPorId.mockResolvedValue(animalMock);

        const result = await detalharAnimal(1);

        expect(mockBuscarAnimalPorId).toHaveBeenCalledWith(1);
        expect(result).toEqual(animalMock);
    });

    it("deve converter o id recebido como texto para número", async () => {
        mockBuscarAnimalPorId.mockResolvedValue(animalMock);

        await detalharAnimal("1");

        expect(mockBuscarAnimalPorId).toHaveBeenCalledWith(1);
    });

    it.each(["abc", 0, -1, 1.5, "1.5", undefined, NaN])(
        "deve lançar erro 400 quando o id for inválido (%p)",
        async (id) => {
            await expect(detalharAnimal(id)).rejects.toMatchObject({
                status: 400,
                message: "Esse código de animal não parece válido. Use um número, como 1 ou 2.",
            });
        }
    );

    it("não deve buscar no repositório quando o id for inválido", async () => {
        await expect(detalharAnimal("abc")).rejects.toMatchObject({ status: 400 });

        expect(mockBuscarAnimalPorId).not.toHaveBeenCalled();
    });

    it("deve lançar erro 404 quando o animal não existir", async () => {
        mockBuscarAnimalPorId.mockResolvedValue(null);

        await expect(detalharAnimal(999)).rejects.toMatchObject({
            status: 404,
            message: "Não encontramos nenhum bichinho com esse código. Será que ele fugiu? 🐾",
        });

        expect(mockBuscarAnimalPorId).toHaveBeenCalledWith(999);
    });
});
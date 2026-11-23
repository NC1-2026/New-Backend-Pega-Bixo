const request = require("supertest");

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = require("../../src/signin.js"); // ajuste o caminho para onde o arquivo estiver

describe("POST /api/signin", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve autenticar e devolver o token", async () => {
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue("token-fake");

        const res = await request(app)
            .post("/api/signin")
            .send({ email: "utilisateur@exemple.com", password: "123456" });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: "Connexion réussie", token: "token-fake" });
        expect(jwt.sign).toHaveBeenCalledWith(
            { userId: 1, email: "utilisateur@exemple.com" },
            "votre_cle_secrete_ultra_securisee",
            { expiresIn: "1h" }
        );
    });

    it("deve devolver 401 quando o email não existir", async () => {
        const res = await request(app)
            .post("/api/signin")
            .send({ email: "naoexiste@exemple.com", password: "123456" });

        expect(res.status).toBe(401);
        expect(res.body).toEqual({ error: "Email ou mot de passe incorrect." });
        expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it("deve devolver 401 quando a senha estiver incorreta", async () => {
        bcrypt.compare.mockResolvedValue(false);

        const res = await request(app)
            .post("/api/signin")
            .send({ email: "utilisateur@exemple.com", password: "senha-errada" });

        expect(res.status).toBe(401);
        expect(res.body).toEqual({ error: "Email ou mot de passe incorrect." });
        expect(jwt.sign).not.toHaveBeenCalled();
    });

    it("deve devolver 401 quando não enviar email", async () => {
        const res = await request(app).post("/api/signin").send({ password: "123456" });

        expect(res.status).toBe(401);
    });

    it("deve devolver 500 quando acontecer um erro inesperado", async () => {
        bcrypt.compare.mockRejectedValue(new Error("falha"));

        const res = await request(app)
            .post("/api/signin")
            .send({ email: "utilisateur@exemple.com", password: "123456" });

        expect(res.status).toBe(500);
        expect(res.body).toEqual({ error: "Erreur interne du serveur." });
    });
});
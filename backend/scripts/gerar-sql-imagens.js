import { readdirSync } from 'node:fs';
import path from 'node:path';

const BASE = 'https://new-backend-pega-bixo.onrender.com/imagens/';

const arquivos = readdirSync('public/imagens').filter((f) =>
  /\.(jpe?g|png|webp)$/i.test(f)
);

for (const arquivo of arquivos) {
  const nome = path.parse(arquivo).name.toLowerCase();
  console.log(
    `UPDATE "Animal" SET "imagemUrl" = '${BASE}${encodeURIComponent(arquivo)}' ` +
      `WHERE lower(replace("nomeCientifico", ' ', '-')) = '${nome}';`
  );
}
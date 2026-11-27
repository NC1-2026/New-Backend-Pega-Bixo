/* import { ALIMENTACAO, STATUS } from './labels';

// Ligue quando as fotos estiverem carregando no catálogo
const USAR_FOTO = false;

const embaralhar = (lista) => {
  const a = [...lista];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// 1 resposta certa + 3 erradas, sem repetir valores
const montarOpcoes = (correta, candidatas) => {
  const erradas = embaralhar([...new Set(candidatas)].filter((v) => v !== correta)).slice(0, 3);
  return embaralhar([correta, ...erradas]);
};

export function gerarQuiz(animais, total = 5) {
  const tipos = ['cientifico', 'alimentacao', 'status', ...(USAR_FOTO ? ['foto'] : [])];
  const rotulosAlimentacao = Object.values(ALIMENTACAO);
  const rotulosStatus = Object.values(STATUS).map((s) => s.rotulo);

  return embaralhar(animais)
    .slice(0, total)
    .map((a) => {
      let tipo = tipos[Math.floor(Math.random() * tipos.length)];
      if (tipo === 'foto' && !a.imagemUrl) tipo = 'cientifico';

      const outros = animais.filter((o) => o.id !== a.id);
      const explicacao = a.informacoesAdicionais?.[0] ?? null;
      const base = { animal: a, explicacao, foto: null };

      if (tipo === 'foto') {
        return {
          ...base,
          foto: a.imagemUrl,
          texto: 'Que animal é este?',
          correta: a.nome,
          opcoes: montarOpcoes(a.nome, outros.map((o) => o.nome)),
        };
      }
      if (tipo === 'alimentacao') {
        const correta = ALIMENTACAO[a.tipoAlimentacao] ?? a.tipoAlimentacao;
        return {
          ...base,
          texto: `Qual é o tipo de alimentação de ${a.nome}?`,
          correta,
          opcoes: montarOpcoes(correta, rotulosAlimentacao),
        };
      }
      if (tipo === 'status') {
        const correta = STATUS[a.statusConservacao]?.rotulo ?? 'Não avaliado';
        return {
          ...base,
          texto: `Qual o status de conservação de ${a.nome}?`,
          correta,
          opcoes: montarOpcoes(correta, rotulosStatus),
        };
      }
      return {
        ...base,
        texto: `Qual é o nome científico de ${a.nome}?`,
        correta: a.nomeCientifico,
        opcoes: montarOpcoes(a.nomeCientifico, outros.map((o) => o.nomeCientifico)),
      };
    });
} */




    import { ALIMENTACAO, STATUS } from './labels';

// Perguntas com foto só funcionam se as imagens estiverem carregando.
// Se as fotos ainda falharem, troque para false.
const USAR_FOTO = true;

const embaralhar = (lista) => {
  const a = [...lista];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const sortear = (lista) => lista[Math.floor(Math.random() * lista.length)];

// 1 resposta certa + 3 erradas, sem repetir valores
const montarOpcoes = (correta, candidatas) => {
  const erradas = embaralhar([...new Set(candidatas)].filter((v) => v !== correta)).slice(0, 3);
  return embaralhar([correta, ...erradas]);
};

export function gerarQuiz(animais, total = 5) {
  const rotulosAlimentacao = Object.values(ALIMENTACAO);
  const rotulosStatus = Object.values(STATUS).map((s) => s.rotulo);

  return embaralhar(animais)
    .slice(0, total)
    .map((a) => {
      // Só entram alimentação, conservação e foto
      const tiposPossiveis = ['alimentacao', 'status'];
      if (USAR_FOTO && a.imagemUrl) tiposPossiveis.push('foto');

      const tipo = sortear(tiposPossiveis);

      const outros = animais.filter((o) => o.id !== a.id);
      const explicacao = a.informacoesAdicionais?.[0] ?? null;
      const base = { animal: a, explicacao, foto: null };

      if (tipo === 'foto') {
        return {
          ...base,
          foto: a.imagemUrl,
          texto: 'Que animal é este?',
          correta: a.nome,
          opcoes: montarOpcoes(a.nome, outros.map((o) => o.nome)),
        };
      }

      if (tipo === 'alimentacao') {
        const correta = ALIMENTACAO[a.tipoAlimentacao] ?? a.tipoAlimentacao;
        return {
          ...base,
          texto: `Qual é o tipo de alimentação de ${a.nome}?`,
          correta,
          opcoes: montarOpcoes(correta, rotulosAlimentacao),
        };
      }

      const correta = STATUS[a.statusConservacao]?.rotulo ?? 'Não avaliado';
      return {
        ...base,
        texto: `Qual o status de conservação de ${a.nome}?`,
        correta,
        opcoes: montarOpcoes(correta, rotulosStatus),
      };
    });
}
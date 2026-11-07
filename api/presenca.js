let listaPresencas = [];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // GET: Retorna os alunos presentes e metadados da aula atual
  if (req.method === 'GET') {
    res.status(200).json(listaPresencas);
    return;
  }

  // POST: Adiciona ou atualiza o aluno na lista da aula
  if (req.method === 'POST') {
    const { alunoId, nome, turma, avatarUrl, disciplina, periodo } = req.body;

    if (!nome || !turma) {
      return res.status(400).json({ erro: 'Nome e Turma são obrigatórios!' });
    }

    const dataAtual = new Date().toLocaleDateString('pt-BR');
    const horarioAtual = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    // Evita duplicidade do mesmo aluno na mesma turma/sessão
    const indexExistente = listaPresencas.findIndex(p => p.alunoId === alunoId && p.turma === turma);

    const novoRegistro = {
      alunoId: alunoId || Date.now().toString(),
      nome,
      turma,
      avatarUrl: avatarUrl || '',
      disciplina: disciplina || 'Artes / Cultura Digital',
      periodo: periodo || '1º e 2º Período',
      data: dataAtual,
      horario: horarioAtual
    };

    if (indexExistente >= 0) {
      listaPresencas[indexExistente] = novoRegistro;
    } else {
      listaPresencas.push(novoRegistro);
    }

    res.status(200).json({ mensagem: 'Presença atualizada com sucesso!', registro: novoRegistro });
    return;
  }

  // DELETE: Limpa a lista (caso queira reiniciar a chamada do dia)
  if (req.method === 'DELETE') {
    listaPresencas = [];
    res.status(200).json({ mensagem: 'Painel limpo com sucesso!' });
    return;
  }

  res.status(405).json({ erro: 'Método não permitido' });
}

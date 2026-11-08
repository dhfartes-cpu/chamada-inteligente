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

  if (req.method === 'GET') {
    res.status(200).json(listaPresencas);
    return;
  }

  if (req.method === 'POST') {
    const { alunoId, nome, turma, avatarUrl, disciplina, periodo } = req.body;

    if (!nome || !turma) {
      return res.status(400).json({ erro: 'Nome e Turma são obrigatórios!' });
    }

    const dataAtual = new Date().toLocaleDateString('pt-BR');
    const horarioAtual = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    // Chave única combinando Aluno, Turma e Disciplina para separar as aulas
    const chaveUnica = `${alunoId}-${turma}-${disciplina}`;
    const indexExistente = listaPresencas.findIndex(p => `${p.alunoId}-${p.turma}-${p.disciplina}` === chaveUnica);

    const novoRegistro = {
      alunoId: alunoId || Date.now().toString(),
      nome,
      turma,
      avatarUrl: avatarUrl || '',
      disciplina: disciplina || 'Artes',
      periodo: periodo || '1º Período',
      data: dataAtual,
      horario: horarioAtual
    };

    if (indexExistente >= 0) {
      listaPresencas[indexExistente] = novoRegistro;
    } else {
      listaPresencas.push(novoRegistro);
    }

    res.status(200).json({ mensagem: 'Presença atualizada!', registro: novoRegistro });
    return;
  }

  // DELETE para remover um aluno específico ou limpar tudo
  if (req.method === 'DELETE') {
    const { alunoId, turma, disciplina } = req.query;
    if (alunoId && turma && disciplina) {
      listaPresencas = listaPresencas.filter(p => !(p.alunoId === alunoId && p.turma === turma && p.disciplina === disciplina));
      return res.status(200).json({ mensagem: 'Aluno removido da presença.' });
    }
    listaPresencas = [];
    res.status(200).json({ mensagem: 'Painel limpo!' });
    return;
  }

  res.status(405).json({ erro: 'Método não permitido' });
}

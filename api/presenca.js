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
    // CORREÇÃO: Adicionamos o 'faltas' aqui para ele não ser ignorado!
    const { alunoId, nome, turma, avatarUrl, disciplina, periodo, professor, status, faltas } = req.body;

    if (!nome || !turma) {
      return res.status(400).json({ erro: 'Nome e Turma são obrigatórios!' });
    }

    const agora = new Date();
    const dataAtual = agora.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const horarioAtual = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' });

    const discAtual = disciplina || 'Artes';
    const profAtual = professor || 'Douglas H. França';
    const perAtual = periodo || '1 Período';
    const statusAtual = status || 'PRESENTE';
    
    // CORREÇÃO: Garante que o campo faltas seja sempre um array válido (ex: [1, 2])
    const faltasAtual = Array.isArray(faltas) ? faltas : [];

    // REGRA DE SOBREPOSIÇÃO POR TURMA:
    const chamadaExistenteDaTurma = listaPresencas.find(p => p.turma === turma);
    if (chamadaExistenteDaTurma && chamadaExistenteDaTurma.disciplina !== discAtual) {
      listaPresencas = listaPresencas.filter(p => p.turma !== turma);
    }

    const chaveUnica = `${alunoId}-${turma}`;
    const indexExistente = listaPresencas.findIndex(p => `${p.alunoId}-${p.turma}` === chaveUnica);

    const novoRegistro = {
      alunoId: alunoId || Date.now().toString(),
      nome,
      turma,
      avatarUrl: avatarUrl || '',
      disciplina: discAtual,
      professor: profAtual,
      periodo: perAtual,
      status: statusAtual,
      faltas: faltasAtual, // CORREÇÃO: Salva o array de faltas aqui
      data: dataAtual,
      horario: horarioAtual
    };

    if (indexExistente >= 0) {
      listaPresencas[indexExistente] = novoRegistro;
    } else {
      listaPresencas.push(novoRegistro);
    }

    res.status(200).json({ mensagem: 'Sincronizado com sucesso!', registro: novoRegistro });
    return;
  }

  if (req.method === 'DELETE') {
    listaPresencas = [];
    res.status(200).json({ mensagem: 'Limpo com sucesso!' });
    return;
  }

  res.status(405).json({ erro: 'Método não permitido' });
}

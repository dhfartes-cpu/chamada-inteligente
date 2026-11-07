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
    const { alunoId, nome, turma, avatarUrl } = req.body;

    if (!nome || !turma) {
      return res.status(400).json({ erro: 'Nome e Turma são obrigatórios!' });
    }

    const novoRegistro = {
      alunoId: alunoId || Date.now().toString(),
      nome,
      turma,
      avatarUrl: avatarUrl || '',
      horario: new Date().toLocaleTimeString('pt-BR')
    };

    listaPresencas.push(novoRegistro);

    res.status(200).json({ mensagem: 'Presença registrada com sucesso!', registro: novoRegistro });
    return;
  }

  res.status(405).json({ erro: 'Método não permitido' });
}

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

    if (req.method === 'POST') {
        const { alunoId, nome, turma, avatarUrl } = req.body;

        if (!nome || !turma) {
            return res.status(400).json({ erro: 'Nome e Turma são obrigatórios!' });
        }

        const novaPresenca = {
            alunoId: alunoId || 'N/A',
            nome,
            turma,
            avatarUrl: avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + nome,
            horario: new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' })
        };

        listaPresencas.unshift(novaPresenca);

        if (listaPresencas.length > 50) {
            listaPresencas.pop();
        }

        return res.status(200).json({ 
            sucesso: true, 
            mensagem: 'Presença registrada com sucesso!', 
            dados: novaPresenca 
        });
    }

    if (req.method === 'GET') {
        return res.status(200).json(listaPresencas);
    }

    return res.status(405).json({ erro: 'Método não permitido' });
}
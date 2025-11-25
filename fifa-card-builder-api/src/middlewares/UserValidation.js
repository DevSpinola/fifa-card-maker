const UserModel = require('../model/UserModel');

//const UserValidation = async(req, res, next)
async function UserValidation(req, res, next) {

    const { id, nome, senha, login } = req.body;

    let alteracaoRegistro = req.params.id != null;

    if (!id && !alteracaoRegistro)
        return res.status(400).json({ erro: 'Informe o ID' });

    if (!nome || nome.length < 2)
        return res.status(400).json({ erro: 'Informe o nome com ao menos 2 dígitos' });

    if (alteracaoRegistro) {
        let qtde = (await UserModel.countDocuments({ "id": req.params.id }));
        let existe = qtde >= 1;

        if (!existe)
            return res.status(400).json({ erro: 'Não há registro para o id informado' });
    }
    else {
        if (!id)
            return res.status(400).json({ erro: 'Informe o id' });

        let existe = (await UserModel.countDocuments({ "id": id })) >= 1;
        if (existe)
            return res.status(400).json({ erro: 'Já existe um usuário cadastrado com este id' });
    }

    return next();
}

module.exports = UserValidation;
const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  // O formato geralmente é "Bearer TOKEN_AQUI"
  const [, token] = authHeader.split(" ");

  try {
    const decoded = jwt.verify(token, authConfig.secret);
    
    // Adiciona o ID do usuário na requisição para uso posterior se necessário
    req.userId = decoded.id; 

    return next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido" });
  }
};
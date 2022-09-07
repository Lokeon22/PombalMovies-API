const { verify } = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const authConfig = require("../configs/auth");

function ensureAuthenticated(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("JWT indisponível", 401);
  }

  const [, token] = authHeader.split(" ");

  try {
    const { sub: user_id } = verify(token, authConfig.jwt.secret);

    req.user = {
      id: Number(user_id),
    };

    //Dentro do middle, quando pegamos o user_id ← de sub e estamos inserindo dentro da requisição  o user e o id: que é o id do usuario
    //Então quando ele faz alguma requisição de uma rota, como por exemplo atualizar o profile, então o nosso middleware pega o id do usuario no token e insere na requisição

    return next();
  } catch {
    throw new AppError("JWT Token inválido", 401);
  }
}

module.exports = ensureAuthenticated;

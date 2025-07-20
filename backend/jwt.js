const jwt = require("jsonwebtoken");
const { model } = require("mongoose");
const JWT_SECRET = process.env.JWT_SECRET;

const jwtAuthMiddlware = (req, res, next) => {
  const authorization = req.headers.authorization;

  if(!authorization) return res.status(401).json({ error: "invalid token" });

  const token = req.headers.authorization.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decode = jwt.verify(token, JWT_SECRET);

    req.user = decode;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Unauthorized" });
  }
};

const generateToken = (userData)=>{
    const token = jwt.sign(userData, JWT_SECRET,{expiresIn:1000000});
    return token
}

module.exports = {jwtAuthMiddlware,generateToken};

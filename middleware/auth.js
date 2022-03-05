import jwt from "jsonwebtoken";

export default (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (!token) {
    console.log("No token present in request");
    return res.status(403).json({ success: false, error: "A token is required for authentication" });
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_PRIVATE_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({ success: false, error: "Invalid Token" });
  }
  return next();
};

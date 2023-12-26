const User = require("../models/user");

require("dotenv").config();

async function apiKeyAuth(req, reply) {
  if (["GET", "HEAD"].includes(req.method)) {
    return;
  }
  const userApiKey = req.headers["x-api-key"];

  console.log("userApikey==", userApiKey);
  const realApiKey = process.env.API_KEY;
  if (!userApiKey || userApiKey !== realApiKey) {
    reply.status(401).send({ error: "Unauthorized" });
  }
}

async function basicAuth(req, reply) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    reply.status(401).send({ error: "No authorization header" });
  }

  const [authType, authKey] = authHeader.split(" ");
  if (authType !== "Basic") {
    return reply
      .status(401)
      .send({ error: "Requires basic auth(username,password)" });
  }
  const [email, password] = Buffer.from(authKey, "base64")
    .toString("ascii")
    .split(":");

  //   console.log({ email, password });

  try {
    const user = await User.findOne({ email });
    // console.log("User==", user);

    if (!user) {
      return reply.status(401).send({ error: "User not found" });
    }
    const isMatch = await user.comparePassword(password);
    console.log("isMatch==", isMatch);
    if (!isMatch) {
      return reply.status(401).send({ error: "Incorrect password" });
    }
    // const { password, ...userInfos } = user;
    // console.log("userInfos==", userInfos);
    // return reply.status(200).send({ user});
  } catch (error) {
    return reply
      .status(500)
      .send({ error: "an error occured during authoriation" });
  }
}

module.exports = { apiKeyAuth, basicAuth };

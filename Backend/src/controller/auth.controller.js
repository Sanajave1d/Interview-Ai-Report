const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userModel: User, userModel } = require("../models/user.model");
const { blackListTokenModel } = require("../models/blackListToken.model");

const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY || "15m";
const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY || "7d";

function getJwtSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return process.env.JWT_SECRET;
}

function createTokens(user) {
  const payload = { userId: user._id.toString(), username: user.username };
  const secret = getJwtSecret();

  return {
    accessToken: jwt.sign({ ...payload, type: "access" }, secret, {
      expiresIn: accessTokenExpiry,
    }),
    refreshToken: jwt.sign(
      { userId: payload.userId, type: "refresh" },
      secret,
      { expiresIn: refreshTokenExpiry },
    ),
  };
}

function setRefreshTokenCookie(res, refreshToken) {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

/**
 * @name registerController
 * @description register a new user , expects username , email and password
 * @access Public
 * @param {*} req
 * @param {*} res
 */

async function registerController(req, res) {
  const { username, email, password } = req.body;
  console.log(username, email, password)
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "username , email and password are required" });
  }

  const isUserExist = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserExist) {
    return res.status(400).json({ message: "username or email already exist" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    username,
    email,
    password: hashedPassword,
  });

  await user.save();
  const tokens = createTokens(user);
  setRefreshTokenCookie(res, tokens.refreshToken);

  return res.status(201).json({
    accessToken: tokens.accessToken,
    message: "user registered successfully",
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

/**
 * @name loginController
 * @description login an existing user , expects email or username and password
 * @access Public
 * @param {*} req
 * @param {*} res
 */

async function loginController(req, res) {
  const { email, username, password } = req.body;
  if ((!email && !username) || !password) {
    return res
      .status(400)
      .json({ message: "email or username and password are required" });
  }

  const user = await User.findOne(email ? { email } : { username });
  const passwordMatches =
    user && (await bcrypt.compare(password, user.password));

  if (!passwordMatches) {
    return res.status(401).json({ message: "invalid credentials" });
  }

  const tokens = createTokens(user);
  setRefreshTokenCookie(res, tokens.refreshToken);

  return res.json({
    accessToken: tokens.accessToken,
    message: "user logged in successfully",
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

async function refreshTokenController(req, res) {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "refresh token is required" });
  }

  try {
    const decoded = jwt.verify(refreshToken, getJwtSecret());

    const isBlackListed = await blackListTokenModel.findOne({
        token: refreshToken,
    })

    if(isBlackListed){
        return res.status(401).json({
            message: "refresh token has been invalidated"
        })
    }

    if (decoded.type !== "refresh") {
      return res.status(401).json({ message: "invalid refresh token" });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "invalid refresh token" });
    }

    const tokens = createTokens(user);
    setRefreshTokenCookie(res, tokens.refreshToken);

    return res.json({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    return res
      .status(401)
      .json({ message: "invalid or expired refresh token" });
  }
}

async function logoutController(req, res) {
  const refreshToken = req.cookies.refreshToken;

  if(!refreshToken){
    return res.status(400).json({ message: "refresh token is required for logout" });
  }

  try {
    await blackListTokenModel.create({
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
  } catch (err) {
    console.error("Error occurred while blacklisting refresh token:", err);
  }

  return res.json({ message: "user logged out successfully" });
}

/**
 * @name getmeController
 * @description get the details of the logged in user
 * @access Private
 * @param {*} req 
 * @param {*} res  
 */

async function getmeController(req,res) {
    const user = await userModel.findById(req.user.userId)
    return res.status(200).json({
        message: "user details fetched",
        user: {
            _id: user._id,
            username: user.username,
            email: user.email,
        }
    })
}
module.exports = {
  registerController,
  loginController,
  refreshTokenController,
  logoutController,
  getmeController
};

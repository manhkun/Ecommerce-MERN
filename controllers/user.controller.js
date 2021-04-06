const Users = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userCtrl = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const user = await Users.findOne({ email });
      if (user) return res.status(400).json({ msg: "The email already exist" });
      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: "Password is at least 6 characters" });

      // Password Encryption
      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = new Users({ name, email, password: hashPassword });

      // Save on mongodb
      await newUser.save();

      //Json web token
      const accessToken = createAccessToken({ id: newUser._id });
      const refreshToken = createRefreshToken({ id: newUser._id });

      res.cookie("refreshtoken", refreshToken, {
        httpOnly: true,
        path: "/user/refresh_token",
      });
      res.json({ accessToken });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await Users.findOne({ email });
      if(!user) return res.status(400).json({ msg: "User doesn't exist" });

      const isMatch = await bcrypt.compare(password, user.password);
      if(!isMatch) return res.status(400).json({ msg: "Password is incorrect" });

      // If success, create access token and refresh token
      const accessToken = createAccessToken({ id: user._id });
      const refreshToken = createRefreshToken({ id: user._id });

      res.cookie("refreshtoken", refreshToken, {
        httpOnly: true,
        path: "/user/refresh_token",
      });
      res.json({ accessToken });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie('refreshtoken', {
        path: '/user/refresh_token'
      });
      return res.json({msg: "Logout"});
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  refreshToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token)
        return res.status(400).json({ msg: "Please login or register" });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err)
          return res.status(400).json({ msg: "Please login or register" });
        const accesstoken = createAccessToken({ id: user.id });
        res.json({ accesstoken });
      });

      res.json({ rf_token });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select('-password');
      if(!user) return res.status(400).json({ msg: "User doesn't exist" });

      res.json(user);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }
};

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
};

const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

module.exports = userCtrl;


const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMaile = require("../middlewares/sendMail");
const Post = require("../models/postModel");
const User = require("../models/userModel");


// <========================= User Registration Profile =========================>

const registration = async (req, res) => {
  const { name, email, password } = req.body;

  const findUser = await User.findOne({ where:{ email: email} });
  if (findUser) {
    return res.status(400).json({ messages: "User already SignUp" });
  }



  const newUser = await User.create({
    name: name,
    email: email,
    password: password,
  });
  const secret = process.env.TOKEN;
  const payloade = {
    email: newUser.email,
    id: newUser.id,
  };
  const token = jwt.sign(payloade, secret, { expiresIn: "15m" });
  
  try {
    const link = `${process.env.URL_DOMIN}/api/verify/${ newUser.id}/${token}`;
    await sendMaile(newUser.email, "Email Verification", link);
    res.json({ messages: "send to email and verify your account" });
  } catch (error) {
    res.status(404).json({ messages: "Server Error" });
  }
};

//<========================= Verify Registration User =========================>

const verifyUser = async (req, res) => {
  const { id, token } = req.params;
  const findUser = await User.findOne({ where: { id: id } });

  if (!findUser) {
    return res.status(401).json({ messages: "Invalid link" });
  }
  const secret = process.env.TOKEN;
  try {
    jwt.verify(token, secret);

    await User.update( 
    { verified: true },
      {
        where: {
          id: id,
        },
      })
    res.render("veryfi");
  } catch (error) {
    res.status(400).json({ messages: "Invalid link" });
  }
};

 // <=========================== Login User =======================>

const login = async (req, res) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ where: { email: email } });
  
  if (!findUser) {
    return res.status(401).json({ messages: "User email is not SignUp" });
  }
  const UserValidPass = await bcrypt.compare(password, findUser.password);

  if (!UserValidPass) {
    return res.status(400).json({ messages: "User password is not valid" });
  }
  if (findUser.verified === "0" ) {
    return res.status(404).json({ messages: "User is not verified" });
  }

  const { id, name, email: userEmail } = findUser;

  console.log(findUser.verified);

  const userInfo = {
    id: id,
    name: name,
    email: userEmail,
  };

  const Token = jwt.sign(userInfo, process.env.TOKEN, { expiresIn: "1h" });

  const refreshToken = jwt.sign(userInfo, process.env.REFRESH_TOKEN, {
    expiresIn: "1y",
  });

  res.status(200).json({ token: Token, refreshToken: refreshToken });
};

 // <====================== User forgot Password =====================>

const forgotPassword = async (req, res) => {
  
  const findUser = await User.findOne({ where:{ email: req.body.email} });

  if (!findUser) {
    return res.status(401).json({ messages: "Email not registrared" });
  }
  const { id, email, password } = findUser;

  const secret = process.env.TOKEN + password;
  const payloade = {
    email: email,
    id: id,
  };

  const token = jwt.sign(payloade, secret, { expiresIn: "15m" });
  try {
    const link = `${process.env.URL_DOMIN}/api/reset-password/${id}/${token}`;
    sendMaile(email, "password reset", link);

    res.status(200).json({ messages: "Send email to reset your Password" });
  } catch (error) {
    res.status(404).json({ messages: "Not Found" });
  }
};

//  <======================== get User Reset Password ====================>
const getresetPassword = async (req, res) => {
  const { id, token } = req.params;
  const findUser = await User.findOne({ where:{ id:id} });
  if (findUser.id != id) {
    return res.status(400).json({ messages: "Invalid link" });
  }

  const secret = process.env.TOKEN + findUser.password;

  if (!jwt.verify(token, secret)) {
    return res.status(400).json({ messages: "Invalid link" });
  }

  try {
    res.render("reset-password", {
      email: findUser.email,
      title: "Reset Password",
    });
  } catch (error) {
    console.log(error.messages);
    res.status(400).json({ messages: "Invalid link" });
  }
};

 // <================= User Reset Password =======================>

const ResetPassword = async (req, res) => {
  const { id, token } = req.params;
  const findUser = await User.findOne({ where: { id: id }});

  if (findUser.id !=id) {
    return res.status(401).json({ messages: "User is not valid" });
  }

  const secret = process.env.TOKEN + findUser.password;

  if (!jwt.verify(token, secret)) {
    return res.status(400).json({ messages: "Invalid link" });
  }

  try {

    findUser.password = req.body.password;
    await findUser.save();

    res.render("sucess-or-invalid", {
      messages: "Password changed successfully",
      title: "Reset Password",
    });
  } catch (error) {
    res.status(400).json({ messages: "Invalid link" });
  }
};

//  <========================= User Logout =========================>

const logout = async (req, res) => {
  try {
    await res.clearCookie("token");
    await res.clearCookie("refreshToken");
    await res.localStorage.removeItem("token");
    res.status(200).json({ messages: "Logout successfully" });
  } catch (error) {
    res.status(400).json({ messages: "User not Logout" });
  }
};

// <========================= all user =========================>
const allUser = async (req, res) => {
  await User.findAll(
      {
          include: [{
              model: Post,
          }],
          attributes: ["id", "name", "email"],
      }
  ).then((users) => {
      res.status(200).json({  
          message: "All users",
          users,
      });
  }).catch((error) => {
      res.status(400).json({
          message: "Error getting all users",
          error,
      });
  }
  );  
}
// // <========================= Refresh Token  =========================>

// const refreshToken = (req, res) => {};

module.exports = {
  registration,
  login,
  getresetPassword,
  forgotPassword,
  ResetPassword,
  verifyUser,
//   refreshToken,
  logout,
  allUser,
};

const express = require("express");
const cors = require("cors");
const userRouter = require("./routers/userRouter");
const auth = require("./middlewares/authUser");
const { errorHandler } = require("./middlewares/errorMiddleware");
const sequelize = require("./config/db");
const postRouter = require("./routers/postRouter");
require("dotenv").config();
const app = express();


const port = process.env.PORT || 6000;

app.use( cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(errorHandler);


sequelize.sync({force:false}).then(result => {
  console.log("Mysql DataBase Sync Successfully");
}).catch(err => {
  console.log(err);
});


// Routing
app.use("/api", userRouter);
app.use("/post",postRouter);

app.get('/', auth, (req, res) => {
  console.log(req.user.id);
  res.send("yes")
})


// // Database Connection
// require("./DB/db");

// Server Connection
app.listen(port, () => {
  console.log(`Node Server is running on port ${port}`);
}
);

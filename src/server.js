require("express-async-errors");
require("dotenv/config");

const database = require("./database/sqlite");
const AppError = require("./utils/AppError");
const uploadConfig = require("./configs/upload");
const express = require("express");

const routes = require("./routes");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

app.use(routes);

database(); // Command for create user table

app.use((error, req, res, next) => {
  if (error instanceof AppError) {
    return res
      .status(error.statusCoded)
      .json({ status: "error", message: error.message });
  }

  console.error(error);

  return res.status(500).json({
    status: error,
    message: "Internal server error",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server runing on Port ${PORT}`);
});

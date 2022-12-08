const express = require("express");
const route = require("./Routes/routes.js")
const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
const app = express();
app.use(express.json());

mongoose
.connect(
  "mongodb+srv://ravisingh007ravi:Ravi1234@cluster0.w9hbwbb.mongodb.net/?retryWrites=true&w=majority",
  { UseNewUrlParser: true }
  )
  .then(() => console.log("Mongo-Db is connected"))
  .catch((err) => console.log(err.message));

app.use("/", route);

app.listen(process.env.PORT || 3000, function () {
  console.log("listening at " + (process.env.PORT || 3000));
});

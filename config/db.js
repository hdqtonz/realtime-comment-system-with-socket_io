const mongoose = require("mongoose");

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log("Successfully conenct with database");
  })
  .catch((e) => {
    console.log(e);
  });

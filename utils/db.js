const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/bebas", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// const contact1 = new Contact({
//   name: "Bayu Risma",
//   phone: "121000101",
//   email: "bayu@gmail.com",
// });

// contact1.save().then((result) => console.log(result));

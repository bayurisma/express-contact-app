const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const { body, validationResult, check } = require("express-validator");

const methodOverride = require("method-override");

const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");

require("./utils/db");
const Contact = require("./models/contact");

const app = express();
const port = 3000;

// Method Override setup
app.use(methodOverride("_method"));

// EJS Setup
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// flash configuration
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 60000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

// Home page

app.get("/", (req, res) => {
  const mahasiswa = [
    {
      name: "bayu",
      email: "bayugg@gmail.com",
    },
    {
      name: "jeni",
      email: "jenifer@gmail.com",
    },
    {
      name: "niko",
      email: "niko@gmail.com",
    },
  ];
  res.render("index", {
    greeting: "How's your day goin??",
    title: "Home page",
    mahasiswa,
    layout: "layouts/main-layout",
  });
});

// About page
app.get("/about", (req, res) => {
  res.render("about", {
    layout: "layouts/main-layout",
    title: "About page",
  });
});

// Contact page
app.get("/contact", async (req, res) => {
  const contacts = await Contact.find();

  res.render("contact", {
    layout: "layouts/main-layout",
    title: "Contact page",
    contacts,
    msg: req.flash("msg"),
  });
});

// add contact form page

app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    title: "Add contact form",
    layout: "layouts/main-layout",
  });
});

// process add data contact
app.post(
  "/contact",
  [
    body("name").custom(async (value) => {
      const duplicate = await Contact.findOne({ name: value });
      if (duplicate) {
        throw new Error("Name already exist!");
      }
      return true;
    }),
    check("email", "Email is not valid!").isEmail(),
    check("phone", "Phone number is not valid!").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("add-contact", {
        title: "Add contact form",
        layout: "layouts/main-layout",
        errors: errors.array(),
      });
    } else {
      Contact.insertMany(req.body, (err, result) => {
        req.flash("msg", "Data successfully added!");
        res.redirect("/contact");
      });
    }
  }
);

//delete contact
app.delete("/contact", (req, res) => {
  Contact.deleteOne({ _id: req.body._id }).then((result) => {
    req.flash("msg", "Data successfully deleted!");
    res.redirect("/contact");
  });
});

// edit contact page
app.get("/contact/edit/:name", async (req, res) => {
  const contact = await Contact.findOne({ name: req.params.name });

  res.render("edit-contact", {
    title: "Edit contact form",
    layout: "layouts/main-layout",
    contact,
  });
});

// processing data change
app.put(
  "/contact",
  [
    body("name").custom(async (value, { req }) => {
      const duplicate = await Contact.findOne({ name: value });
      if (value !== req.body.oldName && duplicate) {
        throw new Error("Name already exist!");
      }
      return true;
    }),
    check("email", "Email is not valid!").isEmail(),
    check("phone", "Phone number is not valid!").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("edit-contact", {
        title: "Edit contact form",
        layout: "layouts/main-layout",
        errors: errors.array(),
        contact: req.body,
      });
    } else {
      Contact.updateOne(
        { _id: req.body._id },
        {
          $set: {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
          },
        }
      ).then((result) => {
        req.flash("msg", "Data successfully updated!");
        res.redirect("/contact");
      });
    }
  }
);

//detail contact page
app.get("/contact/:name", async (req, res) => {
  const contact = await Contact.findOne({ name: req.params.name });

  res.render("detail", {
    layout: "layouts/main-layout",
    title: "Contact detail page",
    contact,
  });
});

app.listen(port, () => {
  console.log(
    `MongoDB Contact App server listening on http://localhost:${port}`
  );
});

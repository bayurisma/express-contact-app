const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const { loadContact, findContact, addContact, checkDuplicate, deleteContact, updateContacts } = require('./utils/contacts');
const { body, check, validationResult } = require('express-validator');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');

//Third-party middleware
app.use(expressLayouts);

//Built-in middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// flash configuration
app.use(cookieParser('secret'));
app.use(
  session({
    cookie: { maxAge: 60000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

// Home page

app.get('/', (req, res) => {
  const mahasiswa = [
    {
      name: 'bayu',
      email: 'bayugg@gmail.com',
    },
    {
      name: 'jeni',
      email: 'jenifer@gmail.com',
    },
    {
      name: 'niko',
      email: 'niko@gmail.com',
    },
  ];
  res.render('index', {
    greeting: "How's your day goin??",
    title: 'Home page',
    mahasiswa,
    layout: 'layouts/main-layout',
  });
});

// About page
app.get('/about', (req, res) => {
  res.render('about', {
    layout: 'layouts/main-layout',
    title: 'About page',
  });
});

// Contact page
app.get('/contact', (req, res) => {
  const contacts = loadContact();
  res.render('contact', {
    layout: 'layouts/main-layout',
    title: 'Contact page',
    contacts,
    msg: req.flash('msg'),
  });
});

// add contact form page

app.get('/contact/add', (req, res) => {
  res.render('add-contact', {
    title: 'Add contact form',
    layout: 'layouts/main-layout',
  });
});

// processing data contact
app.post(
  '/contact',
  [
    body('name').custom((value) => {
      const duplicate = checkDuplicate(value);
      if (duplicate) {
        throw new Error('Name already exist!');
      }
      return true;
    }),
    check('email', 'Email is not valid!').isEmail(),
    check('phone', 'Phone number is not valid!').isMobilePhone('id-ID'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('add-contact', {
        title: 'Add contact form',
        layout: 'layouts/main-layout',
        errors: errors.array(),
      });
    } else {
      addContact(req.body);
      req.flash('msg', 'Data successfully added!');
      res.redirect('/contact');
    }
  }
);

//delete contact
app.get('/contact/delete/:name', (req, res) => {
  const contact = findContact(req.params.name);

  if (!contact) {
    res.status(404);
    res.send('<h1>404 Not Found</h1>');
  } else {
    deleteContact(req.params.name);
    req.flash('msg', 'Data successfully deleted!');
    res.redirect('/contact');
  }
});

// edit contact page
app.get('/contact/edit/:name', (req, res) => {
  const contact = findContact(req.params.name);

  res.render('edit-contact', {
    title: 'Edit contact form',
    layout: 'layouts/main-layout',
    contact,
  });
});

// processing data change
app.post(
  '/contact/update',
  [
    body('name').custom((value, { req }) => {
      const duplicate = checkDuplicate(value);
      if (value !== req.body.oldName && duplicate) {
        throw new Error('Name already exist!');
      }
      return true;
    }),
    check('email', 'Email is not valid!').isEmail(),
    check('phone', 'Phone number is not valid!').isMobilePhone('id-ID'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('edit-contact', {
        title: 'Edit contact form',
        layout: 'layouts/main-layout',
        errors: errors.array(),
        contact: req.body,
      });
    } else {
      updateContacts(req.body);
      req.flash('msg', 'Data successfully updated!');
      res.redirect('/contact');
    }
  }
);

//detail contact page
app.get('/contact/:name', (req, res) => {
  const contact = findContact(req.params.name);
  res.render('detail', {
    layout: 'layouts/main-layout',
    title: 'Contact detail page',
    contact,
  });
});

app.use('/', (req, res) => {
  res.status(404);
  res.send('<h1>404 Not Found</h1>');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

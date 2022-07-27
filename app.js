const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const { loadContact, findContact } = require('./utils/contacts');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');

//Third-party middleware
app.use(expressLayouts);

//Built-in middleware
app.use(express.static('public'));

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

app.get('/about', (req, res) => {
  res.render('about', {
    layout: 'layouts/main-layout',
    title: 'About page',
  });
});

app.get('/contact', (req, res) => {
  const contacts = loadContact();
  res.render('contact', {
    layout: 'layouts/main-layout',
    title: 'Contact page',
    contacts,
  });
});

app.get('/contact/:name', (req, res) => {
  const contact = findContact(req.params.name);
  res.render('detail', {
    layout: 'layouts/main-layout',
    title: 'Contact detail page',
    contact,
  });
});

app.get('/product/:id', (req, res) => {
  res.send(`Product ID: ${req.params.id}`);
});

app.use('/', (req, res) => {
  res.status(404);
  res.send('<h1>404 Not Found</h1>');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

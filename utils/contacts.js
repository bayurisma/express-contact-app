const fs = require('fs');
const { builtinModules } = require('module');

// membuat directory dan data baru
const dirPath = './data';
const dataPath = './data/contacts.json';

if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, '[]', 'utf-8');
}

const loadContact = () => {
  const file = fs.readFileSync('data/contacts.json', 'utf-8');
  const contacts = JSON.parse(file);
  return contacts;
};

// cari contact berdasarkan nama
const findContact = (name) => {
  const contacts = loadContact();

  const contact = contacts.find((contact) => contact.name.toLowerCase() === name.toLowerCase());
  return contact;
};

module.exports = { loadContact, findContact };

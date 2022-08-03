const fs = require('fs');
const { builtinModules } = require('module');
const axios = require('axios');

// membuat directory dan data baru
const dirPath = './data';
const dataPath = './data/contacts.json';

const fetchContact = async () => {
  let res = await axios.get('https://jsonplaceholder.typicode.com/users');
  fs.writeFileSync(dataPath, JSON.stringify(res.data), 'utf-8');
};

if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}
if (!fs.existsSync(dataPath)) {
  fetchContact();
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

// menimpa file contacts.json dengan data baru
const saveContacts = (contacts) => {
  fs.writeFileSync('data/contacts.json', JSON.stringify(contacts));
};

// menambahkan contact baru
const addContact = (contact) => {
  const contacts = loadContact();
  contacts.push(contact);
  saveContacts(contacts);
};

// memeriksa data kontak duplikat
const checkDuplicate = (name) => {
  const contacts = loadContact();
  return contacts.find((contact) => contact.name === name);
};

// menghapus data kontak
const deleteContact = (name) => {
  const contacts = loadContact();
  const filteredContacts = contacts.filter((contact) => contact.name !== name);
  saveContacts(filteredContacts);
};

// mengubah data kontak
const updateContacts = (newContact) => {
  const contacts = loadContact();
  const filteredContacts = contacts.filter((contact) => contact.name !== newContact.oldName);
  delete newContact.oldName;
  filteredContacts.push(newContact);
  saveContacts(filteredContacts);
};

module.exports = { loadContact, findContact, addContact, checkDuplicate, deleteContact, updateContacts };

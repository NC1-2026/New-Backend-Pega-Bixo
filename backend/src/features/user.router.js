const express = require('express');

const router = express.Router();
const users = [];
let nextId = 1;

router.get('/', (req, res) => {
  res.json(users);
});

router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((item) => item.id === id);

  if (!user) {
    return res.status(404).json({ message: `Usuario ${id} nao encontrado` });
  }

  return res.json(user);
});

router.post('/', (req, res) => {
  const user = { id: nextId++, ...req.body };
  users.push(user);
  res.status(201).json(user);
});

router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = users.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: `Usuario ${id} nao encontrado` });
  }

  users[index] = { id, ...req.body };
  return res.json(users[index]);
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = users.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: `Usuario ${id} nao encontrado` });
  }

  users.splice(index, 1);
  return res.status(204).send();
});

module.exports = router;


const users = [];
let nextId = 1;

function findAll(req, res) {
  return res.json(users);
}

function findOne(req, res) {
  const id = Number(req.params.id);
  const user = users.find((item) => item.id === id);

  if (!user) {
    return res.status(404).json({ message: `Usuario ${id} nao encontrado` });
  }

  return res.json(user);
}

function create(req, res) {
  const user = { id: nextId++, ...req.body };
  users.push(user);
  return res.status(201).json(user);
}

function update(req, res) {
  const id = Number(req.params.id);
  const index = users.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: `Usuario ${id} nao encontrado` });
  }

  users[index] = { id, ...req.body };
  return res.json(users[index]);
}

function remove(req, res) {
  const id = Number(req.params.id);
  const index = users.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ message: `Usuario ${id} nao encontrado` });
  }

  users.splice(index, 1);
  return res.status(204).send();
}

module.exports = {
  findAll,
  findOne,
  create,
  update,
  remove,
};

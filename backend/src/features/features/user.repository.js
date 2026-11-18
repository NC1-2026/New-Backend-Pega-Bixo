const users = [];
let nextId = 1;

function findAll() {
  return users;
}

function findById(id) {
  return users.find((user) => user.id === id);
}

function create(data) {
  const user = { id: nextId++, ...data };
  users.push(user);
  return user;
}

function update(id, data) {
  const index = users.findIndex((user) => user.id === id);

  if (index === -1) {
    return null;
  }

  users[index] = { id, ...data };
  return users[index];
}

function remove(id) {
  const index = users.findIndex((user) => user.id === id);

  if (index === -1) {
    return false;
  }

  users.splice(index, 1);
  return true;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};

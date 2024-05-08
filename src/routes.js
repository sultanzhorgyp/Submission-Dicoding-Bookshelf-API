const {
    handlerAmbilSemuaBuku,
    handlerAmbilBuku,
    handlerUbahBuku,
    handlerTambahBuku,
    handlerHapusBuku,
  } = require('./handler');

  const routes = [
    {
      method: 'POST',
      path: '/books',
      handler: handlerTambahBuku,
    },
    {
      method: 'PUT',
      path: '/books/{id}',
      handler: handlerUbahBuku,
    },
    {
      method: 'GET',
      path: '/books',
      handler: handlerAmbilSemuaBuku,
    },
    {
      method: 'GET',
      path: '/books/{id}',
      handler: handlerAmbilBuku,
    },
    {
      method: 'DELETE',
      path: '/books/{id}',
      handler: handlerHapusBuku,
    },
  ];
  module.exports = routes;
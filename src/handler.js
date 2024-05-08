const books = require('./books');
const {nanoid} = require('nanoid');
const handlerTambahBuku = (request, h) => {
    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    } = request.payload;
    if (!name) {
      return h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi name buku',
      }).code(400);
    }
  
    if (readPage > pageCount) {
      return h.response({
        status: 'fail',
        message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      }).code(400);
    }
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;
    const newBook = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      insertedAt,
      updatedAt,
    };
    books.push(newBook);
    const isSuccess = books.filter((book) => book.id === id).length > 0;
    if (isSuccess) {
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      });
      response.code(201);
      return response;
    }
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
  };

  const handlerAmbilSemuaBuku = (request, h) => {
    const {query} = request;
  
    let filteredBooks = [...books];
  
    // Filter berdasarkan name (case insensitive)
    if (query.name) {
      const searchname = query.name.toLowerCase();
      filteredBooks = filteredBooks.filter((book) =>
        book.name.toLowerCase().includes(searchname),
      );
    }
  
    // Filter berdasarkan status reading
    if (query.reading === '0' || query.reading === '1') {
      const readingValue = query.reading === '1';
      filteredBooks = filteredBooks.filter(
          (book) => book.reading === readingValue,
      );
    }
  
    // Filter berdasarkan status finished
    if (query.finished === '0' || query.finished === '1') {
      const finishedValue = query.finished === '1';
      filteredBooks = filteredBooks.filter(
          (book) => book.finished === finishedValue,
      );
    }
  
    const response = {
      status: 'success',
      data: {
        books: filteredBooks.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    };
  
    return h.response(response).code(200);
  };

  const handlerAmbilBuku = (request, h) => {
    const {id} = request.params;
    const book = books.filter((n) => n.id === id)[0];
    if (book !== undefined) {
      return {
        status: 'success',
        data: {
          book,
        },
      };
    }
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  };

  const handlerUbahBuku = (request, h) => {
    const {id} = request.params;
    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    } = request.payload;
    if (!name) {
      return h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi name buku',
      }).code(400);
    }
  
    if (readPage > pageCount) {
      return h.response({
        status: 'fail',
        message:
        'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      }).code(400);
    }
    const updatedAt = new Date().toISOString();
    const index = books.findIndex((book)=>book.id===id);
    if (index !== -1) {
      books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished: pageCount === readPage,
        reading,
        updatedAt,
      };
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      });
      response.code(200);
      return response;
    }
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  };

  const handlerHapusBuku = (request, h) => {
    const {id} = request.params;
    const index = books.findIndex((book)=>book.id==id);
    if (index!==-1) {
      books.splice(index, 1);
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      });
      response.code(200);
      return response;
    }
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  };
  module.exports = {
    handlerAmbilSemuaBuku,
    handlerAmbilBuku,
    handlerTambahBuku,
    handlerUbahBuku,
    handlerHapusBuku,
  };
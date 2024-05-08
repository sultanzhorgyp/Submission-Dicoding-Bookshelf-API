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
        message: 'Failed to update the book. Please fill in the name of the book',
      }).code(400);
    }
  
    if (readPage > pageCount) {
      return h.response({
        status: 'fail',
        message:
        'Failed to update the book. readPage cannot be greater than pageCount',
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
        message: 'Book added successfully',
        data: {
          bookId: id,
        },
      });
      response.code(201);
      return response;
    }
    const response = h.response({
      status: 'fail',
      message: 'Book failed to add',
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
      message: 'Book not found',
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
        message: 'Failed to update the book. Please fill in the name of the book',
      }).code(400);
    }
  
    if (readPage > pageCount) {
      return h.response({
        status: 'fail',
        message:
        'Failed to update the book. readPage cannot be greater than pageCount',
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
        message: 'The book was updated successfully',
      });
      response.code(200);
      return response;
    }
    const response = h.response({
      status: 'fail',
      message: 'Failed to update the book. Id not found',
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
        message: 'The book has been successfully deleted',
      });
      response.code(200);
      return response;
    }
    const response = h.response({
      status: 'fail',
      message: 'Book failed to delete. Id not found',
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
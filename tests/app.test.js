const request = require('supertest');
const app = require('../src/app');
const pool = require('../src/db');

// Mock del pool de conexiones
jest.mock('../src/db', () => ({
  query: jest.fn(),
  execute: jest.fn(),
}));

describe('API Libros', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. GET /health
  test('GET /health devuelve 200 y status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  // 2. POST /libros creación válida
  test('POST /libros crea un libro y devuelve 201', async () => {
    pool.execute.mockResolvedValue([{ insertId: 1 }]);
    const res = await request(app)
      .post('/libros')
      .send({ titulo: 'Test', autor: 'Autor', anio_publicacion: 2020 });
    expect(res.statusCode).toBe(201);
    expect(res.body.titulo).toBe('Test');
  });

  // 3. POST /libros datos inválidos
  test('POST /libros con datos inválidos devuelve 400', async () => {
    const res = await request(app)
      .post('/libros')
      .send({ titulo: '', autor: 'Autor' }); // falta año, título vacío
    expect(res.statusCode).toBe(400);
  });

  // 4. GET /libros/:id libro inexistente
  test('GET /libros/:id devuelve 404 si no existe', async () => {
    pool.execute.mockResolvedValue([[]]); // array vacío
    const res = await request(app).get('/libros/999');
    expect(res.statusCode).toBe(404);
  });
});
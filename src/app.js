require('dotenv').config();
const express = require('express');
const pool = require('./db');
const app = express();

app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'api-libros' });
});

// GET todos los libros
app.get('/libros', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM libros');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno' });
  }
});

// GET un libro por ID
app.get('/libros/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM libros WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Libro no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno' });
  }
});

// POST crear libro
app.post('/libros', async (req, res) => {
  const { titulo, autor, anio_publicacion } = req.body;

  if (!titulo || !autor || !Number.isInteger(anio_publicacion)) {
    return res.status(400).json({ error: 'Datos inválidos. Título y autor requeridos, año debe ser entero.' });
  }

  try {
    const [result] = await pool.execute(
      'INSERT INTO libros (titulo, autor, anio_publicacion) VALUES (?, ?, ?)',
      [titulo, autor, anio_publicacion]
    );
    res.status(201).json({ id: result.insertId, titulo, autor, anio_publicacion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno' });
  }
});

// PUT actualizar libro
app.put('/libros/:id', async (req, res) => {
  const { titulo, autor, anio_publicacion } = req.body;
  if (!titulo || !autor || !Number.isInteger(anio_publicacion)) {
    return res.status(400).json({ error: 'Datos inválidos' });
  }

  try {
    const [result] = await pool.execute(
      'UPDATE libros SET titulo = ?, autor = ?, anio_publicacion = ? WHERE id = ?',
      [titulo, autor, anio_publicacion, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Libro no encontrado' });
    res.json({ id: req.params.id, titulo, autor, anio_publicacion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno' });
  }
});

// DELETE eliminar libro
app.delete('/libros/:id', async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM libros WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Libro no encontrado' });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno' });
  }
});

// Solo iniciar el servidor cuando se ejecute directamente (no en pruebas)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`API corriendo en puerto ${PORT}`));
}

module.exports = app;
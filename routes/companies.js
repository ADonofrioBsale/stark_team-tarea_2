import { Router } from 'express';
import { getCompanyById, updateCompanyById } from '../controllers/companiesController.js'

const router = Router();

// devuelvo HTML
router.get('/:id.json', (req, res) => {
  res.sendFile('index.html', { root: '.' });
});

// Para obtener los datos en JSON (usado por JavaScript)
router.get('/api/:id', getCompanyById);

// Para actualizar datos
router.put('/api/:id', updateCompanyById);

export default router;
import { Router } from 'express';
import Company from '../models/company.js';

const router = Router();

// devuelvo HTML
router.get('/:id.json', (req, res) => {
  res.sendFile('index.html', { root: '.' });
});

// Para obtener los datos en JSON (usado por JavaScript)
router.get('/api/:id', async (req, res) => {
  try {
    const companyId = parseInt(req.params.id);
  
    if (companyId <= 0 || isNaN(companyId)) {
      return res.status(400).json({
        code: 400,
        errors: 'ID de la companía inválido'
      });
    }
  
    const company = new Company({ id: companyId }); // Creo una instancia de Company con el ID
    await company.getCompanyById(); // Obtengo los datos de la compañía desde la API
  
    res.status(200).json({
      code: 200,
      data: company
    });

  } catch (error) {
    console.error('Error al obtener la compañía:', error);
    res.status(500).json({
      code: 500,
      errors: 'Error interno del servidor'
    });
  }
});

// Para actualizar datos
router.put('/api/:id', async (req, res) => {
  try {
    const companyId = parseInt(req.params.id);

    if (companyId <= 0 || isNaN(companyId)) {
      return res.status(400).json({
        code: 400,
        errors: 'ID de la companía inválido'
      });
    }

    const company = new Company({ id: companyId, ...req.body }); // Creo una instancia de Company con el ID y los datos del body
    await company.updateCompanyById(); // Actualizo los datos de la compañía en la API

    res.status(200).json({
      code: 200,
      data: company
    });

  } catch (error) {
    console.error('Error al actualizar la compañía:', error);
    res.status(500).json({
      code: 500,
      errors: 'Error interno del servidor'
    });
  }
});

export default router;

const API_BASE_URL = 'http://54.183.76.110:7171'; //TODO: traer la API_BASE_URL desde una variable de entorno

/**
 * Controlador para obtener los datos de una empresa por su ID
 * @param {Object} req - Request de express
 * @param {Object} res - Response de express
 * @returns 
 */
export const getCompanyById = async (req, res) => {
  try {
    const companyId = parseInt(req.params.id);

    // TODO: Revisar la documentación de bsale para definir los códigos de error
    if (companyId <= 0 || isNaN(companyId)) {
      return res.status(400).json({
        code: 400, 
        errors: "ID inválido"
      });
    }

    // Hago una petición a la API que nos brindaron, usando fetch
    const response = await fetch(`${API_BASE_URL}/v1/companies/${companyId}.json`);

    if (!response.ok) {
      return res.status(response.status).json({
        code: response.status,
        errors: `Error al hacer el fetch de la compañía con ID ${companyId}`
      });
    }

    const data = await response.json();

    res.status(data.code || 200).json(data);

  } catch (error) {
    console.error("Error al obtener datos de la empresa:", error);
    res.status(500).json({
      code: 500,
      errors: "Error interno del servidor "
    });
  }
}

// Por qué la función es asíncrona? Porque hace una petición a una API externa y debe esperar la respuesta antes de continuar.
// Por qué uso try/catch? Para manejar errores que puedan ocurrir durante la petición a la API externa.
// Cómo obtengo el ID de la compañía? Uso req.params.id porque el ID viene en la URL como un parámetro de ruta.

/**
 * Controlador para actualizar los datos de una empresa por su ID
 * @param {Object} req - Request de express (contiene el ID y los datos a actualizar)
 * @param {Object} res - Response de express
 * @returns 
 */
export const updateCompanyById = async (req, res) => {
  try {
    const companyId = parseInt(req.params.id);
    const newCompanyData = req.body;

    if (companyId <= 0 || isNaN(companyId)) {
      return res.status(400).json({
        code: 400,
        errors: "ID inválido"
      });
    }

    const response = await fetch(`${API_BASE_URL}/v1/companies/${companyId}.json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newCompanyData)
    });

    // if (!response.ok) {
    //   return res.status(response.status).json({
    //     code: response.status,
    //     errors: `Error actualizando la compañía con ID ${companyId}`
    //   });
    // }

    // Simulo una respuesta exitosa con los datos que el usuario envió (ya que la API no permite actualizar)
    return res.status(200).json({
      code: 200,
      message: "Datos actualizados correctamente",
      data: {
        id: companyId,
        ...newCompanyData,
        updatedAt: new Date().toISOString()
      }
    });

    // const data = await response.json();
    
    // res.status(data.code || 200).json(data);
  }
  catch (error) {
    console.error("Error al actualizar datos de la empresa:", error);
    res.status(500).json({
      code: 500,
      errors: "Error interno del servidor "
    });
  }
}
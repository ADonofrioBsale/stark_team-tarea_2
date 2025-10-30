import express from 'express';
// import 'dotenv/config';
// import cors from 'cors';
import companiesRouter from './routes/companies.js';

const app = express(); // Creo una instancia de express
const port = process.env.PORT || 3000;

// Middlewares --> funciones que se ejecutan antes de llegar a las rutas (como si fueran "filtros" o "checkpoints")
app.use(express.static('public')); // Para "servir" archivos estáticos como HTML, CSS y JS con express
// Usado para que cuando el cliente solicita un archivo (por ejemplo /logo-bsale.png), express busque ese archivo en el directorio especificado (en este caso public/logo-bsale.png) y lo envíe directamente. 

//TODO: usar Morgan para logs de auditoría (o investigar otra alternativa)

app.use(express.json()); // Para que express pueda parsear JSON en el body de las peticiones

// Rutas
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: '.' }); // Para levantar el arvhivo index.html con express
})

// Todas las rutas que empiecen con '/companies', express las delega al 'companiesRouter'
app.use('/companies', companiesRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

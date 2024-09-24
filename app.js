import express from 'express';
import inventoryRoutes from './routes/inventoryRoutes.js';
import authRoutes from './routes/authRoutes.js';
import dashboard from './routes/dashboardRoutes.js';
import index from './routes/indexRoutes.js';
import hr from './routes/hrRoutes.js';
import db from './config/db.js';
//const Producto = require('./models/Producto');
//import { Producto } from './models/Producto.js';

const app = express(); // Crea la app
//const db = require('./config/db.js');

try{
    await db.authenticate();
    db.sync();
    console.log('Conectado a la base de datos');
} catch(error){
    console.log(error);
}

app.set('view engine', 'pug')
app.set('views', './views')

app.use( (express.static('public')) ) 

app.use(express.urlencoded({extended: true}));

app.use('/inventory', inventoryRoutes); //app.get('/', usuarioRoutes);
app.use('/auth', authRoutes);
app.use('/dashboard', dashboard);
app.use('/hr', hr);
app.use('/', index);


// Puerto
const port = 3000;
app.listen(port, () => {
    console.log(`El servidor esta funcionando en el puerto ${port}`);
}  );
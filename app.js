import express from 'express';

import authRoutes from './routes/authRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import financesRoutes from './routes/financesRoutes.js';
import configRoutes from './routes/configRoutes.js';
import hrRoutes from './routes/hrRoutes.js';
import dashboard from './routes/dashboardRoutes.js';
import index from './routes/indexRoutes.js';
import db from './config/db.js';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import {PORT} from './config.js';

const app = express();

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
app.use(express.json());
app.use( cookieParser() );
app.use( csrf({ cookie: true }) );

app.use('/autenticacion', authRoutes);
app.use('/dashboard', dashboard);
app.use('/', index);

app.use('/recursos_humanos', hrRoutes);
app.use('/inventario', inventoryRoutes); 
app.use('/finanzas', financesRoutes);

app.use('/configuraciones', configRoutes)

app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
}  );
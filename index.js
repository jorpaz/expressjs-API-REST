const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
const cors = require('cors');
const routerApi = require('./routes');
const https = require("https");
const { logErrors, errorHandler, boomErrorHandler } = require('./middlewares/errorHandler');
const path = require('path');


const port = process.env.PORT || 3000;

app.use(express.json());

//Esto es para el acceso a nuestra API  que le queramos dar a otras apps u otros sitios web. Esto es porque nuestra API no es pública, de lo contrario solo es necesraia la línea 26.
const whiteList = [
  'http://localhost:3000',
  'https://express-api-q41z.onrender.com'
];
const options = {
  origin: (origin, callback) => {
    if (whiteList.includes(origin) || !origin){
      callback(null, true);
    } else {
      callback(new Error('No tiene permitido el acceso a esta API'));
    }
  }
}
app.use(cors(options));

/*app.get('/', (req, res) => {
  res.send('Hola, este es mi server en Express');
});*/

app.get('/', (req, res) => {
  //res.send('Hola, este es mi server en Express');
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/nueva-ruta', (req, res) => {
  res.send('Hola, soy una nueva ruta');
});

routerApi(app);

app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log('Mi port ' + port);
  console.log('SEGUNDA PRUEBA');
});

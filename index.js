const express = require('express');
const cors = require('cors');
const routerApi = require('./routes');
const { logErrors, errorHandler, boomErrorHandler } = require('./middlewares/errorHandler');
const https = require("https");

const app = express();
const port = 3000;

app.use(express.json());

//Esto es para el acceso a nuestra API  que le queramos dar a otras apps u otros sitios web. Esto es porque nuestra API no es pública, de lo contrario solo es necesraia la línea 26.
const whiteList = [
  'http://localhost:8080',
  'https://myapp.com.ejemplo',
  'https://otraapp.com.ejemplo'
];
const options = {
  origin: (origin, callback) => {
    if (whiteList.includes() || !origin){
      callback(null, true);
    } else {
      callback(new Error('No tiene permitido el acceso a esta API'));
    }
  }
}
app.use(cors(options));

app.get('/', (req, res) => {
  res.send('Hola, este es mi server en Express');
});

app.get('/nueva-ruta', (req, res) => {
  res.send('Hola, soy una nueva ruta');
});

routerApi(app);

app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log('Mi port ' + port);
});

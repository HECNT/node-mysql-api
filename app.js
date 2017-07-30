var express     = require ('express')
    app         = express()
    mysql       = require('mysql')
    connection  = require('./server/models/main.js')
    bodyParser  = require('body-parser')
    json2xls    = require('json2xls')
    fs          = require('fs')

app.get('/home', function (req, res) {
  res.sendFile(__dirname + '/client/views/index.html')
})

app.use(bodyParser.json());
app.use(bodyParser());

app.use(express.static(__dirname + '/public'))

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// GET
app.get('/get-all', getAll)
app.get('/get-lenguaje', getLenguaje)
app.get('/get-download', getDownload)

// POST
app.post('/set-new-dev', setNewDev)
app.post('/set-delete', setDelete)
app.post('/set-update', setUpdate)

function getAll (req, res) {

  connection.query(`

    SELECT
      p1.programador_id,
    	p1.nombre,
    	p1.ap,
    	p1.am,
    	p1.lenguaje_id,
    	p1.pais,
    	l1.nombre AS lenguaje_nombre,
      p1.edad
    FROM
    	programador AS p1
    LEFT JOIN
    	lenguaje AS l1
    ON
    	p1.lenguaje_id = l1.lenguaje_id

    `, function (error, results, fields) {
    if (error) throw error;
    res.json(results)
  });

}

function getLenguaje (req, res) {
  connection.query(`

    SELECT
      *
    FROM
      lenguaje

    `, function (err, result, fields){
      if (err) {
        console.log('Hubo un error getLenguaje');
      } else {
        res.json(result)
      }
  })
}

function setNewDev (req, res) {
  var d = req.body
  connection.query(`
      INSERT INTO
        programador (nombre, ap, am, lenguaje_id, pais, edad)
      VALUES
        (? ,? ,? ,?, ?, ?)

    `, [d.nombre, d.ap, d.am, d.lenguaje_nombre, d.pais, d.edad], function (err, result, fields){
    if (err) {
      console.log(err);
      console.log('Hubo un error al tratar de insertar');
    } else {
      res.json(result)
    }
  })
}

function setDelete (req, res) {
  var d = req.body
  connection.query(`

      DELETE FROM
        programador
      WHERE
        programador_id = ?

    `, [d.programador_id], function (err, result, fields){
    if (err) {
      console.log(err, 'Hubo un error setDelete');
    } else {
      res.json(result)
    }
  })
}

function getDownload (req, res) {
  connection.query(`

    SELECT
      p1.programador_id,
    	p1.nombre,
    	p1.ap,
    	p1.am,
    	p1.lenguaje_id,
    	p1.pais,
    	l1.nombre AS lenguaje_nombre,
      p1.edad
    FROM
    	programador AS p1
    LEFT JOIN
    	lenguaje AS l1
    ON
    	p1.lenguaje_id = l1.lenguaje_id

    `, function (error, results, fields) {
    if (error) throw error;
    var xls = json2xls(results);

    fs.writeFileSync('./public/upload/programador.xlsx', xls, 'binary');
    res.json(1)
  });
}

function setUpdate (req, res) {
  var d = req.body
  console.log(d,'dddddddd');
  connection.query(`

    UPDATE
      programador
    SET
      nombre          = ?,
      ap              = ?,
      am              = ?,
      lenguaje_id     = ?,
      pais            = ?,
      edad            = ?
    WHERE
      programador_id  = ?

    `,[d[0].nombre, d[0].ap, d[0].am, d[0].lenguaje_id, d[0].pais, d[0].edad, d[0].lenguaje_id],function (err, result, fields){
      if (err) {
        console.log('Hubo un error setUpdate', err);
      } else {
        res.json(result)
      }
    })
}

app.listen(3001, function () {
  console.log('Escuchando en el puerto 3001');

})

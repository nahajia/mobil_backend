const express = require('express')
var cors = require('cors')
var mysql=require('mysql')
const multer = require('multer');
const bodyParser = require('body-parser');

const app = express()
const port = 3000
var connection;
function kapcsolat(){
 connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'marveladatb'
  })
  
  connection.connect()
}



app.use(cors())
app.use(express.json())
app.use(express.static('kepek'))
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.get('/film', (req, res) => {
kapcsolat()
connection.query('SELECT * from film', (err, rows, fields) => {
  if (err) throw err

  console.log(rows)
  res.send(rows)
})

connection.end()

  })

  app.get('/segedtabla', (req, res) => {
    kapcsolat()
    connection.query('SELECT * from segedtabla', (err, rows, fields) => {
      if (err) throw err
    
      console.log(rows)
      res.send(rows)
    })
    
    connection.end()
    
      })


app.post('/felvitel', (req, res) => {
kapcsolat() 
connection.query(`insert into szavazat values (null,${req.body.bevitel1})`, (err, rows, fields) => {
  if (err) {
    console.log("Hiba")
    res.send("Hiba")
  }
  else{
    console.log("Sikeres felvitel")
    res.send("Sikeres felvitel")
  }

  
})

connection.end()

  })


//INSERT INTO film VALUES (NULL, 'alma', 2023, '1.jpg');
/*
app.post('/felvitelfilm', (req, res) => {
  kapcsolat()
  
  connection.query(`INSERT INTO film VALUES (NULL, 'alma', 2023, '1.jpg')`, (err, rows, fields) => {
  if (err){
    console.log("Hiba")
    res.send("Hiba")
  }
  else{
    console.log("Sikeres felvitel")
    res.send("Sikeres felvitel")
  }
    })
  connection.end() 
  })
*/



//-------------------------------képfeltöltés programrésze
const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, './kepek');
  },
  filename(req, file, callback) {
    callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });
app.post('/api/upload', upload.array('photo', 3), (req, res) => {
  console.log('file', req.files);
  console.log('body', req.body);
//---------------------adatb-be való felvitel
kapcsolat()
  
connection.query(`INSERT INTO film VALUES (NULL, '${req.body.bevitel1}', 2023, '${req.files[0].filename}')`, (err, rows, fields) => {
if (err){
  console.log("Hiba")
  res.send("Hiba")
}
else{
  console.log("Sikeres felvitel")
  res.send("Sikeres felvitel")
}
  })
connection.end() 
//---------------------adatbbe felvitel VÉGE
 
});


//-------------------------------képfeltöltés programrész VÉGE




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

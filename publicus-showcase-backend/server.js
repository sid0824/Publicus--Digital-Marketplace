import express from 'express'
import router from "./routes";
var cors = require("cors");
import path from 'path';
import DB from './db';
//ROUTER

//SERVER
const app = express();


app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '..', 'publicus-showcase-ui', 'build')));
//app.use(express.static('public'));
app.use(router);

console.log(path.join(__dirname, '..', 'publicus-showcase-ui', 'build'));


const port = process.env.PORT || 9000;
app.listen(port, () => console.log(`Server listening on port: ${port}`));

// app.get('/api/newReg', (req, res) => {
//   let utc = new Date().toJSON().slice(0,10).replace(/-/g,'/');
//   let reg = {Date: utc, FirstName: "Joe", LastName: "Smith",MedicalProfessional: false};
//   let sql = 'INSERT INTO stats SET ?';
//   let query = db.query(sql, reg, (err, result) => {
//       if(err) throw err;
//       console.log(result);
//       res.send("Posted");
//   });
// });



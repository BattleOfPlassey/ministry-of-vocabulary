require('dotenv').config();
const express = require("express");
const fs = require("fs");
const sqlite = require("sql.js");
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
// require('dotenv').config();

const articles = require('./routes/articlesRoute.js');

const config = require('./config.js');


const MONGODB_URI = process.env.mongodburi;


mongoose.connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
});
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});
mongoose.connection.on('error', (error) => {
    console.log(error);
});


const filebuffer = fs.readFileSync("db/data.sqlite");

const db = new sqlite.Database(filebuffer);
const users = require('./routes/usersRoute.js');

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.set("port", process.env.PORT || 3001);
// console.log(process.env.PORT);
// Express only serves static assets in production
// if (process.env.NODE_ENV === "production") {
  
//   app.use(express.static("client/build"));
// }



const COLUMNS = [
  "Word",
  "Meaning",
  "Mneomonic",
  "Usage"
];
app.get("/api/word", (req, res) => {
  const param = req.query.q;

  if (!param) {
    res.json({
      error: "Missing required parameter `q`"
    });
    return;
  }
// console.log("Printing Q Params",param)
  // WARNING: Not for production use! The following statement
  // is not protected against SQL injections.
  const r = db.exec(
    `
    select ${COLUMNS.join(", ")} from WordBook1_Autosaved
    where Word like '${param}%'
    limit 100
  `
  );
  // console.log("Printing Query Result",r[0].values)

  if (r[0]) {
    res.json(
      r[0].values.map(entry => {
        const e = {};
        
        COLUMNS.forEach((c, idx) => {
          e[c] = entry[idx];
        });
        return e;
      })
    );
  } else {
    res.json([]);
  }
});



app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === 'OPTIONS') {
      res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, GET");
      return res.status(200).json({});
  }
  next();
});


app.use('/api/users', users);
app.use('/api/articles', articles);

if (process.env.NODE_ENV === 'production') {
  // app.use(express.static(path.join(__dirname, 'build')));
    // app.get('/*', (req, res) => {
    // res.sendFile(path.join(__dirname, 'build', 'index.html')); 
  //});
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/build/index.html'));
  });
}

app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});

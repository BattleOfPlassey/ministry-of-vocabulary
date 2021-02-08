require('dotenv').config();
const express = require("express");
const fs = require("fs");
const sqlite = require("sql.js");
const dotenv = require('dotenv');

const filebuffer = fs.readFileSync("db/data.sqlite");

const db = new sqlite.Database(filebuffer);

const app = express();

app.set("port", process.env.PORT || 3001);
// console.log(process.env.PORT);
// Express only serves static assets in production
if (process.env.NODE_ENV === "production") {
  
  app.use(express.static("client/build"));
}

// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, 'build')));
//   app.get('/*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'build', 'index.html'));
//   });
// }

const COLUMNS = [
  "Word",
  "Meaning",
  "Mneomonic",
  "Usage"
];
app.get("/api/food", (req, res) => {
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
    where Word like '%${param}%'
    limit 100
  `
  );
  // console.log("Printing Query Result",r[0].values)

  if (r[0]) {
    res.json(
      r[0].values.map(entry => {
        const e = {};
        COLUMNS.forEach((c, idx) => {
          // combine fat columns
          if (c.match(/^fa_/)) {
            e.fat_g = e.fat_g || 0.0;
            e.fat_g = (parseFloat(e.fat_g, 10) +
              parseFloat(entry[idx], 10)).toFixed(2);
          } else {
            e[c] = entry[idx];
            // console.log(e[c])
          }
          // console.log(e)
        });
        return e;
      })
    );
  } else {
    res.json([]);
  }
});

app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});

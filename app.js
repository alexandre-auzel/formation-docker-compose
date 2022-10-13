const express = require("express");
const { Pool } = require('pg');
const dotenv = require("dotenv")

dotenv.config()

const app = express();
const port = 3000;
const client = new Pool({
    host: 'database',
    user: process.env.DATABASE_USER,
    database: 'postgres',
    password: process.env.DATABASE_PWD,
    port: process.env.DATABASE_PORT,
})


const query1 = `
    CREATE TABLE IF NOT EXISTS "Livres" (
	    "id" SERIAL,
	    "title" VARCHAR(100) NOT NULL,
	    "author" VARCHAR(100) NOT NULL,
	    PRIMARY KEY ("id")
    );`;

const query2 = `
    INSERT INTO "Livres" (title, author) VALUES 
    ('Des fleurs pour Algernon', 'Keyes'),
    ('Vango', 'De Fombelle'),
    ('Acceleraate', 'Forsgren')
    ;`;
const populate = async () => {
    await client.query(query1);
    const result = await client.query(`SELECT * FROM "Livres"`);
    if(result.rows.length===0){
      await client.query(query2); 

    }
};

populate()



app.get("/", async (req, res) => {
  try {
    const result = await client.query(`SELECT * FROM "Livres"`);
    res.send(result.rows)
  } catch (e){
    res.send(e)
  }
  
 })

app.get("/livres/", async (req, response) => {
  try {
    const title = req.query.title;
    const author = req.query.author;
    const result = await client.query('INSERT INTO "Livres" (title, author) VALUES ($1,$2) RETURNING *', [title, author])
    response.status(200).send(result.rows)
  } catch(e) {
    response.send(e);
  }
  
});

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

process.on('SIGTERM', () => {
  debug('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    debug('HTTP server closed')
  })
})
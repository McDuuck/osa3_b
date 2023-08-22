const express = require('express');
const cors = require('cors');
const jsonServer = require('json-server');

const app = express();


app.use(cors())

app.use('/api', jsonServer.router('db.json'));

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./src/routes/place-route')(app);
require('./src/routes/post-route')(app);

app.get('/', (req, res) => {
  return res.json({message: "Welcome to daya"})
})

app.listen(port, () => {
  console.log('Success connect to port: ' + port);
});
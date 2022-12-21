const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');


dotenv.config();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(process.env.PORT || 3001, () => {
    console.log(`Servidor funcionando en el puerto: ${process.env.PORT || 3001}`);
});


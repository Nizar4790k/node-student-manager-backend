const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const mongodb = require('mongodb');

const register = require('./controllers/register');
const login = require('./controllers/login');
const students = require('./controllers/students')
const grades = require('./controllers/grades')

dotenv.config();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(process.env.PORT || 3001, () => {
    console.log(`Servidor funcionando en el puerto: ${process.env.PORT || 3001}`);
});

const db = {
    MongoClient: mongodb.MongoClient,
    url: process.env.MONGODB_URI,// URL at which MongoDB service is running
    dbName: process.env.DB_NAME, // A Client to MongoDB
    ObjectId: mongodb.ObjectId
};


app.post('/login', (req, res) => {
    login.handleLogin(req, res, db, bcrypt);
})


app.post('/register', (req, res) => {

    register.handleRegister(req, res, db, bcrypt);
});

app.post('/students', (req, res) => {

    students.addStudent(req, res, db);
});

app.get('/students', (req, res) => {

    students.getStudents(req, res, db);

});

app.delete('/students', (req, res) => {

    students.deleteStudent(req, res, db);

});

app.put('/students', (req, res) => {

    students.updateStudent(req, res, db);

});


app.get('/grades', (req, res) => {

    grades.getGrades(req,res,db)

});



app.put('/grades', (req, res) => {

    grades.updateGrade(req, res, db);

});

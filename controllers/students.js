const addStudent = async (req, res, database) => {

  const student = req.body

  const { nombre, fechaNacimiento } = student;

  if (!nombre || !fechaNacimiento) {
    return res.status(400).json("EMPTY_FIELDS");
  }

  const { MongoClient, url, dbName } = database;

  const client = await MongoClient.connect(url, { useNewUrlParser: true })
    .catch(err => { console.log(err); });

  try {


    if (!client) {
      res.status(500).json("ERROR IN THE SERVER");
      return
    }

    const db = client.db(dbName);
    let collection = db.collection("students");

    let result = await insertStudent(student, collection);

    if (result) {
      res.status(200).json("STUDENT_INSERTED");
    }


  } catch (err) {
    console.log(err);
    res.status(500).json("ERROR IN THE SERVER");

  } finally {
    client.close();
  }

}




async function insertStudent(student, collection) {



  try {

    let result = await collection.insertOne(student);
    return result;
  }
  catch (err) {
    console.log(err)
  }

}

async function getStudents(req, res, database) {


  const { MongoClient, url, dbName } = database;

  const client = await MongoClient.connect(url, { useNewUrlParser: true })
    .catch(err => { console.log(err); });

  try {

    if (!client) {
      res.status(500).json("ERROR IN THE SERVER");
      return
    }

    const db = client.db(dbName);
    let collection = db.collection("students");

    const nombreEstudiante = req.query.nombre

 

    var students = []

    if(nombreEstudiante){
      console.log(nombreEstudiante)


    students  = await collection.find({nombre: {'$regex': nombreEstudiante, '$options': 'i'}}).toArray() ;
  
    
    
    }else{

    students = await collection.find({}).toArray();

    }

    


    res.status(200).json(students);



  } catch (err) {
    console.log(err);
    res.status(500).json("ERROR IN THE SERVER");
  } finally {
    client.close();
  }

}

async function deleteStudent(req, res, database) {

  console.log(req.body);
  const _id = req.body._id;
  console.log(_id);

  const { MongoClient, url, dbName, ObjectId } = database;

  const client = await MongoClient.connect(url, { useNewUrlParser: true })
    .catch(err => { console.log(err); });

  try {

    if (!client) {
      res.status(500).json("ERROR IN THE SERVER");
      return
    }

    const db = client.db(dbName);
    let collection = db.collection("students");


    const result = await collection.deleteOne({ _id: new ObjectId(_id) });

    console.log(result);

    if (result.deletedCount === 1) {

      res.status(200).json("Estudiante eliminado correctamente");
    } else {
      res.status(404).json("Estudiante no encontrado");
    }




  } catch (err) {
    console.log(err);
    res.status(500).json("ERROR IN THE SERVER");
  } finally {
    client.close();
  }


}


async function updateStudent(req, res, database) {


  const  student = req.body
  console.log(student)

  const { MongoClient, url, dbName, ObjectId } = database;

  const client = await MongoClient.connect(url, { useNewUrlParser: true })
    .catch(err => { console.log(err); });

  try {

    if (!client) {
      res.status(500).json("ERROR IN THE SERVER");
      return
    }

    const db = client.db(dbName);
    let collection = db.collection("students");


    const result = await collection.updateOne
    (
      { _id: new ObjectId(student._id) },
      {$set:{nombre:student.nombre,fechaNacimiento:student.fechaNacimiento,sexo:student.sexo}}
    );

    console.log(result);

    
    if (result.modifiedCount === 1) {

      res.status(200).json("Estudiante actualizado correctamente");
    } else if(result.matchedCount===1) {
      res.status(304).json("Estudiante ya fue modificado con los mismos datos");
    }else{
      res.status(404).json("Estudiante no encontrado");
    }
    



  } catch (err) {
    console.log(err);
    res.status(500).json("ERROR IN THE SERVER");
  } finally {
    client.close();
  }


}



module.exports = {
  addStudent: addStudent,
  getStudents: getStudents,
  deleteStudent: deleteStudent,
  updateStudent:updateStudent
}
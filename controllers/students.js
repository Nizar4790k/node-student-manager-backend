const addStudent = async (req, res, database) => {


  const { nombre, precio } = req.body;

  if (!nombre || !precio) {
    return res.status(400).json("EMPTY_FIELDS");
  }


  const student = { nombre: nombre, precio: precio }

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

  const { nombre, precio, } = student;

  try {

    let result = await collection.insertOne({ nombre: nombre, precio: precio });
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

    const students = await collection.find({}).toArray();


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


module.exports = {
  addStudent: addStudent,
  getStudents: getStudents,
  deleteStudent: deleteStudent
}
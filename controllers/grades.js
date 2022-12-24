async function getGrades(req, res, database) {
  const { MongoClient, url, dbName } = database;

  const client = await MongoClient.connect(url, {
    useNewUrlParser: true,
  }).catch((err) => {
    console.log(err);
  });

  try {
    if (!client) {
      res.status(500).json("ERROR IN THE SERVER");
      return;
    }

    const db = client.db(dbName);
    let collection = db.collection("students");

    const subject = req.query.subject;

    var projection = {};

    switch (subject) {
      case "Lengua Española":
        projection = { nombre: 1, "materias.espanol": 1 };
        break;
      case "Matemáticas":
        projection = { nombre: 1, "materias.matematicas": 1 };
        break;
      case "Ciencias Naturales":
        projection = { nombre: 1, "materias.naturales": 1 };
        break;
      case "Ciencias Sociales":
        projection = { nombre: 1, "materias.sociales": 1 };
        break;
    }

    const grades = await collection
      .find({}, { projection: projection})
      .toArray();

    res.status(200).json(grades);
  } catch (err) {
    console.log(err);
    res.status(500).json("ERROR IN THE SERVER");
  } finally {
    client.close();
  }
}


async function updateGrade(req, res, database) {


  const  grade = req.body
  console.log(grade)

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


    var projection = {}

    if(grade.materias.espanol){
      projection = {$set:{"materias.espanol":grade.materias.espanol}}
    }else if (grade.materias.matematicas){
      projection = {$set:{"materias.matematicas":grade.materias.matematicas}}
    }else if(grade.materias.naturales){
      projection = {$set:{"materias.naturales":grade.materias.naturales}}
    }else{
      projection = {$set:{"materias.sociales":grade.materias.sociales}}
    }


    const result = await collection.updateOne
    (
      { _id: new ObjectId(grade._id) },
      projection
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
  getGrades: getGrades,
  updateGrade: updateGrade
};

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

module.exports = {
  getGrades: getGrades,
};

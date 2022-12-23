async function getGrades(req, res, database) {
    
  const subject = req.query.subject
   

    
   
    const { MongoClient, url, dbName } = database;
  
    const client = await MongoClient.connect(url, { useNewUrlParser: true })
      .catch(err => { console.log(err); });
  
    try {
  
      if (!client) {
        res.status(500).json("ERROR IN THE SERVER");
        return
      }
  
      const db =  client.db(dbName);
      let collection = db.collection("students");
  
      const grades = await collection.find({},{nombre:1,"materias.espanol":1}).toArray()
      

      console.log(grades)
      
      
  
      res.status(200).json(grades);
  
  
  
    } catch (err) {
      console.log(err);
      res.status(500).json("ERROR IN THE SERVER");
    } finally {
      client.close();
    }

    
  
  }

  module.exports = {
    getGrades:getGrades
  }
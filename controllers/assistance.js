async function getAssistance(req, res, database) {
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
  
      const date = req.query.date;
      console.log(date);
      
   
  
    
  
       const assistance = await collection.aggregate([{$unwind:"$asistencia"}, {
        $match: {
          "asistencia.fecha":date
        }
      },{ "$project" : { "nombre": 1, "_id": 1,"asistencia":1 }}],
      ).toArray();


      
     
      if (assistance.length===0){
        const assistance2 = await collection.find({},{projection:{nombre:1}}).toArray()

      
        res.status(200).json(assistance2);
        return;
        

      }

      


  
      res.status(200).json(assistance);
    } catch (err) {
      console.log(err);
      res.status(500).json("ERROR IN THE SERVER");
    } finally {
      client.close();
    }
  }


module.exports = {
    getAssistance:getAssistance
}
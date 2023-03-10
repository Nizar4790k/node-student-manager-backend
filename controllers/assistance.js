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
     
      
   
  
    
  
       const assistance = await collection.aggregate([{$unwind:"$asistencia"}, {
        $match: {
          "asistencia.fecha":date
        }
      },{ "$project" : { "nombre": 1, "_id": 1,"asistencia":1 }}],
      ).toArray();


      console.log(assistance.length)

      console.log(assistance.length===0)
      
      
     
      if (assistance.length===0){
        const assistance2 = await collection.find({},{projection:{nombre:1}}).toArray()

        assistance2.forEach(assistance => {
          assistance.asistencia = {fecha:new Date().toISOString().split('T')[0],status:'',notes:''}
        });

        
       
      
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



  async function updateAssistance(req, res, database) {


    const  assistance = req.body

   

  
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
  
  
  
  
  
  
     
     

      var result = await collection.aggregate([{$unwind:"$asistencia"}, {
        $match: {
          "asistencia.fecha":assistance.asistencia.fecha,
          "_id":new ObjectId(assistance._id)

        }
      },{ "$project" : { "nombre": 1, "_id": 1,"asistencia":1 }}],
      ).toArray();

     
      console.log(result.length)

      
      if(result.length===0){
        

        var projection = {$push:{"asistencia":assistance.asistencia}}

        result = await collection.updateOne
        (
          { _id: new ObjectId(assistance._id) },
          projection
        );

      }else{


        
        var projection = {$set:{"asistencia.$":assistance.asistencia}}

        result = await collection.updateOne
        (
          { _id: new ObjectId(assistance._id),"asistencia.fecha": assistance.asistencia.fecha },
          projection
        );

      }
    


      assistance.asistencia = [assistance.asistencia]

      

       

      /*
      result = await collection.updateOne
      (
        { _id: new ObjectId(assistance._id),"asistencia.fecha":assistance.asistencia[0].fecha },
        projection
      );
  */
    

      
      
      if (result.modifiedCount === 1) {
  
        res.status(200).json("Asistencia actualizado correctamente");
      } else if(result.matchedCount===1) {
        res.status(304).json("Asistencia ya fue modificado con los mismos datos");
      }else{
        res.status(404).json("Asistencia no encontrado");
      }
      
  
     
  
  
    } catch (err) {
      console.log(err);
      res.status(500).json("ERROR IN THE SERVER");
    } finally {
      client.close();
    }
  
  
  }


module.exports = {
    getAssistance:getAssistance,
    updateAssistance:updateAssistance
}
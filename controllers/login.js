const handleLogin = async (req, res, database, bcrypt) =>{

    

    const { email, password } = req.body;
    
    const { MongoClient, url, dbName } = database;

    const client = await MongoClient.connect(url, { useNewUrlParser: true })
        .catch(err => { console.log(err); });

    try{
        

        if (!client) {
            res.status(500).json("ERROR IN THE SERVER");
            return
        }

        const db = client.db(dbName);
        
        let collection = db.collection("users");

        const result = await checkUser(email,password,collection,bcrypt);

        if(result){
       
            res.json({status:"ACCESS_GRANTED",user:result})
            
        }else{
            res.json({status:"ACCESS_DENIED"});
        }
        



    }catch(err){
        console.log(err);
        res.status(500).json("ERROR IN THE SERVER");

    }finally{
        client.close();
    }




}

async function checkUser(email,password,collection,bcrypt){

    try {
        let query = { email:email};
        let result = await collection.findOne(query);

        let value = bcrypt.compareSync(password,result.password);
        
        if (value) {
            return {fullName:result.fullName,id:result._id};
        } else {
            return false;
        }
    } catch (err) {
        console.log(err);
    }

}

module.exports = {
    handleLogin: handleLogin
};
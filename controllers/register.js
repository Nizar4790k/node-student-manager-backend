const handleRegister = async (req, res, database, bcrypt) => {


    const { email, password ,fullName } = req.body;



    if (!email|| !password || !fullName) {
        return res.status(400).json("EMPTY_FIELDS");
    }

    let salt = bcrypt.genSaltSync(10);

    hash = bcrypt.hashSync(password, salt);

    const user = { email: email, password: hash, fullName:fullName , role:"client" }

    const { MongoClient, url, dbName } = database;



    var isFound = false;



    const client = await MongoClient.connect(url, { useNewUrlParser: true })
        .catch(err => { console.log(err); });

    try {


        if (!client) {
            res.status(500).json("ERROR IN THE SERVER");
            return
        }

        const db = client.db(dbName);
        let collection = db.collection("users");


        isFound = await checkUser(user, collection);


        if (!isFound) {


            let result = await insertUser(user, collection);
            if (result) {
                res.json("USER_INSERTED");
            }


        } else {
            res.json("USER_EXIST");
        }


    } catch (err) {
        res.status(500).json("ERROR IN THE SERVER");

    } finally {
        client.close();
    }

}

async function checkUser(user, collection) {

    try {
        let query = { email: user.email};
        let result = await collection.findOne(query);

        if (result) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.log(err);
    }

}

async function insertUser(user, collection) {

    const { email, password, fullName,role } = user;

    try {
        
        let result = await collection.insertOne({ fullName: fullName, password: password, role: role, email: email });
        return result;
    }
    catch (err) {
        console.log(err)
    }

}




module.exports = {
    handleRegister: handleRegister
};
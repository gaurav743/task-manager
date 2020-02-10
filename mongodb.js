const mongodb = require('mongodb')
const mongoClient = mongodb.MongoClient //Client to interact with DB. This is not a function.
const objectID = mongodb.ObjectID;

const connectionUrl = "mongodb://127.0.0.1:27017"
const database = "task-manager"
const id = new objectID()

mongoClient.connect(connectionUrl, { useNewUrlParser: true }, (error, client) => { //useNewUrlParser - Used to parse the connection url. 
    if(error){
        console.log("Failed to connect to database.")
    }

    const db = client.db(database) //Get database instance.

    db.collection("taskManager").deleteOne( {
        description : "Learn Angular 8" //filter records based on condition
    }).then( (result) => {
        console.log(result) //This has properties like deletedCount.
    }).catch( (error) => {
        console.log(error)
    })
})

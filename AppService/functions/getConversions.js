exports = async function(searchArgs){

  var serviceName = "mongodb-atlas";

  // Update these to reflect your db/collection
  var dbName = "mqlConverter";
  var collName = "queries";

  // Get a collection from the context
  var collection = context.services.get(serviceName).db(dbName).collection(collName);

  var result;
  
  //validate if searchArgs is empty or not
  if (searchArgs != null && searchArgs != "") {

    //use searchArgs to create an Atlas Search pipeline
    var pipeline = [
      {
        "$search": {
          "text": {
            "query": searchArgs,
            "path": "query"
          }
        }
      }
    ];
  } else {
    //if searchArgs is empty, return all documents
    var pipeline = [
      {
        "$match": {}
      }
    ];
  }
    
    try {

      result = await collection.aggregate(pipeline);
    } catch(err) {
      console.log("Error occurred while executing find:", err.message);
      return { error: err.message };
    }
    
  return result;
};
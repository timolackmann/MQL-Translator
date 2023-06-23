exports = async function(){

  var serviceName = "mongodb-atlas";

  // Update these to reflect your db/collection
  var dbName = "mqlConverter";
  var collName = "queries";

  // Get a collection from the context
  var collection = context.services.get(serviceName).db(dbName).collection(collName);

  var findResult;
  try {
 
    findResult = await collection.find();

  } catch(err) {
    console.log("Error occurred while executing find:", err.message);

    return { error: err.message };
  }


  return result;
};
exports = async function(){
  
  // This function is triggered by a scheduled event and deletes all documents in the collection older than 30 days

  // Get the collection object
  var serviceName = "mongodb-atlas";
  var dbName = "mqlConverter";
  var collName = "queries";
  var collection = context.services.get(serviceName).db(dbName).collection(collName);

  try {
    var deleteResult = await collection.deleteMany({ "date": { "$lt": new Date(currentDate.setDate(currentDate.getDate() - 30)) } });
  } catch(err) {
    console.log("Error occurred while executing findOne:", err.message);

    return { error: err.message };
  }

  // To call other named functions:
  // var result = context.functions.execute("function_name", arg1, arg2);

  return { result: deleteResult };
};
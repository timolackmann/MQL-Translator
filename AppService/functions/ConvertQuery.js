exports = async function(query, documentModel){

  const { Configuration, OpenAIApi } = require("openai");
  const configuration = new Configuration({
    apiKey: context.values.get("openai_api_key"),
  });
  const openai = new OpenAIApi(configuration);
  var serviceName = "mongodb-atlas";

  // Update these to reflect your db/collection
  var dbName = "mqlConverter";
  var collName = "queries";

  // Get a collection from the context
  var collection = context.services.get(serviceName).db(dbName).collection(collName);

  // Insert a document into the collection and store object id
  var objId = collection.insertOne({ "query": query, "documentModel": documentModel, "date": new Date(), "user": context.user.id }).insertedId;
  
  console.log(objId);

  var promptText = 'convert the following SQL to MQL\n\n' + query + '\n\n# document model\n\n' + documentModel;

  try {
    var result = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages:[
        {"role": "system", "content": "You are a helpful assistant that translates SQL to mongoDB aggregation pipeline. You just need to return the mongodb command without an explaination"},
        {"role":"user","content":promptText}
        ]
    });
  }
  catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data.error.message);
    } else {
      console.log(error.message);
    }
  }

  //insert result into the collection
  collection.updateOne({ "_id": objId }, { $set: { "result": result.data.choices[0].message, "validated":false } });
};
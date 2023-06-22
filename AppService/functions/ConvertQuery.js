exports = async function(request, response){
  
  const data = JSON.parse(request.body.text());
  query = data.query;
  documentModel = data.documentModel;
  
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
  var obj = await collection.insertOne({ "query": query, "documentModel": documentModel, "date": new Date(), "user": context.user.id });
  var objId = obj.insertedId;
  
  console.log(objId);

  var promptText = 'convert the following SQL to MQL\n\n' + query 
  
  //check if document model is provided and add it to the prompt
  if(documentModel != null){
    promptText += '\n\nusing the following document model\n\n' + documentModel 
  }

  console.log(promptText);

  try {
    var result = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages:[
        {"role": "system", "content": "You are a helpful assistant that translates SQL to mongoDB aggregation pipeline. You must only return the aggregation pipeline without any additional explanation. The response needs to be a valid JSON format and start with '[' and end with ']'"},
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

  let doc = await collection.updateOne({ "_id": objId }, { $set: { "result": result.data.choices[0].message, "validated":false } });
  response.setBody(JSON.stringify(result.data.choices[0].message));
  //insert result into the collection
};
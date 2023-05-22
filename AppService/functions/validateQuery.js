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


  try {
    var result = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages:[
        {"role": "system", "content": "You are a helpful assistant that validates a mongodb command. Only respond with 'True' if the command is valid and with 'False' if it is not"},
        {"role":"user","content":query}
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
  console.log(result.data.choices[0].message.content);
  //insert result into the collection
  //collection.updateOne({ "_id": objId }, { $set: { "result": result.data.choices[0].message, "validated":false } });
};
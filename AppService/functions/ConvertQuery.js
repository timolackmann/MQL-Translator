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

  collection.insertOne({ "query": query, "documentModel": documentModel, "date": new Date(), "user": context.user.id });
  
  var promptText = '# convert the following SQL to MQL\n\n' + query + '\n\n# document model\n\n' + documentModel + '\n\n# MQL\n\n';
  console.log(promptText);
  try {
    var result = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: promptText,
      temperature: 0,
      max_tokens: 150,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      stop: ["#", ";"],
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
  console.log(result);
  return { result: result };
};
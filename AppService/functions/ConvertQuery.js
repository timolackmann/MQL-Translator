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
  
  var promptText = '# convert the following query to MQL\n\n' + query + '\n\n# document model\n\n' + documentModel + '\n\n# MQL\n\n';
  console.log(promptText);
  try {
    var result = await openai.createCompletion({
      engine: "text-davinci-003",
      prompt: "# convert the following SQL to MQL \n\n INSERT INTO Customers (CustomerName, ContactName, Address, City, PostalCode, Country) VALUES ('Cardinal','Tom B. Erichsen','Skagen 21','Stavanger','4006','Norway');",
      maxTokens: 4000,
      temperature: 0,
      topP: 1,
      presencePenalty: 0,
      frequencyPenalty: 0,
      bestOf: 1,
      n: 1,
      stream: false,
      stop: ["#", ";"]
    });
  }
  catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
  }
  console.log(result);
  return { result: result };
};
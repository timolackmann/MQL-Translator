exports = async function(query, documentModel){
  
  //configure openAI module for request
  const { Configuration, OpenAIApi } = require("openai");
  const configuration = new Configuration({
  //Using App Service Secret for api key storage
    apiKey: context.values.get("openai_api_key"),
  });
  const openai = new OpenAIApi(configuration);
  
  //connect with mongodb instance
  var serviceName = "mongodb-atlas";
  var dbName = "mqlConverter";
  var collName = "queries";
  
  var collection = context.services.get(serviceName).db(dbName).collection(collName);

  // create prompt for ChatGPT
  var promptText = 'convert the following SQL to MQL\n\n' + query 
  
  //check if document model is provided and add it to the prompt
  if(documentModel != null && documentModel !=""){
    promptText += '\n\nusing the following document model\n\n' + documentModel 
  }

  try {
    var result = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages:[
        {"role": "system", "content": "You are a helpful assistant that translates SQL to mongoDB aggregation pipeline. You must only return the aggregation pipeline JSON without any additional explanation. The response must start with '[' and end with ']'. Every key and value must start and end with quotation marks"},
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

  const mql = result.data.choices[0].message.content;
  
  //save request and chatGPT response in Atlas
  collection.insertOne({"result": mql, "validated":false, "query": query, "documentModel": documentModel, "date": new Date(), "user": context.user.id });
  return mql;
};
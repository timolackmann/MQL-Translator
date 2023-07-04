#!/bin/bash

if ! command -v realm-cli &> /dev/null
then
    echo "realm-cli could not be found, please install it"
    exit
fi

echo "This script imports the SQL to MQL conversion app into your Atlas project"
echo 
echo "Before you run this script, make sure you have:"
echo "1. Created a new MongoDB Atlas project for your App Services app"
echo "2. Created a new cluster inside that project for storing the chatGPT interactions"
echo "3. Created an API Key inside your project, and recorded the public and private key details"
echo "4. Installed dependencies for this script: mongodb-realm-cli"
echo "For more details on these steps, see the README.md file."
echo

# Prompt for API Keys
echo "Enter the PUBLIC Key for your PROJECT level API Key:"
read publicKeyProject
echo "Enter the PRIVATE Key for your PROJECT level API Key:"
read privateKeyProject
echo "Enter the name of the running Atlas cluster that will store the chatGPT interactions:"
read clusterName
echo "Enter your ChatGPT API key:"
read chatGPTKey
echo "Enter your first users email:"
read userEmail
echo "Enter your first users password:"
read userPassword
echo "Thanks....."

# Rewrite the App Service with the specified cluster name
config='{
    "name": "mongodb-atlas",
    "type": "mongodb-atlas",
    "config": {
        "clusterName": "'$clusterName'",
        "readPreference": "primary",
        "wireProtocolEnabled": false
    },
    "version": 1
}'
echo "$config" > ./AppService/data_sources/mongodb-atlas/config.json

# Import the App Services app
realm-cli login --api-key="$publicKeyProject" --private-api-key="$privateKeyProject"
realm-cli push --yes --include-package-json --local ./AppService 

# set variable to the app id
app_id=$(realm-cli apps describe -a "SQLTranslator" -f json | jq -r '.doc.client_app_id')

# Write secrets to App Services app
realm-cli secrets create -n secret_openai_api_key -v $chatGPTKey -a $app_id
realm-cli push -y --include-package-json --local ./AppService

# Create email user
realm-cli users create --type email --email $userEmail --password $userPassword -a $app_id

# Save the app id to the .env file of the frontend
echo "REACT_APP_REALM_APP_ID=$app_id" > ./frontend/.env

echo "Your app is now deployed. You can now run the frontend with 'cd frontend && npm start'"
echo "Before you can use the search functionality, you need to create an Atlas Search index"
echo "for your existing cluster for the namespace mqlConverter.queries with the name 'default'"

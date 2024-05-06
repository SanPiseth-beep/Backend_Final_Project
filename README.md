## Final Project: Rest API for US states with data from JSON file and mangoDB

### Web API
- The API is hosted on Heroku at the following URL: https://nebulous-cypress-zinc.glitch.me/

### Description
This project is a REST API that provides information about US states. The data is stored in a JSON file and in a MongoDB database. The API provides the following endpoints:
#### GET requests
- GET /states: Returns a list of all US states.
- GET /states/?contig=true: Returns a list of all contiguaus US states .
- GET /states/contig=true: Returns a list of all non contiguaus US states .
- GET /states/{state}: Returns information about a specific state.
- GET /states/{state}/funfact: Returns a fun fact about a specific state.
- GET /states/{state}/capital: Returns the capital of a specific state.
- GET /states/{state}/nickname: Returns the largest city of a specific state.
- GET /states/{state}/population: Returns the largest city of a specific state.
- GET /states/{state}/admission: Returns the largest city of a specific state.

#### POST requests
- POST /states/{state}/funfact: Adds a new state to the list of states.

#### PATCH requests
- PATCH /states/{state}/funfact: Updates the fun fact of a specific state.

#### DELETE requests
- DELETE /states/{state}/funfact: Deletes the fun fact of a specific state.
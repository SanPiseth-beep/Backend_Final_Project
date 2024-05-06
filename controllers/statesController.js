// Import the State model
const State = require('../model/State');

// Define the data object that will hold the states data and a method to set it
const data = {
    states: require('../model/states.json'), // Load initial states data from JSON file
    setStates: function (data) {this.states = data} // Method to update the states data
};

// Function to merge the states data with the fun facts from the database
async function merge(){
    // Loop over each state in the states data
    for (const state in data.states){ 
        // Query the database for the fun facts of the current state
        const fact = await State.findOne({state: data.states[state].code}).exec();
        // If fun facts are found, add them to the states data
        if (fact){
            data.states[state].funfacts = fact.funfacts;
        }
    }
}

// Run the merge function to initialize the states data with fun facts
merge();

// Handler function to get all states
const getAllStates = async (req,res)=> {
    // Check if there is a query parameter
    if (req.query){
        // If the 'contig' query parameter is 'true', filter out the non-contiguous states
        if(req.query.contig == 'true') {
            const result = data.states.filter(st => st.code != "AK" && st.code != "HI");
            res.json(result);
            return;
        }
        // If the 'contig' query parameter is 'false', return only the non-contiguous states
        else if (req.query.contig == 'false') {
            const result = data.states.filter( st => st.code == "AK" || st.code == "HI");     
            res.json(result);
            return;
        }
    }

    // If no query parameter is provided, return all states
    res.json(data.states);
}

// Handler function to get a specific state
const getState = async (req,res)=> {
    // Convert the state code to uppercase
    const code = req.params.state.toUpperCase();
    // Find the state in the states data
    const state = data.states.find( st => st.code == code);
    // Return the state
    res.json(state);
}

// Handler function to get the capital of a specific state
const getCapital = (req,res)=> {
    // Convert the state code to uppercase
    const code = req.params.state.toUpperCase();
    // Find the state in the states data
    const state = data.states.find( st => st.code == code);
    // Return the state and its capital
    res.json({"state": state.state, "capital": state.capital_city});
}

// Handler function to get the nickname of a specific state
const getNickname = (req,res)=> {
    // Convert the state code to uppercase
    const code = req.params.state.toUpperCase();
    // Find the state in the states data
    const state = data.states.find( st => st.code == code);
    // Return the state and its nickname
    res.json({"state": state.state, "nickname": state.nickname});
}

// Handler function to get the population of a specific state
const getPopulation = (req,res)=> {
    // Convert the state code to uppercase
    const code = req.params.state.toUpperCase();
    // Find the state in the states data
    const state = data.states.find( st => st.code == code);
    // Return the state and its population
    res.json({"state": state.state, "population": state.population.toLocaleString("en-US")});
}

// Handler function to get the admission date of a specific state
const getAdmission = (req,res)=> {
    // Convert the state code to uppercase
    const code = req.params.state.toUpperCase();
    // Find the state in the states data
    const state = data.states.find( st => st.code == code);
    // Return the state and its admission date
    res.json({"state": state.state, "admitted": state.admission_date});
}

// Handler function to get a random fun fact of a specific state
const getFunFact = (req,res)=>{
    // Convert the state code to uppercase
    const code = req.params.state.toUpperCase();
    // Find the state in the states data
    const state = data.states.find( st => st.code == code);
    // If the state is not found, return a message
    if (!state) {
        return res.status(404).json({"message": `Invalid state abbreviation parameter`});
    }
    // If the state has fun facts, return a random one
    if(state.funfacts){
         res.status(201).json({"funfact": state.funfacts[Math.floor((Math.random()*state.funfacts.length))]});
    } 
    // If the state does not have fun facts, return a message
    else
    {
        res.status(201).json({"message": `No Fun Facts found for ${state.state}`});
    }
}

// Handler function to create fun facts for a specific state
const createFunFact = async (req,res)=>{
    // Check if the request body contains fun facts
    if(!req?.body?.funfacts){
        return res.status(400).json({"message": "State fun facts value required"});
    }
    // Check if the fun facts are provided as an array
    if(!Array.isArray(req.body.funfacts)) {
        return res.status(400).json({'message': "State fun facts value must be an array"});
    }

    // Convert the state code to uppercase
    const code = req.params.state.toUpperCase();

    try {
        // Try to add the fun facts to the existing ones in the database
        // If the state does not exist in the database, create a new document
        if(!await State.findOneAndUpdate({state: code},{$push: {"funfacts": req.body.funfacts}})){   
            await State.create({ 
                state: code,
                funfacts: req.body.funfacts
            });
        }
        await merge();

        // Get the updated state document from the database
        const result = await State.findOne({state: code}).exec();

        // Return the updated state document
        res.status(201).json(result);
    } catch (err) {console.error(err);}   
}

// Handler function to update a fun fact of a specific state
const updateFunFact = async (req,res)=>{
    // Check if the request body contains the index of the fun fact to update
    if(!req?.body?.index) {
        return res.status(400).json({"message": "State fun fact index value required"});
    }
    // Check if the request body contains the new fun fact
    if(!req?.body?.funfact){
        return res.status(400).json({"message": "State fun fact value required"});
    }

    // Convert the state code to uppercase
    const code = req.params.state.toUpperCase();

    // Get the state document from the database
    const state = await State.findOne({state: code}).exec();
    // Find the state in the states data
    const jstate = data.states.find( st => st.code == code);

    // Check if the state has fun facts
    if (!jstate.funfacts || jstate.funfacts.length === 0){
        return res.status(400).json({"message": `No Fun Facts found for ${jstate.state}`});
    }

    // Get the index of the fun fact to update
    let index = req.body.index;

    // Check if the state has fun facts and if the provided index is valid
    if (!jstate.funfacts || index > state.funfacts.length || index < 1 || !index){
        return res.status(400).json({"message": `No Fun Fact found at that index for ${jstate.state}`});
    }
    // Adjust the index to zero-based indexing
    index -= 1;

    // Update the fun fact at the provided index
    if (req.body.funfact) state.funfacts[index] = req.body.funfact;
    
    // Save the updated state document to the database
    const result = await state.save();

    // Return the updated state document
    res.status(201).json(result);

    // Rebuild the states data to include the updated fun fact
    merge();
}   

// Handler function to delete a fun fact of a specific state
const deleteFunFact = async(req,res)=>{
    // Check if the request body contains the index of the fun fact to delete
    if(!req.body.index) {
        return res.status(400).json({"message": "State fun fact index value required"});
    }

    // Convert the state code to uppercase
    const code = req.params.state.toUpperCase();

    // Get the state document from the database
    const state = await State.findOne({state: code}).exec();
    // Find the state in the states data
    const jstate = data.states.find( st => st.code == code);

    // Check if the state has fun facts
    if (!jstate.funfacts || jstate.funfacts.length === 0){
        return res.status(400).json({"message": `No Fun Facts found for ${jstate.state}`});
    }

    // Get the index of the fun fact to delete
    let index = req.body.index;

    // Check if the state has fun facts and if the provided index is valid
    if (!jstate.funfacts || index > state.funfacts.length || index < 1 || !index){
        return res.status(400).json({"message": `No Fun Fact found at that index for ${jstate.state}`});
    }
    // Adjust the index to zero-based indexing
    index -= 1;

    // Delete the fun fact at the provided index
    state.funfacts.splice(index, 1);
    
    // Save the updated state document to the database
    const result = await state.save();

    // Return the updated state document
    res.status(201).json(result);

    // Rebuild the states data to exclude the deleted fun fact
    merge();
}

// Export the handler functions
module.exports={
    getAllStates, 
    getState, 
    getNickname, 
    getPopulation, 
    getCapital, 
    getAdmission, 
    getFunFact, 
    createFunFact, 
    updateFunFact, 
    deleteFunFact
};
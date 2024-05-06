// Import states.json
const data = {
    states: require('../model/states.json'), // states data imported from a JSON file
    setStates: function (data) { this.states = data } // method to set the states data
};

// verifyState is a middleware function that verifies the state code
const verifyState = (req, res, next) => {
    // Extract the state code from the request parameters and convert it to uppercase
    const code = req.params.state.toUpperCase(); 

    // Find the state in the states data that matches the state code
    const state = data.states.find( st => st.code == code);

    // If no matching state is found, return a 404 status and a JSON message
    if(!state) {
        return res.status(404).json({ 'message': 'Invalid state abbreviation parameter'});
    }

    // If a matching state is found, attach it to the response object
    res.state = state;

    // Call the next middleware function
    next();
}

// Export the verifyState function
module.exports = verifyState;
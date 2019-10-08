const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const url = "https://api.darksky.net/forecast/a37f6068b45179e94fb6f8e0bc1d310f/" + latitude + "," + longitude

    // First parameter is the object passed in. Second parameter is the callback function (i.e. what we want to do once request is done finishing its side of things)
    // request calls our callback function and passes in a bunch of parameters. We only care about the first two, 'error' and 'response'
    // We can use those two values that it passed into our callback function and see if 'error' is undefined (meaning no error) as well as what we have in our 'response'
    request({url, json: true}, (error, { body }) => {
        if (error) {
            // Calls the callback function and passes in an error for the 'error' parameter and nothing (undefined) for the response parameter
            callback('Unable to connect to weather services!', undefined)
        } else if (body.error) {
            // Calls the callback function and passes in an error for the 'error' parameter and nothing (undefined) for the response parameter
            callback('Unable to find location!', undefined)
        } else {
            // Calls the callback function and passes in nothing (undefined) for the error parameter and then our actual data for the 'response' parameter
            callback(undefined, body.daily.data[0].summary + " It is currently " + body.currently.temperature + " degrees out. The high today is " + body.daily.data[0].temperatureHigh + " with a low of " + body.daily.data[0].temperatureLow + ". There is a " + body.currently.precipProbability + "% chance of rain.")
        }
    })
}

module.exports = forecast
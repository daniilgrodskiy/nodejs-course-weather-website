const request = require('request')


const geocode = (address, callback) => {
    const url = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + encodeURIComponent(address) + ".json?access_token=pk.eyJ1IjoiZGFuaWlsLWdyb2Rza2l5IiwiYSI6ImNrMTlqcmQ1ejBta28zZHAxdmUwNXphemcifQ.mzC8jVI75ypWPM9oRl2Ejg"

    request({url, json: true}, (error, { body }) => {
        if (error) {
            callback("Unable to connect to location services!", undefined)
            // Don't need the undefined, but it's nicer that way for now lol.
        } else if (body.features.length === 0) {
            callback("Unable to find location. Try another search", undefined)
        } else {
            callback(undefined, {
                // 'data' that is passed in into the callback function will be an object
                latitude: body.features[0].center[1],
                longitude: body.features[0].center[0],
                location: body.features[0].place_name,
            })
        }
    })
}

module.exports = geocode
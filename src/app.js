const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

// __dirname returns the current path location
const app = express()

// Define paths for Express config
// .join concatenates the current path directory and then goes a folder back and adds the 'public' folder
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

// Index page
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Daniil Grodskiy'
    })
})

// About page
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Daniil Grodskiy'
    })
})

// Help page
app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text.',
        title: 'Help',
        name: 'Daniil Grodskiy'
    })
})


// Weather page
// First parameter is partial url (so for app.com/help it'd be 'help' and for app.com it'd be '')
app.get('/weather', (req, res) => {
    // req.query are the query key-value pairs inside the url
    // req.query.address gets the value of the key 'address'

    if (!req.query.address) {
        // If there's no address query, throw an error
        return res.send({
            error: 'You must provide an address!'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        // Passes in address from query
        // Callback function returns an object with three properties. We're just destructuring it.
        if (error) {
            // If the callback returns an error, break and send the error
            // Same as return res.send({error: error})
            return res.send({error})
        }

        forecast(latitude, longitude, (error, forecastData) => {
            // forecast() takes in the latitude and longitude returned from the geocode function and returns a callback
            // Callback returns either an error a response
            // Response is not an object, it's just a string so we can't destructure it like we did with the callback object in geocode()
            if (error) {
                return res.send({ error })
            }

            res.send({
                // Sending an object (JSON) to print out when someone requests this page on the server.
                // Properties come from both the callback functions that geocode and forecast had
                forecast: forecastData,
                location,
                address: req.query.address,
            })
        })
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Daniil Grodskiy',
        errorMessage: "Help article not found."
    })
})

app.get('/products', (req, res) => {

    if (!req.query.search) {
        // Only runs when there's no search query term
        // We need 'return' because it'll stop the function (like a break). Otherwise, we'd get an error because we're trying to send another request to the server with res.send() (http can only send one response)
        return res.send({
            error: 'You must provide a search term'
        })
    }

    res.send({
        products: [],
    })
})

app.get('*', (req, res) => {
    // * - match anything that hasn't been matched so far
    res.render('404', {
        title: '404',
        name: 'Daniil Grodskiy',
        errorMessage: "Page not found.",
    })

})

// Opens up the port (starts server)
app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})
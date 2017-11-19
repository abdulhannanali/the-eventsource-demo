const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const LocationSource = require('./LocationSource');

const app = express();
const { 
    PORT = 3000, 
    HOST = '0.0.0.0',
    NODE_ENV = 'development',
} = process.env;


app.set('x-powered-by', false);

app.use(cors('*'));
app.use(morgan('dev', {}));

app.use(express.static(__dirname + '/public', { index: 'index.html' }));

app.get('/', function (req, res, next) {
    res.sendStatus(404);
});

function creditsHeaders(req, res, next) {
    res.set('Purpose', 'Demonstrate the EventSource API, Read more on MDN');
    res.set('Best-Enjoyed-With', 'Open Spotify and choose the playlist you hate')
    res.set('Creator', 'Hannan Ali');
    res.set('Creator-Github-Profile', 'https://github.com/abdulhannanali');
    res.set('Creator-Email', 'ali.abdulhannan@gmail.com')
    res.set('Demo-Repo-Link', 'https://github.com/the-eventsource-demo');

    next();
}

app.get('/iss-location', creditsHeaders, async function (req, res, next) {
    if (req.accepts('text/event-stream')) {
        res.set('Cache-Control', 'no-cache');
        res.set('Content-Type', 'text/event-stream');

        try {
            await LocationSource(res);
        } catch (error) {
            console.error('Error occured');
            res.end('ERROR TERMINATING THE STREAM');
        }
    } else {
        res.status(404).send(`The 'Accept' header should contain 'text/event-stream'`);
    }
});

/**
 * Listen to the HOST:PORT
 */
app.listen(PORT, HOST, function (error) {
    if (error) {
        console.error('Error occured while listening');
        console.error(error);
    } else {
        console.log(`Listening on ${HOST}:${PORT}`);
    }
});
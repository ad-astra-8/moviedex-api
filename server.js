require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const app = express()
const PORT = 8000
const MOVIEDEX = require('./moviedex.json');

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())
app.use(validateBearerToken);

app.get('/movie', handleGetMovie) 


function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
    }

    next();
}

function handleGetMovie(req, res) {
    let response = MOVIEDEX;

    if (req.query.genre) {
        response = response.filter(movie => {
            return movie.genre.toLowerCase().includes(req.query.genre.toLowerCase());
        })
    }

    if (req.query.country) {
        response = response.filter(movie => {
            return movie.country.toLowerCase().includes(req.query.country.toLowerCase());
        })
    }

    if (req.query.avg_vote) {
        response = response.filter(movie => {
         return Number(movie.avg_vote) >= Number(req.query.avg_vote)
        })
    }

    res.json(response)
}


app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})
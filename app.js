require('dotenv').config({path: __dirname + '/.env'})
const assert = require('assert')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const scraper = require('./utils/scraper')
const { AssertionError } = require('assert')
const { ScrapingError } = require('./utils/scraper')

// Setup App
const PORT = process.env['SCRAPI_PORT'] || 3000
const DRIVER = process.env['SCRAPI_DRIVER'] || 'basic'

const app = express()
const scrape = scraper({driver: DRIVER})

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('public'))

// Scrape Handler
const handleScrape = async (req, res, { url, data }) => {
  try {
    assert(url, `URL is required`)
    assert(
      typeof data === 'string' || (typeof data === 'object' && !Array.isArray(data)),
      `Data is required and must be object or JSON string`
    )

    if (typeof data === 'string') {
      data = JSON.parse(data)
    }

    const result = await scrape(url, data)
    return res.json({success: true, data: result})
  } catch (err) {
    if (err instanceof ScrapingError || err instanceof AssertionError) {
      res.status(422)
    } else {
      res.status(500)
    }
    return res.json({success: false, error: err.message })
  }
}

// API Endpoints
app.get('/scrape', (req, res) => handleScrape(req, res, req.query))
app.post('/scrape', (req, res) => handleScrape(req, res, req.body))

// Run!
app.listen(PORT, () => console.log(`Scrapi listening on port ${PORT}.`))

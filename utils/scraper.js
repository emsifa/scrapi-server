const puppeteerDriver = require('../drivers/puppeteer')
const Xray = require('x-ray')
const path = require('path')

class ScrapingError extends Error {
  constructor(error) {
    super()
    this.message = error.message
    this.error = error
  }
}

const x = Xray({
  filters: {
    'trim': function (value) {
      return typeof value === 'string' ? value.trim() : value
    },
    'no-double-whitespaces': function (value) {
      return typeof value === 'string' ? value.replace(/\s+/g, ' ') : value
    },
    'no-whitespaces': function (value) {
      return typeof value === 'string' ? value.replace(/\s+/g, '') : value
    },
  }
})

const parseField = (key) => {
  const rg = new RegExp(`^[a-z0-9_-]+\\((.+)\\)$`, "i")
  if (key.match(rg)) {
    const scope = key.replace(rg, '$1')
    return { field: key.split('(').shift(), scope }
  } else {
    return { field: key }
  }
}

const resolveSelectors = (data) => {
  if (Array.isArray(data)) {
    return data.map(resolveSelectors)
  } else if(typeof data !== 'object') {
    return data
  }

  const result = {}
  for (let key in data) {
    const { field, scope } = parseField(key)
    result[field] = (scope && typeof data[key] === 'object') ? x(scope, resolveSelectors(data[key])) : data[key]
  }
  return result
}

const scraper = ({driver, options}) => {
  if (typeof driver === 'string' && driver === 'puppeteer') {
    const driverPuppeteer = puppeteerDriver({
      headless: true,
      userDataDir: path.resolve(__dirname, '../puppeteer-data'),
      ...options
    })

    x.driver(driverPuppeteer)
  } else if (typeof driver === 'function') {
    x.driver(driver)
  }

  return function scrape(url, data) {
    const selectors = resolveSelectors(data)
    return new Promise((resolve, reject) => x(url, selectors).then(resolve).catch(err => reject(new ScrapingError(err))))
  }
}

module.exports = scraper
module.exports.parseField = parseField
module.exports.resolveSelectors = resolveSelectors
module.exports.ScrapingError = ScrapingError

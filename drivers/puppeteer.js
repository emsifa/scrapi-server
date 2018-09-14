/**
 * Module Dependencies
 */

/**
 * Export `driver`
 */

/**
 * Initialize the `driver`
 * with the following `options`
 *
 * @param {Object} options
 * @param {Function} fn
 * @ param {Object} [goto_options] Options that'll pass to Puppeteer's .goto() method.
 * @ param {String} [waitForSelector]  A css selector that Puppeteer ought to wait for after executing goto()
 * @return {Function}
 * @api public
 */

const moduleExists = (module) => {
  try {
    const m = require(module)
    return true
  } catch (e) {
    return false
  }
}

const requirePuppeteer = () => {
  if (moduleExists('puppeteer-core')) {
    return require('puppeteer-core')
  } else if(moduleExists('puppeteer')) {
    return require('puppeteer')
  } else {
    return null
  }
}

const driver = (options, fn, gotoOptions = {}, waitForSelector) => {
  // create above returned function's scope so
  // we re-use the same chromium page each time
  const puppeteer = requirePuppeteer()
  if (!puppeteer) {
    throw new Error(`Failed to make puppeteer driver. Missing package 'puppeteer' or 'puppeteer-core'.`)
  }

  if (moduleExists('puppeteer-core') && !options.executablePath) {
    options.executablePath = process.env['PUPPETEER_EXECUTABLE_PATH']
  }

  let page, browser
  return fn
    ? fn(ctx, done)
    : async (ctx, done) => {
        if (!browser) browser = await puppeteer.launch(options)
        if (!page) page = await browser.newPage()

        try {
          await page.goto(ctx.url, gotoOptions)
          if (typeof waitForSelector === 'string') {
            await page.waitFor(waitForSelector)
          }
          const html = await page.content()
          ctx.body = html
          done(null, ctx)
        } catch (err) {
          if (err) return done(err)
        }
      }
}
module.exports = driver

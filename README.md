SCRAPI-SERVER
================================

Scraper API server using NodeJs, x-ray, and support puppeteer driver.

## Up and Running

#### Installation

* `git clone https://www.github.com/emsifa/scrapi-server`
* `cd scrapi-server`
* Run `npm install` or `yarn`

#### Running Application

* Run `npm start` or `node app`.
* Open `localhost:3000`.

This will open scrapi playground where you can try some URL and data to scrape.

You can also open this URL (for example) to fetch JSON data:

```
http://localhost:3000/scrape?url=https://www.github.com&data[title]=title&data[meta][viewport]=meta[name='viewport']@content&data[meta][description]=meta[name='description']@content
```

## Puppeteer

Puppeteer driver let your scraper to fetch complete HTML including HTML rendered by javascript such as angular, react, vue, or some DOM that rendered after AJAX request.

#### Using 'puppeteer-core'

* `npm install -S puppeteer-core` or `yarn add puppeteer-core`
* Modify `.env` file, change `SCRAPI_DRIVER` to 'puppeteer'.
* Set `PUPPETEER_EXECUTABLE_PATH` to your google chrome/chromium executable path.

#### Using 'puppeteer'

* `npm install -S puppeteer`
* Modify `.env` file, change `SCRAPI_DRIVER` to 'puppeteer'.

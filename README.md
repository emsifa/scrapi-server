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

You can also try this simple query to check installation:

```
http://localhost:3000/scrape?url=https://www.github.com&data={"title":"title"}
```

## API Endpoints

There are 2 endpoints you can call:

1. `GET /scrape`
2. `POST /scrape` 

Each endpoints require `url` and `data` parameter.

* `url`: URL to scrape. Currently we only support `GET` method.
* `data`: Schema query (can be JSON string or object).

For example, you can open url below:

```
http://localhost:3000/scrape?url=https://www.github.com/emsifa/scrapi-server&data={"title":"title","meta":{"description":"meta[name='description']@content","thumbnail":"meta[property='og:image']@content"}}
```

Example above would scrape from URL `https://www.github.com/emsifa/scrapi-server` with schema:

```javascript
{
  "title": "title", // scrape text from <title>...</title>
  "meta": {
    // scrape content attribute from <meta name='description'/>
    "description": "meta[name='description']@content",
    // scrape content attribute from <meta property='og:image'/>
    "thumbnail": "meta[property='og:image']@content"
  }
}
```

Example above would gives us output like this:

```json
{
  "success": true,
  "data": {
    "title": "...",
    "meta": {
      "description": "...",
      "thumbnail": "https://..."
    }
  }
}
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

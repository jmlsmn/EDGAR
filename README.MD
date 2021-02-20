# EDGAR
EDGAR is a simple Node/Express web application to retrieve SEC filings by company ticker symbol.

See it running here: https://edgar-aaeu4.ondigitalocean.app/

## Prerequisites

- Node.js

## Run Locally

Clone the project:

    $git clone https://github.com/jmlsmn/EDGAR

Get dependencies:

    $npm install

Run:

    $npm start
    Navigate to http://localhost:3000/ or http://localhost:3000/filings?ticker=AAPL(to hit the api directly) in your browser.

Run Tests:

    $npm run test
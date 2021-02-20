import Parser from 'rss-parser';
import { parse as htmlParser } from 'node-html-parser';
import { fetcher } from '../util/fetchHelper';
import cacheFactory from '../util/cacheFactory';
import config from '../config';
import { 
    FILING_ERROR, 
    TICKER_ERROR, 
    TICKER_NOT_FOUND 
} from '../constants';

/**
 * RSS Parser
 */
const parser = new Parser(); 

/**
 * Returns SEC Filings using the provided Ticker
 * @param {*} ticker - Company Symbol
 * @param {*} skip - Number of records to skip 
 * @param {*} take - Number of records to take 
 */
export async function getFilings(ticker, skip = 0, take = 40) {
    if (!ticker) return [];

    let tickerId = cacheFactory.instance().get(ticker);
    if(!tickerId) { 
        tickerId = await retrieveTickerId(ticker);
        cacheFactory.instance().set(ticker, tickerId);
    }
    return await retrieveFilingFeed(tickerId, skip, take);
}

/**
 * Makes a request to retrieve the CIK number
 * @param {string} ticker - Company Symbol
 */
async function retrieveTickerId(ticker) {
    const body = {
        keysTyped: ticker,
        narrow: true
    };

    const response = await fetcher(config.tickerUrl,'POST', TICKER_ERROR, JSON.stringify(body));

    const results = await response.json();
    if (results.hits && results.hits.hits.length) {
        return results.hits.hits[0]._id;
    }
    throw TICKER_NOT_FOUND;
}

/**
 * Retrieves and parses filing RSS feed
 * @param {string} tickerId - SEC CIK Number
 * @param {int} skip - Number of records to skip
 * @param {int} take - Number of records to take
 */
async function retrieveFilingFeed(tickerId, skip, take) {
    const feedUrl = `${config.filingFeedUrl}&CIK=${tickerId}&start=${skip}&count=${take}`;
    const feed = await parser.parseURL(feedUrl);

    const results = await Promise.all(
        feed.items.map(async (item) => {
            return {
                name: item.title,
                filingDate: item.pubDate,
                filingUrl: await extractFilingUrl(item.link)
            }
        }
    ));

    return {
        companyName: feed.title,
        filings: results
    };
}

/**
 * Makes a request to the provided indexUrl to extract and return the url of the filing document
 * @param {string} indexUrl - Url of the filing index
 */
async function extractFilingUrl(indexUrl) {
    const fileExtension = '.htm';
    if (!indexUrl || !indexUrl.endsWith(fileExtension)) return '';

    const headerUrl = indexUrl.replace(fileExtension,`-headers${fileExtension}`);

    const documentBaseUrl = indexUrl.substring(0, indexUrl.lastIndexOf('/') + 1);
    const response = await fetcher(headerUrl, 'GET', FILING_ERROR);

    const root = htmlParser(await response.text());
    const preNodeHtml = htmlParser(root.querySelector('pre').innerHTML);

    const hrefResult = preNodeHtml.querySelectorAll('a')
        .find(ahref => {
            const link = ahref.getAttribute('href');
            return link && (link.toLowerCase().endsWith(fileExtension) || link.toLowerCase().endsWith(`${fileExtension}l`));
        });

    const filename = hrefResult ? hrefResult.getAttribute('href') : '';

    return hrefResult && filename ? `${documentBaseUrl}${filename}` : '';
}
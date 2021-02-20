import { jest } from '@jest/globals';
import 'regenerator-runtime/runtime'

jest.mock('rss-parser');
import Parser from 'rss-parser';

jest.mock('node-html-parser');
import { parse as htmlParser } from 'node-html-parser';

jest.mock('node-fetch');
import fetch from 'node-fetch';

import cacheFactory from '../util/cacheFactory';
import * as filingService from '../services/filingService';
import { TICKER_NOT_FOUND } from '../constants';

test('getFilings should return empty array if passed an emtpy ticker', async () => {
    //Assert
    expect(await filingService.getFilings('')).toEqual([]);
});

test('getFilings should save ticker to cache', async () => {
    //Arrange
    const ticker = 'AAPL';
    const tickerId = 12345;
    cacheFactory.init();

    const response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return { hits: {
                hits: [{_id: tickerId}]
            }};
        },
    });
    fetch.mockImplementation(()=> response);

    const feedResponse = Promise.resolve({
        title: 'Company Name',
        items: [{
            title: '10-K',
            pubDate: '2021-01-01',
            link: 'https://example.com/'
        }]
    });
    Parser.prototype.parseURL.mockImplementation(() => feedResponse);

    //Act
    const data = await filingService.getFilings(ticker);

    //Assert
    expect(cacheFactory.instance().get(ticker)).toEqual(tickerId);
});

test('getFilings should return result', async () => {
    //Arrange
    const ticker = 'AAPL';
    const tickerId = 12345;
    cacheFactory.init();

    const response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return { hits: {
                hits: [{_id: tickerId}]
            }};
        },
    });
    fetch.mockImplementation(()=> response);

    const feedResponse = Promise.resolve({
        title: 'Company Name',
        items: [{
            title: '10-K',
            pubDate: '2021-01-01',
            link: 'https://example.com/'
        }]
    });
    Parser.prototype.parseURL.mockImplementation(() => feedResponse);

    //Act
    const data = await filingService.getFilings(ticker);
    const expected = {
        companyName: 'Company Name',
        filings: [{
            name: '10-K',
            filingDate: '2021-01-01',
            filingUrl: ''
        }]
    };

    //Assert
    expect(data).toEqual(expected);
});

test('getFilings should throw exception when ticker is not found', async () => {
    //Arrange
    const ticker = 'XYZ';
    cacheFactory.init();

    const response = Promise.resolve({
        ok: true,
        status: 200,
        json: () => {
            return { hits: {
                hits: []
            }};
        },
    });
    fetch.mockImplementation(()=> response);

    
    //Act
    expect.assertions(1);

    try {
        await filingService.getFilings(ticker);
    } catch (e) {
         //Assert
         expect(e).toMatch(TICKER_NOT_FOUND);
    }
});




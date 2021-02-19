import fetch from 'node-fetch';

/**
 * Wrapper around node-fetch to handle status codes
 * @param {*} url - Url to fetch
 * @param {*} method - HTTP Method
 * @param {*} errorToThrow - Error to throw in case of invalid status
 * @param {*} body - Optional body parameter
 */
export async function fetcher(url, method, errorToThrow, body) {
    const response = await fetch(url, {
        body,
        method
    });

    const { status } = response;
    if (status < 200 || status >= 300) {
        throw errorToThrow;
    }

    return response;
}
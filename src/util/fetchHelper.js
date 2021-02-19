import fetch from 'node-fetch';

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
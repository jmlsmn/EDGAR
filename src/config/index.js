const config = {
    tickerUrl: 'https://efts.sec.gov/LATEST/search-index',
    filingFeedUrl: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&owner=exclude&output=atom',
    defaultCacheDurationSeconds: 600,
    pageLimits: [
        { lower: 0, upper: 20 }, //10 records
        { lower: 20, upper: 40 }, //20 records
        { lower: 40, upper: 100 } // 40 records
    ]
};

export default config;
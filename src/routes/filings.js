import { Router } from 'express';
import middleware from '../middleware';
import { getFilings } from '../services/filingService';

const router = Router();

/**
 * GET filings route
 */
router.get('/', middleware.cacheHandler(), middleware.routeHandler(async (req, res) => {
    const { ticker, skip, take } = req.query;
    return res.send(await getFilings(ticker, skip, take));
}));

export default router;
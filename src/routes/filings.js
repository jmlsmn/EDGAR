import { Router } from 'express';
import routeHandler from '../middleware/routeHandler';
import { getFilings } from '../services/filingService';


const router = Router();

router.get('/', routeHandler(async (req, res) => {
    const { ticker, skip, take } = req.query;
    return res.send(await getFilings(ticker, skip, take));
}));

export default router;
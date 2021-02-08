import {Router} from 'express';
import fs from 'fs';
import path from 'path';
const router = Router();

router.post('/saveSale', async (req, res) => {
    
    // const {seller, shippingMethod, orderNum, buyerName, buyerPhone, buyerEmail, shippingAdress,
    //         shippingCity, shippingRegion, shippingCountry, items} = req.body;

    const newInsert = {
        name: 'pablo'
    }

    const pathDb = path.resolve(__dirname, '../db/dataBase.json');

    try {
        const resp = await fs.readFileSync(pathDb);
        const response = await JSON.parse(resp.toString());
        
        const save = [...response, newInsert];
    
        return res.json({
            ok: true,
            data:save
        })
    } catch(err) {

    }
})
    
router.get('/', async (req, res) => {
    try {

        const pathDb = path.resolve(__dirname, '../db/dataBase.json');

        const resp = await fs.readFileSync(pathDb);
        const response = await JSON.parse(resp.toString());

        return res.status(200).json({
            ok: true,
            data:response
        })

    } catch(err) {
        console.log(err)
    }
})

export default router;
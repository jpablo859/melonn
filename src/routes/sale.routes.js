import {Router} from 'express';
import fs from 'fs';
import path from 'path';
const router = Router();

const pathDb = path.resolve(__dirname, '../db/dataBase.json');

const list = async () => {
    try {
        const resp = await fs.readFileSync(pathDb);
        const response = await JSON.parse(resp.toString());

        return response;
    }  catch (err) {
        res.status(500).json({
            ok:false,
            data: {
                message: 'Internal error'
            }
        })
    }
}

const getDate = () => {
    const date = new Date();
    const month = date.getMonth()+1 < 10 ? `0${date.getMonth()+1}` : date.getMonth()+1;
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    const toDay = `${date.getFullYear()}-${month}-${day} ${hours}:${minutes}`;

    return toDay;
}

const getInternalOrder = () => {
    const date = new Date();
    return `${Date.parse(date)}${Math.floor((Math.random() * 100))}`;
}

router.post('/saveSale', async (req, res) => {
    
    // const {seller, shippingMethod, orderNum, buyerName, buyerPhone, buyerEmail, shippingAdress,
    //         shippingCity, shippingRegion, shippingCountry, items} = req.body;

    const date = getDate();

    let newInsert = req.body;
    newInsert.date = date;
    newInsert.internalOrderNum = getInternalOrder();

    try {
        
        const response = await list();
        
        const save = [...response, newInsert];

        fs.writeFileSync(pathDb, JSON.stringify(save));
    
        return res.status(200).json({
            ok: true,
            data:save
        })

    } catch(err) {
        res.status(500).json({
            ok:false,
            data: {
                message: 'Internal error'
            }
        })
    }
})
    
router.get('/', async (req, res) => {
    try {

        const response = await list();

        return res.status(200).json({
            ok: true,
            data:response
        })

    } catch(err) {
        console.log(err)
    }
})
    
router.get('/detail/:id', async (req, res) => {
    try {

        const {id} = req.params;
        const response = await list();

        const data = response.find(({internalOrderNum}) => internalOrderNum === id);

        if (!data) return res.status(400).json({
            ok:false,
            data: {
                message: `D'nt exist the order number`
            }
        })

        return res.status(200).json({
            ok: true,
            data
        })

    } catch(err) {
        console.log(err)
    }
})

export default router;
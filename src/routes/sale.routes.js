import {Router} from 'express';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

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
    const toDay = `${date.getFullYear()}-${month}-${day}`;

    return {
        date: toDay,
        hour: `${hours}:${minutes}`
    }
}

const getInternalOrder = () => {
    const date = new Date();
    return `${Date.parse(date)}${Math.floor((Math.random() * 100))}`;
}

const ArrayBussinesDay = (date, NotbussinetDay) => {

    let data = [];
    let i = 1;
    let newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);

    for(let x = 0; x<=i; x++) {
        newDate.setDate(newDate.getDate() + 1);
        let newYear = newDate.getFullYear();
        let newMonth = newDate.getMonth() < 10 ? `0${newDate.getMonth() + 1}` : newDate.getMonth() + 1;
        let newDay = newDate.getDate() < 10 ? `0${newDate.getDate()}` : newDate.getDate();
        let date2 = `${newYear}-${newMonth}-${newDay}`;
        
        let filter = NotbussinetDay.find(item => item === date2);

        if(!filter) data = [...data,date2];
        if(data.length < 10){
            i++;
        } 
    }

    return data;

}

router.post('/saveSale', async (req, res) => {
    
    const API_KEY = '8hu71URNzm7FCLV9LfDPd9Gz61zN2diV6kG2hDEw';

    const date = getDate();
    
    let newInsert = req.body;
    newInsert.date = `${date.date} ${date.hour}`;
    newInsert.internalOrderNum = getInternalOrder();

    const fnReduce = (ac, {weight}) => ac+=parseFloat(weight);
    
    try {

        const NotBussinesDayApi = await axios.get(`https://yhua9e1l30.execute-api.us-east-1.amazonaws.com/sandbox/off-days`, {
            headers: {
                'x-api-key': API_KEY
            }
        })

        const bussinesDay = await ArrayBussinesDay(date.date, NotBussinesDayApi.data);

        const totWeight = newInsert.items.reduce(fnReduce, 0);
        
        const {data:shpMethodDetail} = await axios.get(`https://yhua9e1l30.execute-api.us-east-1.amazonaws.com/sandbox/shipping-methods/1`, {
            headers: {
                'x-api-key': API_KEY
            }
        });

        if(totWeight > shpMethodDetail.rules.availability.byWeight.max) {
            return res.json({
                ok: false,
                data: {
                    message: 'Exceeds weight'
                }
            })
        }
        
        const response = await list();
        
        const save = [...response, newInsert];

        fs.writeFileSync(pathDb, JSON.stringify(save));
    
        return res.json({
            ok: true,
            data:{
                message: 'Successfully stored order'
            }
        })

    } catch(err) {
        res.json({
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
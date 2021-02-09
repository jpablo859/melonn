import express from 'express'
import cors from 'cors';
import saleRouter from './routes/sale.routes';

const app = express();


app.set('PORT', process.env.PORT || 4000);

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api/melonn', saleRouter);

export default app;
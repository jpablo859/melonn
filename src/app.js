import express from 'express'
import saleRouter from './routes/sale.routes';

const app = express();

app.set('PORT', process.env.PORT || 3000);

app.use('/api/tasks', saleRouter);

export default app;
import app from './app';
import 'dotenv';

app.listen(app.get('PORT'));

console.log(`server on port ${process.env.PORT || 3000}`);
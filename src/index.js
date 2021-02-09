import app from './app';

app.listen(app.get('PORT'));

console.log(`server on port ${process.env.PORT || 4000}`);
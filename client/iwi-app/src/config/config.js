const heroku = 'https://iwi-app.herokuapp.com';
const local = 'http://localhost:9999';

const URI = process.env.NODE_ENV === 'development' ? local : heroku;

export default URI;
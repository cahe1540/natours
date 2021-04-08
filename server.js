//required modules
const mongoose = require('mongoose');
const dotenv = require('dotenv');
//add config env variables

//global uncaught exception handler
process.on('uncaughtException', (err) => {

  console.log('Uncaught exception... Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});


dotenv.config({ path: './config.env' });

const app = require('./app.js');

//database address
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

//create connection to DB using mongoose.connect
mongoose
  .connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  // eslint-disable-next-line no-unused-vars
  .then((con) => console.log('\ndb.connections successful...'));

/************BEGIN SERVER LISTEN*/
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {

  console.log('Unhandled rejection... Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

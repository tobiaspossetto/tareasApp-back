const express = require('express');
const logger = require('morgan');
const cors = require('cors')

require('./libs/db-connection')
const app = express();


//configure express

app.set('port', process.env.PORT || 4000);


//middleware
app.use(cors());
app.use(logger('dev'))
app.use(express.json());


//rutes

app.use('/users', require('./routes/user'))
app.use('/task',require('./routes/task'))

// Starting the server
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
  });
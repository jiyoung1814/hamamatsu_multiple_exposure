const express =  require("express");
const app = express();
const db = require('./db/index');

app.set('port', 8000);

db.connect();

const router = require('./routes/index');

// app.get('/', (req, res) =>{
//     console.log(`Request received from: ${req.ip}`);
// })

app.listen(app.get('port'), () =>{
    console.log('hamamatsu server start on port ', app.get('port'));
})

app.use(express.json()); 
app.use('/', router);
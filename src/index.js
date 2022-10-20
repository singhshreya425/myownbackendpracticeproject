const express = require('express');
var bodyParser = require('body-parser');

const route = require('./routes/test.js');
const route1 = require('./routes/route.js');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/testapi", function(req,res){
    console.log("test")
    res.send({data:"test api"})
})

app.use('/', route);
app.use('/', route1);

app.listen(process.env.PORT || 3000, function() {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});

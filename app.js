const request = require('request');
const express = require('express');
const path = require('path');
const axios = require('axios');
require("dotenv").config();

const app = express();

app.use(express.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get('/', async(req, res) => {
    const START_INDEX = 0;
    const END_INDEX = 0;
    const result = await axios.get(`http://openapi.seoul.go.kr:8088/${process.env.API_KEY}/json/culturalEventInfo/1/100/`);
    // console.log("result: ", result.data.culturalEventInfo.result);
    console.log("RESULT: ", result.data.culturalEventInfo.RESULT);
    console.log("-------------------------------------------------------");
    console.log("row: ", result.data.culturalEventInfo.row);
    console.log("====================================================");
    // console.log("result: ", result);
    const items = result.data.culturalEventInfo.row;
    res.render('index', {items});

});



app.listen(3000, () => console.log('PORT 3000....!!'));
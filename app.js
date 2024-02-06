const express = require('express');
const path = require('path');
const axios = require('axios');
require("dotenv").config();

const app = express();

app.use(express.urlencoded({ extended: true})); // URL-encoded 데이터 파싱
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json()) // JSON 데이터 파싱

app.get('/', (req, res) => {
    res.redirect('/index');
})

app.get('/index', async(req, res) => {
    let {date, query, selectOption} = req.query;
    let indexNum = 100;
    if(!date) { date=' ';}
    if(!query) {query=' ';}
    if(!selectOption) {selectOption=' ';}
    const result = await axios.get(`http://openapi.seoul.go.kr:8088/${process.env.API_KEY}/json/culturalEventInfo/1/${indexNum}/${selectOption}/${query}/${date}`);
    if(result.data.RESULT && result.data.RESULT.CODE === 'INFO-200') {
        const items = 'INFO-200'
        return res.render('index', {items, selectOption});
    }
    const items = result.data.culturalEventInfo.row;
    res.render('index', {items, selectOption});
});

app.post('/more', async(req, res) => {
    const {cur, selectOption} = req.body;
    const result = await axios.get(`http://openapi.seoul.go.kr:8088/${process.env.API_KEY}/json/culturalEventInfo/${cur+1}/${cur+100}/${selectOption}`);
    if('culturalEventInfo' in result.data) {
        const resultObj = {};
        const contentArr = [];
        const items = result.data.culturalEventInfo.row;
        for(item of items) {
            const data = `<div class="content">
                            <div class="content-img-wrap">
                                <img class="content-img" src="${item.MAIN_IMG}" alt="${item.TITLE}">
                            </div>
                            <div class="content-text-wrap">
                                <p class="content-text codename">${item.CODENAME}</p>
                                <p class="content-text title">${item.TITLE}</p>
                                <p class="content-text date">${item.DATE}</p>
                                <p class="content-text place">${item.PLACE}</p>
                            </div>
                          </div>`
            contentArr.push(data);
        }
        resultObj.contentArr = contentArr;
        return res.json(resultObj);

    } else {
        return res.json('noData');
    }
})

app.get('/index/detail', (req, res) => {
    res.render('detail');
});



app.listen(3000, () => console.log('PORT 3000....!!'));

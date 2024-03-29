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
    if(!date) { date=' ';}
    if(!query) {query=' ';}
    if(!selectOption) {selectOption=' ';}

    const search = query.replace(/[\[\]]/g, ''); // 대괄호는 에러가 발생함. 정규식으로 제거. (api문의글에서 참고, +검색 기능이 완벽하지 않은거 같음.)
    const result = await axios.get(`http://openapi.seoul.go.kr:8088/${process.env.API_KEY}/json/culturalEventInfo/1/100/${selectOption}/${search}/${date}`);
    if(result.data.RESULT && result.data.RESULT.CODE === 'INFO-200') { // INFO-200: 해당하는 데이터가 없음.
        const items = 'INFO-200'
        return res.render('index', {items, selectOption, query, date});
    }
    
    const items = result.data.culturalEventInfo.row;
    res.render('index', {items, selectOption, query, date});
});

app.post('/more', async(req, res) => {
    let {cur, selectOption, query, date} = req.body;
    const search = query.replace(/[\[\]]/g, '');
    const result = await axios.get(`http://openapi.seoul.go.kr:8088/${process.env.API_KEY}/json/culturalEventInfo/${cur+1}/${cur+100}/${selectOption}/${search}/${date}`);
    if('culturalEventInfo' in result.data) {
        const resultObj = {};
        const contentArr = [];
        const items = result.data.culturalEventInfo.row;
        for(item of items) {
            const data = `<div class="content" onclick="detail(this)" data-lot="${ item.LOT }" data-lat="${ item.LAT }">
                            <div class="content-img-wrap">
                                <img class="content-img" src="${ item.MAIN_IMG }" alt="${ item.TITLE }">
                            </div>
                            <div class="content-text-wrap">
                                <p class="content-text codename">${ item.CODENAME }</p>
                                <p class="content-text title">${ item.TITLE }</p>
                                <p class="content-text date">${ item.DATE }</p>
                                <p class="content-text place">${ item.PLACE }</p>
                            </div>
                          </div>
                          <div class="content-detail-wrap">
                          <div class="content-detail">
                              <div class="content-detail-info-wrap">
                                  <div class="content-detail-event-wrap">
                                      <div class="content-detail-img-wrap">
                                          <img class="content-detail-img" src="${ item.MAIN_IMG }" alt="">
                                      </div>
                                      <div class="content-detail-text-wrap">
                                          <p class="detail-title">${ item.TITLE }</p>
                                          <div class="content-detail-text">
                                              <div class="tag">분류</div>
                                              <div class="tag-text">${ item.CODENAME }</div>
                                          </div>
                                          <div class="content-detail-text">
                                              <div class="tag">장소</div>
                                              <div class="tag-text">${ item.PLACE }</div>
                                          </div>
                                          <div class="content-detail-text">
                                              <div class="tag">기간</div>
                                              <div class="tag-text">${ item.DATE }</div>
                                          </div>
                                          <div class="content-detail-text">
                                              <div class="tag">대상</div>
                                              <div class="tag-text">${ item.USE_TRGT }</div>
                                          </div>
                                          <div class="content-detail-text">
                                              <div class="tag">요금</div>
                                              <div class="tag-text">${ item.USE_FEE }</div>
                                          </div>
                                          <a class="org-link" href="${ item.ORG_LINK }" target="_blank">홈페이지 바로가기<i class="fa-solid fa-link"></i></a>
                                      </div>
                                  </div>
                                  <div class="content-detail-place-wrap">
                                      <p class="place-title">위 치</p>
                                      <div id="map"></div>
                                  </div>
                                  <div class="content-detail-close-wrap">
                                      <button class="content-detail-close-btn" onclick="closeDetailBtn(this)">닫기</button>
                                  </div>
                              </div>
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

app.listen(3000, () => console.log('PORT 3000....!!'));
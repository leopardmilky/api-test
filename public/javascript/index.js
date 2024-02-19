const topWrap = document.getElementById('top-wrap');
topWrap.addEventListener('click', function(){ window.location.href = '/index'})

const arrowBtn = document.getElementById('arrow-up-btn');
arrowBtn.addEventListener('click', function(){
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
})

const moreBtn = document.getElementById('more-btn');
moreBtn.addEventListener('click', async function() {
    const noResult = document.getElementById('no-result');
    if(noResult) { noResult.remove(); }
    const cnt = document.getElementsByClassName('content');
    const selectOption = document.getElementById('select-codename').value;
    const date = document.getElementById('search-date').value;
    const query = document.getElementById('search-content').value;
    const data = {cur: cnt.length, selectOption: selectOption, date: date, query: query}
    const result = await axios.post('/more', data);
    if(result.data === 'noData') {
        window.alert('모든 데이터를 불러왔습니다.')
        document.getElementById('more-wrap').remove();
    } else {
        const mainWrap = document.getElementById('main-wrap');
        for(item of result.data.contentArr) {
            mainWrap.insertAdjacentHTML('beforeend', item);
        }
    }
});

function submitForm() {
    const searchDate = document.getElementById('search-date').value;
    const searchContent = document.getElementById('search-content').value;
    document.getElementById('search-date-hidden').value = searchDate
    document.getElementById('search-content-hidden').value = searchContent
    document.getElementById("select-form").submit();
}

function detail(e) {
    document.body.style.overflow = 'hidden';
    const contentDetailWrap = e.nextElementSibling;
    contentDetailWrap.style.display = 'flex';

    const lot = e.getAttribute('data-lot');
    const lat = e.getAttribute('data-lat');
    const targetElement = e.nextElementSibling.children[0].children[0].children[0].nextElementSibling.children[1];

    const map = new naver.maps.Map(targetElement, { center: new naver.maps.LatLng(lot, lat), zoom: 16 });
    new naver.maps.Marker({ position: new naver.maps.LatLng(lot, lat), map: map });
}

function closeDetailBtn(e) {
    document.body.style.overflow = 'auto';
    const contentDetailWrap = e.parentElement.parentElement.parentElement.parentElement;
    contentDetailWrap.style.display = 'none';
}

document.addEventListener('click', (e) => {
    const contentDetailWrap = e.target.getAttribute('class');
    if(contentDetailWrap === 'content-detail-wrap') {
        e.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
})



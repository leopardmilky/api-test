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
    const data = {cur: cnt.length, selectOption: selectOption}
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

function detail(e) {
    const data = e.getAttribute('data-detail')
    console.log("data: ", data)
}

function submitForm() {
    document.getElementById("select-form").submit();
}
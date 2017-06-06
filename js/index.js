document.querySelector("#add").addEventListener('click', addCom);

let commds = {
    'oil' : "https://www.quandl.com/api/v3/datasets/OPEC/ORB.json",
    'gold': "https://www.quandl.com/api/v3/datasets/LBMA/GOLD.json",
    'corn': "https://www.quandl.com/api/v3/datasets/TFGRAIN/CORN.json",
    'wheat' : "https://www.quandl.com/api/v3/datasets/WORLDBANK/WLD_SOYBEAN_OIL.json"
}



function newEntry(commd,price) {
    const item = document.createElement('li')
    item.classList.add('listItem')
    item.innerHTML = `<strong>${commd.commodity}</strong> : Current Price ${price}
            <button type="button" class="btn btn-yellow">
            Favorite
        </button>

        <button type="button" class="btn btn-danger">
            delete
        </button>`
    return item
}

function addCom() {
    const commd = {
        commodity: document.getElementById('commodity').value
    }
    const list = document.querySelector('#list')
    let price = 0
    $.get(commds[document.getElementById('commodity').value.toLowerCase()], function(data, status){
        price = data.dataset.data[0][1]
        list.insertBefore(newEntry(commd, price),document.querySelector('li'))
        document.querySelector('.btn-yellow').addEventListener('click', favFunct)
        document.querySelector('.btn-danger').addEventListener('click', deleteFunct)
    });
    document.getElementById('commodity').value = ''
}
function favFunct(){
    if(this.parentElement.style.backgroundColor == ''){
        this.parentElement.style.backgroundColor = 'yellow'
    }
    else{
        this.parentElement.style.backgroundColor = ''
    }
}
function deleteFunct(){
    this.parentElement.remove(this.parentElement)
}
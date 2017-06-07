document.querySelector("#add").addEventListener('click', addCom);

let commds = {
    'crude oil': "OPEC/ORB.json",
    'natural gas' : "CHRIS/CME_NG1.json",
    'coal' : "ODA/PCOALAU_USD.json",
    'gold': "WORLDBANK/WLD_GOLD.json",
    'sliver' : "WORLDBANK/WLD_SILVER.json",
    'copper' : "ODA/PCOPP_USD.json",
    'corn': "TFGRAIN/CORN.json",
    'wheat': "ODA/PWHEAMT_USD.json",
    'rice' : "TFGRAIN/SOYBEANS.json",
    'tea' : "ODA/PTEA_USD.json",
    'olive oil' : "ODA/POLVOIL_USD.json",
    'beef' : "ODA/PBEEF_USD.json",
    'bananas': "PBANSOP_USD.json",
    'coconut': "WORLDBANK/WLD_COPRA.json",
    'rubber' : "ODA/POLVOIL_USD.json",
    'cotton' : "ODA/PCOTTIND_USD.json",
    'wood': "ODA/PLOGSK_USD.json",
    'wool' : "ODA/PWOOLC_USD.json"
}

function newEntry(commd, price) {
    const item = document.createElement('li')
    item.classList.add('listItem')
    commd.commodity = capitalizeFirstLetter(commd.commodity)
    item.innerHTML = `
        <div class ="card">
        ${commd.commodity}
            <br>
        Today's Price: $${price}
            <br>
            <button type="button" class="btn btn-yellow">
            Favorite
        </button>
        <button type="button" class="btn btn-danger">
            delete
        </button>
        </div>
        `
    item.style.fontSize = "medium"
    return item
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function addCom() {
    const commd = {
        commodity: document.getElementById('commodity').value
    }
    const list = document.querySelector('#list')
    $.ajax({
        type : "GET",
        dataType: "json",
        url : 'https://www.quandl.com/api/v3/datasets/' + commds[document.getElementById('commodity').value.toLowerCase()] + '?api_key=2NTN3pfHTxvHT3ak4G9C',
        success : function (data) {
            let price = data.dataset.data[0][1]
            list.insertBefore(newEntry(commd, price), document.querySelector('li'))
            document.querySelector('.btn-yellow').addEventListener('click', favFunct)
            document.querySelector('.btn-danger').addEventListener('click', deleteFunct)
            document.getElementById('commodity').placeholder = 'Enter a commodity'
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            document.getElementById('commodity').placeholder = 'Unknown commodity'
        }
    });
    document.getElementById('commodity').value = ''
}

function favFunct() {
    if (this.parentElement.style.backgroundColor == '') {
        this.parentElement.style.backgroundColor = '#ff0000'
        $(this.parentElement).addClass('animated pulse infinite')
    } else {
        this.parentElement.style.backgroundColor = ''
        $(this.parentElement).removeClass('animated pulse infinite')
    }
}

function deleteFunct() {
    this.parentElement.remove(this.parentElement)
}
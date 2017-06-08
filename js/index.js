const app = {
    init() {
        document.querySelector("#add").addEventListener('click', this.addCom.bind(this))
        this.commds = {
            'crude oil': "OPEC/ORB.json",
            'natural gas': "CHRIS/CME_NG1.json",
            'coal': "ODA/PCOALAU_USD.json",
            'gold': "WORLDBANK/WLD_GOLD.json",
            'sliver': "WORLDBANK/WLD_SILVER.json",
            'copper': "ODA/PCOPP_USD.json",
            'corn': "TFGRAIN/CORN.json",
            'wheat': "ODA/PWHEAMT_USD.json",
            'rice': "TFGRAIN/SOYBEANS.json",
            'tea': "ODA/PTEA_USD.json",
            'olive oil': "ODA/POLVOIL_USD.json",
            'beef': "ODA/PBEEF_USD.json",
            'bananas': "PBANSOP_USD.json",
            'coconut': "WORLDBANK/WLD_COPRA.json",
            'rubber': "ODA/POLVOIL_USD.json",
            'cotton': "ODA/PCOTTIND_USD.json",
            'wood': "ODA/PLOGSK_USD.json",
            'wool': "ODA/PWOOLC_USD.json"
        }
        if (JSON.parse(localStorage.getItem("added")) == undefined) {
            this.added = [];
            localStorage.setItem("added", JSON.stringify(added));
        }
        this.loadSaved()
    },

    newEntry(commd, price) {
        const item = document.createElement('li')
        item.classList.add('listItem')
        commd.commodity = app.capitalizeFirstLetter(commd.commodity)
        item.innerHTML =
            `
            <div class ="card">
                <div>
                    <p>${commd.commodity}</p>
                    Today's Price: $${price}
                    <button type="button" class="btn btn-yellow">
                        Favorite
                    </button>
                    <button type="button" class="btn btn-danger">
                        delete
                    </button>
                    <button type="button" class="btn btn-primary up">
                        &#8593
                    </button>
                    <button type="button" class="btn btn-primary down">
                        &#8595
                    </button>
                </div>
            </div>
        `
        item.style.fontSize = "medium"
        return item
    },

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    addCom(ev) {
        ev.preventDefault()
        this.onCreate(document.getElementById('commodity').value.toLowerCase(), false)
    },

    favFunct() {
        if (this.parentElement.parentElement.style.backgroundColor == '') {
            this.parentElement.parentElement.style.backgroundColor = '#ff0000'
            $(this.parentElement.parentElement).addClass('animated pulse infinite')
        } else {
            this.parentElement.parentElement.style.backgroundColor = ''
            $(this.parentElement.parentElement).removeClass('animated pulse infinite')
        }
    },

    deleteFunct() {
        let added = JSON.parse(localStorage.getItem("added"))
        const pos = added.indexOf(this.parentElement.querySelector('p').innerHTML.toLowerCase())
        added.splice(pos, 1)
        this.parentElement.parentElement.remove(this.parentElement)
        localStorage.setItem("added", JSON.stringify(added));
    },

    moveUp() {
        let added = JSON.parse(localStorage.added)
        const pos = added.indexOf(this.parentElement.querySelector('p').innerHTML.toLowerCase())
        if (pos != added.length - 1) {
            let temp = added[pos]
            added[pos] = added[pos + 1]
            added[pos + 1] = temp
        }
        localStorage.setItem("added", JSON.stringify(added));
        app.loadSaved()
    },

    moveDown() {
        let added = JSON.parse(localStorage.added)
        const pos = added.indexOf(this.parentElement.querySelector('p').innerHTML.toLowerCase())
        if (pos != 0) {
            let temp = added[pos]
            added[pos] = added[pos - 1]
            added[pos - 1] = temp
        }
        localStorage.setItem("added", JSON.stringify(added));
        app.loadSaved()
    },

    loadSaved() {
        document.querySelector('ul').innerHTML = ''
        let added = JSON.parse(localStorage.added)
        added.forEach(function (entry) {
            app.onCreate(entry, true)
        })
    },

    onCreate(entry, reload) {
        if (this.commds[entry.toLowerCase()] != undefined) {
            $.ajax({
                type: "GET",
                dataType: "json",
                async: false,
                url: 'https://www.quandl.com/api/v3/datasets/' + this.commds[entry.toLowerCase()] + '?api_key=2NTN3pfHTxvHT3ak4G9C',
                success: function (data) {
                    const commd = {
                        commodity: entry
                    }
                    const list = document.querySelector('#list')
                    let price = data.dataset.data[0][1]
                    list.insertBefore(app.newEntry(commd,price), document.querySelector('li'))
                    if (!reload) {
                        let added = JSON.parse(localStorage.added)
                        added.push(entry)
                        localStorage.setItem("added", JSON.stringify(added));
                    }
                    document.querySelector('.btn-yellow').addEventListener('click', app.favFunct)
                    document.querySelector('.btn-danger').addEventListener('click', app.deleteFunct)
                    document.querySelector('.up').addEventListener('click', app.moveUp)
                    document.querySelector('.down').addEventListener('click', app.moveDown)
                    document.getElementById('commodity').placeholder = 'Enter a commodity'
                    document.getElementById('commodity').value = ''
                },
            });
        } else {
            document.getElementById('commodity').placeholder = 'Unknown commodity'
            document.getElementById('commodity').value = ''
        }
    }
}

app.init()
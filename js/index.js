const app = {
    init() {
        document.querySelector("#add").addEventListener('click', this.addCom.bind(this))
        this.template = document.querySelector('.template')
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
            localStorage.setItem("added", JSON.stringify([]));
        }
        if (JSON.parse(localStorage.getItem("accountValue")) == undefined) {
            localStorage.setItem("accountValue", "1000000");
        }
        if (JSON.parse(localStorage.getItem("portfolioValue")) == undefined) {
            localStorage.setItem("portfolioValue", "0");
        }

        document.querySelector("#wallet").textContent = localStorage.getItem("accountValue")
        document.querySelector("#portfolio").textContent = localStorage.getItem("portfolioValue")
        this.revert = ''
        this.loadSaved()
    },

    newEntry(commd, price) {
        const item = this.template.cloneNode(true)
        item.classList.remove('template')
        item.classList.add('listItem')
        commd.commodity = app.capitalizeFirstLetter(commd.commodity)
        item
            .querySelector('.name')
            .textContent = commd.commodity

        item
            .querySelector('.name')
            .addEventListener('click',app.click)

        item
            .querySelector('.name')
            .addEventListener('blur',app.blured)

        item
            .querySelector('.price')
            .textContent = price
        item.style.fontSize = "medium"
        item.querySelector('.btn-yellow').addEventListener('click', app.favFunct)
        item.querySelector('.btn-danger').addEventListener('click', app.deleteFunct)
        item.querySelector('.up').addEventListener('click', app.moveUp)
        item.querySelector('.down').addEventListener('click', app.moveDown)
        if (commd.isFavorite) {
            app.favFunct.bind(item.querySelector('.btn-yellow'))()
        }
        return item
    },

    blured(){
        this.contentEditable="false"

        if(app.commds[this.textContent.toLowerCase()] == undefined){
            this.textContent = app.revert
        }
    },

    click(){
        app.revert = this.textContent
        this.contentEditable="true"
    },

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    addCom(ev) {
        ev.preventDefault()
        const commd = {
            commodity: document.getElementById('commodity').value.toLowerCase(),
            isFavorite: false
        }
        this.onCreate(commd, false)
    },

    favFunct() {
        if (this.parentElement.parentElement.style.backgroundColor == '') {
            this.parentElement.parentElement.style.backgroundColor = '#ff0000'
            $(this.parentElement.parentElement).addClass('animated pulse infinite')

            let added = JSON.parse(localStorage.getItem("added"))
            let name = this.parentElement.querySelector('.name').innerHTML
            const pos = app.findIndex(added, name)
            added[pos].isFavorite = true
            localStorage.setItem("added", JSON.stringify(added));

        } else {
            this.parentElement.parentElement.style.backgroundColor = ''
            $(this.parentElement.parentElement).removeClass('animated pulse infinite')

            let added = JSON.parse(localStorage.getItem("added"))
            let name = this.parentElement.querySelector('.name').innerHTML
            const pos = app.findIndex(added, name)
            added[pos].isFavorite = false
            localStorage.setItem("added", JSON.stringify(added));
        }
    },

    deleteFunct() {
        let added = JSON.parse(localStorage.getItem("added"))
        let name = this.parentElement.querySelector('.name').innerHTML
        const pos = app.findIndex(added, name)
        added.splice(pos, 1)
        this.parentElement.parentElement.remove(this.parentElement)
        localStorage.setItem("added", JSON.stringify(added));
    },

    moveUp() {
        let added = JSON.parse(localStorage.getItem("added"))
        let name = this.parentElement.querySelector('.name').innerHTML
        const pos = app.findIndex(added, name)

        if (pos != added.length - 1) {
            let temp = added[pos]
            added[pos] = added[pos + 1]
            added[pos + 1] = temp
        }
        localStorage.setItem("added", JSON.stringify(added));
        app.loadSaved()
    },

    moveDown() {
        let added = JSON.parse(localStorage.getItem("added"))
        let name = this.parentElement.querySelector('.name').innerHTML
        const pos = app.findIndex(added, name)

        if (pos != 0) {
            let temp = added[pos]
            added[pos] = added[pos - 1]
            added[pos - 1] = temp
        }
        localStorage.setItem("added", JSON.stringify(added));
        app.loadSaved()
    },

    findIndex(array, name) {
        for (let i = 0; i < array.length; i++) {
            if (array[i].commodity == name) {
                return i
            }
        }
    },

    loadSaved() {
        document.querySelector('ul').innerHTML = ''
        let added = JSON.parse(localStorage.getItem("added"))
        added.forEach(function (entry) {
            app.onCreate(entry, true)
        })
    },

    onCreate(commd, reload) {
        if (this.commds[commd.commodity.toLowerCase()] != undefined) {
            $.ajax({
                type: "GET",
                dataType: "json",
                async: false,
                url: 'https://www.quandl.com/api/v3/datasets/' + this.commds[commd.commodity.toLowerCase()] + '?api_key=2NTN3pfHTxvHT3ak4G9C',
                success: function (data) {
                    let price = data.dataset.data[0][1]
                    this.list = document.querySelector('#list')
                    this.list.insertBefore(app.newEntry(commd, price), this.list.firstChild)
                    if (!reload) {
                        let added = JSON.parse(localStorage.getItem("added"))
                        added.push(commd)
                        localStorage.setItem("added", JSON.stringify(added));
                    }
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
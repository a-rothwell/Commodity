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
            let value = (1000000).toFixed(2)
            localStorage.setItem("accountValue", value)
        }
        if (JSON.parse(localStorage.getItem("portfolioValue")) == undefined) {
            let value = (0).toFixed(2)
            localStorage.setItem("portfolioValue", value)
        }

        document.querySelector("#wallet").textContent = '$ ' + JSON.parse(localStorage.getItem("accountValue")).toFixed(2)
        document.querySelector("#portfolio").textContent = '$ ' + JSON.parse(localStorage.getItem("portfolioValue")).toFixed(2)
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
            .addEventListener('click', app.click)

        item
            .querySelector('.name')
            .addEventListener('blur', app.blured)

        item
            .querySelector('.price')
            .textContent = '$ ' + price

        item
            .querySelector('.quatity')
            .textContent = commd.quantity

        item.style.fontSize = "medium"
        item.querySelector('.btn-yellow').addEventListener('click', app.favFunct)
        item.querySelector('.btn-danger').addEventListener('click', app.deleteFunct)
        item.querySelector('.up').addEventListener('click', app.moveUp)
        item.querySelector('.down').addEventListener('click', app.moveDown)
        item.querySelector('.buy').addEventListener('click', app.buy)
        item.querySelector('.sell').addEventListener('click', app.sell)
        if (commd.isFavorite) {
            app.favFunct.bind(item.querySelector('.btn-yellow'))()
        }
        return item
    },

    blured() {
        this.contentEditable = "false"
        if (app.commds[this.textContent.toLowerCase()] == undefined) {
            this.textContent = app.revert
        }
        else{
            let added = JSON.parse(localStorage.getItem("added"))
            const pos = app.findIndex(added, app.revert)
            console.log(added)
            added[pos].commodity = this.textContent
            console.log(added)
            localStorage.setItem("added", JSON.stringify(added))
            app.loadSaved()
        }
    },

    click() {
        app.revert = this.textContent
        this.contentEditable = "true"
    },

    buy() {
        let name = this.parentElement.querySelector('.name').innerHTML
        let added = JSON.parse(localStorage.getItem("added"))
        const pos = app.findIndex(added, name)
        added[pos].quantity++
            this.parentElement.querySelector('.quatity').innerHTML = added[pos].quantity
        $.ajax({
            type: "GET",
            dataType: "json",
            async: false,
            url: 'https://www.quandl.com/api/v3/datasets/' + app.commds[added[pos].commodity.toLowerCase()] + '?api_key=2NTN3pfHTxvHT3ak4G9C',
            success: function (data) {
                let price = data.dataset.data[0][1]
                let accountValue = (JSON.parse(localStorage.getItem("accountValue")) - price)
                localStorage.setItem("accountValue", accountValue);
                document.querySelector("#wallet").textContent = '$ ' + (JSON.parse(localStorage.getItem("accountValue"))).toFixed(2)
                let total = 0
                added.forEach(function (entry) {
                    $.ajax({
                        type: "GET",
                        dataType: "json",
                        async: false,
                        url: 'https://www.quandl.com/api/v3/datasets/' + app.commds[entry.commodity.toLowerCase()] + '?api_key=2NTN3pfHTxvHT3ak4G9C',
                        success: function (data) {
                            let price = data.dataset.data[0][1]
                            total = (total + (entry.quantity * price))

                        }
                    })
                })
                localStorage.setItem("portfolioValue", total);
                document.querySelector("#portfolio").textContent = '$ ' + (JSON.parse(localStorage.getItem("portfolioValue"))).toFixed(2)
                localStorage.setItem("added", JSON.stringify(added))
            }
        })
    },

    sell() {
        let name = this.parentElement.querySelector('.name').innerHTML
        let added = JSON.parse(localStorage.getItem("added"))
        const pos = app.findIndex(added, name)
        if (added[pos].quantity != 0) {
            added[pos].quantity--
                this.parentElement.querySelector('.quatity').innerHTML = added[pos].quantity
            $.ajax({
                type: "GET",
                dataType: "json",
                async: false,
                url: 'https://www.quandl.com/api/v3/datasets/' + app.commds[added[pos].commodity.toLowerCase()] + '?api_key=2NTN3pfHTxvHT3ak4G9C',
                success: function (data) {
                    let price = data.dataset.data[0][1]
                    let accountValue = (JSON.parse(localStorage.getItem("accountValue")) + price)
                    localStorage.setItem("accountValue", accountValue);
                    document.querySelector("#wallet").textContent = '$ ' + (JSON.parse(localStorage.getItem("accountValue"))).toFixed(2)
                    let total = 0
                    added.forEach(function (entry) {
                        $.ajax({
                            type: "GET",
                            dataType: "json",
                            async: false,
                            url: 'https://www.quandl.com/api/v3/datasets/' + app.commds[entry.commodity.toLowerCase()] + '?api_key=2NTN3pfHTxvHT3ak4G9C',
                            success: function (data) {
                                let price = data.dataset.data[0][1]
                                total = (total + (entry.quantity * price))

                            }
                        })
                    })
                    localStorage.setItem("portfolioValue", total);
                    document.querySelector("#portfolio").textContent = '$ ' + (JSON.parse(localStorage.getItem("portfolioValue"))).toFixed(2)
                    localStorage.setItem("added", JSON.stringify(added))
                }
            })
        }
    },

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    addCom(ev) {
        ev.preventDefault()
        const commd = {
            commodity: document.getElementById('commodity').value,
            isFavorite: false,
            quantity: 0
        }
        let added = JSON.parse(localStorage.getItem("added"))
        if (this.commds[commd.commodity.toLowerCase()] != undefined && app.findIndex(added, commd.commodity) == -1) {
            this.onCreate(commd, false)

        } else {
            document.getElementById('commodity').placeholder = 'Unknown commodity'
            document.getElementById('commodity').value = ''
        }
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
        let accountValue = JSON.parse(localStorage.getItem("accountValue"))
        let portfolioValue = JSON.parse(localStorage.getItem("portfolioValue"))

        $.ajax({
            type: "GET",
            dataType: "json",
            async: false,
            url: 'https://www.quandl.com/api/v3/datasets/' + app.commds[added[pos].commodity.toLowerCase()] + '?api_key=2NTN3pfHTxvHT3ak4G9C',
            success: function (data) {
                let price = data.dataset.data[0][1]
                accountValue += (added[pos].quantity * price)
                portfolioValue -= (added[pos].quantity * price)
            }
        })

        localStorage.setItem("accountValue", accountValue)
        localStorage.setItem("portfolioValue", portfolioValue)
        added[pos].quantity = 0

        document.querySelector("#wallet").textContent = '$ ' + (JSON.parse(localStorage.getItem("accountValue"))).toFixed(2)
        document.querySelector("#portfolio").textContent = '$ ' + (JSON.parse(localStorage.getItem("portfolioValue"))).toFixed(2)
        this.parentElement.querySelector('.quatity').innerHTML = added[pos].quantity
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
            if (array[i].commodity.toLowerCase() == name.toLowerCase()) {
                return i
            }
        }
        return -1
    },

    loadSaved() {
        document.querySelector('ul').innerHTML = ''
        let added = JSON.parse(localStorage.getItem("added"))
        added.forEach(function (entry) {
            app.onCreate(entry, true)
        })
    },

    onCreate(commd, reload) {
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
        })
    }
}

app.init()
class Produs {
    constructor(id, actor, flori) {
        this.id = id;
        this.actor = actor;
        this.flori = flori;
    }
}

class MyBaseClass {
    get() { }
    add(_actor, _flori, _listaProduse) { }
}

class MyLocalStorage extends MyBaseClass {
    get() {
        var listaProduse = JSON.parse(localStorage.getItem("produse"));
        if (listaProduse == null) {
            var jsonObject = { "produse": [] };
            localStorage.setItem("produse", JSON.stringify(jsonObject));
            listaProduse = JSON.parse(localStorage.getItem("produse"));
        }
        return listaProduse;
    }

    add(_actor, _flori, _listaProduse) {
        _listaProduse = this.get();
        var id = _listaProduse.produse.length + 1;
        var produs = new Produs(id, _actor, _flori);
        _listaProduse.produse.push(produs);
        localStorage.setItem("produse", JSON.stringify(_listaProduse));
    }
}
var listaIndexed = null;
class MyIndexedDB extends MyBaseClass {
    constructor() {
        super();
        this.db = null;
        this.objectStore = null;
        const request = window.indexedDB.open("MyDatabase", 2);

        request.onerror = (e) => {
            console.error("IndexedDB error: " + request.errorCode);
        };

        request.onsuccess = (e) => {
            console.log("Successful database connection");
            this.db = request.result;
        };

        //se intra aici cand baza de date e creata sau versiunea este updatata
        request.onupgradeneeded = (e) => {
            console.log("Database created");
            this.db = request.result;
            this.objectStore = this.db.createObjectStore("Produse", { keyPath: 'id' })
            this.objectStore.createIndex("actor", "actor", { unique: false });
            this.objectStore.createIndex("flori", "flori", { unique: false });

            this.objectStore.transaction.oncompleted = (e) => {
                console.log('Object store "Produse" created');
            }
        };
    }
    get() {
        const request = this.db.transaction("Produse")
            .objectStore("Produse")
            .getAll();

        request.onsuccess = () => {
            listaIndexed = request.result;
            //nu merge sa returnez lista, cand apelez, valoarea returnata e undefined
        }

        request.onerror = (err) => {
            console.error("Eroare la returnarea produselor:" + err)
        }
    }

    add(_actor, _flori, _listaProduse) {
        const transaction = this.db.transaction("Produse", "readwrite");

        transaction.oncomplete = function (event) {
            console.log("Operatia de tranzactie efectuata cu succes.")
        };

        transaction.onerror = function (event) {
            console.log("Operatie de tarczactie a esuat.")
        };

        const objectStore = transaction.objectStore("Produse");

        var numarProduse;
        var r = objectStore.count();
        r.onsuccess = () => {
            numarProduse = r.result;
            var produs = new Produs(numarProduse + 1, _actor, _flori);
            const request = objectStore.add(produs);

            request.onsuccess = () => {
                // request.result contains key of the added object
                console.log("Produs adaugat");
            };

            request.onerror = (err) => {
                console.error("Error to add new student:" + err);
            };
        };
    }
}

var mylocalStorage = new MyLocalStorage();
var myindexedDB = new MyIndexedDB();

function pressAdd() {
    var flori = document.getElementById("flori").value;
    var actor = document.getElementById("actor").value;

    if (flori == "" && actor == "") {
        document.getElementById("flori").value = "Câmp obligatoriu";
        document.getElementById("actor").value = "Câmp obligatoriu";
    }
    else if (flori == "") {
        document.getElementById("flori").value = "Câmp obligatoriu";
    }
    else if (actor == "") {
        document.getElementById("actor").value = "Câmp obligatoriu";
    }
    else if (flori == "Câmp obligatoriu" || actor == "Câmp obligatoriu") {
        return;
    }
    else {
        if (document.getElementById("localSt").checked == true) {
            mylocalStorage.add(actor, flori);
        }
        else {
            myindexedDB.add(actor, flori);
        }
        document.getElementById("flori").value = "";
        document.getElementById("actor").value = "";
    }
}

function worker() {
    const myWorker = new Worker("js/worker.js");
    console.log("S-a intrat în funcția worker.");

    var listaProduse;

    if (document.getElementById("localSt").checked == true) {
        listaProduse = mylocalStorage.get();
    }
    else {
        /*
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        
        async function demo() {
            await sleep(2000);
            listaProduse = myindexedDB.get();
            console.log(listaProduse);
        }
        demo();*/ //am incercat asta in caz ca trebuia sa astept putin ca sa se adauge elementul si abia dupa il pot returna
        myindexedDB.get()
        listaProduse = listaIndexed;
    }

    myWorker.postMessage([JSON.stringify(listaProduse)]); //aici trimit catre worker.js

    myWorker.onmessage = function (e) { //aici citesc ce trimit din worker.js
        if (e.data[0] == "pass") {
            tabelCumparaturi(e.data[1]);
        }
    };
}

function tabelCumparaturi(lista) {
    var tabel = document.getElementById("tabelCumparaturi");
    tabel.innerHTML =
        "<tr>" +
        "<th>Nr.</th>" +
        "<th>Actor</th>" +
        "<th>Cantitate flori</th>" +
        "</tr>";

    var size;

    if (document.getElementById("localSt").checked == true) {
        lista = JSON.parse(lista);
        size = lista.produse.length;
    }
    else size = listaIndexed.length;

    for (var i = 0; i < size; ++i) {
        var produs = document.getElementById("localSt").checked == true ? lista.produse[i] : listaIndexed[i];
        var tr = document.createElement("tr");

        var td = document.createElement("td");
        td.innerText = produs.id;
        tr.appendChild(td);

        td = document.createElement("td");
        td.innerText = produs.actor;
        tr.appendChild(td);

        td = document.createElement("td");
        td.innerText = produs.flori;
        tr.appendChild(td);

        tabel.appendChild(tr);
    }
}
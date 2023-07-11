function Sectiunea1() {
    var azi = new Date();
    document.getElementById("data").innerHTML = azi.toDateString().split(' ')[2] + "." + azi.toDateString().split(' ')[1] + "." + azi.toDateString().split(' ')[3];
    document.getElementById("url").innerHTML = window.location;

    window.setInterval(setTime, 1000);

    if (navigator.geolocation)
        navigator.geolocation.getCurrentPosition(showPosition);
    else
        document.getElementById("locatie").innerHTML = "Geolocation nu este acceptat de acest browser.";

    document.getElementById("browser").innerHTML = window.navigator.appCodeName;

    var Name = "Necunoscut";
    if (navigator.appVersion.indexOf("Win") != -1)
        Name = "Windows OS";
    if (navigator.appVersion.indexOf("Mac") != -1)
        Name = "MacOS";
    if (navigator.appVersion.indexOf("X11") != -1)
        Name = "UNIX OS";
    if (navigator.appVersion.indexOf("Linux") != -1)
        Name = "Linux OS";
    document.getElementById("sistemOperare").innerHTML = Name;
}

function setTime() {
    var azi = new Date();
    document.getElementById("timp").innerHTML = azi.getHours() + ":" + azi.getMinutes() + ":" + azi.getSeconds();
}

function showPosition(position) {
    document.getElementById("locatie").innerHTML =
        "Latitudine: " + position.coords.latitude +
        " și Longitudine: " + position.coords.longitude;
}

//sectiunea 2
function Sectiunea2() {
    var c = document.getElementById("canva");
    var contur = document.getElementById("contur");
    var umplere = document.getElementById("umplere");
    var ctx = c.getContext("2d");

    c.addEventListener('dblclick', function (event) {
        ctx.beginPath();
        ctx.lineWidth = "3";
        ctx.strokeStyle = contur.value;
        ctx.fillStyle = umplere.value;
        ctx.fillRect(event.offsetX - 30, event.offsetY - 15, 60, 30);
        ctx.strokeRect(event.offsetX - 30, event.offsetY - 15, 60, 30);
        ctx.closePath();
    });
}

//sectiunea 3
/*
function ButonLinie() {
    var tabel = document.getElementById("tabelInvat");
    var index = document.getElementById("liniaColoana");
    var color = document.getElementById("linie");
    var coloane = tabel.rows[0].cells.length //numarul de coloane
    var tr = document.createElement("tr");

    for (var j = 0; j < coloane; j++) {
        var td = document.createElement("td");
        td.style.backgroundColor = color.value;
        var tdText = document.createTextNode('row ' + index.value + ' cell ' + j);
        td.appendChild(tdText);
        tr.appendChild(td);
    }

    tabel.appendChild(tr);
}*/

function ButonColoana() {
    var index = document.getElementById("liniaColoana");
    var color = document.getElementById("coloana");
    let trs = document.querySelectorAll('#tabelInvat tr');

    for (let tr of trs) {
        tr.insertCell(index.value).style.backgroundColor = color.value;
    }
}

function ButonLinie() {
    var tabel = document.getElementById("tabelInvat");
    var index = document.getElementById("liniaColoana");
    var color = document.getElementById("linie");
    var coloane = tabel.rows[0].cells.length; //numarul de coloane

    var tr = tabel.insertRow(index.value);
    for (var i = 0; i < coloane; ++i) {
        var td = tr.insertCell(i);
        td.style.backgroundColor = color.value;
        var tdText = document.createTextNode('row ' + index.value + ', cell ' + i);
        td.appendChild(tdText);
    }
}

//ajax
function schimbaContinut(resursa, jsFisier, jsFunctie) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            document.getElementById("continut").innerHTML = xhttp.responseText;
        }
    };
    xhttp.open("GET", resursa + ".html", true);
    xhttp.send();

    if (jsFisier) {
        var elementScript = document.createElement('script');
        elementScript.onload = function () {
            console.log("hello");
            if (jsFunctie) {
                window[jsFunctie]();
            }
        };
        elementScript.src = jsFisier;
        document.head.appendChild(elementScript);
    } else {
        if (jsFunctie) {
            window[jsFunctie]();
        }
    }
}

//verifica
function verificaUtilizator() {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var persoane = this.responseText;
            const object = JSON.parse(persoane);
            var utilizator = document.getElementById("utilizator").value;
            var parola = document.getElementById("parola").value;
            var flag = false;

            for (var i = 0; i < object.utilizatori.length; ++i) {
                if (utilizator == object.utilizatori[i].utilizator && parola == object.utilizatori[i].parola) {
                    flag = true;
                    break;
                }
            }

            if (flag) {
                document.getElementById("verifica").innerHTML = "Utilizator existent!";
                document.getElementById("verifica").style.color = "green";
            }
            else {
                document.getElementById("verifica").innerHTML = "Nume de utilizator sau parolă greșită!";
                document.getElementById("verifica").style.color = "red";
            }
        }
    };

    xhttp.open("GET", "resurse/utilizatori.json", true);
    xhttp.send();
}

//inregistreaza
function inregistreaza() {
    var form = document.getElementById('form');
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var utilizator = document.getElementById('numeUtilizator').value;
        var parola = document.getElementById('parola').value;
        var nume = document.getElementById('nume').value;
        var prenume = document.getElementById('prenume').value;
        var email = document.getElementById('email').value;
        var telefon = document.getElementById('telefon').value;
        var sex = document.getElementById('sex').value;
        var dramaPreferata = document.getElementById('preferat').value;
        var culoare = document.getElementById('color').value;
        var data = document.getElementById('dataNasterii').value;
        var ora = document.getElementById('oraNasterii').value;
        var varsta = document.getElementById('varsta').value;
        var adresa = document.getElementById('adresaPagina').value;
        var descriere = document.getElementById('descriere').value;

        fetch('/api/utilizatori', {
            method: 'POST',
            body: JSON.stringify({
                utilizator: utilizator,
                parola: parola,
                nume: nume,
                prenume: prenume,
                email: email,
                telefon: telefon,
                sex: sex,
                culoare: culoare,
                data: data,
                ora: ora,
                varsta: varsta,
                adresa: adresa,
                descriere: descriere,
                dramaPreferata : dramaPreferata,
            }),
            headers: {
                'Content-type': 'text/html; charset=UTF-8',
            }
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
            }).catch(error => console.error('Error:', error));
    });

    document.getElementById('numeUtilizator').value = "";
    document.getElementById('parola').value = "";
    document.getElementById('nume').value = "";
    document.getElementById('prenume').value = "";
    document.getElementById('email').value = "";
    document.getElementById('telefon').value = "";
    document.getElementById('sex').value = "";
    document.getElementById('preferat').value = "";
    document.getElementById('color').value = "";
    document.getElementById('dataNasterii').value = "";
    document.getElementById('oraNasterii').value = "";
    document.getElementById('adresaPagina').value = "";
    document.getElementById('descriere').value = "";
}
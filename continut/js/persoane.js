function incarcaPersoane() {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var persoane = this.responseXML.getElementsByTagName("persoana");
            var numarPersoane = persoane.length; //numarul de persoane
            var tbl = document.createElement('table');
            document.getElementById("persoane").innerHTML = "";
            document.getElementById("persoane").appendChild(tbl);

            var tabel = "" +
                "<table>" +
                "<tr>" +
                "<th>Nume</th>" +
                "<th>Prenume</th>" +
                "<th>Vârstă</th>" +
                "<th>Adresă</th>" +
                "<th>Meserie</th>" +
                "<th>Facultate</th>" +
                "<th>Cetățenie</th>" +
                "</tr>";

            for (var i = 0; i < numarPersoane; ++i) {
                tabel +=
                    "<tr>" +
                    "<td>" + persoane[i].childNodes[1].innerHTML + "</td>" +
                    "<td>" + persoane[i].childNodes[3].innerHTML + "</td>" +
                    "<td>" + persoane[i].childNodes[5].innerHTML + "</td>" +
                    "<td>" + "Str. " + persoane[i].childNodes[7].childNodes[1].innerHTML +
                    ", Nr. " + persoane[i].childNodes[7].childNodes[3].innerHTML +
                    ", Loc. " + persoane[i].childNodes[7].childNodes[5].innerHTML +
                    ", Jud. " + persoane[i].childNodes[7].childNodes[7].innerHTML +
                    ", " + persoane[i].childNodes[7].childNodes[9].innerHTML + "</td>" +
                    "<td>" + persoane[i].childNodes[9].childNodes[1].innerHTML + "</td>" +
                    "<td>" + persoane[i].childNodes[9].childNodes[3].innerHTML + "</td>" +
                    "<td>" + persoane[i].childNodes[9].childNodes[5].innerHTML + "</td>" +
                    "</tr>";
            }

            tabel += "</table>";

            tbl.innerHTML = tabel;
        }
    };
    xhttp.open("GET", "resurse/persoane.xml", true);
    xhttp.send();
}
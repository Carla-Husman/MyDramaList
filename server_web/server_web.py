import gzip
import socket
import json

def write_json(new_data, filename='continut/resurse/utilizatori.json'):
    with open(filename,'r+') as file:
          # First we load existing data into a dict.
        file_data = json.load(file)
        # Join new_data with file_data inside emp_details
        file_data["utilizatori"].append(new_data)
        # Sets file's current position at offset.
        file.seek(0)
        # convert back to json.
        json.dump(file_data, file, indent = 4)

# creeaza un server socket
serversocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# specifica ca serverul va rula pe portul 5678, accesibil de pe orice ip al serverului
serversocket.bind(('', 5678))

# serverul poate accepta conexiuni; specifica cati clienti pot astepta la coada
serversocket.listen(5)

while True:
    print ("#########################################################################")
    print ('Serverul asculta potentiali clienti.')

    # asteapta conectarea unui client la server
    # metoda `accept` este blocanta => clientsocket, care reprezinta socket-ul corespunzator clientului conectat
    (clientsocket, address) = serversocket.accept()
    print ('S-a conectat un client.')
    
    # se proceseaza cererea si se citeste prima linie de text
    cerere = ''
    linieDeStart = ''
    while True:
        data = clientsocket.recv(1024)
        cerere = cerere + data.decode()
        print ('S-a citit mesajul: \n---------------------------\n' + cerere + '\n---------------------------')
        pozitie = cerere.find('\r\n')
        if (pozitie > -1):
            linieDeStart = cerere[0:pozitie]
            print ('S-a citit linia de start din cerere: ##### ' + linieDeStart + '# ')
            break
    print ('S-a terminat cititrea.')
    
    # TODO interpretarea sirului de caractere `linieDeStart` pentru a extrage numele resursei cerute
    detResursaCeruta = linieDeStart.split(' ')
    resursa = detResursaCeruta[1]
    html = detResursaCeruta[2]

    try:
        #construirea informatiilor din rapsuns
        if detResursaCeruta[0] == "POST":
            array = cerere.split('{')
            myJson = "{" + array[1]
            final = myJson.split('"')
            y = {"utilizator":str(final[3]),
                "parola": str(final[7]),
                "nume": str(final[11]),
                "prenume": str(final[15]),
                "email": str(final[19]),
                "telefon": str(final[23]),
                "sex": str(final[27]),
                "drama": str(final[55]),
                "culoare":str(final[31]),
                "data": str(final[35]),
                "ora": str(final[39]),
                "varsta": str(final[43]),
                "adresa": str(final[47]),
                "descriere": str(final[51])
                }
            write_json(y) 

        fisier = open("continut/" + resursa,"rb")
        continut = fisier.read()
        fisier.close()

        extensie = resursa.split('.')[1]
        type = ""
        match extensie:
            case "html":
                type = "text/html; charset=utf-8"
            case "css":
                type = "text/css; charset=utf-8"
            case "js":
                type = "application/js; charset=utf-8"
            case "png":
                type = "text/png"
            case "jpg":
                type = "text/jpeg"
            case "jpeg":
                type = "text/jpeg"
            case "gif":
                type = "text/gif"
            case "ico":
                type = "image/x-icon"
            case "json":
                type = "application/json; charset=utf-8"
            case "xml":
                type = "application/xml; charset=utf-8"
            case _:
                type = ""

        # TODO trimiterea răspunsului HTTP
        mesaj = html + ' 200 OK \r\n'
        clientsocket.sendall(mesaj.encode('utf-8'))
        mesaj = "Content-Length: " + str(len(continut)) + "\r\n"
        clientsocket.sendall(mesaj.encode('utf-8'))
        mesaj = "Content-Type: " + type + "\r\n"
        clientsocket.sendall(mesaj.encode('utf-8'))
        mesaj = "Content-Encoding: gzip \r\n"
        clientsocket.sendall(mesaj.encode('utf-8'))
        mesaj = "Server: MyDramaList Server \r\n"
        clientsocket.sendall(mesaj.encode('utf-8'))
        clientsocket.sendall('\r\n'.encode('utf-8'))

        #continutul din fisierul sursa
        continut_gzip = gzip.compress(continut)
        clientsocket.sendall(continut_gzip)
    except:
        mesajEroare = "Nu a fost găsită nicio pagină web pentru resursa:" + resursa
        mesaj = html + ' 404 Not Found \r\n'
        clientsocket.sendall(mesaj.encode('utf-8'))
        mesaj = "Content-Length: " + str(len(mesajEroare.encode('utf-8'))) + "\r\n"
        clientsocket.sendall(mesaj.encode('utf-8'))
        mesaj = "Content-Type: text/plain; charset=utf-8\r\n"
        clientsocket.sendall(mesaj.encode('utf-8'))
        mesaj = "Server: MyDramaList Server \r\n"
        clientsocket.sendall(mesaj.encode('utf-8'))
        clientsocket.sendall('\r\n'.encode('utf-8'))

        #continutul din fisierul sursa
        clientsocket.sendall(mesajEroare.encode('utf-8'))

    clientsocket.close()
    print ('S-a terminat comunicarea cu clientul.')
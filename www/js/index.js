var doc = document;

doc.addEventListener('deviceready', onDeviceReady, false);
doc.getElementById('btn-buscar1').addEventListener('click',buscar);
doc.getElementById('btn-buscar2').addEventListener('click',buscar);
doc.getElementById('btn-batalla').addEventListener('click',batalla);
doc.getElementById('btn-volver').addEventListener('click',volver);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
}

var total1 = null;
var total2 = null;
var userWin = '';

async function buscar(e){
    let txtUsuario = e.target.id === 'btn-buscar1' ? 'user1' : 'user2';
    let nombre = doc.getElementById(txtUsuario).value;
    let datos = await getUser(nombre);
    console.log(datos);
    if(datos.message){
        //Ocurrió un error o el usuario no ha sido encontrado o no existe
        alert(nombre !== '' ? 'Usuario no encontrado o no existe.' : 'Debes ingresar el nombre de un usuario de Github');
    }else{
        //Se han encontrado datos
        let id = txtUsuario === 'user1' ? '1' : '2';
        let total = mostrarPuntaje(id, datos);
        if(id === '1'){
            total1 = total;
        }else{
            total2 = total;
        }
        doc.getElementById('btn-batalla').disabled = (total1 === null || total2 === null);
    }
}

function getUser(user){
    return fetch(`https://api.github.com/users/${user}`)
    .then(resp => resp.json())
    .then(data=>{
        return data;
    }).catch(error => console.log(error))
}

function mostrarPuntaje(id, datos){
    doc.getElementById('avatar' + id).src = datos.avatar_url;
    doc.getElementById('public_repo' + id).innerText= datos.public_repos;
    doc.getElementById('seguidores' + id).innerText = datos.followers;
    doc.getElementById('seguidos' + id).innerText = datos.following;
    doc.getElementById('gists' + id).innerText = datos.public_gists;
    let total = datos.public_repos + datos.followers + datos.following + datos.public_gists;
    doc.getElementById('total' + id).innerText = total;
    return total;
}

function batalla(){
    let user1 = doc.getElementById('user1').value;
    let user2 = doc.getElementById('user2').value;
    if(user1 !== '' && user2 !== '')
    {
        doc.getElementById('start').style.display = 'none';
        doc.getElementById('win').style.display = 'block';
        doc.getElementById('ganador').innerText = total1 > total2 ? user1 + ' ha ganado!' :(total1 < total2 ? user2 + ' ha ganado!' : 'Felicitaciones: Tenemos un empate!');
    }else{
        alert('Debes ingresar los dos nombres de usuarios de git.');
    }
}


function volver(){
    //Ocultando el div del ganador y mostrando los formularios de ingreso de usuarios
    doc.getElementById('start').style.display = 'block';
    doc.getElementById('win').style.display = 'none';
    //Reseteando datos
    total1 = null;
    total2 = null;
    let datos = {
        public_repos: 0,
        followers: 0,
        following: 0,
        public_gists: 0,
        avatar_url: '/www/img/user.png',

    };
    mostrarPuntaje(1, datos);
    mostrarPuntaje(2, datos);
    doc.getElementById('user1').value = '';
    doc.getElementById('user2').value = '';
    doc.getElementById('btn-batalla').disabled = (total1 === null || total2 === null);
}
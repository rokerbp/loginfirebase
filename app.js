//Login
var provider = new firebase.auth.GoogleAuthProvider();

$('#login').click(function(){
    firebase.auth().signInWithPopup(provider).then(function(result) {
            //console.log(result.user);
            guardarDatos(result.user);
            $('#login').hide();
            $('#bienvenido').append(
                '<h4>Bienvenido '+result.user.displayName+'<strong></strong></h4><p>'+result.user.email+'</p>'
            );
        });
});

$('#eliminar').click(function(){
    console.log('eliminar');
})

// Escribir en base de datod
function guardarDatos(user){
    var usuario ={
        uid:user.uid,
        nombre:user.displayName,
        email:user.email,
        foto:user.photoURL
    } 
    firebase.database().ref("usuarios/" + user.uid).set(usuario)
}

// Leer de base de datos
firebase.database().ref("usuarios").on("child_added", function(s){
    var user = s.val();
    $('#root').append(
        '<div class="card '+user.uid+'" style="width: 14rem;"><img class="card-img-top" src="'+user.foto+'" alt="Card image cap"><div class="card-body"><h5 class="card-title">'+user.nombre+'</h5><p class="card-text">'+user.email+'</p><button onClick="eliminarDatos(`'+user.uid+'`);" class="btn btn-danger">Eliminar Perfil</button></div></div>'
        );
});

// Leer si cambia un registro de la DB
firebase.database().ref("usuarios").on("child_changed", function(s){
    //console.log(s.val().nombre);
    $('.'+s.val().uid).replaceWith('<div class="card '+s.val().uid+'" style="width: 14rem;"><img class="card-img-top" src="'+s.val().foto+'" alt="Card image cap"><div class="card-body"><h5 class="card-title">'+s.val().nombre+'</h5><p class="card-text">'+s.val().email+'</p><button onClick="eliminarDatos(`'+s.val().uid+'`);" class="btn btn-danger">Eliminar Perfil</button></div></div>')
})

//Eliminar registro de la base de datos
function eliminarDatos(uid){
    //console.log('voy a eliminar'+uid);
    firebase.database().ref("usuarios/"+uid).remove();
}

// Si se elimina un registro eliminamos el card correspondiente
firebase.database().ref("usuarios").on("child_removed", function(s){
    var user = s.val();
    $('.'+user.uid).remove();
    //alert('El usuario ' +user.nombre+' ha sido borrado' );
})
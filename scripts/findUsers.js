function findUsers(username, noGeolocationFN, newUserFN, endOfUsersFN) {
    var debug = function(x) { console.log(x) }
    debug(username)
    var foundUsers = []
    if (!navigator.geolocation) {
        noGeolocationFN();
        return;
    }
    var socket = io.connect(window.location.origin, {'forceNew': true});
    socket.on('connect', function() { 
        debug('connected')
        navigator.geolocation.getCurrentPosition(function(pos) {
            var coords = [pos.coords.longitude, pos.coords.latitude] // don't change order
            var data = {username: username, coords: coords}
            debug(JSON.stringify(data))
            socket.emit('location', data)
            debug('sent to server')
        }, noGeolocationFN)
    })
    socket.on('newUser', function(name) {
        if(username !== name && foundUsers.indexOf(name) == -1) {
            foundUsers.push(name)
            debug(name)
            newUserFN(name);
        }
    })
    socket.on('disconnect', function() {
        debug('disconnect');
        socket = null;
        endOfUsersFN();
    })
    socket.on('error', function(data) {
        debug("ERROR: " + data)
    })
    socket.on('debug', debug);
}
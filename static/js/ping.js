
var getUserMedia = (function () {
    if (navigator.getUserMedia) {
        return navigator.getUserMedia.bind(navigator)
    }
    if (navigator.webkitGetUserMedia) {
        return navigator.webkitGetUserMedia.bind(navigator)
    }
    if (navigator.mozGetUSerMedia) {
        return navigator.mozGetUSerMedia.bind(navigator)
    }

})();

function onRecieveStream(stream) {
    var audio = document.querySelector('audio');
    console.log(audio);
    //audio.src = window.URL.createObjectURL(stream);
    audio.srcObject = stream;
    audio.onloadedmetadata = function (e) {
        console.log('Now Playing the audio');
        audio.play();
    }
}

//The function to execute ping request

function call() {
    var person_to_call = document.getElementById('callings').value;
    console.log('PEER IS CALLING ==> ' + person_to_call);

    var peer = new Peer();
    getUserMedia({ video: false, audio: true }, function (stream) {
        var call = peer.call(person_to_call, stream);
        call.on('stream', function (remoteStream) {
            console.log(remoteStream);
            onRecieveStream(remoteStream);
            //This will show the stream in some canvas element.
        });
    }, function (err) {
        console.log('Failed to get local stream', err);
    });

}

// Peer response function: Generate id and send to the callr and wait for ping response

function answerer() {
    var peer = new Peer();
    peer.on('open', (id) => {
        document.getElementById('peerid').innerHTML = id;
    });
    peer.on('call', function (call) {
        getUserMedia({ video: false, audio: true }, function (stream) {
            console.log("PEER IS GETTING CALLED.");
            call.answer(stream); // Answer the call with an A/V stream.
            call.on('stream', function (remoteStream) {
                console.log(remoteStream)  // Show stream in some video/canvas element.
            });
        }, function (err) {
            console.log('Failed to get local stream', err);
        });
    });
}
function host(peer){
    console.log("host")
    var baseurl = "https://morganq.github.io/picoremoteplay/"
    document.getElementById('remoteplay_controls').innerHTML = baseurl + "?join=" + peer.id;
    var cvs = document.getElementById('canvas');

    var lastBlob = null;

    peer.on('connection', function(conn) {

        function send_canvas()
        {
            cvs.toBlob((b) => {
                if(!lastBlob || lastBlob.size != b.size) {
                    conn.send(b);
                    console.log("yes");
                }
                else {
                    console.log("no");
                }
                lastBlob = b;
            }, "image/png");
        }

        setInterval(send_canvas, 1000 / 120);

        conn.on('data', function(data) {
            // Player 2 (index 1) gets the buttons.
            pico8_buttons[1] = data
        });

    });
}

function join(peer, join_peer_id){
    console.log("join " + join_peer_id);

    var player_inputs = 0;
    document.getElementById('remoteplay_controls').innerHTML = "";
    document.getElementById('p8_container').remove();

    // Make the img
    var outcvs = document.createElement('img');
    outcvs.className = "sharp"
    document.getElementById('remoteplay_container').appendChild(outcvs);

    var conn = peer.connect(join_peer_id);
    conn.on('open', function(){
        console.log("connected!");

        conn.on('data', function(data) {
            var blob = new Blob([data], { type: "image/png" });
            var url = URL.createObjectURL(blob);
            outcvs.src = url;
        });

        document.addEventListener("keydown",
            function (event) {
                player_inputs |= keyMask(event);
                console.log(player_inputs);
                conn.send(player_inputs);
                if (event.preventDefault) event.preventDefault();
            },{passive: false});
            
        document.addEventListener("keyup",
            function (event) {
                player_inputs &= ~keyMask(event);
                console.log(player_inputs);
                conn.send(player_inputs);
                if (event.preventDefault) event.preventDefault();
            },{passive: false});                
        

    });
}

window.onload = function() {
    var peer = new Peer();
    peer.on('open', function(id) {
        console.log(id);
        var search = window.location.search
        if(search.startsWith("?join=")) {
            join(peer, search.substring(6))
        }
    });    
    

    document.getElementById('join').onclick = function()
    {
        join(peer, document.getElementById('peerid').value)
    }
    document.getElementById('host').onclick = function()
    {
        host(peer);
    }    
}

function keyMask(event) {
    var mask = 0;
    // 0x1 left, 0x2 right, 0x4 up, 0x8 right, 0x10 O, 0x20 X, 0x40 menu
    if(event.key == "ArrowLeft") { mask = 0x1; }
    if(event.key == "ArrowRight") { mask = 0x2; }
    if(event.key == "ArrowUp") { mask = 0x4; }
    if(event.key == "ArrowDown") { mask = 0x8; }
    if(event.key == "z") { mask = 0x10; }
    if(event.key == "x") { mask = 0x20; }
    if(event.key == "Enter") { mask = 0x40; }
    return mask;                    
}
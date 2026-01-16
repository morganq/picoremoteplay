window.onload = function() {

    var peer = new Peer();

    var cvs = document.getElementById('canvas');
    console.log(cvs);



    var peer = new Peer();
    peer.on('open', function(id) {
        console.log('My peer ID is: ' + id);
    });    

    document.getElementById('join').onclick = function()
    {
        console.log("join");
        document.getElementById('p8_container').remove();
        var outcvs = document.createElement('img');
        outcvs.className = "sharp"

        //outcvs.width = 128;
        //outcvs.height = 128;
        outcvs.style.border = "1px solid";
        document.getElementById('p8_frame').appendChild(outcvs);
        var conn = peer.connect(document.getElementById('peerid').value);
            // on open will be launch when you successfully connect to PeerServer
            conn.on('open', function(){
                console.log("connected!");

                conn.on('data', function(data) {
	                console.log('Received', data);
                    var blob = new Blob([data], { type: "image/png" })
                    var url = URL.createObjectURL(blob);
                    outcvs.src = url;
                    console.log(blob);
	            });
            });
    }
    document.getElementById('host').onclick = function()
    {
        console.log("host");
        peer.on('connection', function(conn) {

            function send_canvas()
            {
                var img = cvs.toBlob((b) => {
                    console.log(b.size);
                    conn.send(b);
                }, "image/png");
            }

            setInterval(send_canvas, 1000 / 30);

        });
    }    
}

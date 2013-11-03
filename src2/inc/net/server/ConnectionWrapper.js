String.prototype.size = function (n, ch) {
    n = n || this.length;
    ch = ch || " ";

    for (var i = this.length, str = this; i < n; ++ i) {
        str += ch;
    }

    return str;
}

String.prototype.middle = function (n, ch) {
    n = n || this.length;
    ch = ch || " ";

    var d = n - this.length;
    var dl, dr;
    var d2;
    var str = this;

    if (d < 0) {
        return this;
    }

    d2 = d / 2;

    if (d % 2 == 1) {
        dl = Math.floor(d2);
        dr = Math.ceil(d2);
    }
    else {
        dl = dr = d2;
    }

    for (var i = 0; i < dl; ++ i) {
        str = ch + str;
    }

    for (var i = 0; i < dr; ++ i) {
        str = str + ch;
    }

    return str;
}


String.spec = {
    inv: {begin: '<span style="color: black; background: lightgray;">', end: '</span>'},

    red: {begin: '<span style="color: red;">', end: '</span>'},
    blue: {begin: '<span style="color: blue;">', end: '</span>'},
    green: {begin: '<span style="color: green;">', end: '</span>'},
    gray: {begin: '<span style="color: gray;">', end: '</span>'},

    bold: {begin: '<span style="font-weight: bold;">', end: '</span>'},
    italic: {begin: '<span style="font-style: italic;">', end: '</span>'},
    underline: {begin: '<span style="text-decoration: underline;">', end: '</span>'}
}

for (var i in String.spec) {
    if (i == "reset") continue;
    (function (i){
        String.prototype[i] = function() {
            return String.spec[i].begin + this + String.spec[i].end;
        }
    })(i);
}

Number.prototype.prettyByteSize = function () {
    var bytes = this;

    if (bytes < 1000) {
        return String(bytes) + " b";
    }

    if (bytes < 1000000) {
        return String((bytes / 1000).toFixed(2)) + " kb";
    }

    return String((bytes / 1000000).toFixed(2)) + " mb"; 
}



function ConnectionWrapper(request) {
    var connection = request.accept(null, request.origin);
    var connected = new Date();
    var wrapper = this;

    //Recieve (in)
    var RX = {
        packets: 0,
        bytes: 0
    };

    //Trancieve (out) 
    var TX = {
        packets: 0,
        bytes: 0
    };

    var events = {
        "message": null
    };

    var ext = request.requestedExtensions;
    var isDeflateSupported = false;

    for (var i = 0; i < ext.length; i++) {
        if (ext[i].name.match(/deflate/)) {
            isDeflateSupported = true;
        }
    };

    connection.on("message", function(message) {
        var callback = events["message"];

        RX.packets ++;

        switch (message.type) {
            case "utf8":
                RX.bytes += Buffer.byteLength(message.utf8Data, "utf8");
            break;
            case "binary":
            default: 
                RX.bytes += message.binaryData.length;
        }
        
        if (callback) {
            callback(message);
        }
    });

    connection.on("close", function(connection) {
        var callback = events["close"];

        wrapper.opened = false;
        wrapper.disconnected = new Date();

        if (callback) {
            callback(connection);
        }
    });


    this.request = request;
    this.connection = connection;
    this.connected = connected;
    this.TX = TX;
    this.RX = RX;
    this.events = events;
    this.opened = true;
    this.disconnected = 0;
    this.deflate = isDeflateSupported;
    this.id = ConnectionWrapper.connections.length;
    this.info = null;
    
    ConnectionWrapper.connections.push(this);

    //console.log(this.toString());
}

ConnectionWrapper.prototype = {
    sendUTF: function (str) {
        this.TX.packets ++;
        this.TX.bytes += Buffer.byteLength(str, "utf8");

        this.connection.sendUTF(str);
    },

    sendBytes: function (buffer) {
        this.TX.packets ++;
        this.TX.bytes += buffer.length;

        this.connection.sendBytes(buffer);
    },

    on: function (event, callback) {
        this.events[event] = callback;
    },

    toString: function () {
        var duration = Math.round(((this.opened? (new Date): this.disconnected).getTime() - this.connected.getTime()) / 1000);
//  
        return (
            // "".size(this.id, "\n") + 
            (this.request.origin + (this.deflate? " (deflate) ": "" )).middle(32) + "|" +
            ("   " + this.RX.packets + " / " + (this.RX.bytes).prettyByteSize()).middle(24) + "|" +
            ("   " + this.TX.packets + " / " + (this.TX.bytes).prettyByteSize()).middle(24) + "|" +
            // (((1. - this.TX.packets / this.RX.packets) * 100).toFixed(4) + "%").middle(16) + "|" +
            (duration + " sec").middle(16) + "|" +
            (this.opened? "opened".middle(16).green(): "closed".middle(16).red()) /*+ 
            "\r"*/);
    }
}

ConnectionWrapper.connections = [];
ConnectionWrapper.printStatUnitsStr = null;
ConnectionWrapper.printStatUnits = function () {
    if (!ConnectionWrapper.printStatUnitsStr) {
        var output = [
            ("peer (pid: " + process.pid + ")").middle(32).inv(),
            "RX packets / bytes".middle(24).inv(),
            "TX packets / bytes".middle(24).inv(),
            // "losses".middle(16).inv(),
            "duration".middle(16).inv(),
            "status".middle(16).inv()
        ];

        ConnectionWrapper.printStatUnitsStr = output.join("|");
    }

    return ConnectionWrapper.printStatUnitsStr;
}


exports.wrapper = ConnectionWrapper;
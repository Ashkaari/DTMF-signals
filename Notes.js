var fs          = require('fs'),
    fd          = fs.openSync('./notes.raw', 'w');

//https://en.wikipedia.org/wiki/Piano_key_frequencies

var notesAndFreqs = {
    25: 110.000, //A2
    16: 65.4064, //C2
    18: 73.4162, //D2
    52: 523.25,  //C5
    54: 587.33,  //D5
};

function NotesSound(notes, mSecs, s_rate) {
    notes = notes.length ? notes : [notes];

    var length_     = mSecs * s_rate/1000,
        lengthFull  = length_ * notes.length,
        b           = new Buffer(lengthFull),
        num         = 0,
        i           = 0,
        period      = length_;

    console.log("Full buffer's length:" + lengthFull);

    while (num < notes.length) {
        var frequency = notesAndFreqs[notes[num]];

        for(i; i < period; i++) {
            b[i] = 64 * Math.sin(2 * Math.PI  * i/s_rate * frequency);
            console.log(i +') '+b[i]);
        }

        period += length_;
        console.log("Now i is equal to " + i + ", and period is equal to " + period);
        num++;
    }

    fs.writeSync(fd, b, 0, lengthFull);
    fs.closeSync(fd);
}

NotesSound(52, 500, 8000);
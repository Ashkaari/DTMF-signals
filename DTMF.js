var fs           = require('fs'),
    fd           = fs.readFileSync('./notes.wav'),
    txt          = fs.openSync('./tt.txt', 'w'),
    sample_rate  = 16000;


/**
 * ОСНОВНАЯ ФОРМУЛА:
 * X(k) = SUM(x{t)e^(-2)*pi*t*k/n
 * где, x(t) - t-шный элемент входящего массива (x - представляет уровни сигнала в различные моменты времени)
 *      X{k) - k-ый элемент выходящего массива
 *  ФОРМУЛА ЭЙЛЕРА:
 *  e^(x*i)         = cos(x) + i * sin(x) для каждого x
 *  e^(-2*pi*i*j/n) = cos(-2*pi*(tk/n)) + i * sin(-2*pi*(tk/n)) || cos(2*pi*(tk/n)) - i* sin(2*pi*(tk/n))
 *
 *  По определению (ссылка 2):
 *  x{t)e^(-2)*pi*t*k/n = [Real(x(t)) + i * Imagine(x(t))] [cos(2*pi*(tk/n)) - i* sin(2*pi*(tk/n))]
 */

function DFT (data) {
    var n           = data.length,
        res_real    = new Array(n),
        res_imagine = new Array(n);

    for(var k = 0; k < n; k++) {
        var real    = 0,
            imagine = 0;

        for(var t = 0; t < n; t++) {
            var angle = -2 * Math.PI * t * k / n;

            real    += data[t] * Math.cos(angle);
            imagine += data[t] * Math.sin(angle);
        }
        res_real[k]    = real;
        res_imagine[k] = imagine;

    }

    return createSpectrum(res_imagine, res_real);
}

function createSpectrum(imagine_part, real_part) {
    var spectrum    = new Array(imagine_part.length/2),
        peak        = 0,
        peak_index  = 0;
    for(var i = 0; i < spectrum.length; i++) {
        spectrum[i] = Math.sqrt(imagine_part[i] * imagine_part[i] + real_part[i] * real_part[i]) / imagine_part.length;
    }
    //Ищем максимум
    for(var j = 1; j <spectrum.length; j++) {
        if(spectrum[j] > peak) {
            peak_index = j;
            peak       = spectrum[j]
        }
    }

    console.log("Peak found at position: " + peak_index + " Peak value: " + peak);
    console.log("In Hz = " + (peak_index * sample_rate / imagine_part.length));
    return spectrum;
}

var d_array = DFT(fd);

fs.writeSync(txt, d_array.toString(), 'utf8');
fs.closeSync(txt);

//https://ru.wikipedia.org/wiki/%D0%9A%D0%BE%D0%BC%D0%BF%D0%BB%D0%B5%D0%BA%D1%81%D0%BD%D0%B0%D1%8F_%D0%B0%D0%BC%D0%BF%D0%BB%D0%B8%D1%82%D1%83%D0%B4%D0%B0
//https://en.wikipedia.org/wiki/Discrete_Fourier_transform#Definition - Формулы
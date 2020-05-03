jsfolder = "http://www.mathscinet.ru/zjun/";
imagesfolder = "http://www.mathscinet.ru/images/";
directory1 = "http://www.mathscinet.ru/manual/gfinit/"; //where
toolboxdirectory = "http://www.mathscinet.ru/zjun"; // ��� toolbox
rootdirectory = "http://www.mathscinet.ru/manual/"; //user
filesdirectory = rootdirectory + 'files/';
directory = directory1;

function folder(s) { directory1 = s + '/'; }
reldirectory = "manual/gfinit/";
relfilesdirectory = reldirectory;
tick = reldirectory.indexOf('/');
if (tick > 0) relfilesdirectory = reldirectory.substr(0, tick);
relfilesdirectory = "../" + relfilesdirectory + "/files/";
reldirectory = "../" + reldirectory;
receiveData = 0;
receiveF = 0;
tick = 0;
calculationT = -1;
calculationTFlg = false;
textjm = '';
var axissetted = false,
    axisminX = -1,
    axisminY = -1,
    axismaxX = 1,
    axismaxY = 1;
carriagereturn = "\u000A";
toleranceinit = 0.0000001;
tolerance = toleranceinit;
toleranceeig = 50;

talk = 0;
nohello = 0;
nohello2 = false;
swit� hpressed = 0;
timerhello = 0;
timerhello2 = 0;
timerhello3 = true;
timercond = '';
canvasW = 520;
canvasH = 300;

svet = new Array();
svet[0] = new Image();
svet[0].src = "http://www.mathscinet.ru//images/green.gif";
svet[1] = new Image();
svet[1].src = "http://www.mathscinet.ru//images/red.gif";

function startread() {
    if (nohello == 0) {
        if (timercond != '') {
            ajaxRead(timercond);
            timerhello3 = receiveData == 0;
        }
        if (timerhello3 && timerhello == 0) {
            ajaxRead('command');
            mainFORM.texttm.value = receiveData;
            timerhello2 = 0;
            readsv();
        }
    }
}

function readsv() {
    ajaxRead('commands');
    document.picsv.src = svet[receiveData].src;
    if (receiveData == 0) {
        mainFORM.textsv.value = '��������';
        writesv();
    } else {
        mainFORM.textsv.value = '������';
        ajaxWrite('commands', 'reset');
        if (timerhello2 < 50) {
            if (timerhello2 == 0) { setTimeout("readsv()", 500); } else { setTimeout("readsv()", 7000); }
            timerhello2++;
        } else {
            timerhello = 0;
        }
    }
}

function writesv() {
    ajaxWrite('commands', '1');
    timerhello++;
    if (timerhello < 40) { setTimeout("writesv()", 5000); } else {
        timerhello = 0;
        ajaxWrite('commands', '0');
        mainFORM.textsv.value = '������';
        document.picsv.src = svet[1].src;
    }
}

function writecom(cm) {
    if (mainFORM.textsv.value == '��������') { ajaxWrite('command', cm) } else {
        ajaxRead('command');
        mainFORM.texttm.value = receiveData;
    }
};

function writetm() {
    if (mainFORM.textsv.value == '��������') { ajaxWrite('command', mainFORM.texttm.value) } else {
        ajaxRead('command');
        mainFORM.texttm.value = receiveData;
    }
};

function checkEnter(e) {
    if ((e.keyCode && e.keyCode == 13) || (e.which && e.which == 13)) writetm();
}

function disableEnterKey() { // ������� ����� ���������������� � enter
    if (window.event.keyCode == 13) window.event.keyCode = 0;
    //  onKeyPress="disableEnterKey()"
}

function replaces123(n) {
    function strreplace(s1, s2, s3) {
        var a = s3.split(s1);
        var b = "";
        for (var i = 0; i < a.length; i++) { b += a[i]; if (i < a.length - 1) b += s2; }
        return b;
    }
    var s = document.getElementById('text').value;
    s = strreplace("<<<specsym1>>>", "\'", s);
    s = strreplace("<<<specsym2>>>", '\"', s);
    s = strreplace("<<<specsym3>>>", "\\", s);
    document.getElementById('text').value = s;
}
replaces123();

function runcalc(s) {
    function ajaxRead2(filename) {
        receiveF = 0;
        var xmlObj = null;
        if (window.XMLHttpRequest) {
            xmlObj = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            xmlObj = new ActiveXObject("Microsoft.XMLHTTP");
        } else { return; }
        xmlObj.open('GET', filename, false);
        xmlObj.send('');
        return xmlObj.responseText;
    }

    function incl(text) {
        function getTool(name) {
            var s = ajaxRead2(directory1 + name);
            if (s.indexOf('404 Not Found') > -1) {
                s = ajaxRead2(toolboxdirectory + name);
                if (s.indexOf('404 Not Found') > -1) s = '';
            }
            return s;
        }
        var tool = "";
        if (text.substr(0, 8) == '#include') {
            var x = text.indexOf(';');
            if (x > 0) {
                var inc = text.substr(9, x - 9);
                inc = inc.split(',');
                text = text.substr(x + 1);
                for (var i = 0; i < inc.length; i++) {
                    while (inc[i].substr(0, 1) == " ") inc[i] = inc[i].substr(1);
                    tool = tool + "\r\n" + getTool(inc[i] + ".jm") + "\r\n";
                }
            }
        }
        return tool + text;
    }
    calculationTFlg = true;
    document.getElementById('stp').value = 'Stop';
    document.getElementById('bgCanvas').innerHTML = '';
    axissetted = false;
    axisminX = -1;
    axisminY = -1;
    axismaxX = 1;
    axismaxY = 1;
    tick = 0;
    calculationT = -1;
    s = incl(s);
    calc(s);
}

function calc(s12345) {
    function comjm(s) {
        function comjms(aj) {
            var i, j, c, cc, c2;
            if (aj.indexOf('.xml') > 0) { // alert(aj); 
                aj = aj.split('=');
                cc = aj[0] + '={' + aj[1];
                i = cc.indexOf('}');
                if (i > 0) cc = cc.substring(0, i + 1); // alert(cc);
                aj = calcExpr2(cc) + ';'; // alert(aj); 
            } else { // alert(aj); 
                aj = aj.split('=');
                cc = aj[0] + '={{' + aj[1];
                c = calcExpr(cc);
                aj = ''; // alert(c);  
                for (j = 0; j < c.length; j++) {
                    cc = c[j];
                    i = cc.indexOf('.}');
                    if (i > 0) {
                        cc = cc.substring(0, i) + '}';
                        c2 = c[j + 1];
                        i = c2.indexOf('/');
                        if (i > 0) { c[j + 1] = c2.substring(0, i) + '.' + c2.substring(i, c2.length); } else {
                            i = c2.indexOf('*');
                            if (i > 0) c[j + 1] = c2.substring(0, i) + '.' + c2.substring(i, c2.length);
                        }
                    }
                    //if (cc.indexOf('.xml')>0) alert(cc); 
                    aj += calcExpr2(cc) + ';';
                }
            }
            return aj;
        }
        var i, j, a, ai, aj, ajj, ajjj, b;
        if (s.indexOf('{{') > -1) {
            a = s.split('{{');
            b = '';
            for (i = 0; i < a.length; i++) {
                ai = a[i];
                j = 0;
                if (i) j = ai.indexOf('}}'); // if (i==0) alert(ai);
                if (j > 0) {
                    j = j + 2;
                    aj = ai.substring(0, j);
                    ai = ai.substring(j);
                    if (aj.indexOf(';') > 0) {
                        aj = aj.substring(0, j - 2);
                        ajj = aj.split(';');
                        aj = '';
                        for (j = 0; j < ajj.length; j++) { ajjj = ajj[j]; if (ajjj != '')
                                if (ajjj != ' ') aj += comjms(ajjj + '}}'); }
                    } else { aj = comjms(aj); }
                    b += aj + ai;
                } else { if (ai != '') b += ai + ';'; }
            }
            return b;
        } else { return s; }
        /*  // var b=s.split("\r\n"); s=''; for(var i=0;i<b.length;i++) s+=b[i];  
          var a=s.replace("{ ","{;"); 
          a=a.replace("} ","};"); a=a.replace("}\r\n","}\r\n;"); // alert(a);
          var a=a.split(';'); var b=''; 
          for(var i=0;i<a.length;i++){ var ai=a[i];
            if(ai.indexOf('{{')>-1){
              if(ai!=""){ 
              var c=calcExpr(ai); for(var j=0;j<c.length;j++) b+=calcExpr2(c[j])+';';}
            }else{ ai=ai.replace(/(^\s*)|(\s*)$/g, ''); if(ai!='') b+=ai+';'; }
          }
        */
    }
    calculationT++;
    tick = calculationT; // mainFORMoutvalue=mainFORM.out.value; 
    if (s12345.indexOf('getputs(false)') < 0) mainFORM.out.value = "";
    if (tick == 0) {
        var k12345 = s12345.indexOf('<br>');
        if (k12345 > -1) s12345 = s12345.substring(0, k12345);
        var k12345 = s12345.indexOf('{{C#');
        if (k12345 > -1) {
            var a12345 = s12345.split('{{C#');
            var textjc = a12345[1];
            var k212345 = textjc.indexOf('C#}}');
            if (k212345 > -1) { textjm = textjc.substring(k212345 + 4);
                textjc = textjc.substring(0, k212345); } else { textjm = ''; }
            // alert(textjc); alert(textjm);   
            textjm = comjm(a12345[0] + comjc(textjc) + textjm);
        } else { textjm = comjm(s12345); }
        // alert(textjm);
    }
    with(Math) eval(textjm);
}

function restart(T) { if (calculationTFlg) { document.getElementById('stp').value = 'Stop';
        setTimeout('calc(textjm)', T); } }

function puts(s) {
    if (s == "clear") { mainFORM.out.value = ""; } else { mainFORM.out.value += " " + s + carriagereturn; }
};

function getputs() { return mainFORM.out.value; };

function putm(A, N) {
    var i, n, m;
    n = rows(A);
    m = cols(A);
    if (N == undefined) {
        if (n == 0) { puts(A); } else { if (m == 1) { puts(A); } else { for (i = 0; i < n; i++) puts(A[i]); } }
    } else {
        if (n < 2) { puts(N + "[" + A + "]"); } else { n--;
            puts(N + "[[" + A[0] + "],"); for (i = 1; i < n; i++) puts("[" + A[i] + "],");
            puts("[" + A[n] + "]];"); }
    }
    // mainFORM.out.value+=carriagereturn;
}

function putms(H) {
    var i, j, s;
    for (i = 0; i < rows(H); i++) {
        s = "";
        for (j = 0; j < cols(H); j++)
            if (H[i][j] == 1) { s += "+"; } else { if (H[i][j] == 0) { s += "0"; } else { if (H[i][j] == -1) { s += "-"; } else { s += "*"; } } }
        puts(s);
    }
}

function putmf(A) {
    function getb(BS) { b = BS; if (typeof(b) == 'string')
            if (b == '') b = ' . '; return b; }
    var i, j, n, m, b, s, s2, s3, s4, B;
    n = rows(A);
    m = cols(A);
    s = ' ';
    s2 = '';
    s3 = carriagereturn;
    s4 = s2;
    if (arguments.length > 1) {
        mainFORM.out.value += arguments[1] + '=[';
        if (arguments.length < 3) { s = ","; } else { s = arguments[2]; } s2 = ';';
        s3 = '';
        s4 = '] '
    };
    if (n == 0) { mainFORM.out.value += A; } else {
        B = format(A, 10000);
        if (m == 1) {
            for (i = 0; i < n; i++) {
                mainFORM.out.value += getb(B[i]);
                if (i != n - 1) mainFORM.out.value += s2;
                mainFORM.out.value += s3;
            }
        } else {
            for (i = 0; i < n; i++) {
                for (j = 0; j < m; j++) {
                    mainFORM.out.value += getb(B[i][j]);
                    if (j != m - 1) mainFORM.out.value += s;
                }
                if (i != n - 1) mainFORM.out.value += s2;
                mainFORM.out.value += s3;
            }
        }
    }
    mainFORM.out.value += s4;
    mainFORM.out.value += carriagereturn;
}

function getmatrix(S, ZR, SR) {
    var i, j, k, sz, sz2, ZP, ST, SN, F, A, B;
    ZP = ",";
    SN = "\n";
    if ((S.indexOf('+-') < 0) && (S.indexOf('++') < 0) && (S.indexOf('-+') < 0) && (S.indexOf('0+') < 0) && (S.indexOf('0-') < 0)) { ST = S; } else {
        ST = S.replace(/\+/g, "1,");
        ST = ST.replace(/\-/g, "-1,");
        ST = ST.replace(/0/g, "0,");
    }
    if (arguments.length > 1) ZP = ZR;
    if (arguments.length > 2) SN = SR;
    sz = ST.indexOf(SN);
    if (sz < 0) { A = parseFloat(ST) } else {
        ST = ST.split(SN);
        sz = ST.length;
        A = zero(1);
        F = true;
        for (i = 0; i < sz; i++)
            if (F) {
                B = trim(ST[i]).split(ZP);
                if (i > 0) F = sz2 == B.length;
                if (F) {
                    sz2 = B.length;
                    k = 0;
                    A[i] = zero(1);
                    for (j = 0; j < sz2; j++)
                        if (trim(B[j]) != '') { A[i][k] = parseFloat(trim(B[j]));
                            k++; }
                }
            }
    }
    return A;
}

function clock(a) {
    var h;
    var getdatei = new Date();
    h = getdatei.getDate();
    if (a == 1) h = getdatei.getHours();
    if (a == 2) h = getdatei.getMinutes();
    if (a == 3) h = getdatei.getSeconds();
    if (a == 4) h = getdatei.getMilliseconds();
    if (a == 5) h = getdatei.getYear();
    if (a == 6) h = getdatei.getMonth();
    if (a == 7) h = getdatei.getDate();
    return h;
}

function sound(name) {
    // if (name.indexOf("./")<0) // name=jsfolder+"../music/"+name; // document.all.bgsound.src =name;
    if (name.indexOf("mid") > 0) { MIDIjs.play(name); } else {
        if (name.indexOf("./") < 0) name = filesdirectory + name;
        var audio = new Audio();
        audio.src = name;
        audio.autoplay = true;
    }
}

function trim(str, chars) {
    return ltrim(rtrim(str, chars), chars);
}

function ltrim(str, chars) {
    chars = chars || "\\s";
    return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
}

function rtrim(str, chars) {
    chars = chars || "\\s";
    return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
}

function rows(A) {
    var r;
    switch (typeof(A)) {
        case 'number':
            r = 0;
            break;
        case 'string':
            r = 0;
            break;
        case 'object':
            r = A.length;
            break;
    }
    return r;
}

function cols(A) {
    var c;
    switch (typeof(A)) {
        case 'number':
            c = 0;
            break;
        case 'string':
            c = 0;
            break;
        case 'object':
            switch (typeof(A[0])) {
                case 'number':
                    c = 1;
                    break;
                case 'string':
                    c = 1;
                    break;
                case 'object':
                    c = A[0].length;
                    break;
            }
            break;
    }
    return c;
}

function size(A) { return rows(A); }

function sh(x) { return (Math.exp(x) - Math.exp(-x)) / 2; }

function ch(x) { return (Math.exp(x) + Math.exp(-x)) / 2; }

function factorial(n) { return !n ? 1 : n * factorial(n - 1); }

function polyv(N, p) {
    var i, j, n, n1, p1, p2, p3, p4, P;
    n = rows(N);
    if (n) {
        n--;
        j = n;
        p1 = N[n];
        p2 = 0;
        p3 = 1;
        p4 = 0;
        for (i = 0; i < n; i++) {
            p5 = p3 * p[0] - p4 * p[1];
            p4 = p4 * p[0] + p3 * p[1];
            p3 = p5;
            j--;
            p1 = p1 + N[j] * p3;
            p2 = p2 + N[j] * p4;
        };
        P = [p1, p2];
    } else { P = [N, 0]; }
    return P;
}

function matrix(n, m) {
    var i, j, A, B;
    A = new Array();
    n = Math.abs(n);
    m = Math.abs(m);
    if (n == 0) n = 1;
    if (m == 0) m = 1;
    for (i = 0; i < n; i++) {
        if (m == 1) { A[i] = 0; } else {
            B = new Array();
            for (j = 0; j < m; j++) B[j] = 0;
            A[i] = B;
        }
    }
    return A;
}

function equal(A, d) {
    var n, m, i, j, B;
    n = rows(A);
    m = cols(A);
    if (n == 0) { B = A; } else {
        B = matrix(n, m);
        if (m == 1) { for (i = 0; i < n; i++) B[i] = A[i]; } else {
            for (j = 0; j < m; j++)
                for (i = 0; i < n; i++) B[i][j] = A[i][j];
        }
    }
    if (arguments.length > 1) {
        if (n == 0) { B += d; } else {
            if (m == 1) { B[0] += d } else {
                for (i = 0; i < n; i++)
                    if (i < m) B[i][i] += d;
            }
        }
    }
    return B;
}

function time(A) {
    var n, i, t, T, dT;
    n = 100;
    if (arguments.length == 2) n = arguments[1];
    T = 0;
    dT = A / n;
    t = new Array();
    for (i = 0; i < n; i++) { t[i] = T;
        T = T + dT; };
    t[n] = A;
    return t;
}

function line(A) {
    var n, i, t;
    n = rows(A);
    if (n) { t = line(n); } else { t = new Array(); for (i = 0; i < A; i++) t[i] = i; }
    return t;
}

function zero(A) {
    var n, m;
    n = rows(A);
    if (n) { m = cols(A); } else { n = A;
        m = 1; }
    return matrix(n, m);
}

function zeros(A) {
    var n, m;
    n = rows(A);
    if (n) { m = cols(A); } else { n = A;
        m = n; }
    return matrix(n, m);
}

function one(A) {
    var n, m, i, j, B;
    n = rows(A);
    if (n) { m = cols(A); } else { n = A;
        m = 1; } B = matrix(n, m);
    for (i = 0; i < n; i++)
        if (m == 1) { B[i] = 1; } else { for (j = 0; j < m; j++) B[i][j] = 1; }
    return B;
}

function ones(A) {
    var n, m, i, j, B;
    var n = rows(A);
    if (n) { m = cols(A); } else { n = A;
        m = n; } B = matrix(n, m);
    for (i = 0; i < n; i++)
        if (m == 1) { B[i] = 1; } else { for (j = 0; j < m; j++) B[i][j] = 1; }
    return B;
}

function randint(A) {
    return Math.round(Math.abs(A * Math.random()));
}

function randseq(n, m, b) {
    var i, j, a, b2;
    a = one(n);
    if (m == undefined) { for (j = 0; j < n; j++)
            if (randint(1) != 1) a[j] = -1; } else {
        if (b == undefined) { for (i = 0; i < n; i++) a[i] = randseq(m); } else {
            if (m > 1) { a = matrix(n, m); for (i = 0; i < n; i++)
                    for (j = 0; j < m; j++) a[i][j] = randint(b); } else {
                for (i = 0; i < n; i++) a[i] = randint(b);
            }
        }
    }
    return a;
}

function rand(A) {
    var n, m, i, j, B;
    n = rows(A);
    if (n) { m = cols(A); } else { n = A;
        m = 1; } B = matrix(n, m);
    for (i = 0; i < n; i++)
        if (m == 1) { B[i] = 2 * Math.random() - 1; } else {
            for (j = 0; j < m; j++) B[i][j] = 2 * Math.random() - 1;
        }
    return B;
}

function rands(A) {
    var n, m, i, j, B;
    n = rows(A);
    if (n) { m = cols(A); } else { n = A;
        m = n; } B = matrix(n, m);
    for (i = 0; i < n; i++)
        if (m == 1) { B[i] = 2 * Math.random() - 1; } else {
            for (j = 0; j < m; j++) B[i][j] = 2 * Math.random() - 1;
        }
    return B;
}

function diag(A) {
    var i, ii, j, k, n, m, B;
    n = rows(A);
    if (arguments.length == 2) {
        k = arguments[1];
        m = cols(A);
        if (n) { if (m) { B = matrix(n * k, m * k); } else { B = matrix(n * k, k); } } else { B = matrix(k, k); }
        for (ii = 0; ii < k; ii++)
            if (n) { for (i = 0; i < n; i++)
                    if (m) { for (j = 0; j < m; j++) B[i + ii * n][j + ii * m] = A[i][j]; } else { B[i + ii * n][ii] = A[i]; } } else { B[ii][ii] = A; }
    } else {
        if (n) {
            m = cols(A);
            if (m == 1) { m = n;
                B = matrix(n, m); for (i = 0; i < n; i++) B[i][i] = A[i]; } else {
                if (n < m) n = m;
                B = matrix(n, 1);
                for (i = 0; i < n; i++) B[i] = A[i][i];
            }
        } else { B = A; }
    }
    return B;
}


function eye(A) {
    var i, n, m, B;
    n = rows(A);
    if (n) { m = cols(A); } else { n = A;
        m = n; } B = matrix(n, m);
    for (i = 0; i < n; i++)
        if (i < m) B[i][i] = 1;
    return B;
}

function eyez(A) {
    var i, n, F, B;
    B = eye(A);
    n = rows(B);
    F = 1;
    for (i = 0; i < n; i++) { B[i][i] = F;
        F = -F; }
    return B;
}

function a2ab(H2) {
    var i, j, i2, j2, i21, j21, v, w, iv, jw, n, m, H;
    m = cols(H2);
    n = rows(H2);
    v = n / 2;
    H = matrix(n, m);
    if (m == 1) {
        for (i = 0; i < v; i++) { i2 = 2 * i;
            i21 = i2 + 1;
            iv = i + v;
            H[i] = H2[i2];
            H[iv] = H2[i21]; }
    } else {
        w = m / 2;
        for (i = 0; i < v; i++) {
            i2 = 2 * i;
            i21 = i2 + 1;
            iv = i + v;
            for (j = 0; j < w; j++) {
                j2 = 2 * j;
                j21 = j2 + 1;
                jw = j + w;
                H[i][j] = H2[i2][j2];
                H[i][jw] = H2[i2][j21];
                H[iv][j] = H2[i21][j2];
                H[iv][jw] = H2[i21][j21];
            }
        }
    }
    return H;
}

function ab2a(H2) {
    var i, j, i2, j2, i21, j21, v, w, iv, jw, n, m, H;
    m = cols(H2);
    n = rows(H2);
    v = n / 2;
    H = matrix(n, m);
    if (m == 1) {
        for (i = 0; i < v; i++) { i2 = 2 * i;
            i21 = i2 + 1;
            iv = i + v;
            H[i2] = H2[i];
            H[i21] = H2[iv]; }
    } else {
        w = m / 2;
        for (i = 0; i < v; i++) {
            i2 = 2 * i;
            i21 = i2 + 1;
            iv = i + v;
            for (j = 0; j < w; j++) {
                j2 = 2 * j;
                j21 = j2 + 1;
                jw = j + w;
                H[i2][j2] = H2[i][j];
                H[i2][j21] = H2[i][jw];
                H[i21][j2] = H2[iv][j];
                H[i21][j21] = H2[iv][jw];
            }
        }
    }
    return H;
}

function a2ds(A) {
    var i, j, P;
    P = zero(1);
    j = 0;
    for (i = 0; i < rows(A); i++)
        if (A[i] != 1) P[j++] = i;
    return P;
}

function ds2a(v, P) {
    var i, j, v2, A;
    A = one(v);
    v2 = rows(P);
    for (i = 0; i < v; i++)
        for (j = 0; j < v2; j++)
            if (i == P[j]) A[i] = -1;
    return A;
}

function diags(A) {
    var i, j, i1, n, m, a, b, B;
    n = rows(A);
    if (n) {
        m = cols(A);
        B = matrix(n, 2);
        if (n == 1) { B[i][0] = A[0];
            B[i][1] = 0; } else {
            i = 0;
            while ((i < n) && (i < m)) {
                a = A[i][i];
                B[i][0] = a;
                B[i][1] = 0;
                i1 = i + 1;
                if (i1 < n) {
                    b = (Math.abs(A[i][i1]) + Math.abs(A[i1][i])) / 2;
                    if (b > 0.000001) {
                        a = (a + A[i1][i1]) / 2;
                        B[i][0] = a;
                        B[i1][0] = a;
                        B[i][1] = b;
                        B[i1][1] = -b;
                        i = i1;
                    }
                }
                i++;
            }
        }
    } else { B = A; }
    return B;
}

function flip(A) {
    var i, j, i1, n, m, B;
    n = rows(A);
    if (n) {
        m = cols(A);
        B = matrix(n, m);
        if (m == 1) { i1 = n; for (i = 0; i < n; i++) { i1--;
                B[i] = A[i1]; } } else {
            for (j = 0; j < m; j++) { i1 = n; for (i = 0; i < n; i++) { i1--;
                    B[i][j] = A[i1][j]; } }
        }
    } else { B = A; }
    return B;
}

function fliplr(A) {
    var i, j, i1, n, m, B;
    n = rows(A);
    if (n) {
        m = cols(A);
        if (m == 1) { B = equal(A) } else {
            B = matrix(n, m);
            for (j = 0; j < n; j++) {
                i1 = m;
                for (i = 0; i < m; i++) { i1--;
                    B[j][i] = A[j][i1]; }
            }
        }
    } else { B = A; }
    return B;
}

function absm(A) {
    var i, j, n, m, B;
    n = rows(A);
    if (n) {
        m = cols(A);
        B = matrix(n, m);
        if (m == 1) { for (i = 0; i < n; i++) B[i] = Math.abs(A[i]); } else {
            for (i = 0; i < n; i++)
                for (j = 0; j < m; j++) B[i][j] = Math.abs(A[i][j]);
        }
    } else { B = Math.abs(A); }
    return B;
}

function sqrtm(A) {
    var i, j, n, m, B;
    n = rows(A);
    if (n) {
        m = cols(A);
        B = matrix(n, m);
        if (m == 1) { for (i = 0; i < n; i++) B[i] = Math.sqrt(A[i]); } else {
            for (i = 0; i < n; i++)
                for (j = 0; j < m; j++) B[i][j] = Math.sqrt(A[i][j]);
        }
    } else { B = Math.sqrt(A); }
    return B;
}

function floorm(A) {
    var i, j, n, m, B;
    n = rows(A);
    if (n) {
        m = cols(A);
        B = matrix(n, m);
        if (m == 1) { for (i = 0; i < n; i++) B[i] = Math.floor(A[i]); } else {
            for (i = 0; i < n; i++)
                for (j = 0; j < m; j++) B[i][j] = Math.floor(A[i][j]);
        }
    } else { B = Math.floor(A); }
    return B;
}

function roundm(A) {
    var i, j, n, m, B;
    n = rows(A);
    if (n) {
        m = cols(A);
        B = matrix(n, m);
        if (m == 1) { for (i = 0; i < n; i++) B[i] = Math.round(A[i]); } else {
            for (i = 0; i < n; i++)
                for (j = 0; j < m; j++) B[i][j] = Math.round(A[i][j]);
        }
    } else { B = Math.round(A); }
    return B;
}

function sign(x, e) { if (arguments.length > 1) { return signm(x, e); } else { return signm(x); } }

function signm(x, e) {
    var i, j, n, m, B;
    n = rows(x);
    if (n) {
        m = cols(x);
        B = matrix(n, m);
        if (m == 1) { for (i = 0; i < n; i++)
                if (arguments.length > 1) { B[i] = signm(x[i], e); } else { B[i] = signm(x[i]); } } else {
            for (i = 0; i < n; i++)
                for (j = 0; j < m; j++)
                    if (arguments.length > 1) { B[i][j] = signm(x[i][j], e); } else { B[i][j] = signm(x[i][j]); }
        }
        return B;
    } else {
        if (x > 0) { return 1; } else {
            if (x < 0) { return -1; } else {
                if (arguments.length > 1) { return e; } else { return 0; }
            }
        }
    }
}

function logm(A) {
    var i, j, n, m, B;
    n = rows(A);
    if (n) {
        m = cols(A);
        B = matrix(n, m);
        if (m == 1) { for (i = 0; i < n; i++) B[i] = Math.log(A[i]); } else {
            for (i = 0; i < n; i++)
                for (j = 0; j < m; j++) B[i][j] = Math.log(A[i][j]);
        }
    } else { B = Math.log(A); }
    return B;
}

// BLOCKS

function col(A, j) {
    var i, n, m, B;
    n = rows(A);
    if (n == 0) { if (j > 0) { B = 0; } else { B = A; } } else {
        m = cols(A);
        B = matrix(n, 1);
        if (m == 1) {
            for (var i = 0; i < n; i++)
                if (j == 0) B[i] = A[i];
        } else {
            for (var i = 0; i < n; i++) { if (j < m) B[i] = A[i][j]; }
        }
    }
    return B;
}

function row(A, i) {
    var j, n, m, nm, B;
    n = rows(A);
    if (n == 0) { if (i > 0) { B = 0; } else { B = A; } } else {
        m = cols(A);
        B = matrix(1, m);
        nm = 0;
        if (m == 1) { if (i < n) B = A[i]; } else {
            for (var j = 0; j < m; j++) B[nm][j] = A[i][j];
            nm++;
        }
    }
    return B;
}

function rowcol(A, i1, i2, j1, j2) {
    var i, j, ii, jj, n, m, n2, m2, B, F;
    n = rows(A);
    F = arguments.length < 4;
    if (n == 0) { if (i1 > 0) { B = 0; } else { B = A; } } else {
        m = cols(A);
        if (i2 < i1) i2 = i1;
        n2 = i2 - i1 + 1;
        if (F) { m2 = m; } else { if (j2 < j1) j2 = j1;
            m2 = j2 - j1 + 1; }
        B = matrix(n2, m2);
        ii = 0;
        if (m == 1) {
            if (!F) F = j1 == 0;
            if (F)
                for (var i = 0; i < n; i++)
                    if (i >= i1)
                        if (i <= i2) { B[ii] = A[i];
                            ii++; }
        } else {
            for (var i = 0; i < n; i++)
                if (i >= i1)
                    if (i <= i2) {
                        if (F) { for (var j = 0; j < m; j++) B[ii][j] = A[i][j]; } else {
                            if (j2 == j1) {
                                for (var j = 0; j < m; j++)
                                    if (j >= j1)
                                        if (j <= j2) B[ii] = A[i][j];
                            } else {
                                jj = 0;
                                for (var j = 0; j < m; j++)
                                    if (j >= j1)
                                        if (j <= j2) { B[ii][jj] = A[i][j];
                                            jj++; }
                            }
                        }
                        ii++;
                    }
        }
    }
    return B;
}

function colline(A) {
    var i, j, k, n, m, ms, B;
    if (arguments.length == 0) { B = []; } else {
        if (arguments.length == 1) {
            n = rows(A);
            if (n == 0) { B = A; } else {
                m = cols(A);
                if (m == 1) { B = equal(A); } else {
                    B = matrix(n * m, 1);
                    k = 0;
                    for (j = 0; j < m; j++)
                        for (i = 0; i < n; i++) { B[k] = A[i][j];
                            k++; }
                }
            }
        } else {
            n = rows(arguments[0]);
            if (n == 0) n = 1;
            m = 0;
            for (k = 0; k < arguments.length; k++) {
                ms = cols(arguments[k]);
                if (ms == 0) ms = 1;
                m = m + ms;
            }
            B = matrix(n, m);
            ms = 0;
            for (k = 0; k < arguments.length; k++) {
                m = cols(arguments[k]);
                if (m == 0) { for (i = 0; i < n; i++) B[i][ms] = arguments[k];
                    m = 1; } else {
                    if (m == 1) { for (i = 0; i < n; i++) B[i][ms] = arguments[k][i]; } else {
                        for (i = 0; i < n; i++)
                            for (j = 0; j < m; j++) B[i][ms + j] = arguments[k][i][j];
                    }
                }
                ms = ms + m;
            }
        }
    }
    return B;
}

function rowline(A) {
    var i, j, k, n, m, ms, B;
    if (arguments.length == 0) { B = []; } else {
        if (arguments.length == 1) {
            n = rows(A);
            if (n == 0) { B = A; } else {
                m = cols(A);
                if (m == 1) { B = equal(A); } else {
                    B = matrix(n * m, 1);
                    k = 0;
                    for (i = 0; i < n; i++)
                        for (j = 0; j < m; j++) { B[k] = A[i][j];
                            k++; }
                }
            }
        } else {
            n = cols(arguments[0]);
            if (n == 0) n = 1;
            m = 0;
            for (k = 0; k < arguments.length; k++) {
                ms = rows(arguments[k]);
                if (ms == 0) ms = 1;
                m = m + ms;
            }
            B = matrix(m, n);
            ms = 0;
            for (k = 0; k < arguments.length; k++) {
                m = rows(arguments[k]);
                if (m == 0) { B[ms] = arguments[k];
                    m = 1; } else {
                    if (n == 1) { for (j = 0; j < m; j++) B[ms + j] = arguments[k][j]; } else {
                        for (j = 0; j < m; j++)
                            for (i = 0; i < n; i++) B[ms + j][i] = arguments[k][j][i];
                    }
                }
                ms = ms + m;
            }
        }
    }
    return B;
}

function sort(A, ix, iy) {
    function srt() { for (i = 0; i < n; i++) Q[i] = A[ix[i]]; }
    var i, j, n, m, Q;
    n = rows(A);
    m = cols(A);
    Q = equal(A);
    if (arguments.length == 3) { if (m == 1) { srt(); } else { for (i = 0; i < n; i++)
                for (j = 0; j < m; j++) Q[i][j] = A[ix[i]][iy[j]]; } } else {
        if (arguments.length > 1) {
            if (m == 1) { srt(); } else { for (i = 0; i < n; i++)
                    for (j = 0; j < m; j++) Q[i][j] = A[i][ix[j]]; }
        } else { if (m == 1) { for (i = 0; i < n; i++)
                    for (j = i + 1; j < n; j++)
                        if (Q[i] > Q[j]) { m = Q[i];
                            Q[i] = Q[j];
                            Q[j] = m; } } else { Q = sort(A, maxabsix(A)); } }
    }
    return Q;
}

function resort(A, ix, iy) {
    var i, j, n, m, Q;
    n = rows(A);
    m = cols(A);
    Q = matrix(n, n);
    if (arguments.length == 3) { for (i = 0; i < n; i++)
            for (j = 0; j < m; j++) Q[ix[i]][iy[j]] = A[i][j]; } else {
        if (arguments.length > 1) { for (i = 0; i < n; i++)
                for (j = 0; j < m; j++) Q[i][ix[j]] = A[i][j]; } else { var ix = getindex(absm(A));
            Q = sort(A, ix); }
    }
    return Q;
}

function sortindex(ix) {
    var i = 1;
    var j = 0;
    while (ix[i - 1] > ix[i]) i = i + 1;
    while (ix[j] > ix[i]) j = j + 1;
    var v = ix[i];
    ix[i] = ix[j];
    ix[j] = v;
    if (i != 1)
        for (var l = 0; l < Math.floor(i / 2); l++) { v = ix[l];
            ix[l] = ix[i - l - 1];
            ix[i - l - 1] = v; }
    return ix;
}

function getindex(A) {
    var i, j, m, ii, ix, q, qm, qj;
    q = equal(A);
    m = rows(q);
    ix = line(m);
    for (i = 0; i < m; i++)
        for (j = i + 1; j < m; j++) {
            qm = q[i];
            qj = q[j];
            if (qm < qj) { q[i] = qj;
                q[j] = qm;
                ii = ix[i];
                ix[i] = ix[j];
                ix[j] = ii; }
        }
    return ix;
}

function maxabsix(A) {
    var j, m, q, ix;
    m = cols(A);
    q = zero(m);
    for (j = 0; j < m; j++) q[j] = maxabs(col(A, j));
    ix = getindex(q);
    return ix;
}

function maxsumix(A) {
    var i, j, n, m, q, ix, s;
    n = rows(A);
    m = cols(A);
    q = zero(m);
    for (j = 0; j < m; j++) { s = 0; for (i = 0; i < n; i++) s = s + A[i][j];
        q[j] = s; };
    ix = getindex(q);
    return ix;
}

function maxcenix(A) {
    var i, j, n, m, q, ix, qm, qj, s;
    n = rows(A);
    m = cols(A);
    q = zero(m);
    for (j = 0; j < m; j++) {
        s = n;
        qj = Math.abs(A[0][j]);
        for (i = 1; i < n; i++) { qm = Math.abs(A[i][j]); if (qm > qj) { qj = qm;
                s = n - i; } };
        q[j] = s;
    };
    ix = getindex(q);
    return ix;
}

function mincenix(A) {
    var i, j, n, m, q, ix, qm, qj, s;
    n = rows(A);
    m = cols(A);
    q = zero(m);
    for (j = 0; j < m; j++) {
        s = n;
        qj = Math.abs(A[0][j]);
        for (i = 1; i < n; i++) { qm = Math.abs(A[i][j]); if (qm < qj) { qj = qm;
                s = n - i; } };
        q[j] = s;
    };
    ix = getindex(q);
    return ix;
}

function maxoscix(A) {
    var i, j, n, m, q, ix, s;
    n = rows(A);
    m = cols(A);
    q = zero(m);
    for (j = 0; j < m; j++) { s = 0; for (i = 1; i < n; i++) { if (sign(A[i][j]) != sign(A[i - 1][j])) s = s + 1; } q[j] = s; };
    ix = getindex(q);
    return ix;
}

function maxm(A) {
    var i, j, n, m, a, B;
    n = rows(A);
    if (n == 0) { B = A; } else {
        m = cols(A);
        B = 0;
        if (m == 1) {
            for (i = 0; i < n; i++) { a = A[i]; if (a > B) B = a; }
        } else {
            for (j = 0; j < m; j++)
                for (i = 0; i < n; i++) { a = A[i][j]; if (a > B) B = a; }
        }
    }
    return B;
}

function minm(A) {
    var i, j, n, m, a, B;
    n = rows(A);
    if (n == 0) { B = A; } else {
        m = cols(A);
        if (m == 1) {
            B = A[0];
            for (i = 0; i < n; i++) { a = A[i]; if (a < B) B = a; }
        } else {
            B = A[0][0];
            for (j = 0; j < m; j++)
                for (i = 0; i < n; i++) { a = A[i][j]; if (a < B) B = a; }
        }
    }
    return B;
}

function maxabs(A) {
    var i, j, n, m, a, B;
    n = rows(A);
    if (n == 0) { B = Math.abs(A); } else {
        m = cols(A);
        B = 0;
        if (m == 1) {
            for (i = 0; i < n; i++) { a = Math.abs(A[i]); if (a > B) B = a; }
        } else {
            for (j = 0; j < m; j++)
                for (i = 0; i < n; i++) { a = Math.abs(A[i][j]); if (a > B) B = a; }
        }
    }
    return B;
}

function minabs(A) {
    var i, j, n, m, a, B;
    n = rows(A);
    if (n == 0) { B = Math.abs(A); } else {
        m = cols(A);
        if (m == 1) {
            B = Math.abs(A[0]);
            for (i = 0; i < n; i++) { a = Math.abs(A[i]); if (a < B) B = a; }
        } else {
            B = Math.abs(A[0][0]);
            for (j = 0; j < m; j++)
                for (i = 0; i < n; i++) { a = Math.abs(A[i][j]); if (a < B) B = a; }
        }
    }
    return B;
}

function maxix(A) {
    var i, j, im, jm, n, m, a, B;
    n = rows(A);
    im = 0;
    jm = 0;
    if (n == 0) { B = A; } else {
        m = cols(A);
        B = 0;
        if (m == 1) {
            for (i = 0; i < n; i++) { a = A[i]; if (a > B) { im = i;
                    B = a; } }
        } else {
            for (j = 0; j < m; j++)
                for (i = 0; i < n; i++) { a = A[i][j]; if (a > B) { im = i;
                        jm = j;
                        B = a; } }
        }
    }
    B = [im, jm, B];
    return B;
}

function minix(A) {
    var i, j, im, jm, n, m, a, B;
    n = rows(A);
    im = 0;
    jm = 0;
    if (n == 0) { B = A; } else {
        m = cols(A);
        if (m == 1) {
            B = A[0];
            for (i = 0; i < n; i++) { a = A[i]; if (a < B) { im = i;
                    B = a; } }
        } else {
            B = A[0][0];
            for (j = 0; j < m; j++)
                for (i = 0; i < n; i++) { a = A[i][j]; if (a < B) { im = i;
                        jm = j;
                        B = a; } }
        }
    }
    B = [im, jm, B];
    return B;
}

function maxabslsm(A, B, C, D, FF, G) {
    function getm() {
        if (Fe) { Fx = x == FF;
            x = FF - x; } x = Math.abs(x);
        if (m < x) m = x;
    }
    var i, j, i1, k, n, a, a2, b, b2, c, c2, d, d2, f, f2, g, g2, F, Fe, Fx, x, m = 0;
    F = arguments.length;
    Fe = false;
    if (F == 2) { Fe = rows(B) == 0; if (Fe) { F = 1;
            FF = B; } } else {
        if (F == 3) { Fe = rows(C) == 0; if (Fe) { F = 2;
                FF = C; } } else {
            if (F == 5) Fe = true;
        }
    }
    n = rows(A);
    Fx = true;
    if (F == 6) {
        for (i = 0; i < n; i++) {
            a = A[i];
            b = B[i];
            c = C[i];
            d = D[i];
            f = FF[i];
            g = G[i];
            i1 = i + 1;
            for (j = i1; j < n; j++) {
                x = 0;
                a2 = A[j];
                b2 = B[j];
                c2 = C[j];
                d2 = D[j];
                f2 = FF[j];
                g2 = G[j];
                for (k = 0; k < n; k++)
                    x += a[k] * a2[k] + b[k] * b2[k] + c[k] * c2[k] + d[k] * d2[k] + f[k] * f2[k] + g[k] * g2[k];
                getm();
            }
        }
    } else {
        for (i = 0; i < n; i++)
            if (Fx) {
                a = A[i];
                i1 = i + 1;
                if (F > 2) {
                    b = B[i];
                    c = C[i];
                    d = D[i];
                    for (j = i1; j < n; j++)
                        if (Fx) {
                            x = 0;
                            a2 = A[j];
                            b2 = B[j];
                            c2 = C[j];
                            d2 = D[j];
                            for (k = 0; k < n; k++)
                                x += a[k] * a2[k] + b[k] * b2[k] + c[k] * c2[k] + d[k] * d2[k];
                            getm();
                        }
                } else {
                    if (F == 2) {
                        b = B[i];
                        for (j = i1; j < n; j++)
                            if (Fx) {
                                x = 0;
                                a2 = A[j];
                                b2 = B[j];
                                for (k = 0; k < n; k++) x += a[k] * a2[k] + b[k] * b2[k];
                                getm();
                            }
                    } else {
                        for (j = i1; j < n; j++)
                            if (Fx) {
                                x = 0;
                                a2 = A[j];
                                for (k = 0; k < n; k++) x += a[k] * a2[k];
                                getm();
                            }
                    }
                }
            }
    }
    return m;
}

function optdet(H, df, p, q) {
    var n, m, sn, d, dn, dmx, u, uu, ix, A, B;
    n = rows(H);
    A = orth(H);
    B = equal(A); // A=norms(A); 
    u = line(n);
    uu = equal(u);
    m = maxabs(A);
    dn = 1 / n;
    d = dn / m / m;
    if (dn < df) {
        dmx = 0;
        while (q > 1) {
            p = 0.995 * p + 0.005;
            q--;
            ix = maxabsix(A);
            u = sort(u, ix);
            A = sort(A, ix);
            A = sat(A, m * p);
            A = orth(A);
            m = maxabs(A);
            d = dn / m / m;
            if (d > dmx) {
                dmx = d;
                B = equal(A);
                uu = equal(u);
                if (d >= df) q = 0;
            }
        }
    }
    return resort(B, uu);
}

// ALGEBRA

function minp(A) { return mulp(-1, A) }

function conv(A, B) {
    var k, j, j1, j2, n, m, w, C;
    m = rows(A);
    n = rows(B);
    w = n + m - 1;
    C = zero(w);
    for (k = 0; k < w; k++) { j2 = k + 1;
        j1 = j2 - n; if (j1 < 0) j1 = 0; if (j2 > m) j2 = m;
        S = 0; for (j = j1; j < j2; j++) S += A[j] * B[k - j];
        C[k] = S; }
    return C;
}

function add(A, B) {
    var i, j, n, m, k, l, C;
    n = rows(A);
    m = cols(A);
    k = rows(B);
    l = cols(B);
    if ((n == 0) && (k == 0)) { C = A + B; } else {
        if (n == 0) {
            C = matrix(k, l);
            if (l == 1) {
                for (i = 0; i < k; i++) C[i] = A + B[i];
            } else {
                for (i = 0; i < k; i++)
                    for (j = 0; j < l; j++) C[i][j] = A + B[i][j];
            }
        } else {
            C = matrix(n, m);
            if (k == 0) {
                if (m == 1) {
                    for (i = 0; i < n; i++) C[i] = A[i] + B;
                } else {
                    for (i = 0; i < n; i++)
                        for (j = 0; j < m; j++) C[i][j] = A[i][j] + B;
                }
            } else {
                if (m == 1) {
                    for (i = 0; i < n; i++) C[i] = A[i];
                } else {
                    for (i = 0; i < n; i++)
                        for (j = 0; j < m; j++) C[i][j] = A[i][j];
                }
                if (m == 1) {
                    for (i = 0; i < n; i++)
                        if (i < k)
                            if (l == 1) { C[i] += B[i]; } else { C[i] += B[i][0]; }
                } else {
                    for (i = 0; i < n; i++)
                        if (i < k)
                            for (j = 0; j < m; j++)
                                if (j < l)
                                    if (l == 1) { C[i][j] += B[i]; } else { C[i][j] += B[i][j]; }
                }
            }
        }
    }
    return C;
}

function sub(A, B) {
    var i, j, n, m, k, l, C;
    n = rows(A);
    m = cols(A);
    k = rows(B);
    l = cols(B);
    if ((n == 0) && (k == 0)) { C = A - B; } else {
        if (n == 0) {
            C = matrix(k, l);
            if (l == 1) {
                for (i = 0; i < k; i++) C[i] = A - B[i];
            } else {
                for (i = 0; i < k; i++)
                    for (j = 0; j < l; j++) C[i][j] = A - B[i][j];
            }
        } else {
            C = matrix(n, m);
            if (k == 0) {
                if (m == 1) {
                    for (i = 0; i < n; i++) C[i] = A[i] - B;
                } else {
                    for (i = 0; i < n; i++)
                        for (j = 0; j < m; j++) C[i][j] = A[i][j] - B;
                }
            } else {
                if (m == 1) {
                    for (i = 0; i < n; i++) C[i] = A[i];
                } else {
                    for (i = 0; i < n; i++)
                        for (j = 0; j < m; j++) C[i][j] = A[i][j];
                }
                if (m == 1) {
                    for (i = 0; i < n; i++)
                        if (i < k)
                            if (l == 1) { C[i] -= B[i]; } else { C[i] -= B[i][0]; }
                } else {
                    for (i = 0; i < n; i++)
                        if (i < k)
                            for (j = 0; j < m; j++)
                                if (j < l)
                                    if (l == 1) { C[i][j] -= B[i]; } else { C[i][j] -= B[i][j]; }
                }
            }
        }
    }
    return C;
}

function mul(A, B) {
    var i, j, ii, n, m, k, l, s, C;
    n = rows(A);
    m = cols(A);
    k = rows(B);
    l = cols(B);
    if ((n == 0) && (k == 0)) { C = A * B; } else {
        if (n == 0) { C = mulp(A, B); } else {
            if (k == 0) { C = mulp(A, B); } else {
                C = matrix(n, l);
                if (m != k) { alert('error of matrix dimensions'); } else {
                    if (m == 1) {
                        if (l == 1) { for (i = 0; i < n; i++) C[i] = A[i] * B[0]; } else {
                            for (i = 0; i < n; i++)
                                for (j = 0; j < l; j++) C[i][j] = A[i] * B[0][j];
                        }
                    } else {
                        if (l == 1) {
                            for (i = 0; i < n; i++) {
                                s = 0;
                                for (ii = 0; ii < m; ii++) s = s + A[i][ii] * B[ii];
                                C[i] = s;
                            }
                            if (n == 1) C = s;
                        } else {
                            for (i = 0; i < n; i++)
                                for (j = 0; j < l; j++) {
                                    s = 0;
                                    for (ii = 0; ii < m; ii++) s = s + A[i][ii] * B[ii][j];
                                    C[i][j] = s;
                                }
                        }
                    }
                }
            }
        }
    }
    return C;
}

function mulp(A, B) {
    var i, j, n, m, k, l, C;
    n = rows(A);
    m = cols(A);
    k = rows(B);
    l = cols(B);
    if ((n == 0) && (k == 0)) { C = A * B; } else {
        if (n == 0) {
            C = matrix(k, l);
            if (l == 1) {
                for (i = 0; i < k; i++) C[i] = A * B[i];
            } else {
                for (i = 0; i < k; i++)
                    for (j = 0; j < l; j++) C[i][j] = A * B[i][j];
            }
        } else {
            C = matrix(n, m);
            if (k == 0) {
                if (m == 1) {
                    for (i = 0; i < n; i++) C[i] = A[i] * B;
                } else {
                    for (i = 0; i < n; i++)
                        for (j = 0; j < m; j++) C[i][j] = A[i][j] * B;
                }
            } else {
                if (m == 1) {
                    for (i = 0; i < n; i++) C[i] = A[i];
                } else {
                    for (i = 0; i < n; i++)
                        for (j = 0; j < m; j++) C[i][j] = A[i][j];
                }
                if (m == 1) {
                    for (i = 0; i < n; i++)
                        if (i < k)
                            if (l == 1) { C[i] *= B[i]; } else { C[i] *= B[i][0]; }
                } else {
                    for (i = 0; i < n; i++)
                        if (i < k)
                            for (j = 0; j < m; j++)
                                if (j < l)
                                    if (l == 1) { C[i][j] *= B[i]; } else { C[i][j] *= B[i][j]; }
                }
            }
        }
    }
    return C;
}

function mulcirc(a, b, c) {
    var i, j, s, d, v, A;
    v = rows(a);
    if (b == undefined) var b = 0;
    if (c == undefined) var c = v;
    A = zero(c);
    for (i = b; i < c; i++) {
        s = 0;
        for (j = 0; j < v; j++) {
            d = j + i;
            if (d >= v) d -= v;
            s += a[d] * a[j];
        }
        A[i] = s;
    }
    return A;
}

function mulnegacirc(a, b, c) {
    var i, j, s, d, v, A;
    v = rows(a);
    if (b == undefined) var b = 0;
    if (c == undefined) var c = v;
    A = zero(c);
    for (i = b; i < c; i++) {
        s = 0;
        for (j = 0; j < v; j++) {
            d = j + i;
            if (d >= v) { d -= v;
                s -= a[d] * a[j]; } else { s += a[d] * a[j]; }
        }
        A[i] = s;
    }
    return A;
}

function powm(A, n) { var i, P;
    P = eye(A); for (i = 0; i < n; i++) P = mul(P, A); return P }

function kron(A, B) {
    var i, j, ii, jj, n, m, k, l, nk, ml, C;
    n = rows(A);
    m = cols(A);
    k = rows(B);
    l = cols(B);
    if ((n == 0) && (k == 0)) { C = A * B; } else {
        if (n == 0) { C = mulp(A, B); } else {
            if (k == 0) { C = mulp(A, B); } else {
                nk = n * k;
                ml = m * l;
                C = matrix(nk, ml);
                if (ml == 1) {
                    for (i = 0; i < n; i++)
                        for (ii = 0; ii < k; ii++) C[i * k + ii] = A[i] * B[ii];
                } else {
                    for (i = 0; i < n; i++)
                        for (j = 0; j < m; j++)
                            for (ii = 0; ii < k; ii++)
                                for (jj = 0; jj < l; jj++)
                                    if (m == 1) { C[i * k + ii][j * l + jj] = A[i] * B[ii][jj]; } else { if (l == 1) { C[i * k + ii][j * l + jj] = A[i][j] * B[ii]; } else { C[i * k + ii][j * l + jj] = A[i][j] * B[ii][jj]; } }
                }
            }
        }
    }
    return C;
}

function mul2seq(a, b, ag, bg) {
    var i, v, g, gvg, apb, amb, cg, dg, cgs, dgs, a2, b2, A, B, F;
    v = rows(a);
    F = arguments.length;
    if (F < 3) { var ag = [1, 1]; var bg = [1, -1]; }
    if (F < 5) {
        g = rows(ag);
        gvg = g * (v - 1) + 1;
        A = divp(add(ag, bg), 2);
        B = divp(sub(ag, bg), 2);
        cg = zero(gvg);
        dg = zero(gvg);
        for (i = 0; i < v; i++) { cg[i * g] = a[i];
            dg[i * g] = b[i]; } cgs = flip(cg);
        dgs = flip(dg);
        a2 = add(conv(A, cg), conv(B, dgs));
        b2 = sub(conv(A, dg), conv(B, cgs));
    } else {
        a2 = [];
        b2 = [];
        for (i = 0; i < v; i++) {
            A = a[i];
            B = b[i];
            if ((A == 1) && (B == 1)) { a2 = a2.concat(ag);
                b2 = bg.concat(b2); } else {
                if ((A != 1) && (B == 1)) { a2 = a2.concat(bg);
                    b2 = minp(ag).concat(b2); } else {
                    if ((A == 1) && (B != 1)) { a2 = a2.concat(minp(bg));
                        b2 = ag.concat(b2); } else { // if ((A!=1)&&(B!=1)) { }
                        a2 = a2.concat(minp(ag));
                        b2 = minp(bg).concat(b2);
                    }
                }
            }
        }
    }
    return [a2, b2];
}

function div(A, B) {
    var C = inv(A);
    C = mul(C, B);
    return C;
}

function div2(A, B) {
    var C = inv(B);
    C = mul(A, C);
    return C;
}

function inv(A) {
    var i, j, j2, k, F, G, SM, ES, E0, Rk, Sin, D, B, C;
    var n = rows(A),
        m = cols(A);
    if (n == 0) { if (A == 0) { B = 0; } else { B = 1 / A; } } else {
        var TolSTD = 0.0000000000001;
        B = matrix(m, n);
        E0 = TolSTD * TolSTD;
        ES = tolerance;
        SM = 0;
        Rk = 0;
        Sin = new Array(0);
        D = new Array(0);
        C = new Array(0);
        for (i = m - 1; i >= 0; i--) {
            Sin[i] = 1;
            F = 0;
            for (j = 0; j < n; j++) { if (m == 1) { G = A[j]; } else { G = A[j][i]; } F = F + G * G; } SM = SM + F;
            D[i] = F;
        }
        E0 = E0 * SM;
        if (E0 < TolSTD) E0 = TolSTD;
        i = 0;
        if (SM > 0) {
            if (n == 1) { for (j = 0; j < m; j++) B[j] = A[i][j] / SM; } else {
                if (m == 1) { for (j = 0; j < n; j++) B[i][j] = A[j] / SM; } else {
                    if (F > E0) { Rk = 1;
                        Sin[i] = Rk;
                        F = D[i]; if (F == 0) F = Rk; for (j = 0; j < n; j++) B[i][j] = A[j][i] / F; }
                    for (k = 1; k < m; k++) {
                        if (D[k] < E0) { for (j = 0; j < n; j++) B[k][j] = 0; } else {
                            j2 = k;
                            for (j = 0; j < j2; j++) { F = 0; for (i = 0; i < n; i++) F = F + B[j][i] * A[i][k];
                                D[j] = F; };
                            SM = 0;
                            for (j = 0; j < n; j++) { F = A[j][k]; for (i = 0; i < j2; i++) F = F - A[j][i] * D[i];
                                C[j] = F;
                                SM = SM + F * F; };
                            if (D[k] > TolSTD) Sin[k] = Math.sqrt(SM / D[k]);
                            if (SM > ES * D[k]) { for (j = 0; j < n; j++) B[k][j] = C[j] / SM;
                                Rk++; } else {
                                F = 1;
                                for (j = 0; j < j2; j++) F = F + D[j] * D[j];
                                for (j = 0; j < n; j++) { SM = 0; for (i = 0; i < j2; i++) SM = SM + D[i] * B[i][j];
                                    B[k][j] = SM / F; }
                            };
                            for (j = 0; j < j2; j++)
                                for (i = 0; i < n; i++) B[j][i] = B[j][i] - D[j] * B[k][i];
                        }
                    }
                }
            }
        }
    }
    return B;
};

function divp(A, B) {
    var i, j;
    var n = rows(A),
        m = cols(A),
        k = rows(B),
        l = cols(B);
    if ((n == 0) && (k == 0)) { var C = A / B; } else {
        if (n == 0) {
            var C = matrix(k, l);
            if (l == 1) {
                for (i = 0; i < k; i++) C[i] = A / B[i];
            } else {
                for (i = 0; i < k; i++)
                    for (var j = 0; j < l; j++) C[i][j] = A / B[i][j];
            }
        } else {
            var C = matrix(n, m);
            if (k == 0) {
                if (m == 1) {
                    for (i = 0; i < n; i++) C[i] = A[i] / B;
                } else {
                    for (i = 0; i < n; i++)
                        for (j = 0; j < m; j++) C[i][j] = A[i][j] / B;
                }
            } else {
                if (m == 1) {
                    for (i = 0; i < n; i++) C[i] = A[i];
                } else {
                    for (i = 0; i < n; i++)
                        for (j = 0; j < m; j++) C[i][j] = A[i][j];
                }
                if (m == 1) {
                    for (i = 0; i < n; i++)
                        if (i < k)
                            if (l == 1) { C[i] /= B[i]; } else { C[i] /= B[i][0]; }
                } else {
                    for (var i = 0; i < n; i++)
                        if (i < k)
                            for (var j = 0; j < m; j++)
                                if (j < l)
                                    if (l == 1) { C[i][j] /= B[i]; } else { C[i][j] /= B[i][j]; }
                }
            }
        }
    }
    return C;
}


function tr(A) {
    var i, j, n, m, B;
    n = rows(A);
    if (n == 0) { B = A; } else {
        m = cols(A);
        if ((n == 1) && (m == 1)) { B = equal(A); } else {
            B = matrix(m, n);
            if (m == 1) { for (i = 0; i < n; i++) B[0][i] = A[i]; } else {
                if (n == 1) { for (j = 0; j < m; j++) B[j] = A[0][j]; } else {
                    for (i = 0; i < n; i++)
                        for (j = 0; j < m; j++) B[j][i] = A[i][j];
                }
            }
        }
    }
    return B;
}

function tril(A) {
    var i, j, n, m, B;
    n = rows(A);
    if (n == 0) { B = A; } else {
        m = cols(A);
        B = matrix(n, m);
        if (m == 1) { for (i = 0; i < n; i++) B[i] = A[i]; } else {
            for (i = 0; i < n; i++)
                for (j = 0; j <= i; j++) B[i][j] = A[i][j];
        }
    }
    return B;
}

function triu(A) {
    var B = tr(tril(tr(A)));
    return B;
}

function orth(A) {
    var i, j, k, n, m, s, a, q, Q;
    Q = zeros(A);
    n = rows(A);
    m = cols(A);
    q = col(A, 0);
    q = norms(q);
    for (i = 0; i < n; i++) Q[i][0] = q[i];
    for (k = 1; k < m; k++) {
        a = col(A, k);
        for (j = 0; j < k; j++) {
            q = col(Q, j);
            s = 0;
            for (i = 0; i < n; i++) s = s + a[i] * q[i];
            for (i = 0; i < n; i++) a[i] = a[i] - s * q[i];
        };
        a = norms(a);
        for (i = 0; i < n; i++) Q[i][k] = a[i];
    }
    return Q;
}

function qr(P) {
    var i, j, k, n, m, u, v, s, p, Q;
    n = rows(P);
    m = cols(P);
    Q = eye(n);
    for (j = 0; j < m; j++) {
        s = 0.0;
        for (i = j; i < n; i++) { v = P[i][j];
            s = s + v * v; } s = Math.sqrt(s);
        u = P[j][j];
        if (u > 0) s = -s;
        u = u - s;
        P[j][j] = s;
        p = s * u;
        if (p != 0) {
            for (i = j + 1; i < m; i++) {
                s = P[j][i] * u;
                for (k = j + 1; k < n; k++) s = s + P[k][i] * P[k][j];
                s = s / p;
                P[j][i] = P[j][i] + s * u;
                for (k = j + 1; k < n; k++) P[k][i] = P[k][i] + s * P[k][j];
            }
            for (i = 0; i < n; i++) {
                s = Q[j][i] * u;
                for (k = j + 1; k < n; k++) s = s + Q[k][i] * P[k][j];
                s = s / p;
                Q[j][i] = Q[j][i] + s * u;
                for (k = j + 1; k < n; k++) Q[k][i] = Q[k][i] + s * P[k][j];
            }
        }
        for (i = j + 1; i < n; i++) P[i][j] = 0;
    }
    return Q;
}

function lsm(P, r, eps) {
    var i, j, n, rank, n1, r1, I, T, Q, x;
    n = rows(P);
    if (n) {
        T = cholbal(P, r, eps);
        r = T[1];
        I = T[2];
        rank = T[3];
        n1 = n - 1;
        r1 = rank - 1;
        T = rowcol(T[0], 0, n1, 0, r1);
        Q = qr(T);
        x = zero(rank);
        x[0] = r[0] / T[0][0];
        for (i = 1; i < rank; i++) {
            s = r[i];
            for (j = 0; j < i; j++) s = s - T[j][i] * x[j];
            x[i] = s / T[i][i];
        }
        Q = rowcol(Q, 0, r1, 0, n1);
        T = mul(tr(Q), x);
        for (i = 0; i < n; i++) x[I[i]] = T[i];
    } else {
        if (P == 0) { rank = 0;
            x = r; } else { rank = 1;
            x = r / P; }
    }
    return [x, rank];
}

function cholbal(A, b, eps) {
    var i, j, k, n, s, p, rank, P, r, L, I, ki, rk, si, eps;
    n = cols(A);
    if (n) {
        P = equal(A);
        r = equal(b);
        rank = -1;
        I = line(n);
        L = zeros(P);
        for (i = 0; i < n; i++) L[i][i] = Math.abs(P[i][i]);
        for (k = 0; k < n; k++)
            if (k == rank + 1) {
                ki = k;
                rk = 0;
                s = Math.sqrt(L[k][k]);
                for (i = k; i < n; i++) {
                    si = L[i][i];
                    if (si > eps) {
                        si = Math.sqrt(si);
                        ri = Math.abs(r[i]) / si;
                        rank = k;
                        if (ri > rk) { rk = ri;
                            s = si;
                            ki = i; }
                    }
                }
                if (ki > k) {
                    for (i = k; i < n; i++) {
                        p = P[i][ki];
                        P[i][ki] = P[i][k];
                        P[i][k] = p;
                    }
                    for (i = k; i < n; i++) {
                        p = P[ki][i];
                        P[ki][i] = P[k][i];
                        P[k][i] = p;
                    }
                    for (i = 0; i < k; i++) {
                        p = L[ki][i];
                        L[ki][i] = L[k][i];
                        L[k][i] = p;
                    }
                    p = I[ki];
                    I[ki] = I[k];
                    I[k] = p;
                    p = r[ki];
                    r[ki] = r[k];
                    r[k] = p;
                    L[ki][ki] = L[k][k];
                }
                if (rank == k) {
                    r[k] = r[k] / s;
                    L[k][k] = s;
                    for (i = k + 1; i < n; i++) {
                        p = P[i][k];
                        for (j = 0; j < k; j++) p = p - L[i][j] * L[k][j];
                        p = p / s;
                        L[i][k] = p;
                        r[i] = r[i] - p * r[k];
                        p = L[i][i] - p * p;
                        if (p < 0) p = 0;
                        L[i][i] = p;
                    }
                }
            } rank++;
        for (i = rank; i < n; i++) L[i][i] = 0;
    } else {
        I = 0;
        L = Math.sqrt(A);
        if (A < eps) { rank = 0;
            r = b; } else { rank = 1;
            r = b / L; }
    }
    return [L, r, I, rank];
}

function chol(P) {
    var i, j, k, n, s, p, L;
    n = cols(P);
    if (n) {
        L = zeros(P);
        for (k = 0; k < n; k++)
            for (i = k; i < n; i++) {
                p = P[i][k];
                for (j = 0; j < k; j++) p = p - L[i][j] * L[k][j];
                if (i == k) {
                    if (p < tolerance) p = tolerance;
                    s = Math.sqrt(p);
                    L[i][i] = s;
                } else { L[i][k] = p / s; }
            }
    } else { L = Math.sqrt(P); }
    return L;
}

function rank(A) {
    var n, m, r, P, L;
    n = rows(A);
    m = cols(A);
    if (n <= m) { P = mul(A, tr(A)); } else { P = mul(tr(A), A);
        n = m; }
    r = one(n);
    L = cholbal(P, r, tolerance);
    return L[3];
}

function det(A) {
    var i, n, d, U;
    n = rows(A);
    if (n) {
        if (A[0][0] == 0) { U = lu(flip(A)); } else { U = lu(A); } U = U[1];
        d = 1;
        for (i = 0; i < n; i++) d = d * U[i][i];
        if (A[0][0] == 0) d = -d;
        if (isNaN(d)) { U = add(A, mulp(0.000001, eye(A)));
            d = det(U); }
    } else { d = A; }
    return d;
}

function lu(A) {
    var i, j, k, n, s, u, L, U;
    n = rows(A);
    L = zeros(A);
    U = zeros(A);
    for (i = 0; i < n; i++) {
        for (j = i; j < n; j++) {
            s = A[i][j];
            for (k = 0; k < i; k++) s = s - L[i][k] * U[k][j];
            U[i][j] = s;
        }
        u = U[i][i];
        for (j = i; j < n; j++) {
            s = A[j][i];
            for (k = 0; k < i; k++) s = s - L[j][k] * U[k][i];
            L[j][i] = s / u;
        }
    }
    return [L, U];
}

function cond(A) {
    var S = svd(A);
    return S[0] / S[rows(A) - 1];
}

function svd(A) {
    var S = diag(eig(mul(tr(A), A)));
    for (var i = 0; i < rows(S); i++) S[i] = Math.sqrt(S[i]);
    return S;
}

function svds(A) {
    var i, j, k, S, V, U;
    S = eigs(mul(tr(A), A));
    V = S[1];
    S = S[0];
    for (i = 0; i < rows(S); i++) S[i][i] = Math.sqrt(S[i][i]);
    U = norms(div2(mul(A, V), S));
    i = rows(A) - 1;
    j = cols(A) - 1;
    k = i;
    if (k > j) k = j;
    U = rowcol(U, 0, i, 0, k);
    S = rowcol(S, 0, k, 0, k);
    V = rowcol(V, 0, j, 0, k);
    return [U, S, V];
}

// FUNCTIONS

function sum(A) {
    var i, j, n, m, s, S;
    n = rows(A);
    if (n) {
        m = cols(A);
        if (m == 1) { S = 0; for (i = 0; i < n; i++) S = S + A[i]; } else {
            S = one(m);
            for (j = 0; j < m; j++) { s = 0; for (i = 0; i < n; i++) s = s + A[i][j];
                S[j] = s; }
        }
    } else { S = A; }
    return S;
}

function sums(A) {
    var i, j, n, m, s, S;
    n = rows(A);
    m = cols(A);
    if ((n == 0) || (m < 2)) { S = equal(A) } else {
        S = one(n);
        for (i = 0; i < n; i++) { s = 0; for (j = 0; j < m; j++) s = s + A[i][j];
            S[i] = s; }
    }
    return S;
}

function absm(A) {
    var i, j, n, m, B;
    n = rows(A);
    if (n == 0) { B = Math.abs(A); } else {
        m = cols(A);
        B = matrix(n, m);
        if (m == 1) {
            for (var i = 0; i < n; i++) B[i] = Math.abs(A[i]);
        } else {
            for (var j = 0; j < m; j++)
                for (var i = 0; i < n; i++) B[i][j] = Math.abs(A[i][j]);
        }
    }
    return B;
}

function sat(A, S, M) {
    var i, j, n, m, b, mS, B, F, Z;
    n = rows(A);
    Z = S < 0;
    if (Z) S = -S;
    mS = -S;
    F = false;
    if (arguments.length == 3) { if (M < 0) M = abs(M); var mM = -M;
        F = true; }

    function sata(a) {
        if (a > S) { if (Z) { b = a; } else { b = S; } } else { if (a < mS) { b = mS; } else { b = a; } }
        if (F)
            if (Math.abs(b) < M)
                if (b > 0) { b = M; } else { b = mM; } return b;
    }
    if (n == 0) { if (A != 0) { B = sata(A); } else { B = A; } } else {
        m = cols(A);
        B = matrix(n, m);
        if (m == 1) { for (var i = 0; i < n; i++) B[i] = sata(A[i]); } else {
            for (var j = 0; j < m; j++)
                for (var i = 0; i < n; i++) B[i][j] = sata(A[i][j]);
        }
    }
    return B;
}

function eig(A) { var D = eigs(A); return D[0]; }

function eigv(A) { var D = eigs(A); return D[1]; }

function eigs(A) {
    var innerE0 = 1e-35;
    var n = rows(A),
        n1 = cols(A);
    var B = equal(A);
    var C = eye(n);
    if (n1 != n) { alert('eig() - matrix have to be square!'); } else {
        var mark = 0,
            n1 = n - 1;
        for (var t = 0; t < toleranceeig; t++) {
            if (mark > 0) break;
            var con = 0;
            for (var i = 0; i < n1; i++) {
                var aii = B[i][i];
                for (var j = i + 1; j < n; j++) {
                    var aij = B[i][j];
                    var aji = B[j][i];
                    if (Math.abs(aij + aji) > innerE0 || (Math.abs(aij - aji) > innerE0 && Math.abs(aii - B[j][j]) > innerE0)) { con = 1; break; }
                }
            };
            if (con == 0) { break; } else {
                mark = 1;
                for (var k = 0; k < n1; k++)
                    for (var m = k + 1; m < n; m++) {
                        var h = 0,
                            g = 0,
                            hj = 0,
                            yh = 0;
                        for (var i = 0; i < n; i++) {
                            var aik = B[i][k];
                            var aim = B[i][m];
                            var te = aik * aik;
                            var tee = aim * aim;
                            yh = yh + te - tee;
                            if (i != k && i != m) {
                                var aki = B[k][i];
                                var ami = B[m][i];
                                h = h + aki * ami - aik * aim;
                                var tep = te + ami * ami;
                                var tem = tee + aki * aki;
                                g = g + tep + tem;
                                hj = hj - tep + tem;
                            }
                        };
                        h = h + h;
                        var d = B[k][k] - B[m][m];
                        var akm = B[k][m];
                        var amk = B[m][k];
                        var c = akm + amk;
                        var de = akm - amk;
                        if (Math.abs(c) < innerE0) { var cx = 1; var sx = 0; } else {
                            var cot2x = d / c;
                            var sig = 1;
                            if (cot2x < 0) sig = -1;
                            var cotx = cot2x + (sig * Math.sqrt(1 + cot2x * cot2x));
                            var sx = sig / Math.sqrt(1 + cotx * cotx);
                            var cx = sx * cotx;
                        };
                        if (yh < 0) { var tem = cx; var cx = sx;
                            sx = -tem; };
                        var cos2x = cx * cx - sx * sx;
                        var sin2x = 2 * sx * cx;
                        d = d * cos2x + c * sin2x;
                        h = h * cos2x - hj * sin2x;
                        var den = g + 2 * (de * de + d * d);
                        var tanhy = (de * d - h / 2) / den;
                        if (Math.abs(tanhy) < innerE0) { var chy = 1; var shy = 0; } else {
                            var chy = 1 / Math.sqrt(1 - tanhy * tanhy);
                            var shy = chy * tanhy;
                        };
                        var c1 = chy * cx - shy * sx;
                        var c2 = chy * cx + shy * sx;
                        var s1 = chy * sx + shy * cx;
                        var s2 = -chy * sx + shy * cx;
                        if (Math.abs(s1) > innerE0 || Math.abs(s2) > innerE0) {
                            mark = 0;
                            for (var i = 0; i < n; i++) { var aki = B[k][i]; var ami = B[m][i];
                                B[k][i] = c1 * aki + s1 * ami;
                                B[m][i] = s2 * aki + c2 * ami; }
                            for (var i = 0; i < n; i++) {
                                var aik = B[i][k];
                                var aim = B[i][m];
                                B[i][k] = c2 * aik - s2 * aim;
                                B[i][m] = -s1 * aik + c1 * aim;
                                var cik = C[i][k];
                                var cim = C[i][m];
                                C[i][k] = c2 * cik - s2 * cim;
                                C[i][m] = -s1 * cik + c1 * cim;
                            }
                        }
                    }
            }
        }
    }
    var D = [B, C];
    return D;
}

function norm(A) {
    var i, j, n, m, b, nm, B;
    n = rows(A);
    if (n == 0) { B = Math.abs(A); } else {
        m = cols(A);
        B = matrix(n, m);
        nm = 0;
        if (m == 1) {
            for (i = 0; i < n; i++) { b = A[i];
                nm = nm + b * b; };
            B = Math.sqrt(nm);
        } else {
            for (i = 0; i < n; i++)
                for (j = 0; j < m; j++) { b = A[i][j];
                    nm = nm + b * b; };
            B = Math.sqrt(nm);
        }
    }
    return B;
}

function norms(A, N) {
    var i, j, n, m, b, nm, B, F;
    n = rows(A);
    F = arguments.length == 1;
    if (!F) F = N == 2;
    if (!F) F = (Math.abs(N) != 1) && (N != 8);
    if (F) {
        if (n == 0) { B = A; if (B != 0) B = B / Math.abs(B); } else {
            m = cols(A);
            B = matrix(n, m);
            if (m == 1) {
                nm = 0;
                for (i = 0; i < n; i++) { b = A[i];
                    nm = nm + b * b; };
                nm = Math.sqrt(nm);
                if (nm != 0)
                    for (i = 0; i < n; i++) B[i] = A[i] / nm;
            } else {
                for (j = 0; j < m; j++) {
                    nm = 0;
                    for (i = 0; i < n; i++) { b = A[i][j];
                        nm = nm + b * b; };
                    nm = Math.sqrt(nm);
                    if (nm != 0)
                        for (i = 0; i < n; i++) B[i][j] = A[i][j] / nm;
                }
            }
        }
    } else {
        if (N == 8) {
            if (n == 0) { B = A; if (B != 0) B = 1; } else {
                m = cols(A);
                B = matrix(n, m);
                if (m == 1) {
                    nm = maxabs(A);
                    if (nm != 0) B = divp(A, nm);
                    // nm=0; for (i=0; i<n; i++) { b=A[i]; if (Math.abs(b)>Math.abs(nm)) nm=b; };
                } else {
                    for (j = 0; j < m; j++) {
                        b = col(A, j);
                        nm = maxabs(b);
                        // nm=0;  for (i=0; i<n; i++) { b=Math.abs(A[i][j]);  if (b>nm) nm=b; }; 
                        if (nm != 0)
                            for (i = 0; i < n; i++) B[i][j] = A[i][j] / nm;
                    }
                }
            }
        } else {
            if (Math.abs(N) == 1) {
                if (n == 0) { B = A; if (B < 0) B = -B; } else {
                    m = cols(A);
                    B = matrix(n, m);
                    if (m == 1) {
                        b = A[0];
                        for (i = 0; i < n; i++) { nm = A[i]; if (b > 0) { B[i] = nm; } else { B[i] = -nm; } }
                    } else {
                        for (j = 0; j < m; j++) { b = A[0][j]; for (i = 0; i < n; i++) { nm = A[i][j]; if (b < 0) nm = -nm;
                                B[i][j] = nm; } }
                        for (i = 1; i < n; i++) { b = B[i][0] * N; for (j = 0; j < m; j++) { nm = B[i][j]; if (b < 0) nm = -nm;
                                B[i][j] = nm; } }
                    }
                }
            }
        }
    }
    return B;
}

// MATRICES

function compan(x) {
    var n, m, n1, z, F;
    n = rows(x);
    if (n) {
        z = -x[0];
        if (z) {
            n--;
            F = zeros(n);
            n1 = n - 1;
            if (n1) {
                for (i = 0; i < n; i++) { if (i) F[i - 1][i] = 1;
                    F[n1][i] = x[n - i] / z; }
            } else { F = x[1] / z; }
        } else { F = 0; }
    } else { F = 0; }
    return F;
}

function hilbert(A, M) {
    var n = rows(A);
    if (arguments.length == 1) var M = 1;
    if (n == 0) { n = A; var m = n; } else { var m = cols(A); }
    var B = matrix(n, m);
    for (var i = 0; i < n; i++)
        for (var j = 0; j < m; j++)
            if (i == j) { B[i][j] = 1; } else { B[i][j] = M / (i - j); }
    return B;
}

function hankel(x, y) {
    var T;
    T = flip(tr(toeplitz(x)));
    if (arguments.length == 2) T = flip(tr(toeplitz(x, y)));
    return T;
}

function toeplitz(x, y) {
    var i, j, T, n;
    n = rows(x);
    if (n) {
        T = zeros(n);
        for (j = 0; j < n; j++) {
            for (i = j; i < n; i++) T[i][j] = x[i - j];
            if (arguments.length == 2)
                for (i = j + 1; i < n; i++) T[j][i] = y[i - j];
        }
    } else { T = x; }
    return T;
}

function square(x) {
    var n, n1, m, m1, i, i1, j, j1, S, F, A, B, C, D;
    F = arguments.length;
    A = arguments[0];
    n = rows(A);
    S = equal(A);
    if (F == 1) {
        if (n) {
            m = cols(A);
            i = Math.round(n / 2);
            j = Math.round(m / 2);
            n = 2 * i;
            m = 2 * j;
            i1 = i - 1;
            n1 = n - 1;
            j1 = j - 1;
            m1 = m - 1;
            B = rowcol(A, 0, i1, j, m1);
            C = rowcol(A, i, n1, 0, j1);
            D = rowcol(A, i, n1, j, m1);
            A = rowcol(A, 0, i1, 0, j1);
            S = [A, B, C, D];
        }
    } else {
        B = arguments[1];
        C = arguments[2];
        if (rows(B) > 0) n = 1;
        if (F == 4) {
            D = arguments[3];
            if (n) { S = tr(colline(tr(colline(A, B)), tr(colline(C, D)))); } else { S = [
                    [A, B],
                    [C, D]
                ]; }
        } else {
            F = Math.sqrt(F);
            S = colline(A, B, C);
            if (F == 3) {
                S = colline(tr(S), tr(colline(arguments[3], arguments[4], arguments[5])));
                S = tr(colline(S, tr(colline(arguments[6], arguments[7], arguments[8]))));
            } else {
                S = tr(colline(S, arguments[3]));
                S = colline(S, tr(colline(arguments[4], arguments[5], arguments[6], arguments[7])));
                S = colline(S, tr(colline(arguments[8], arguments[9], arguments[10], arguments[11])));
                S = tr(colline(S, tr(colline(arguments[12], arguments[13], arguments[14], arguments[15]))));
            }
        }
    }
    return S;
}

function circshifts(A, p, q) {
    var i, j, d, Q;
    if (arguments.length == 1) { var p = 1; var q = 1; }
    n = rows(A);
    if (n < 2) { Q = equal(A); } else {
        Q = zero(n);
        d = p % n;
        for (i = 0; i < n; i++) { j = i - d; if (j < 0) { j = j + n; } else { if (j >= n) j = j - n; } Q[i] = equal(A[j]); }
    }
    if (arguments.length != 2) Q = tr(circshifts(tr(Q), q));
    return Q;
}

function circshift(x, p, z) {
    var i, j, k, n, m, m1, y, F, P, Z;
    y = equal(x);
    P = 1;
    Z = 1;
    F = arguments.length;
    if (F > 1) P = p;
    if (P != 0) {
        if (F > 2) Z = z;
        if (P > 1) { for (k = 0; k < P; k++) y = circshift(y, 1, Z); } else {
            if (P < 0) { y = circshiftback(y, -P, Z); } else {
                n = rows(x);
                m = cols(x);
                if (m) {
                    if (m > 1) {
                        m1 = m - 1;
                        for (i = 0; i < n; i++) { y[i][0] = Z * x[i][m1]; for (j = 1; j < m; j++) y[i][j] = x[i][j - 1]; }
                    } else {
                        m1 = n - 1;
                        y[0] = Z * x[m1];
                        for (i = 1; i < n; i++) y[i] = x[i - 1];
                    }
                } else { y = x }
            }
        }
    }
    return y;
}

function circshiftback(x, p, z) {
    var i, j, k, n, m, m1, y, F, P, Z;
    y = equal(x);
    P = 1;
    Z = 1;
    F = arguments.length;
    if (F > 1) P = p;
    if (P != 0) {
        if (F > 2) Z = z;
        if (P > 1) { for (k = 0; k < P; k++) y = circshiftback(y, 1, Z); } else {
            if (P < 0) { y = circshift(y, -P, Z); } else {
                n = rows(x);
                m = cols(x);
                if (m) {
                    if (m > 1) {
                        m1 = m - 1;
                        for (i = 0; i < n; i++) { y[i][m1] = Z * x[i][0]; for (j = 0; j < m1; j++) y[i][j] = x[i][j + 1]; }
                    } else {
                        m1 = n - 1;
                        y[m1] = Z * x[0];
                        for (i = 0; i < m1; i++) y[i] = x[i + 1];
                    }
                } else { y = x }
            }
        }
    }
    return y;
}

function circ(x) {
    var i, j, k, n, A;
    if (arguments.length == 2) { A = circul(arguments[0], arguments[1]); } else {
        n = rows(x);
        if (n > 1) {
            A = zeros(n);
            for (i = 0; i < n; i++)
                for (j = i; j < n; j++) { k = j - i;
                    A[i][j] = x[k]; if (i != j) A[j][i] = x[n - k]; }
        } else { A = x; }
    }
    return A;
}

function circback(x) {
    var i, j, k, n, A;
    n = rows(x);
    n = rows(x);
    if (n > 1) { A = zeros(n); for (i = 0; i < n; i++)
            for (j = 0; j < n; j++) { k = j + i; if (k >= n) k = k - n;
                A[i][j] = x[k]; } } else { A = x; }
    return A;
}

function negacirc(x) {
    var i, j, k, n, A;
    n = rows(x);
    if (n > 1) {
        A = zeros(n);
        for (i = 0; i < n; i++)
            for (j = i; j < n; j++) { k = j - i;
                A[i][j] = x[k]; if (i != j) A[j][i] = -x[n - k]; }
    } else { A = x; }
    return A;
}

function circul(x) {
    var i, j, k, l, h, n, m, a, A, B, F;
    F = arguments.length;
    if (F == 1) { A = circ(x); } else {
        n = rows(arguments[0]);
        m = cols(arguments[0]);
        A = zeros(n * F);
        for (k = 0; k < F; k++) {
            if (m > 1) { B = equal(arguments[k]); } else { B = circ(arguments[k]); }
            for (l = 0; l < F; l++) { h = k + l; if (h >= F) h = h - F; for (i = 0; i < n; i++)
                    for (j = 0; j < n; j++) { a = B[i][j];
                        A[i + l * n][j + h * n] = a; } }
        }
    }
    return A;
}

function circulback(x) {
    var i, j, k, l, h, n, m, a, A, B, F;
    F = arguments.length;
    if (F == 1) { A = circback(x); } else {
        n = rows(arguments[0]);
        m = cols(arguments[0]);
        A = zeros(n * F);
        for (k = 0; k < F; k++) {
            if (m > 1) { B = equal(arguments[k]); } else { B = circback(arguments[k]); }
            for (l = 0; l < F; l++) {
                h = k - l;
                if (h < 0) h = h + F;
                for (i = 0; i < n; i++)
                    for (j = 0; j < n; j++) { a = B[i][j];
                        A[i + l * n][j + h * n] = a; }
            }
        }
    }
    return A;
}

function twocircul(x) {
    var i, j, i2, j2, y, n, m, a, b, s1, s2, F, FS;

    function makemat(ar, i) {
        var x, m;
        m = cols(ar[i]);
        if ((m == 1) && (n > 1)) { x = circ(ar[i]); } else { x = ar[i]; }
        return x;
    }
    F = arguments.length;
    FS = (F < 3);
    if (F == 1) { F = 0; } else { F = 1; } n = rows(arguments[0]);
    a = makemat(arguments, 0);
    b = makemat(arguments, F);
    if (n == 1) {
        if (FS) { s1 = b;
            s2 = minp(a); } else { s1 = minp(b);
            s2 = a; }
        y = [
            [a, b],
            [s1, s2]
        ];
    } else {
        y = matrix(2 * n, 2 * n);
        for (i = 0; i < n; i++) {
            i2 = n + i;
            for (j = 0; j < n; j++) {
                j2 = n + j;
                y[i][j] = a[i][j];
                y[i][j2] = b[i][j];
                s1 = b[j][i];
                s2 = a[j][i];
                if (FS) { y[i2][j] = s1;
                    y[i2][j2] = -s2; } else { y[i2][j] = -s1;
                    y[i2][j2] = s2; }
            }
        }
    }
    return y;
}

function crossmatrix(a) {
    var i, j, n, m, x, y, z, c;
    m = cols(a);
    if (m) {
        x = equal(a);
        n = rows(a);
        for (i = 0; i < n; i++) {
            if (i) x = circshift(x);
            y = equal(x);
            for (j = 0; j < n - 1; j++) y = colline(y, x);
            y = tr(y);
            z = equal(y);
            for (j = 0; j < n - 1; j++) y = colline(y, z);
            y = tr(y);
            if (i == 0) { c = equal(y) } else { c = colline(c, y); }
        }
    } else { c = x }
    return tr(c);
}

function border(A, a, b, c, d) {
    var A, e, eT, m, q, F, F2;
    F = arguments.length;
    q = 1;
    if (F > 2) { q = b; if (q == "NaN") q = 1 / 2; }
    m = rows(A);
    if (m < 2) { m = 0; if (F > 1) m = a; return [
            [m, q],
            [-q, A]
        ] } else {
        if (F > 3) {
            e = m;
            F2 = m - Math.floor(m / 2) * 2 == 0;
            if (F2) e = e / 2;
            e = one(e);
            eT = mulp(c, e);
            if (F2) { e = mulp(q, e);
                e = e.concat(eT);
                eT = tr(e); } else { e = mulp(b, e);
                eT = tr(eT); }
        } else { e = one(m);
            e = mulp(q, e);
            eT = tr(e); }
        if (F == 1)
            if (m - Math.floor(m / 4) * 4 == 3) e = minp(e);
        if (F == 5) { m = m / 2; for (i = 0; i < m; i++)
                for (j = 0; j < m; j++)
                    if ((A[i][j]) == 1) { A[i + m][j + m] = d; } else { A[i + m][j + m] = 1; } }
        q = 0;
        if (F > 1) q = a;
        return square(q, eT, e, A);
    }
}

function sylvester(A) { var S = minp(A); return square(A, A, A, S); }

function jacobsthal(n) {
    if (n == 9) { return circul([0, 1, 1], [-1, -1, 1], [-1, 1, -1]); } else {
        if (n == 49) {
            var a = circul([0, 1, 1, 1, 1, 1, 1]),
                b = circul([-1, 1, 1, -1, 1, -1, -1]),
                c = circul([-1, -1, -1, 1, -1, 1, 1]);
            return circul(a, b, b, c, b, c, c);
        } else { return circul(legendre(n)); }
    }
}

function legendre(m) {
    var i, c, s, m2;
    m2 = Math.floor(m / 2);
    m2++;
    c = one(m);
    c = minp(c);
    for (i = 1; i < m2; i++) { s = i * i;
        c[s - Math.floor(s / m) * m] = 1; } c[0] = 0;
    return c;
}

function hadamard(n) {
    var i, k, S;
    i = rows(n);
    if (i) {
        S = sylvester(n);
        n = i;
        for (i = 0; i < n; i++) { k = n + i;
            S[i][i] = 1;
            S[k][i] = -1;
            S[i][k] = -1;
            S[k][k] = -1; }
    } else {
        if ((n == 12) || (n == 20)) {
            S = belevitch(n);
            S = flip(minp(S));
            for (i = n - 1; i > 0; i--) { S[i] = equal(S[i - 1]);
                S[i][n - i] = -1; } S[0] = equal(one(n));
        } else {
            k = 1;
            S = 1;
            for (i = 0; i < n; i++)
                if (k < n) { k = k * 2;
                    S = sylvester(S); }
        }
    }
    return S;
}

function skewconference(n) {
    var A, A2, H, H2, n2, F;
    if (n < 6) { return belevitch(n); } else {
        n2 = n;
        F = n2 > 64;
        while (F) { n2 = n2 / 4;
            F = n2 > 64; }
        if ((n < 32) || (n2 == 64)) {
            A = jacobsthal(n / 2 - 1);
            H = border(A);
            H2 = equal(H);
            A = border(flip(add(A, eye(A))), -1);
            A2 = minp(A);
        } else {
            H = skewconference(n / 2);
            H2 = tr(H);
            A = pluginto(H, [0], [1]);
            A2 = tr(pluginto(H, [0], [-1]));
        }
        return square(H, A, tr(A2), H2);
    }
}

function belevitch(n) { return border(jacobsthal(n - 1)); }

function core(C) {
    var i, q, n;
    n = rows(C);
    Q = equal(C);
    q = n - 1;
    for (i = 1; i < n; i++) {
        if (Q[0][i] < 0)
            for (j = 0; j < n; j++) Q[j][i] = -Q[j][i];
        if (Q[i][0] < 0)
            for (j = 0; j < n; j++) Q[i][j] = -Q[i][j];
    }
    return rowcol(Q, 1, q, 1, q);
}

// CONTROL

function fun(s125, a125) {
    var i125, n125, tt125, f125, y125;
    if (arguments.length == 2) {
        y125 = "n125=rows(" + a125 + "); tt125=equal(" + a125 + "); f125=new Array(); for (i125=0;i125<n125;i125++) { " + a125 + "=tt125[i125];  with(Math) f125[i125]=eval(s125); }; " + a125 + "=equal(tt125);";
        eval(y125);
    } else { n125 = rows(t);
        tt125 = equal(t);
        f125 = new Array(); for (i125 = 0; i125 < n125; i125++) { t = tt125[i125];
            with(Math) f125[i125] = eval(s125); };
        t = equal(tt125); }
    return f125;
}

function runge(rp123, x, dt) {
    var fun, a123, b123;
    a123 = equal(x);
    with(Math) eval(rp123);
    b123 = mulp(fun, dt);
    x = divp(b123, 2);
    x = add(a123, x);
    with(Math) eval(rp123);
    fun = mulp(fun, dt);
    x = divp(fun, 2);
    x = add(a123, x);
    fun = mulp(fun, 2);
    b123 = add(b123, fun);
    with(Math) eval(rp123);
    fun = mulp(fun, dt);
    x = add(a123, fun);
    fun = mulp(fun, 2);
    b123 = add(fun, b123);
    with(Math) eval(rp123);
    fun = mulp(fun, dt);
    b123 = add(b123, fun);
    b123 = divp(b123, 6);
    x = add(a123, b123);
    return x;
}

function lsim(N, D, u, t) {
    var i, j, n, n1, m, k, l, s, p, T, D0;
    var x = new Array();
    var y = new Array();
    T = t[1];
    k = size(t);
    if (cols(N) < 2) { // y=lsim(N,D,u,t);  B/A C(D) 
        m = size(N);
        var NN = equal(N);
        n = size(D);
        p = 0;
        D0 = D[0];
        if (m != 0) { if (m == n) { p = NN[0] / D0; for (i = 0; i < m; i++) NN[i] = NN[i] - p * D[i]; } }
        n = n - 1;
        n1 = n - 1;
        for (i = 0; i < n; i++) { x[i] = 0;
            y[i] = p * u[i]; };
        for (l = n; l < k; l++) {
            s = 0;
            for (i = 0; i < n; i++) s = s + x[i] * D[i + 1] / D0;
            for (i = n1; i > 0; i--) x[i] = x[i] + x[i - 1] * T;
            x[0] = x[0] - (s - u[l - 1]) * T;
            if (m == 0) { y[l] = x[n1] * NN / D0; } else {
                j = m - 1;
                s = 0;
                for (i = n - 1; i >= 0; i--) { s = s + x[i] * NN[j];
                    j--; if (j < 0) break; };
                y[l] = p * u[l] + s / D0;
            }
        }
    } else { // y=lsim(N,x,u,t)    
        var A = N[0];
        var B = N[1];
        var C = N[2];
        n = rows(A);
        if (n == 0) {
            s = 0;
            y[0] = 0;
            for (i = 1; i < k; i++) { s = s + (A * s + B * u[i - 1]) * T;
                y[i] = C * s; };
        } else {
            var dx = new Array();
            p = 0;
            m = cols(B);
            for (i = 0; i < n; i++) { x[i] = D[i];
                y[i] = 0;
                p = p + C[i] * x[i]; };
            for (i = 0; i < n; i++) y[i] = p;
            for (l = n; l < k; l++) {
                for (i = 0; i < n; i++) {
                    p = 0;
                    for (j = 0; j < n; j++) p = p + A[i][j] * x[j];
                    if (m > 1) { for (j = 0; j < m; j++) p = p + B[i][j] * u[l - 1][j]; } else { p = p + B[i] * u[l - 1]; } dx[i] = p * T;
                };
                p = 0;
                for (i = 0; i < n; i++) { x[i] = x[i] + dx[i];
                    p = p + C[i] * x[i]; };
                y[l] = p;
            }
        }
    }
    return y;
}

function tf(N, D) {
    var S, A, b, c, n, m, i;
    A = compan(D);
    A = flip(A);
    A = tr(A);
    A = flip(A);
    n = cols(A);
    b = zero(n);
    c = zero(n);
    c[0] = 1;
    n = n - 1;
    m = size(N);
    if (m == 0) { b[n] = N; } else { for (i = 0; i < m; i++) { b[n - i] = N[m - i - 1]; } }
    S = [A, b, c];
    return S;
}

function ctrb(A, b) {
    var i, W;
    W = zeros(A);
    W[0] = equal(b);
    for (i = 1; i < rows(A); i++) { W[i] = mul(A, W[i - 1]); }
    W = tr(W);
    return W;
}

function obsv(A, c) { var W = tr(ctrb(tr(A), c)); return W; }

function step(N, D, t) { return lsim(N, D, one(t), t); }

function impulse(N, D, t) {
    var n = rows(N);
    if (n == 0) { var NN = [N, 0]; } else { var NN = equal(N);
        NN[n] = 0; }
    return step(NN, D, t);
}

function freq(W, n) {
    if (arguments.length > 1) { var w = time(W, n); } else {
        var n = rows(W);
        if (n) { var w = line(n);
            w = mulp(w, Math.PI / W[1] / n); } else { w = time(W); }
    }
    return w;
}

function fft(f) {
    var i, j, n, k, c, s, r, fj;
    n = rows(f);
    k = Math.PI / n;
    c = zero(f);
    s = zero(f);
    g = colline(c, s);
    for (i = 0; i < n; i++) {
        c = 0;
        s = 0;
        for (j = 0; j < n; j++) { r = k * i * j;
            fj = f[j];
            c = c + fj * Math.cos(r);
            s = s + fj * Math.sin(r); }
        g[i][0] = c;
        g[i][1] = s;
    }
    return g;
}

function mag(g) {
    var i, n, m;
    n = rows(g);
    m = zero(n);
    if (n) {
        for (i = 0; i < n; i++) m[i] = 2 * Math.sqrt(g[i][0] * g[i][0] + g[i][1] * g[i][1]) / n;
    } else { m = Math.abs(g); }
    return m;
}

function bode(N, D, w) {
    var i, b, p;
    b = zero(w);
    n = rows(w);
    if (n)
        for (i = 0; i < n; i++) { p = [0, w[i]];
            b[i] = norm(polyv(N, p)) / norm(polyv(D, p)); }
    return b;
}

function abode(N, D, a) {
    var i, b, p;
    b = zero(a);
    n = rows(a);
    if (n)
        for (i = 0; i < n; i++) { p = [a[i], 0];
            b[i] = norm(polyv(N, p)) / norm(polyv(D, p)); }
    return b;
}

function riccati(A, R, Q, D) {
    function riccati4(A, R, Q, D) {
        var i, j, k, n, m, v, w, d, P;
        n = cols(A);
        P = square(A, R, minp(Q), D);
        P = eigs(P);
        d = diag(P[0]);
        P = P[1];
        v = ones(n);
        w = ones(n);
        m = 2 * n;
        k = -1;
        for (i = 0; i < m; i++)
            if (d[i] < 0) {
                k = k + 1;
                for (j = 0; j < n; j++) { v[j][k] = P[j][i];
                    w[j][k] = P[n + j][i]; }
            }
        P = mul(w, inv(v));
        return P;
    }
    if (arguments.length == 4) { return riccati4(A, R, Q, D) } else { return riccati4(A, R, Q, minp(tr(A))); }
}

function lyap(A, Q) { return riccati(A, zeros(Q), Q); }

// SYMBOLS

function adds(A, B) {
    var i, j, n, m, b, C, P;
    C = equal(A);
    n = rows(A);
    m = cols(A);
    P = '+';
    for (i = 0; i < n; i++)
        for (j = 0; j < m; j++) {
            b = B[i][j];
            if (b.length > 1) { C[i][j] = C[i][j] + b; } else { if (b != '0') C[i][j] = C[i][j] + P + b; }
        }
    return C;
}

function subs(A, B) {
    var i, j, n, m, b, C, M, P;
    C = equal(A);
    n = rows(A);
    m = cols(A);
    M = '-';
    P = '+';
    for (i = 0; i < n; i++)
        for (j = 0; j < m; j++) {
            b = B[i][j];
            if (b.length > 1) {
                if (b.substring(0, 1) == M) {
                    C[i][j] = C[i][j] + P + b.substring(1);
                } else { C[i][j] = C[i][j] + b; }
            } else {
                if (b != '0') C[i][j] = C[i][j] + M + b;
            }
        }
    return C;
}

function muls(A, B) {
    var i, j, k, l, n, nn, m, a, b, az, bz, s, S, Z, C, M, P, U, X;

    function getab(BK) { b = BK;
        bz = U; if (b.length > 1) { b = b.substring(1);
            bz = M; } return b; }
    n = rows(A);
    m = cols(B);
    M = '-';
    P = '+';
    U = '';
    X = '*';
    if (n) {
        C = matrix(n, m);
        for (i = 0; i < n; i++)
            for (j = 0; j < m; j++) {
                S = new Array();
                S[0] = U;
                Z = new Array();
                Z[0] = U;
                for (k = 0; k < cols(A); k++) {
                    a = getab(A[i][k]);
                    az = bz;
                    b = getab(B[k][j]);
                    if (az + bz == M) { Z[k] = M; } else { Z[k] = P; }
                    if (a > b) { S[k] = b + X + a; } else { S[k] = a + X + b; }
                }
                nn = cols(A);
                for (k = 0; k < nn; k++)
                    for (l = k + 1; l < nn; l++) {
                        a = S[k];
                        b = S[l];
                        if (a < b) {
                            S[k] = b;
                            S[l] = a;
                            a = Z[k];
                            Z[k] = Z[l];
                            Z[l] = a;
                        }
                    }
                for (k = 0; k < nn; k++) {
                    a = S[k];
                    if (a != '') {
                        b = Z[k];
                        s = 1;
                        for (l = k + 1; l < nn; l++)
                            if (a == S[l]) { if (b == Z[l]) { s++; } else { s--; };
                                S[l] = U;
                                Z[l] = U; }
                        if (s != 1) {
                            if (s == 0) { Z[k] = U;
                                S[k] = U; } else {
                                if (s < 0) { if (b == P) { b = M; } else { b = P; } s = -s; }
                                if (s > 1) { Z[k] = b + s + X; } else { Z[k] = b; }
                            }
                        }
                    }
                }
                s = U;
                for (k = 0; k < cols(A); k++) s += Z[k] + S[k];
                if (s.charAt(0) == P) s = s.substring(1);
                C[i][j] = s;
            }
    } else {
        n = rows(B);
        C = matrix(n, m);
        a = getab(A);
        az = bz;
        for (i = 0; i < n; i++)
            for (j = 0; j < m; j++) {
                b = getab(B[i][j]);
                if (a != "1")
                    if (a > b) { b = b + X + a; } else { b = a + X + b; }
                if (az + bz == M) b = M + b;
                C[i][j] = b;
            }
    }
    return C;
}

function krons(A, B) {
    var i, j, ii, jj, nk, ml, C;
    var n = rows(A),
        m = cols(A),
        k = rows(B),
        l = cols(B);
    if ((n == 0) && (k == 0)) { C = A + "*" + B; } else {
        if (n == 0) {
            C = matrix(k, l);
            for (i = 0; i < k; i++)
                if (l == 1) { C = A + "*" + B[i]; } else {
                    for (j = 0; j < l; j++) C = A + "*" + B[i][j];
                }
        } else {
            if (k == 0) {
                C = matrix(n, m);
                for (i = 0; i < n; i++)
                    if (m == 1) { C = A[i] + "*" + B; } else {
                        for (j = 0; j < m; j++) C = A[i][j] + "*" + B;
                    }
            } else {
                nk = n * k;
                ml = m * l;
                C = matrix(nk, ml);
                if (ml == 1) {
                    for (i = 0; i < n; i++)
                        for (ii = 0; ii < k; ii++) C[i * n + ii] = A[i] + B[ii];
                } else {
                    for (i = 0; i < n; i++)
                        for (j = 0; j < m; j++)
                            for (ii = 0; ii < k; ii++)
                                for (jj = 0; jj < l; jj++)
                                    if (m == 1) {
                                        C[i * k + ii][j * l + jj] = A[i] + "*" + B[ii][jj];
                                    } else {
                                        if (l == 1) {
                                            C[i * k + ii][j * l + jj] = A[i][j] + "*" + B[ii];
                                        } else {
                                            C[i * k + ii][j * l + jj] = A[i][j] + "*" + B[ii][jj];
                                        }
                                    }
                }
            }
        }
    }
    return C;
}

function mins(A) {
    var i, j, n, m, a, C, M;
    C = equal(A);
    n = rows(A);
    m = cols(A);
    M = '-';
    for (i = 0; i < n; i++)
        for (j = 0; j < m; j++) {
            a = "" + A[i][j];
            if (a.length > 1) {
                if (a.substring(0, 1) == M) { C[i][j] = a.substring(1); } else { C[i][j] = M + a; }
            } else { if (a != '0') C[i][j] = M + a; }
        }
    return C;
}

function equals(A, B) {
    var i, j, n, m, C;
    n = rows(A);
    m = cols(A);
    var C = matrix(n, m);
    for (i = 0; i < n; i++)
        for (j = 0; j < m; j++) C[i][j] = A[i][j] + '=' + B[i][j];
    return C;
}

function simplify(A) {
    var i, j, k, l, n, m, a, b, z, s, S, M, P, U, X;
    M = '-';
    P = '+';
    U = '';
    X = '*';
    S = new Array();
    S[0] = U;
    for (i = 0; i < rows(A); i++)
        for (j = 0; j < cols(A); j++) {
            a = A[i][j];
            if (a.charAt(0) == M) {
                a = a.substring(1);
                a = a.split(P);
                n = a.length;
                for (k = 0; k < n; k++) { s = a[k].split(M);
                    a[k] = s.join(P); } a = a.join(M);
            }
            if ((i == 0) && (j == 0)) { S[0] += a; } else {
                for (k = 0; k < rows(S); k++)
                    if (S[k] == a) a = U;
                if ((a != U) && (a != '=0')) S[rows(S)] = a;
            }
        }
    for (i = 0; i < rows(S); i++) {
        a = S[i];
        n = a.length;
        s = 1;
        for (k = 0; k < n; k++)
            if ((a.charAt(k) == M) || (a.charAt(k) == P)) s++;
        if (s > 1) {
            b = a.split(X);
            n = b.length;
            m = b[n - 1].charAt(0);
            l = 1;
            for (k = n - 2; k > 0; k--)
                if ((b[k].length > 1) && (m == b[k].charAt(0))) l = l + 1;
            if (s == l) {
                a = U;
                l = 0;
                for (k = n - 1; k >= 0; k--) {
                    z = X;
                    if ((b[k].length > 1) && (m == b[k].charAt(0))) { l = l + 1; if (l <= s) { b[k] = b[k].substring(1);
                            z = U; } }
                    a = b[k] + a;
                    if (k > 0) a = z + a;
                }
            }
        }
        S[i] = a;
    }
    return S;
}

function pluginto(A, S, B) {
    var i, j, ii, jj, k, n, m, nb, mb, ns, a, b, az, bz, s, C, M, P, U;
    M = '-';
    P = '+';
    U = '';

    function getb(BK) {
        b = BK;
        if (typeof(b) == 'string') {
            bz = U;
            if (b.length > 1) { b = b.substring(1);
                bz = M; }
            if (az + bz == M) b = M + b;
        } else { if (az) b = -b; }
        return b;
    }
    n = rows(A);
    m = cols(A);
    ns = rows(S);
    nb = rows(B[0]);
    mb = cols(B[0]);
    if (nb) { C = matrix(n * nb, m * mb); } else { C = equal(A); }
    for (i = 0; i < n; i++)
        for (j = 0; j < m; j++) {
            a = A[i][j];
            az = U;
            if (a.length > 1) { a = a.substring(1);
                az = M; }
            for (k = 0; k < ns; k++) {
                s = S[k];
                if (s == a)
                    if (nb) { for (ii = 0; ii < nb; ii++)
                            for (jj = 0; jj < mb; jj++) C[i * nb + ii][j * mb + jj] = getb(B[k][ii][jj]); } else { C[i][j] = getb(B[k]); }
            }
        }
    return C;
}

function symbols(A, ep, f) {
    var i, j, k, n, m, a, b, B;
    if (ep == undefined) ep = 0.001;
    n = rows(A);
    m = cols(A);
    B = norms(A, 8);
    for (k = 2; k < n * m; k++) {
        b = minabs(B);
        if (b < 2) {
            for (i = 0; i < n; i++)
                for (j = 0; j < m; j++) {
                    a = A[i][j];
                    if (Math.abs(a - b) < ep) B[i][j] = k;
                    if (Math.abs(a + b) < ep) B[i][j] = -k;
                }
        }
    }
    a = maxabs(B);
    if (f) puts("number of symbols=" + (a - 1));
    for (i = 0; i < n; i++)
        for (j = 0; j < m; j++) {
            b = B[i][j];
            B[i][j] = String.fromCharCode(97 + (a - Math.abs(b))); //65
            if (b < 0)
                if (A[i][j] != 0) B[i][j] = "-" + B[i][j];
        }
    return B;
}

function numbers(A456) {
    var i456, j456, n456, m456, C456;
    n456 = rows(A456);
    if (n456) {
        m456 = cols(A456);
        C456 = matrix(n456, m456);
        for (i456 = 0; i456 < n456; i456++)
            for (j456 = 0; j456 < m456; j456++)
                C456[j456][i456] = eval(A456[j456][i456]);
    } else { C456 = eval(A456); }
    return C456;
}

// GALOIS FIELD LIBRARY

function gfinit(p, m) {
    var i, j, p1, p2, p4, F, P;

    function prv(k2, k3, k4, k5) {
        p2 = Math.sqrt(p);
        F = (Math.round(p2) == p2);
        if (F) {
            p4 = Math.sqrt(p2);
            P = (Math.round(p4) == p4);
            if (P) {
                F = P;
                gfinit(p4, k4);
            } else { gfinit(p2, k2); }
        } else {
            F = p == 27;
            if (F) { gfinit(3, k3); } else {
                F = p == 243;
                if (F) { gfinit(3, k5); } else {
                    F = p == 125;
                    if (F) { gfinit(5, k3); } else {
                        F = p == 3125;
                        if (F) { gfinit(5, k5); } else {
                            F = p == 343;
                            if (F) { gfinit(7, k3); } else {
                                F = p == 1331;
                                if (F) gfinit(11, k3);
                            }
                        }
                    }
                }
            }
        }
    }
    // GALOIS FIELD PARAMETERS
    GFp = p;
    GFp2 = GFp * GFp;
    GFz = 0;
    GFc = 1;
    GFs = 1;
    GFr = 1;
    GFd = 1;
    if (arguments.length == 1) var m = 1;
    GFm = m;
    if (m == 1) {
        prv(2, 3, 4, 5);
        if (!F) { // CAYLEY TABLES
            GFe = 1;
            GFadd = matrix(p, p);
            GFmul = matrix(p, p);
            for (i = 0; i < p; i++)
                for (j = 0; j < p; j++) {
                    GFadd[i][j] = (i + j) % p;
                    GFmul[i][j] = ((i % p) * (j % p)) % p;
                }
        }
    } else {
        p1 = p + 1;
        if ((m == 2) && (p != 2)) {
            GFr = 2;
            if (p1 % 4 == 0) { GFr = 1; } else {
                if (p1 % 6 == 0) GFr = 3;
            }
        } else {
            GFc = 1;
            F = m == 3;
            P = m == 4;
            if (p == 2) {
                if (m == 1) GFs = 0;
                if ((m == 5) || (m == 11)) GFd = 2;
                if (m == 8) GFd = 5;
                if ((m == 10) || (m == 12)) GFd = 3;
            }
            if ((p == 3) && (m > 6)) {
                GFd = 2;
                if (m == 7) GFr = 2;
                if (m == 9) GFd = 5;
                if (m == 10) GFr = 2;
            } else {
                if (p == 5) {
                    if ((F) || (m > 5)) GFr = 2;
                    if (m == 6) GFr = 3;
                    if (m == 8) GFs = 0;
                } else {
                    if (p == 7) {
                        if (F) { GFr = 2; } else { if (m < 7) GFr = 3; }
                        if ((F) || (m == 6)) GFs = 0;
                    } else {
                        if (p == 11) { if (F) GFr = 3; if (P) GFr = 6; } else {
                            if (p == 13) { if (m != 5) { GFs = 0;
                                    GFr = 2; } } else {
                                if (p == 17) { GFr = 2; if (P) { GFs = 0;
                                        GFr = 3; if (m == 5) GFr = 6; } } else {
                                    if (p == 19) { if (F) { GFs = 0;
                                            GFr = 2; if (m == 5) GFr = 3; } } else {
                                        if (p == 23) { GFr = 4; if (P) GFr = 3; if (m == 5) GFr = 2; } else {
                                            if (p == 29) { if (P) GFr = 3; } else {
                                                if (p == 31) { if (F) { GFs = 0;
                                                        GFr = 3; } } else {
                                                    if (p == 37) { GFr = 5; if (F) { GFs = 0;
                                                            GFr = 2; } } else {
                                                        if (p == 41) { if (P) GFr = 7; } else {
                                                            if (p == 43) { if (F) { GFs = 0;
                                                                    GFr = 3; } } else { // p=47
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        GFz = zero(GFm);
        GFe = zero(GFm);
        GFe[0] = 1;
        prv(4, 6, 8, 10);
    }
}

function gfnumbers(p, m) {
    var i, j, n, np, v, vv, vvv, F, GFn;
    if (rows(m) == 0) {
        v = line(p);
        for (i = 0; i < m; i++) {
            vv = one(Math.pow(p, i));
            vvv = zero(vv);
            for (j = 1; j < p; j++) vvv = rowline(vvv, mulp(j, vv));
            vv = equal(vvv);
            for (j = 1; j < Math.pow(p, m - i - 1); j++) vvv = rowline(vvv, vv);
            if (i == 0) { GFn = equal(vvv) } else { GFn = colline(GFn, vvv); }
        }
        return GFn;
    } else {
        n = rows(p);
        if (n && rows(p[0])) {
            np = one(n);
            for (j = 0; j < n; j++) np[j] = gfnumbers(p[j], m);
            return np;
        } else {
            F = false;
            for (i = 0; i < rows(m); i++)
                if (!F) { F = gfeq(p, m[i]); if (F) return i; }
            return F;
        }
    }
}

function gfmul(A, B) {
    var i, j, i1, i2, k, n, m, a, b, c, d, C, S;

    function tp(A) { return typeof(A) == "object"; }

    function mulAB() {
        a = cols(A);
        if ((GFm == 1) && (a > 1)) {
            m = cols(B);
            C = matrix(n, m);
            for (i = 0; i < n; i++)
                for (j = 0; j < m; j++) {
                    S = GFz;
                    for (k = 0; k < a; k++) S = gfadd(S, gfmul(A[i][k], B[k][j]));
                    C[i][j] = S;
                }
        } else { for (i = 0; i < n; i++) C[i] = gfmul(A[i], B[i]); }
    }

    function mup(A, B) { for (i = 0; i < n; i++) C[i] = gfmul(A, B[i]); }
    if (tp(B[0])) {
        n = rows(B);
        C = zero(n);
        if (tp(A[0])) { mulAB(); } else { mup(A, B); }
    } else {
        if (GFm == 1) {
            if (tp(A)) {
                n = rows(A);
                C = zero(n);
                if (tp(B)) { mulAB(); } else { mup(B, A); }
            } else {
                if (tp(B)) {
                    n = rows(B);
                    C = zero(n);
                    mup(A, B);
                } else { C = GFmul[A][B]; }
            }
        } else {
            if ((GFm == 2) && (GFp != 2)) {
                a = A[0];
                b = A[1];
                c = B[0];
                d = B[1]; // GF(p^2)
                C = [(GFp2 + a * c - GFr * b * d) % GFp, (GFp2 + a * d + b * c) % GFp];
            } else {
                C = conv(A, B);
                m = GFm - 1;
                i1 = GFd - 1;
                i2 = 2 * GFd - 1;
                k = GFm - GFd;
                for (i = 0; i < GFm; i++) {
                    S = C[i];
                    if (i < m) {
                        a = C[GFm + i];
                        if (i < i1) a += GFs * C[GFm + k + i];
                        S += GFr * a;
                    }
                    if (i > i1) {
                        b = C[k + i];
                        if (i < i2) b += GFs * C[2 * k + i];
                        S += GFs * b;
                    }
                    C[i] = (GFp2 + S) % GFp;
                }
                C = rowcol(C, 0, m);
            }
        }
    }
    return C;
}

function gfpow(A, k) {
    var i, j, n, m, C;
    if (typeof(A[0]) == "object") {
        n = rows(A);
        C = zero(n);
        for (i = 0; i < n; i++) C[i] = gfpow(A[i], k);
        return C;
    } else {
        if (k) {
            C = equal(A);
            if (GFm == 1) {
                n = rows(A);
                m = cols(A);
                if (n == 0) { C = C % GFp; } else {
                    if (m == 1) {
                        for (i = 0; i < n; i++) C[i] = C[i] % GFp;
                    } else {
                        for (i = 0; i < n; i++)
                            for (j = 0; j < m; j++) C[i][j] = C[i][j] % GFp;
                    }
                }
            }
            for (i = 1; i < k; i++) C = gfmul(A, C);
            return C;
        } else { return GFe; }
    }
}

function gfexp(A, k, L, P) {
    var i, n, R, S, C;
    if (typeof(A[0]) == "object") {
        n = rows(A);
        C = zero(n);
        for (i = 0; i < n; i++) C[i] = gfexp(A[i], k, L, P);
        return C;
    } else {
        C = zero(k);
        if (L == undefined) var L = 1;
        S = gfpow(A, L);
        R = GFe;
        if (P == undefined) var P = 0;
        P = gfpow(A, P);
        C[0] = equal(P);
        for (i = 1; i < k; i++) { R = gfmul(R, S);
            C[i] = gfmul(P, R); }
    }
    return C;
}

function gfadd(A, B) {
    var i, n, C;

    function tp(A) { return typeof(A) == "object"; }

    function op1() { for (i = 0; i < n; i++) C[i] = gfadd(A[i], B[i]); }

    function op2() { for (i = 0; i < n; i++) C[i] = gfadd(A, B[i]); }

    function op3() { for (i = 0; i < n; i++) C[i] = gfadd(A[i], B); }

    function op4() {
        C = zero(GFm);
        for (i = 0; i < GFm; i++) C[i] = (GFp2 + A[i] + B[i]) % GFp;
    }
    if (tp(B[0])) { n = rows(B);
        C = zero(n); if (tp(A[0])) { op1(); } else { op2(); } } else {
        if (GFm == 1) {
            if (tp(A)) { n = rows(A);
                C = zero(n); if (tp(B)) { op1(); } else { op3(); } } else {
                if (tp(B)) { n = rows(B);
                    C = zero(n);
                    op2(); } else { C = GFadd[A][B]; }
            }
        } else { if (tp(A[0])) { n = rows(A);
                C = zero(n);
                op3(); } else { op4(); } }
    }
    return C;
}

function gfsub(A, B) {
    var i, n, C;

    function tp(A) { return typeof(A) == "object"; }

    function op1() { for (i = 0; i < n; i++) C[i] = gfsub(A[i], B[i]); }

    function op2() { for (i = 0; i < n; i++) C[i] = gfsub(A, B[i]); }

    function op3() { for (i = 0; i < n; i++) C[i] = gfsub(A[i], B); }

    function op4() {
        C = zero(GFm);
        for (i = 0; i < GFm; i++) C[i] = (GFp2 + A[i] - B[i]) % GFp;
    }
    if (tp(B[0])) { n = rows(B);
        C = zero(n); if (tp(A[0])) { op1(); } else { op2(); } } else {
        if (GFm == 1) {
            if (tp(A)) { n = rows(A);
                C = zero(n); if (tp(B)) { op1(); } else { op3(); } } else {
                if (tp(B)) { n = rows(B);
                    C = zero(n);
                    op2(); } else {
                    for (i = 0; i < rows(GFadd); i++)
                        if (GFadd[i][B % GFp] == A % GFp) C = i;
                }
            }
        } else { if (tp(A[0])) { n = rows(A);
                C = zero(n);
                op3(); } else { op4(); } }
    }
    return C;
}

function gfdiv(A, B) {
    var i, n, C;

    function tp(A) { return typeof(A) == "object"; }
    if (tp(B[0])) {
        n = rows(B);
        C = zero(n);
        if (tp(A[0])) {
            for (i = 0; i < n; i++) C[i] = gfdiv(A[i], B[i]);
        } else {
            for (i = 0; i < n; i++) C[i] = gfdiv(A, B[i]);
        }
    } else {
        if (GFm == 1) {
            if (tp(A)) {
                n = rows(A);
                C = zero(n);
                if (tp(B)) {
                    for (i = 0; i < n; i++) C[i] = gfdiv(A[i], B[i]);
                } else { for (i = 0; i < n; i++) C[i] = gfdiv(A[i], B); }
            } else {
                if (tp(B)) {
                    n = rows(B);
                    C = zero(n);
                    for (i = 0; i < n; i++) C[i] = gfdiv(A, B[i]);
                } else {
                    for (i = 0; i < rows(GFmul); i++)
                        if (GFmul[i][B % GFp] == A % GFp) C = i;
                }
            }
        } else { C = one(GFm); }
    }
    return C;
}

function gfsqrt(A) {
    var i, n, F, C;

    function tp(A) { return typeof(A) == "object"; }

    function op1() {
        n = rows(A);
        C = zero(n);
        for (i = 0; i < n; i++) C[i] = gfsqrt(A[i]);
    }
    if (GFm == 1) {
        if (tp(A)) { op1(); } else {
            F = false;
            for (i = 0; i < rows(GFmul); i++)
                if (!F) { F = GFmul[i][i] == A % GFp; if (F) C = i; }
        }
    } else { if (tp(A[0])) { op1(); } else {} }
    return C;
}

function gfinv(A, num) {
    var i, j, k, n, b, B;
    n = rows(A);
    if (num == undefined) var num = 0;
    if (n == 0) { B = gfdiv(GFe, A); } else {
        B = equal(A);
        for (i = 0; i < n; i++) {
            b = equal(B[i][i]);
            if (norm(b) == 0) {
                if (num < n) {
                    num++;
                    B = gfinv(circshift(A), num);
                    B = tr(circshiftback(tr(B)));
                    return B;
                } else { return 0; }
            } else {
                B[i][i] = GFe;
                for (k = 0; k < n; k++) B[i][k] = gfdiv(B[i][k], b);
                for (j = 0; j < n; j++)
                    if (i != j) {
                        b = equal(B[j][i]);
                        B[j][i] = GFz;
                        for (k = 0; k < n; k++) B[j][k] = gfsub(B[j][k], gfmul(b, B[i][k]));
                    }
            }
        }
    }
    return B;
}

function gfeq(A, B) {
    var i, j, n, m, F;

    function tp(A) { return typeof(A) == "object"; }
    if (tp(B[0])) {
        m = rows(B);
        F = tp(A[0]);
        if (F) {
            n = rows(A);
            F = one(n);
            for (j = 0; j < n; j++)
                if (!gfeq(A[j], B)) F[j] = -1;
        } else {
            for (i = 0; i < m; i++)
                if (!F) F = gfeq(A, B[i]);
        }
    } else {
        m = rows(B);
        if (GFm == 1) {
            if (tp(B)) {
                F = tp(A);
                if (F) {
                    n = rows(A);
                    F = one(n);
                    for (j = 0; j < n; j++)
                        if (!gfeq(A[j], B)) F[j] = -1;
                } else {
                    for (i = 0; i < m; i++)
                        if (!F) F = gfeq(A, B[i]);
                }
            } else { F = (A - B) % GFp == 0; }
        } else {
            F = true;
            for (i = 0; i < m; i++)
                if (F) F = (A[i] - B[i]) % GFp == 0;
        }
    }
    return F;
}

function gfrand(n) {
    var i, C;
    if (arguments.length > 0) {
        if (typeof(n[0]) == "object") n = rows(n);
        C = zero(n);
        for (i = 0; i < n; i++) C[i] = gfrand();
    } else {
        if (GFm == 1) { C = randint(GFp - 1); } else { C = floorm(mulp(GFp, absm(rand(GFm)))); }
    }
    return C;
}

function mod(x, v) {
    var i, j, n, m;
    n = rows(x);
    m = cols(x);
    if (n) {
        y = matrix(n, m);
        if (m > 1) {
            for (i = 0; i < n; i++)
                for (j = 0; j < n; j++) y[i][j] = x[i][j] % v;
        } else { for (i = 0; i < n; i++) y[i] = x[i] % v; }
    } else { y = x % v; }
    return y;
}

// AJAX

function ajaxRead(name) {
    var i, j, sz, sz2, MAT, ST;
    i = 0;
    j = 0;
    ST = '';
    var xmlObj = null;
    receiveF = 0;

    function getdatafrom() {
        sz = xmlObj.responseXML.getElementsByTagName('size')[0].firstChild.data;
        sz = parseInt(sz);
        if (sz < 1) sz = 1;
        if (navigator.userAgent.substr(0, 7) == 'Mozilla') {
            ST = xmlObj.responseText;
            ST = ST.split('<data>')[1].split('</data>')[0];
        } else { ST = xmlObj.responseXML.getElementsByTagName('data')[0].firstChild.data; }
        i = ST.indexOf(",");
        if (i < 0) { receiveData = parseFloat(ST) } else {
            ST = ST.split(',');
            MAT = new Array();
            for (i = 0; i < ST.length; i++) MAT[i] = parseFloat(ST[i]);
            if (sz < 2) { receiveData = MAT; } else {
                sz2 = MAT.length / sz;
                receiveData = matrix(sz2, sz);
                for (i = 0; i < sz2; i++)
                    for (j = 0; j < sz; j++) receiveData[i][j] = MAT[i + j * sz2];
            }
        };
        receiveF = 1;
    }
    if (window.XMLHttpRequest) {
        xmlObj = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        xmlObj = new ActiveXObject("Microsoft.XMLHTTP");
    } else {
        return;
    }
    xmlObj.onreadystatechange = function() {
        if (xmlObj.readyState == 4) getdatafrom();
    }
    if (name.indexOf('.xml') < 0) name = name + '.xml';
    xmlObj.open('GET', directory1 + name + '?' + Math.random(), false);
    xmlObj.send('');
    if (navigator.appName == "Netscape") getdatafrom();
}

function ajaxWrite(name, data) {
    var MAT;
    var sz = 0;
    var xmlObj2 = null;
    var contentType = "application/x-www-form-urlencoded; charset=UTF-8";
    if (window.XMLHttpRequest) {
        xmlObj2 = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        xmlObj2 = new ActiveXObject("Microsoft.XMLHTTP");
    } else {
        return;
    }
    // alert(directory1+'putdata.php');
    xmlObj2.open('POST', directory1 + 'putdata.php', false);
    xmlObj2.setRequestHeader("Content-Type", contentType);
    if (typeof(data) == typeof('')) { if (data.indexOf('.jpg') > -1) sz = 0; } else {
        sz = cols(data);
        data = tr(data);
        // MAT=eval(data); if (typeof(MAT)==typeof(2)) {sz=0;}else{ if (typeof(MAT[0])==typeof(2)) {sz=1}else{sz=MAT.length;}};  
    };
    // alert('password='+name+'&data='+data+'&size='+sz);
    xmlObj2.send('password=' + name + '&data=' + data + '&size=' + sz);
}

function ajaxReadM(name) {
    var xmlObj = null;
    receiveF = 0;

    function getdatafrom() {
        receiveData = getmatrix(trim(xmlObj.responseText), " ", "\r");
        receiveF = 1;
    }
    if (window.XMLHttpRequest) {
        xmlObj = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        xmlObj = new ActiveXObject("Microsoft.XMLHTTP");
    } else {
        return;
    }
    xmlObj.onreadystatechange = function() {
        if (xmlObj.readyState == 4)
            if (receiveF == 0) getdatafrom();
    }
    xmlObj.open('GET', directory1 + name + '?' + Math.random(), false);
    xmlObj.send('');
    if (navigator.appName == "Netscape") getdatafrom();
}


function readphoto(name, col, k, buf) {
    if (buf == undefined) buf = "buffer.xml";
    col += ":";
    if (col == "W:") col = "";
    name += ":" + col + k;
    directory1 = filesdirectory;
    ajaxWrite(buf, name);
    ajaxRead(buf);
    var A = receiveData;
    directory1 = directory;
    return A;
}

// MATLAB

function calcExpr2(s) {
    var a, b, c, d, e, p, f;

    function ajxdr() { if (f > -1) { c = 'directory1=filesdirectory;' + c + '; directory1=directory'; } }

    function ajxwr() { c = 'ajaxWrite(' + a[0] + ',' + b + ')';
        ajxdr(); }

    function ajxrd() { c = 'ajaxRead(' + b + ');' + a[0] + '=receiveData';
        ajxdr(); }
    a = s.split('=');
    b = a[1]; // alert(s); 
    if (b.indexOf('tr(') > -1) {
        // b=b.substring(b.indexOf('tr('))+')'; // buf0=A; tr(buf0)..  
        // p=s.indexOf('};'); c=s.substring(0,p); d=c.split('={');
        // if(d[0]==d[1]){return b;}else{return d[0]+'=equal('+d[1]+');'+b;}
        return s;
    } else { // alert(b);
        b = b.substring(1, b.length - 1);
        p = b.indexOf('[');
        if (p == 0) {
            c = ',';
            p = b.indexOf('],[');
            if (p > -1) {
                e = 'square';
                b = b.substring(2, p) + c + b.substring(p + 3, b.indexOf(']]'));
                p = b.indexOf('-');
                if (p > -1) { e = 'sylvester';
                    b = b.substring(0, p) + b.substring(p + 1, b.length); }
            } else { e = 'colline';
                b = b.substring(1, b.indexOf(']')); }
        } else {
            p = b.indexOf('.*');
            if (p > -1) { c = '.*';
                e = 'mulp'; } else {
                p = b.indexOf('./');
                if (p > -1) { c = './';
                    e = 'divp'; } else {
                    p = b.indexOf('*');
                    if (p > -1) { c = '*';
                        e = 'mul'; } else {
                        p = b.indexOf('/');
                        if (p > -1) { c = '/';
                            e = 'div2'; } else {
                            p = b.indexOf('\\');
                            if (p > -1) { c = '\\';
                                e = 'div'; } else {
                                p = b.indexOf('+');
                                if (p > -1) { c = '+';
                                    e = 'add'; } else {
                                    p = b.indexOf('-');
                                    if (p > -1) { if (p == 0) { c = '';
                                            e = 'equal'; } else { c = '-';
                                            e = 'sub'; } } else {
                                        f = b.indexOf('"');
                                        if (f == 0) { p = 0; } else { p = b.indexOf("'"); }
                                        if (p == 0) {
                                            p = b.indexOf('.xml');
                                            if (p > 0) { ajxrd(); } else {
                                                p = b.indexOf('.txt');
                                                if (p > 0) { ajxrd(); } else {
                                                    p = b.indexOf('.jpg');
                                                    if (p < 0) p = b.indexOf('.png');
                                                    if (p < 0) p = b.indexOf('.bmp');
                                                    if (p > 0) { ajxwr(); } else { c = a[0] + '=' + b; }
                                                }
                                            }
                                        } else {
                                            f = a[0].indexOf('"');
                                            if (f > -1) { p = 1; } else { p = a[0].indexOf("'"); }
                                            if (p > -1) {
                                                p = a[0].indexOf('.xml');
                                                if (p > -1) ajxwr(); // alert(c);  
                                            } else { c = a[0] + '=equal(' + b + ')'; }
                                        }; // alert(c);  
                                        return c;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    var d = b.split(c);
    c = a[0] + '=' + e + '(';
    if (e == 'equal') { c += b; } else { c += d[0]; for (var i = 1; i < d.length; i++) c = c + ',' + d[i]; }
    // alert(c);
    return c += ')';
}

if (!window.cbSplit) {
    var cbSplit = function(str, separator, limit) {
        if (Object.prototype.toString.call(separator) !== "[object RegExp]")
            return cbSplit._nativeSplit.call(str, separator, limit);
        var output = [],
            lastLastIndex = 0,
            flags = (separator.ignoreCase ? "i" : "") +
            (separator.multiline ? "m" : "") +
            (separator.sticky ? "y" : ""),
            separator = RegExp(separator.source, flags + "g"),
            separator2, match, lastIndex, lastLength;
        str = str + "";
        if (!cbSplit._compliantExecNpcg)
            separator2 = RegExp("^" + separator.source + "$(?!\\s)", flags);
        if (limit === undefined || +limit < 0) {
            limit = Infinity;
        } else {
            limit = Math.floor(+limit);
            if (!limit)
                return [];
        }
        while (match = separator.exec(str)) {
            lastIndex = match.index + match[0].length;
            if (lastIndex > lastLastIndex) {
                output.push(str.slice(lastLastIndex, match.index));
                if (!cbSplit._compliantExecNpcg && match.length > 1) {
                    match[0].replace(separator2, function() {
                        for (var i = 1; i < arguments.length - 2; i++) {
                            if (arguments[i] === undefined)
                                match[i] = undefined;
                        }
                    });
                }
                if (match.length > 1 && match.index < str.length) Array.prototype.push.apply(output, match.slice(1));
                lastLength = match[0].length;
                lastLastIndex = lastIndex;
                if (output.length >= limit)
                    break;
            }
            if (separator.lastIndex === match.index)
                separator.lastIndex++;
        }
        if (lastLastIndex === str.length) {
            if (!separator.test("") || lastLength)
                output.push("");
        } else {
            output.push(str.slice(lastLastIndex));
        }
        return output.length > limit ? output.slice(0, limit) : output;
    };
    cbSplit._compliantExecNpcg = /()??/.exec("")[1] === undefined;
    cbSplit._nativeSplit = String.prototype.split;
}
String.prototype.split = function(separator, limit) {
    return cbSplit(this, separator, limit);
};

function binar(op, param) {
    var arg2 = "" + param.arg2;
    if (/-\w/.test(arg2)) { arg2 = "(" + arg2 + ")"; }
    if (op == '%') { op = './'; } else { if (op == '#') op = '.*'; }
    return "{" + param.arg1 + op + arg2 + "}";
}

function trans(op, param) {
    // return "{" + param.arg1 + "}; tr("+param.arg2+")";
    return "tr(" + param.arg1 + ")";
}

function assignment(op, param) {
    return "{" + param.arg1 + "}";
}

// var regexOperations = new RegExp(/^[-\*\+\\/()\^\']$/);
var regexOperations = new RegExp(/^[-\*\#\%\+\\/()\^\']$/);
var regexOperands = new RegExp(/\w/);
//var regexpForSplit = new RegExp(/(^-\d+)|(\()(-\d+)|([-\*\+\\/()\^\'])/);
var regexpForSplit = new RegExp(/(^-\d+)|(\()(-\d+)|([-\*\.\+\\/()\^\'])/);

var operations = {
    '(': { 'priority': 0 },
    ')': { 'priority': 1 },
    '-': { 'priority': 2, 'count': 2, 'func': binar },
    '+': { 'priority': 2, 'count': 2, 'func': binar },
    '#': { 'priority': 3, 'count': 2, 'func': binar },
    '*': { 'priority': 3, 'count': 2, 'func': binar },
    '%': { 'priority': 3, 'count': 2, 'func': binar },
    '/': { 'priority': 3, 'count': 2, 'func': binar },
    '\\': { 'priority': 3, 'count': 2, 'func': binar },
    '^': { 'priority': 4, 'count': 2, 'func': binar },
    '\'': { 'priority': 5, 'count': 1, 'func': trans },
    'assignment': { 'count': 1, 'func': assignment }
};

function splitUpOperand(str) {
    str = str.replace(/\s/g, "");
    str = str.replace(/(?:\(-)([a-zA-Z_]+\w*)/g, "((-1*$1)");
    str = str.replace(/(?:^-)([a-zA-Z_]+\w*)/g, "(-1*$1)");
    var vArr = str.split(regexpForSplit);
    var i;
    var result = new Array();
    for (i in vArr) { if (vArr[i] != "" && typeof vArr[i] != "undefined") { result.push(vArr[i]); } }
    return result;
}

function reversePolishNotation(str) {
    var stack = splitUpOperand(str);
    var str = new Array();
    for (var i = 0; i < stack.length; i++) {
        var ch = stack[i];
        if (ch == '.') {
            i++;
            var ch2 = stack[i];
            if (ch2 == '/') { str.push('%'); } else {
                if (ch2 == '*') { str.push('#'); } else {
                    ch += ch2;
                    if (str.length == 0) { str.push(ch); } else { str[str.length - 1] += ch; }
                }
            }
        } else { str.push(ch); }
    } // alert(str); 
    stack = new Array();
    var result = new Array();
    for (i = 0; i < str.length; i++) {
        if (str[i] == ')') {
            var ch;
            while (stack.length != 0 && (ch = stack.pop()) != '(') { result.push(ch); }
        } else if (regexOperands.test(str[i])) {
            result.push(str[i]);
        } else if (str[i] == '(') {
            stack.push('(');
        } else if (regexOperations.test(str[i])) { // alert(str[i]);  
            if (stack.length == 0) {
                stack.push(str[i]);
            } else {
                if (operations[str[i]].priority > operations[stack[stack.length - 1]].priority) {
                    stack.push(str[i]);
                } else {
                    while (stack.length != 0 && operations[str[i]].priority <= operations[stack[stack.length - 1]].priority) {
                        result.push(stack.pop());
                    }
                    stack.push(str[i]);
                }
            }
        }
    }
    while (stack.length != 0) result.push(stack.pop());
    return result;
}

function calcExpr(ex) {
    var result = new Array();
    var expr = ex.replace(/\w+={{(.+)}}/, "$1");
    var rpn = reversePolishNotation(expr); // alert(expr+' '+rpn);
    var stack = new Array();
    var countBuf = 0;
    for (var i = 0; i < rpn.length; i++) {
        while (!regexOperations.test(rpn[i]) && i < rpn.length) { stack.push(rpn[i++]); }
        var count;
        var operation;
        if (i >= rpn.length) {
            count = 1;
            i = rpn.length - 1;
            operation = "assignment";
        } else {
            operation = rpn[i];
            count = operations[operation].count;
        }
        var param = new Object();
        for (var j = count; j >= 1; j--) { param["arg" + j] = stack.pop(); }
        var varBuf = "Buf" + countBuf++;
        if (i == rpn.length - 1) { varBuf = ex.replace(/(\w+)={{.+}}/, "$1"); } stack.push(varBuf);
        param["arg" + (count + 1)] = varBuf;
        var str = operations[operation].func(operation, param); // alert(varBuf+'='+str+'  '+operation);
        result.push(varBuf + '=' + str);
    }
    // alert(result);
    return result;
}

// PLOT

function format(A, f) {
    var i, j, f1, n, m, B;

    function cut123(a) {
        if (typeof(a) == 'number') { var b = Math.abs(a); if (b > f1) { a = Math.round(a * f) / f; } else { a = 0; } }
        // if (b<f1) { a=0; }else{ a=Math.round(a*f*f)/f/f; }}}
        return a;
    }
    n = rows(A);
    f1 = 1 / f;
    if (n) {
        m = cols(A);
        B = matrix(n, m);
        if (m == 1) {
            for (var i = 0; i < n; i++) B[i] = cut123(A[i]);
        } else {
            for (var i = 0; i < n; i++)
                for (var j = 0; j < m; j++) B[i][j] = cut123(A[i][j]);
        }
    } else { if (typeof(A) == 'string') { B = A; } else { B = cut123(A); } }
    return B;
}

function axis(a) {
    axissetted = (arguments.length > 0);
    if (axissetted) {
        if (arguments.length == 1) { axisminX = -a;
            axismaxX = a;
            axisminY = -a;
            axismaxY = a; } else {
            axisminX = arguments[0];
            axismaxX = arguments[1];
            if (arguments.length == 2) { axisminY = axisminX;
                axismaxY = axismaxX; } else {
                axisminY = arguments[2];
                if (arguments.length == 3) { axismaxY = -axisminY; } else { axismaxY = arguments[3]; }
            }
        }
    }
}

function plots(A, s) {
    var i, s2;
    if (arguments.length == 1) s = "XR";
    i = s.indexOf(':');
    if (i < 0) { s2 = "file.xml";
        s = s2 + ":" + s; } else { s2 = s.substring(0, i); } // alert(s2); 
    ajaxWrite(s2, A);
    plot(s);
}

function plot(A) {
    var transparent2D = 0;

    function plot2(x, y) {
        function adapt(min, max) {
            if (Math.abs(min) > Math.abs(max)) { var am = Math.abs(min); } else { var am = Math.abs(max); }
            if (axissetted) { am = Math.round(100 * am) / 100; } else {
                if (am > 20) { am = Math.floor(am / 10 - 0.1) * 10 + 10; } else {
                    if (am > 5) { am = Math.floor(am / 10 - 0.05) * 10 + 10; } else {
                        if (am > 2) { am = Math.floor(am - 0.1) + 1; } else {
                            if (am > 0.5) { am = Math.floor(am - 0.05) + 1; } else {
                                if (am > 0.2) { am = Math.floor(10 * am - 0.1) / 10 + 0.1; } else {
                                    if (am > 0.05) { am = Math.floor(10 * am - 0.05) / 10 + 0.1; } else {
                                        am = Math.round(100 * am + 0.5) / 100;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return am;
        }

        function axeX(ox, oy, dx, mi, lg, col, h) {
            var hh = oy;
            if (oy == h / 2) hh = h - 10;
            for (var i = 1; i < mi; i++) {
                plotCanvas.setColor("#dddddd");
                var o = ox + dx * i;
                plotCanvas.fillPolygon([o, o], [hh, 10]);
                plotCanvas.setColor(col);
                plotCanvas.fillPolygon([o, o], [oy, oy - lg]);
            }
        }

        function axeY(ox, oy, dy, mi, lg, col, w) {
            var ww = ox;
            if (ox == w / 2) ww = 10;
            for (var i = 1; i < mi; i++) {
                plotCanvas.setColor("#dddddd");
                var o = oy - dy * i;
                plotCanvas.fillPolygon([ww, w - 10, w - 10, ww], [o, o, o - 1, o - 1]);
                plotCanvas.setColor(col);
                plotCanvas.fillPolygon([ox, ox + lg, ox + lg, ox], [o, o, o - 1, o - 1]);
            }
        }

        function putAx(ox, oy, dx, amX, col) {
            plotCanvas.setColor(col);
            var s = format(amX, 1000).toString();
            plotCanvas.drawString(s, ox + 10 * dx - s.length * 4, oy + 5);
        }

        function putAy(ox, oy, dy, amY, col) {
            plotCanvas.setColor(col);
            var s = format(amY, 1000).toString();
            plotCanvas.drawString(s, ox - s.length * 7 - 5, oy - 10 * dy - 6);
        }
        var transparent2D = 0;
        var fx = 0;
        var masx = new Array();
        var masy = new Array;
        if (arguments.length == 2) { masx = x;
            masy = y; } else {
            var count = x.length;
            if (typeof(x[0]) == typeof(2)) { fx = 1; for (var i = 0; i < count; i++) { masy[i] = x[i];
                    masx[i] = i; }; } else {
                count = x[0].length;
                maxcount = x.length;
                for (var i = 0; i < count; i++) masx[i] = x[0][i];
                if (maxcount < 3) { for (var i = 0; i < count; i++) masy[i] = x[1][i]; } else {
                    for (var k = 0; k < maxcount - 1; k++) { var yy = new Array();
                        masy[k] = yy; }
                    for (var k = 1; k < maxcount; k++)
                        for (var i = 0; i < count; i++) masy[k - 1][i] = x[k][i];
                };
            }
        }
        plotCanvas.clear();
        var count = masx.length;
        var w = 500;
        var h = 300;
        var col = "#444444";
        if (transparent2D == 0) { plotCanvas.setColor("#ffffff");
            plotCanvas.fillRect(0, 0, w, h); }
        if (axissetted) {
            var minX = axisminX;
            var maxX = axismaxX;
            var minY = axisminY;
            var maxY = axismaxY;
        } else {
            var minX = masx[0];
            var maxX = minX;
            for (var i = 0; i < count; i++) { if (masx[i] < minX) minX = masx[i]; if (masx[i] > maxX) maxX = masx[i]; }
        };
        if (typeof(masy[0]) == typeof(2)) {
            var maxcount = 0;
            if (!axissetted) {
                var minY = masy[0];
                var maxY = minY;
                for (var i = 0; i < count; i++) { if (masy[i] < minY) minY = masy[i]; if (masy[i] > maxY) maxY = masy[i]; }
            }
        } else {
            var maxcount = masy.length;
            if (!axissetted) {
                var minY = masy[0][0];
                var maxY = minY;
                for (var k = 0; k < maxcount; k++)
                    for (var i = 0; i < count; i++) {
                        if (masy[k][i] < minY) minY = masy[k][i];
                        if (masy[k][i] > maxY) maxY = masy[k][i];
                    }
            }
        };
        var amX = adapt(minX, maxX);
        var amY = adapt(minY, maxY);
        if (minX < 0) { var ox = w / 2; } else { var ox = 30; if (amX > 100) ox = 40; };
        if (minY < 0) { var oy = h / 2; } else { var oy = h - 20; };
        plotCanvas.setColor(col);
        if (minX >= 0) plotCanvas.drawString('0', ox - 12, oy + 3);
        var d10 = 10;
        var w10 = w - d10;
        var h10 = h - d10;
        var oy1 = oy + 1;
        var ox1 = ox + 1;
        plotCanvas.fillPolygon([d10, w10, w10, d10], [oy, oy, oy1, oy1]);
        plotCanvas.fillPolygon([ox, ox, ox1, ox1], [d10, h10, h10, d10]);
        var dx = (w - ox - w / 12) / 10;
        axeX(ox, oy, dx, 11, 3, col, h);
        axeX(ox, oy, dx * 5, 3, 7, col, h);
        if (minX < 0) { axeX(ox, oy, -dx, 11, 3, col, h);
            axeX(ox, oy, -dx * 5, 3, 7, col, h); }
        var dy = (oy - h / 12) / 10;
        axeY(ox, oy, dy, 11, 3, col, w);
        axeY(ox, oy, dy * 5, 3, 7, col, w);
        if (minY < 0) { axeY(ox, oy, -dy, 11, 3, col, w);
            axeY(ox, oy, -dy * 5, 3, 7, col, w); }
        amoX = amX + fx;
        amoY = amY;
        if (amX > 0) amX = 10 * dx / amX;
        if (amY > 0) amY = 10 * dy / amY;
        var maxcount2 = maxcount;
        if (maxcount2 == 0) maxcount2 = 1;
        for (var k = 0; k < maxcount2; k++) {
            if (k == 0) plotCanvas.setColor("#00aaaa");
            if (k == 1) plotCanvas.setColor("#ff0000");
            if (k == 2) plotCanvas.setColor("#00dd00");
            if (k == 3) plotCanvas.setColor("#0000ff");
            if (k == 4) plotCanvas.setColor("#ff00ff");
            if (k > 4) plotCanvas.setColor("#dd00dd");
            for (var i = 0; i < count; i++) {
                ix = ox + amX * masx[i];
                if (maxcount > 0) { iy = oy - amY * masy[k][i]; } else { iy = oy - amY * masy[i]; }
                if ((transparent2D > 1) && (k > 2 - transparent2D)) {
                    if (iy != oy)
                        if (transparent2D > 3) {
                            if (i > 0) plotCanvas.fillPolygon([oix, oix, ix, ix], [oy, iy, iy, oy]);
                        } else { plotCanvas.fillPolygon([ix, ix, ix, ix], [oy, iy, iy, oy]); }
                } else { if (i > 0) plotCanvas.fillPolygon([oix, oix, ix, ix], [oiy, oiy + 1, iy + 1, iy]); }
                oix = ix;
                oiy = iy;
            }
        };
        plotCanvas.setColor(col);
        putAx(ox, oy, dx, amoX, col);
        putAy(ox, oy, dy, amoY, col);
        if (minX < 0) putAx(ox, oy, -dx, -amoX, col);
        if (minY < 0) putAy(ox, oy, -dy, -amoY, col);
    }
    var i, j, k, km, n, m, ms, s, ss, so, opt, B, X, Y;
    km = arguments.length - 1;
    opt = '';
    X = 10;
    Y = 0;
    OpenCanvas('plotCanvas', canvasW, canvasH);
    n = rows(arguments[0]);
    m = cols(arguments[0]);
    if ((km > 1) || (m > 1)) opt = '2D';
    if (typeof(arguments[km]) == 'string') { opt = arguments[km]; } else { km++; };
    if (opt == '') { s = 'plot2(arguments[0]'; for (i = 1; i < km; i++) s += ',arguments[' + i + ']';
        s = s + ')';
        eval(s); } else {
        so = ":";
        s = arguments[0];
        ss = "http://www.mathscinet.ru/zjun/graph.php?matrix=";
        if (typeof(s) == 'string') { // alert(s); alert(km);
            if ((s.indexOf(':X') > -1) || (s.indexOf(':2C') > -1) || (s.indexOf(':M') > -1)) {
                X = (canvasW - 256) / 2;
                Y = (canvasH - 256) / 2;
            } else {
                if ((s.indexOf(':3C') > -1) || (s.indexOf(':3L') > -1)) {
                    Y = 40;
                    so = "::";
                } else {
                    if (km == 0) { so = ":C:"; } else { so = so + opt + so; }
                }
            }
            s = ss + reldirectory + s + so;
        } else {
            so = so + opt + so;
            if (km == 1) { B = equal(arguments[0]); } else {
                m = 0;
                for (k = 0; k < km; k++) m = m + cols(arguments[k]);
                B = matrix(n, m);
                ms = 0;
                for (k = 0; k < km; k++) {
                    m = cols(arguments[k]);
                    if (m == 1) { for (i = 0; i < n; i++) B[i][ms] = arguments[k][i]; } else {
                        for (i = 0; i < n; i++)
                            for (j = 0; j < m; j++) B[i][ms + j] = arguments[k][i][j];
                    };
                    ms = ms + m;
                }
            }
            m = cols(B);
            s = '';
            ms = ',';
            if (m == 1) { for (i = 0; i < n; i++) s += format(B[i], 10000) + ms; } else {
                for (j = 0; j < m; j++)
                    for (i = 0; i < n; i++) s += format(B[i][j], 10000) + ms;
            }
            s = s.substring(0, s.length - 1);
            s = ss + ":" + m + so + s;
            // ms=opt.indexOf('2'); if(ms==0) { n=-2; ms=0; };else{ n=150; ms=40; }; 
        }
        plotCanvas.clear();
        plotCanvas.drawImage(s + ",T=" + Math.random(), X, Y);
    }
    plotCanvas.paint();
    // document.getElementById('graphtd').style.display='block';
    // document.getElementById('graph').src=s; (��� img)
}

function mesh(A) {
    var i, j, n, m, w, h, max, max2, min, s, s2, WS, WS1, WS2, WS3, HS, B, X, Y, P, FB;

    function setcol(ws, a, ds) {
        if (ds == 0) s2 = Math.round(ws * (a - min) / max);
        s2 += ds;
        if (s2 < 20) s2 = 20;
        s = s2 | (s2 << 8) | (s2 << 16);
        s = '#' + s.toString(16);
        plotCanvas.setColor(s);
    }
    n = rows(A);
    m = cols(A);
    WS = canvasW;
    WS2 = 265;
    WS3 = 200;
    HS = canvasH;
    if ((n == 0) || (m == 0)) {} else {
        max = 0;
        if (m == 1) {
            min = A[0];
            h = HS;
            w = WS / n;
            for (i = 0; i < n; i++) { s = A[i]; if (s > max) max = s; if (s < min) min = s; };
            max2 = Math.abs(max);
            if (max == min) { min = 0; } else { max = (max - min); }
            OpenCanvas('plotCanvas', WS, HS);
            plotCanvas.clear();
            for (i = 0; i < n; i++) {
                h = Math.round(HS * A[i] / max2);
                if (h < 1) h = 1;
                setcol(WS3, A[i], 0);
                plotCanvas.fillRect(i * w, HS - h, w + 1, h);
            }
            plotCanvas.paint();
        } else {
            WS = canvasW;
            HS = canvasH;
            if (Math.abs(n - m) / n < 0.1) { HS = HS - 10;
                WS = HS; } WS2 = 240;
            min = A[0][0];
            h = HS / n;
            w = WS / m;
            WS1 = (canvasW - WS) / 2;
            for (i = 0; i < n; i++)
                for (j = 0; j < m; j++) { s = A[i][j]; if (s > max) max = s; if (s < min) min = s; };
            max = (max - min);
            FB = (max == 0);
            if (max >= 0) {
                OpenCanvas('plotCanvas', canvasW, canvasH);
                plotCanvas.clear();
                for (i = 0; i < n; i++)
                    for (j = 0; j < m; j++) {
                        X = WS1 + j * w;
                        Y = 5 + i * h;
                        P = A[i][j];
                        if (FB) { plotCanvas.setColor('#DDDDDD'); } else { setcol(WS2, P, 0); }
                        plotCanvas.fillRect(X, Y, w + 1, h + 1);
                        X++;
                        Y++;
                        if ((w > 4) && (h > 4)) {
                            if (FB) { plotCanvas.setColor('#FFFFFF'); } else { setcol(WS2, P, 10); }
                            plotCanvas.fillRect(X, Y, w - 4, h - 4);
                        }
                    }
                plotCanvas.paint();
            }
        }
    }
}

// GRAPH

var jg_ihtm, jg_ie, jg_fast, jg_dom, jg_moz, jg_n4 = (document.layers && typeof document.classes != "undefined");
var Font = new jsgFont();
var Stroke = new jsgStroke();
var regex = /%%([^;]+);([^;]+);([^;]+);([^;]+);([^;]+);/g;

function OpenCanvas(name, w, h) {
    document.getElementById('wCanvas').style.display = 'block';
    if (arguments.length == 0) {} else {
        eval("if(typeof(" + name + ")==='undefined')" + name + "=new jsGraphics('pCanvas')");
        if (arguments.length > 1)
            if (w > canvasW) canvasW = w;
        if (arguments.length > 2) canvasH = h;
        document.getElementById('wCanvas').style.width = canvasW;
        document.getElementById('wCanvas').style.height = canvasH + 3;
    }
}

// Canvas.drawImage(name,x,y,w,h);
// name=name+"?"+Math.random(); 
// Canvas.setColor('#FF0000');
// Canvas.drawString(string,x,y);
// Canvas.fillRect(x,y,w,h);
// Canvas.fillPolygon(x,y);
// Canvas.paint()  
// Canvas.clear(); 

function integer_compare(x, y) { return (x < y) ? -1 : ((x > y) * 1); }

function chkDHTM(x, i) {
    x = document.body || null;
    jg_ie = x && typeof x.insertAdjacentHTML != "undefined";
    jg_dom = (x && !jg_ie &&
        typeof x.appendChild != "undefined" &&
        typeof document.createRange != "undefined" &&
        typeof(i = document.createRange()).setStartBefore != "undefined" &&
        typeof i.createContextualFragment != "undefined");
    jg_ihtm = !jg_ie && !jg_dom && x && typeof x.innerHTML != "undefined";
    jg_fast = jg_ie && document.all && !window.opera;
    jg_moz = jg_dom && typeof x.style.MozOpacity != "undefined";
}


function pntDoc() {
    this.wnd.document.write(jg_fast ? this.htmRpc() : this.htm);
    this.htm = '';
}


function pntCnvDom() {
    var x = document.createRange();
    x.setStartBefore(this.cnv);
    x = x.createContextualFragment(jg_fast ? this.htmRpc() : this.htm);
    if (this.cnv) this.cnv.appendChild(x);
    this.htm = '';
}


function pntCnvIe() {
    if (this.cnv) this.cnv.insertAdjacentHTML("BeforeEnd", jg_fast ? this.htmRpc() : this.htm);
    this.htm = '';
}


function pntCnvIhtm() {
    if (this.cnv) this.cnv.innerHTML += this.htm;
    this.htm = '';
}


function pntCnv() {
    this.htm = '';
}


function mkDiv(x, y, w, h) {
    this.htm += '<div style="position:absolute;' +
        'left:' + x + 'px;' +
        'top:' + y + 'px;' +
        'width:' + w + 'px;' +
        'height:' + h + 'px;' +
        'clip:rect(0,' + w + 'px,' + h + 'px,0);' +
        'background-color:' + this.color +
        (!jg_moz ? ';overflow:hidden' : '') +
        ';"><\/div>';
}


function mkDivIe(x, y, w, h) {
    this.htm += '%%' + this.color + ';' + x + ';' + y + ';' + w + ';' + h + ';';
}


function mkDivPrt(x, y, w, h) {
    this.htm += '<div style="position:absolute;' +
        'border-left:' + w + 'px solid ' + this.color + ';' +
        'left:' + x + 'px;' +
        'top:' + y + 'px;' +
        'width:0px;' +
        'height:' + h + 'px;' +
        'clip:rect(0,' + w + 'px,' + h + 'px,0);' +
        'background-color:' + this.color +
        (!jg_moz ? ';overflow:hidden' : '') +
        ';"><\/div>';
}


function mkLyr(x, y, w, h) {
    this.htm += '<layer ' +
        'left="' + x + '" ' +
        'top="' + y + '" ' +
        'width="' + w + '" ' +
        'height="' + h + '" ' +
        'bgcolor="' + this.color + '"><\/layer>\n';
}


function htmRpc() {
    return this.htm.replace(
        regex,
        '<div style="overflow:hidden;position:absolute;background-color:' +
        '$1;left:$2;top:$3;width:$4;height:$5"></div>\n');
}


function htmPrtRpc() {
    return this.htm.replace(
        regex,
        '<div style="overflow:hidden;position:absolute;background-color:' +
        '$1;left:$2;top:$3;width:$4;height:$5;border-left:$4px solid $1"></div>\n');
}


function mkLin(x1, y1, x2, y2) {
    if (x1 > x2) {
        var _x2 = x2;
        var _y2 = y2;
        x2 = x1;
        y2 = y1;
        x1 = _x2;
        y1 = _y2;
    }
    var dx = x2 - x1,
        dy = Math.abs(y2 - y1),
        x = x1,
        y = y1,
        yIncr = (y1 > y2) ? -1 : 1;

    if (dx >= dy) {
        var pr = dy << 1,
            pru = pr - (dx << 1),
            p = pr - dx,
            ox = x;
        while ((dx--) > 0) {
            ++x;
            if (p > 0) {
                this.mkDiv(ox, y, x - ox, 1);
                y += yIncr;
                p += pru;
                ox = x;
            } else p += pr;
        }
        this.mkDiv(ox, y, x2 - ox + 1, 1);
    } else {
        var pr = dx << 1,
            pru = pr - (dy << 1),
            p = pr - dy,
            oy = y;
        if (y2 <= y1) {
            while ((dy--) > 0) {
                if (p > 0) {
                    this.mkDiv(x++, y, 1, oy - y + 1);
                    y += yIncr;
                    p += pru;
                    oy = y;
                } else {
                    y += yIncr;
                    p += pr;
                }
            }
            this.mkDiv(x2, y2, 1, oy - y2 + 1);
        } else {
            while ((dy--) > 0) {
                y += yIncr;
                if (p > 0) {
                    this.mkDiv(x++, oy, 1, y - oy);
                    p += pru;
                    oy = y;
                } else p += pr;
            }
            this.mkDiv(x2, oy, 1, y2 - oy + 1);
        }
    }
}


function mkLin2D(x1, y1, x2, y2) {
    if (x1 > x2) {
        var _x2 = x2;
        var _y2 = y2;
        x2 = x1;
        y2 = y1;
        x1 = _x2;
        y1 = _y2;
    }
    var dx = x2 - x1,
        dy = Math.abs(y2 - y1),
        x = x1,
        y = y1,
        yIncr = (y1 > y2) ? -1 : 1;

    var s = this.stroke;
    if (dx >= dy) {
        if (dx > 0 && s - 3 > 0) {
            var _s = (s * dx * Math.sqrt(1 + dy * dy / (dx * dx)) - dx - (s >> 1) * dy) / dx;
            _s = (!(s - 4) ? Math.ceil(_s) : Math.round(_s)) + 1;
        } else var _s = s;
        var ad = Math.ceil(s / 2);

        var pr = dy << 1,
            pru = pr - (dx << 1),
            p = pr - dx,
            ox = x;
        while ((dx--) > 0) {
            ++x;
            if (p > 0) {
                this.mkDiv(ox, y, x - ox + ad, _s);
                y += yIncr;
                p += pru;
                ox = x;
            } else p += pr;
        }
        this.mkDiv(ox, y, x2 - ox + ad + 1, _s);
    } else {
        if (s - 3 > 0) {
            var _s = (s * dy * Math.sqrt(1 + dx * dx / (dy * dy)) - (s >> 1) * dx - dy) / dy;
            _s = (!(s - 4) ? Math.ceil(_s) : Math.round(_s)) + 1;
        } else var _s = s;
        var ad = Math.round(s / 2);

        var pr = dx << 1,
            pru = pr - (dy << 1),
            p = pr - dy,
            oy = y;
        if (y2 <= y1) {
            ++ad;
            while ((dy--) > 0) {
                if (p > 0) {
                    this.mkDiv(x++, y, _s, oy - y + ad);
                    y += yIncr;
                    p += pru;
                    oy = y;
                } else {
                    y += yIncr;
                    p += pr;
                }
            }
            this.mkDiv(x2, y2, _s, oy - y2 + ad);
        } else {
            while ((dy--) > 0) {
                y += yIncr;
                if (p > 0) {
                    this.mkDiv(x++, oy, _s, y - oy + ad);
                    p += pru;
                    oy = y;
                } else p += pr;
            }
            this.mkDiv(x2, oy, _s, y2 - oy + ad + 1);
        }
    }
}


function mkLinDott(x1, y1, x2, y2) {
    if (x1 > x2) {
        var _x2 = x2;
        var _y2 = y2;
        x2 = x1;
        y2 = y1;
        x1 = _x2;
        y1 = _y2;
    }
    var dx = x2 - x1,
        dy = Math.abs(y2 - y1),
        x = x1,
        y = y1,
        yIncr = (y1 > y2) ? -1 : 1,
        drw = true;
    if (dx >= dy) {
        var pr = dy << 1,
            pru = pr - (dx << 1),
            p = pr - dx;
        while ((dx--) > 0) {
            if (drw) this.mkDiv(x, y, 1, 1);
            drw = !drw;
            if (p > 0) {
                y += yIncr;
                p += pru;
            } else p += pr;
            ++x;
        }
        if (drw) this.mkDiv(x, y, 1, 1);
    } else {
        var pr = dx << 1,
            pru = pr - (dy << 1),
            p = pr - dy;
        while ((dy--) > 0) {
            if (drw) this.mkDiv(x, y, 1, 1);
            drw = !drw;
            y += yIncr;
            if (p > 0) {
                ++x;
                p += pru;
            } else p += pr;
        }
        if (drw) this.mkDiv(x, y, 1, 1);
    }
}


function mkOv(left, top, width, height) {
    var a = width >> 1,
        b = height >> 1,
        wod = width & 1,
        hod = (height & 1) + 1,
        cx = left + a,
        cy = top + b,
        x = 0,
        y = b,
        ox = 0,
        oy = b,
        aa = (a * a) << 1,
        bb = (b * b) << 1,
        st = (aa >> 1) * (1 - (b << 1)) + bb,
        tt = (bb >> 1) - aa * ((b << 1) - 1),
        w, h;
    while (y > 0) {
        if (st < 0) {
            st += bb * ((x << 1) + 3);
            tt += (bb << 1) * (++x);
        } else if (tt < 0) {
            st += bb * ((x << 1) + 3) - (aa << 1) * (y - 1);
            tt += (bb << 1) * (++x) - aa * (((y--) << 1) - 3);
            w = x - ox;
            h = oy - y;
            if (w & 2 && h & 2) {
                this.mkOvQds(cx, cy, -x + 2, ox + wod, -oy, oy - 1 + hod, 1, 1);
                this.mkOvQds(cx, cy, -x + 1, x - 1 + wod, -y - 1, y + hod, 1, 1);
            } else this.mkOvQds(cx, cy, -x + 1, ox + wod, -oy, oy - h + hod, w, h);
            ox = x;
            oy = y;
        } else {
            tt -= aa * ((y << 1) - 3);
            st -= (aa << 1) * (--y);
        }
    }
    this.mkDiv(cx - a, cy - oy, a - ox + 1, (oy << 1) + hod);
    this.mkDiv(cx + ox + wod, cy - oy, a - ox + 1, (oy << 1) + hod);
}


function mkOv2D(left, top, width, height) {
    var s = this.stroke;
    width += s - 1;
    height += s - 1;
    var a = width >> 1,
        b = height >> 1,
        wod = width & 1,
        hod = (height & 1) + 1,
        cx = left + a,
        cy = top + b,
        x = 0,
        y = b,
        aa = (a * a) << 1,
        bb = (b * b) << 1,
        st = (aa >> 1) * (1 - (b << 1)) + bb,
        tt = (bb >> 1) - aa * ((b << 1) - 1);

    if (s - 4 < 0 && (!(s - 2) || width - 51 > 0 && height - 51 > 0)) {
        var ox = 0,
            oy = b,
            w, h,
            pxl, pxr, pxt, pxb, pxw;
        while (y > 0) {
            if (st < 0) {
                st += bb * ((x << 1) + 3);
                tt += (bb << 1) * (++x);
            } else if (tt < 0) {
                st += bb * ((x << 1) + 3) - (aa << 1) * (y - 1);
                tt += (bb << 1) * (++x) - aa * (((y--) << 1) - 3);
                w = x - ox;
                h = oy - y;

                if (w - 1) {
                    pxw = w + 1 + (s & 1);
                    h = s;
                } else if (h - 1) {
                    pxw = s;
                    h += 1 + (s & 1);
                } else pxw = h = s;
                this.mkOvQds(cx, cy, -x + 1, ox - pxw + w + wod, -oy, -h + oy + hod, pxw, h);
                ox = x;
                oy = y;
            } else {
                tt -= aa * ((y << 1) - 3);
                st -= (aa << 1) * (--y);
            }
        }
        this.mkDiv(cx - a, cy - oy, s, (oy << 1) + hod);
        this.mkDiv(cx + a + wod - s + 1, cy - oy, s, (oy << 1) + hod);
    } else {
        var _a = (width - ((s - 1) << 1)) >> 1,
            _b = (height - ((s - 1) << 1)) >> 1,
            _x = 0,
            _y = _b,
            _aa = (_a * _a) << 1,
            _bb = (_b * _b) << 1,
            _st = (_aa >> 1) * (1 - (_b << 1)) + _bb,
            _tt = (_bb >> 1) - _aa * ((_b << 1) - 1),

            pxl = new Array(),
            pxt = new Array(),
            _pxb = new Array();
        pxl[0] = 0;
        pxt[0] = b;
        _pxb[0] = _b - 1;
        while (y > 0) {
            if (st < 0) {
                st += bb * ((x << 1) + 3);
                tt += (bb << 1) * (++x);
                pxl[pxl.length] = x;
                pxt[pxt.length] = y;
            } else if (tt < 0) {
                st += bb * ((x << 1) + 3) - (aa << 1) * (y - 1);
                tt += (bb << 1) * (++x) - aa * (((y--) << 1) - 3);
                pxl[pxl.length] = x;
                pxt[pxt.length] = y;
            } else {
                tt -= aa * ((y << 1) - 3);
                st -= (aa << 1) * (--y);
            }

            if (_y > 0) {
                if (_st < 0) {
                    _st += _bb * ((_x << 1) + 3);
                    _tt += (_bb << 1) * (++_x);
                    _pxb[_pxb.length] = _y - 1;
                } else if (_tt < 0) {
                    _st += _bb * ((_x << 1) + 3) - (_aa << 1) * (_y - 1);
                    _tt += (_bb << 1) * (++_x) - _aa * (((_y--) << 1) - 3);
                    _pxb[_pxb.length] = _y - 1;
                } else {
                    _tt -= _aa * ((_y << 1) - 3);
                    _st -= (_aa << 1) * (--_y);
                    _pxb[_pxb.length - 1]--;
                }
            }
        }

        var ox = 0,
            oy = b,
            _oy = _pxb[0],
            l = pxl.length,
            w, h;
        for (var i = 0; i < l; i++) {
            if (typeof _pxb[i] != "undefined") {
                if (_pxb[i] < _oy || pxt[i] < oy) {
                    x = pxl[i];
                    this.mkOvQds(cx, cy, -x + 1, ox + wod, -oy, _oy + hod, x - ox, oy - _oy);
                    ox = x;
                    oy = pxt[i];
                    _oy = _pxb[i];
                }
            } else {
                x = pxl[i];
                this.mkDiv(cx - x + 1, cy - oy, 1, (oy << 1) + hod);
                this.mkDiv(cx + ox + wod, cy - oy, 1, (oy << 1) + hod);
                ox = x;
                oy = pxt[i];
            }
        }
        this.mkDiv(cx - a, cy - oy, 1, (oy << 1) + hod);
        this.mkDiv(cx + ox + wod, cy - oy, 1, (oy << 1) + hod);
    }
}


function mkOvDott(left, top, width, height) {
    var a = width >> 1,
        b = height >> 1,
        wod = width & 1,
        hod = height & 1,
        cx = left + a,
        cy = top + b,
        x = 0,
        y = b,
        aa2 = (a * a) << 1,
        aa4 = aa2 << 1,
        bb = (b * b) << 1,
        st = (aa2 >> 1) * (1 - (b << 1)) + bb,
        tt = (bb >> 1) - aa2 * ((b << 1) - 1),
        drw = true;
    while (y > 0) {
        if (st < 0) {
            st += bb * ((x << 1) + 3);
            tt += (bb << 1) * (++x);
        } else if (tt < 0) {
            st += bb * ((x << 1) + 3) - aa4 * (y - 1);
            tt += (bb << 1) * (++x) - aa2 * (((y--) << 1) - 3);
        } else {
            tt -= aa2 * ((y << 1) - 3);
            st -= aa4 * (--y);
        }
        if (drw) this.mkOvQds(cx, cy, -x, x + wod, -y, y + hod, 1, 1);
        drw = !drw;
    }
}


function mkRect(x, y, w, h) {
    var s = this.stroke;
    this.mkDiv(x, y, w, s);
    this.mkDiv(x + w, y, s, h);
    this.mkDiv(x, y + h, w + s, s);
    this.mkDiv(x, y + s, s, h - s);
}


function mkRectDott(x, y, w, h) {
    this.drawLine(x, y, x + w, y);
    this.drawLine(x + w, y, x + w, y + h);
    this.drawLine(x, y + h, x + w, y + h);
    this.drawLine(x, y, x, y + h);
}


function jsgFont() {
    this.PLAIN = 'font-weight:normal;';
    this.BOLD = 'font-weight:bold;';
    this.ITALIC = 'font-style:italic;';
    this.ITALIC_BOLD = this.ITALIC + this.BOLD;
    this.BOLD_ITALIC = this.ITALIC_BOLD;
}

function jsgStroke() {
    this.DOTTED = -1;
}

function jsGraphics(id, wnd) {
    this.setColor = new Function('arg', 'this.color = arg.toLowerCase();');
    this.bgImage = function(imgSrc, w, h, x, y) {
        if (imgSrc.indexOf('http') < 0) imgSrc = imagesfolder + imgSrc;
        var vsp = ' vspace="150"';
        if (arguments.length > 1) {
            var wdSrc = '" width="' + w + '"';
            if (arguments.length > 2) wdSrc += ' height="' + h + '"';
            if (arguments.length > 3) vsp = ' hspace="' + x + '"';
            if (arguments.length > 4) vsp += ' vspace="' + y + '"';
        } else { var wdSrc = '" width="1" height="1"'; }
        document.getElementById('bgCanvas').innerHTML += '<img SRC="' + imgSrc + wdSrc + vsp + '>';
    }
    this.drawImage = function(imgSrc, x, y, w, h, a) {
        if (imgSrc.indexOf('-:F') > -1) { imgSrc = 'http://www.mathscinet.ru/zjun/graph.php?matrix=' + reldirectory + imgSrc; } else {
            if (imgSrc.indexOf('.xml') > -1) { // alert(imgSrc);
                if (imgSrc.indexOf('http') < 0) imgSrc = reldirectory + imgSrc;
                if (imgSrc.indexOf('matrix=') < 0) imgSrc = 'http://www.mathscinet.ru/zjun/graph.php?matrix=' + imgSrc;
            } else {
                if (imgSrc.indexOf('.box') > -1) { if (imgSrc.indexOf('http') < 0) imgSrc = '../' + reldirectory + imgSrc;
                    imgSrc = 'http://www.mathscinet.ru/zjun/box/box.php?box=' + imgSrc; }
            }
        }
        this.htm += '<div style="position:absolute; left:' + x + 'px; top:' + y + 'px;';
        if (imgSrc.indexOf('../') < 0)
            if (imgSrc.indexOf('http') < 0) imgSrc = imagesfolder + imgSrc;
        //if (w<0) { this.htm +='width: 436px; height: 303px;"><img src="' + imgSrc + '"><\/div>';}else{
        if (arguments.length == 3) { this.htm += '"><img src="' + imgSrc + (a ? (' ' + a) : '') + '"><\/div>'; } else {
            if (arguments.length == 4) { this.htm += 'width:' + w + 'px;"><img src="' + imgSrc + '" width="' + w + '"' + (a ? (' ' + a) : '') + '><\/div>'; } else {
                this.htm += 'width:' + w + 'px; height:' + h + 'px;"><img src="' + imgSrc + '" width="' + w + '" height="' + h + '"' + (a ? (' ' + a) : '') + '><\/div>';
            }
        }
    };

    this.setStroke = function(x) {
        this.stroke = x;
        if (!(x + 1)) {
            this.drawLine = mkLinDott;
            this.mkOv = mkOvDott;
            this.drawRect = mkRectDott;
        } else if (x - 1 > 0) {
            this.drawLine = mkLin2D;
            this.mkOv = mkOv2D;
            this.drawRect = mkRect;
        } else {
            this.drawLine = mkLin;
            this.mkOv = mkOv;
            this.drawRect = mkRect;
        }
    };


    this.setPrintable = function(arg) {
        this.printable = arg;
        if (jg_fast) {
            this.mkDiv = mkDivIe;
            this.htmRpc = arg ? htmPrtRpc : htmRpc;
        } else this.mkDiv = jg_n4 ? mkLyr : arg ? mkDivPrt : mkDiv;
    };


    this.setFont = function(fam, sz, sty) {
        this.ftFam = fam;
        this.ftSz = sz;
        this.ftSty = sty || Font.PLAIN;
    };


    this.drawPolyline = this.drawPolyLine = function(x, y, s) {
        for (var i = 0; i < x.length - 1; i++)
            this.drawLine(x[i], y[i], x[i + 1], y[i + 1]);
    };


    this.fillRect = function(x, y, w, h) {
        this.mkDiv(x, y, w, h);
    };


    this.drawPolygon = function(x, y) {
        this.drawPolyline(x, y);
        this.drawLine(x[x.length - 1], y[x.length - 1], x[0], y[0]);
    };


    this.drawEllipse = this.drawOval = function(x, y, w, h) {
        this.mkOv(x, y, w, h);
    };


    this.fillEllipse = this.fillOval = function(left, top, w, h) {
        var a = (w -= 1) >> 1,
            b = (h -= 1) >> 1,
            wod = (w & 1) + 1,
            hod = (h & 1) + 1,
            cx = left + a,
            cy = top + b,
            x = 0,
            y = b,
            ox = 0,
            oy = b,
            aa2 = (a * a) << 1,
            aa4 = aa2 << 1,
            bb = (b * b) << 1,
            st = (aa2 >> 1) * (1 - (b << 1)) + bb,
            tt = (bb >> 1) - aa2 * ((b << 1) - 1),
            pxl, dw, dh;
        if (w + 1)
            while (y > 0) {
                if (st < 0) {
                    st += bb * ((x << 1) + 3);
                    tt += (bb << 1) * (++x);
                } else if (tt < 0) {
                    st += bb * ((x << 1) + 3) - aa4 * (y - 1);
                    pxl = cx - x;
                    dw = (x << 1) + wod;
                    tt += (bb << 1) * (++x) - aa2 * (((y--) << 1) - 3);
                    dh = oy - y;
                    this.mkDiv(pxl, cy - oy, dw, dh);
                    this.mkDiv(pxl, cy + y + hod, dw, dh);
                    ox = x;
                    oy = y;
                } else {
                    tt -= aa2 * ((y << 1) - 3);
                    st -= aa4 * (--y);
                }
            }
        this.mkDiv(cx - a, cy - oy, w + 1, (oy << 1) + hod);
    };


    this.fillPolygon = function(array_x, array_y) {
        var i;
        var y;
        var miny, maxy;
        var x1, y1;
        var x2, y2;
        var ind1, ind2;
        var ints;

        var n = array_x.length;

        if (!n) return;


        miny = array_y[0];
        maxy = array_y[0];
        for (i = 1; i < n; i++) {
            if (array_y[i] < miny)
                miny = array_y[i];

            if (array_y[i] > maxy)
                maxy = array_y[i];
        }
        for (y = miny; y <= maxy; y++) {
            var polyInts = new Array();
            ints = 0;
            for (i = 0; i < n; i++) {
                if (!i) {
                    ind1 = n - 1;
                    ind2 = 0;
                } else {
                    ind1 = i - 1;
                    ind2 = i;
                }
                y1 = array_y[ind1];
                y2 = array_y[ind2];
                if (y1 < y2) {
                    x1 = array_x[ind1];
                    x2 = array_x[ind2];
                } else if (y1 > y2) {
                    y2 = array_y[ind1];
                    y1 = array_y[ind2];
                    x2 = array_x[ind1];
                    x1 = array_x[ind2];
                } else continue;

                // modified 11. 2. 2004 Walter Zorn
                if ((y >= y1) && (y < y2))
                    polyInts[ints++] = Math.round((y - y1) * (x2 - x1) / (y2 - y1) + x1);

                else if ((y == maxy) && (y > y1) && (y <= y2))
                    polyInts[ints++] = Math.round((y - y1) * (x2 - x1) / (y2 - y1) + x1);
            }
            polyInts.sort(integer_compare);
            for (i = 0; i < ints; i += 2)
                this.mkDiv(polyInts[i], y, polyInts[i + 1] - polyInts[i] + 1, 1);
        }
    };


    this.drawString = function(txt, x, y) {
        this.htm += '<div style="position:absolute;white-space:nowrap;' +
            'left:' + x + 'px;' +
            'top:' + y + 'px;' +
            'font-family:' + this.ftFam + ';' +
            'font-size:' + this.ftSz + ';' +
            'color:' + this.color + ';' + this.ftSty + '">' +
            txt +
            '<\/div>';
    };


    this.drawStringRect = function(txt, x, y, width, halign) {
        this.htm += '<div style="position:absolute;overflow:hidden;' +
            'left:' + x + 'px;' +
            'top:' + y + 'px;' +
            'width:' + width + 'px;' +
            'text-align:' + halign + ';' +
            'font-family:' + this.ftFam + ';' +
            'font-size:' + this.ftSz + ';' +
            'color:' + this.color + ';' + this.ftSty + '">' +
            txt +
            '<\/div>';
    };

    this.clear = function() {
        this.htm = "";
        if (this.cnv) this.cnv.innerHTML = this.defhtm;
    };


    this.mkOvQds = function(cx, cy, xl, xr, yt, yb, w, h) {
        this.mkDiv(xr + cx, yt + cy, w, h);
        this.mkDiv(xr + cx, yb + cy, w, h);
        this.mkDiv(xl + cx, yb + cy, w, h);
        this.mkDiv(xl + cx, yt + cy, w, h);
    };

    this.setStroke(1);
    this.setFont('verdana,geneva,helvetica,sans-serif', String.fromCharCode(0x31, 0x32, 0x70, 0x78), Font.PLAIN);
    this.color = '#000000';
    this.htm = '';
    this.wnd = wnd || window;

    if (!(jg_ie || jg_dom || jg_ihtm)) chkDHTM();
    if (typeof id != 'string' || !id) this.paint = pntDoc;
    else {
        this.cnv = document.all ? (this.wnd.document.all[id] || null) :
            document.getElementById ? (this.wnd.document.getElementById(id) || null) :
            null;
        this.defhtm = (this.cnv && this.cnv.innerHTML) ? this.cnv.innerHTML : '';
        this.paint = jg_dom ? pntCnvDom : jg_ie ? pntCnvIe : jg_ihtm ? pntCnvIhtm : pntCnv;
    }

    this.setPrintable(false);
}

// C#

function interr236() { if (TIMSK != 0) { if (TCNT0 == OCR0) { TCNT0 = 0;
            FLGTCNTO = true; } else { TCNT0++; } } setTimeout('interr236()', 10); }

function comjc(initialtxt) {
    var i, text, str, ind, ind2, i286, i287;
    FlWIF286 = false;
    CS286 = 2;

    function doff(offs) { if (str.indexOf(offs) > -1) str = ''; }

    function doff2(offs, L) { ind = str.indexOf(offs); if (ind > -1) str = str.substr(ind + L, str.length); }

    function doch(offs, L, news) {
        ind = 0;
        while (ind > -1) {
            ind = str.indexOf(offs);
            if (ind > -1) str = str.substr(0, ind) + news + str.substr(ind + L, str.length);
        }
    }

    function chg(smp, wht, ads) {
        var ind = str.indexOf(smp);
        if (ind > -1)
            if (!ads) ind = str.indexOf("=");
        if (ind > -1) {
            var str2 = str.substr(ind, str.length);
            str = str.substr(0, ind);
            var str3 = ';';
            ind = str2.indexOf(';');
            if (ind > -1) { str3 = str2.substr(ind + 1, str2.length);
                str2 = str2.substr(0, ind); }
            str = str + str2 + '; ';
            if (ads) { str = str + wht + str3;
                CS286++; } else { str = str + smp + '286=true;' + wht + str3; };
        }
    }

    function whiff(sz, i28) {
        str = str.substr(0, ind) + 'restart(TimShwMK); break; case ' + CS286 + ': if' + str.substr(ind + sz, str.length) + '}else{calculationT=' + i28 + '; restart(TimShwMK); break; }';
        CS286++;
    }

    function whiff2(i28) {
        CS286++;
        str = 'calculationT=' + i28 + ';' + 'restart(TimShwMK); break; case ' + CS286 + ':';
        CS286++;
    }

    var imF = "http://mathscinet.ru/images/";
    if (initialtxt.indexOf('orangutan.h') > -1) {
        var A286 = "plotCanvas.drawImage('" + imF + "pololu.gif',105,25);";
        var B286 = "plotCanvas.drawImage('" + imF + "ledg.gif',264,125);";
        var C286 = "plotCanvas.drawImage('" + imF + "ledr.gif',265,160);";
    } else {
        var A286 = "plotCanvas.drawImage('" + imF + "atmega8.jpg',110,40);";
        var B286 = "plotCanvas.drawImage('" + imF + "dotg.gif',130,130);";
        var C286 = "plotCanvas.drawImage('" + imF + "dotg.gif',155,50);";
    }

    text = '';
    initialtxt = initialtxt.split('\n');
    i286 = 1;
    i287 = 1;
    for (i = 0; i < initialtxt.length; i++) {
        str = initialtxt[i];
        ind = str.indexOf('#define ');
        if (ind > -1) {
            str = '';
            //str=str.substr(ind+8,str.length); ind=str.indexOf('000UL'); if (ind>-1) str=str.substr(0,ind+2); 
            //ind=str.indexOf(' '); if (ind>-1) { str=str.substr(0,ind)+'='+str.substr(ind+1,str.length)+';'; }
        } else {
            doff('#include');
            doch('//function', 10, 'function');
            doch('goto ', 5, 'continue ');
            doch('//variables', 11, 'if(tick==0){');
            doch('//program', 9, '}');
            doff('UBRRL');
            doff('UBRRH');
            doff('UCSRB');
            doff('UCSRC');
            doff('!(UCSRA');
            ind = str.indexOf('//');
            if (ind > -1) {
                ind2 = str.indexOf('/**/');
                if (ind2 < 0) {
                    ind2 = str.indexOf('}//if');
                    if (ind2 < 0) { ind2 = str.indexOf('}//w'); if (ind2 < 0) str = str.substr(0, ind); }
                }
            }
            ind2 = 13;
            ind = str.indexOf(' main(void)');
            if (ind < 0) { ind = str.indexOf(' main()');
                ind2 = 9; }
            if (ind > -1) { FlWIF286 = true;
                str = 'function main() { switch(tick) { case 1: ' + str.substr(ind + ind2, str.length); }
            doch('GIMSK =', 7, 'TIMSK =');
            doch('GIMSK=', 6, 'TIMSK=');
            doch('void', 4, '');
            doch('volatile', 8, ' ');
            doch('int ', 4, ' ');
            doch('char ', 5, ' ');
            doch('long ', 5, ' ');
            doch('short ', 6, ' ');
            doch('uint32_t ', 9, ' ');
            doch('unsigned ', 9, ' ');
            doch('double A[n][n]', 14, 'A=[]; for(var j=0;j<n;j++)A[j]=[]');
            doch('double a[n]', 11, 'a=[]');
            doch('double Q[n][n]', 14, 'Q=[]; for(var j=0;j<n;j++)Q[j]=[]');
            doch('double q[n]', 11, 'q=[]');
            doch('double ', 7, ' ');
            doch('double[] ', 9, ' ');
            doch('double[][] ', 11, ' ');
            ind = str.indexOf('ISR(');
            if (ind > -1) {
                ind = str.indexOf('TIMER0_OVF');
                if (ind > -1) str = 'function  timer0ovr() {';
                ind = str.indexOf('SIG_INTERRUPT');
                if (ind > -1) str = 'function  timer0ovr() {';
            }
            if (FlWIF286) {
                ind = str.indexOf('/**/');
                if (ind < 0) {
                    ind = str.indexOf('while(');
                    if (ind < 0) ind = str.indexOf('while (');
                    if (ind > -1) { ind2 = -str.indexOf('{'); if (ind2 < 0) { i286 = CS286 - 1;
                            i287 = i286 + 1000;
                            whiff(5, i287); } } else {
                        ind = str.indexOf('if(');
                        if (ind < 0) ind = str.indexOf('if (');
                        if (ind > -1) { ind2 = -str.indexOf('{'); if (ind2 < 0) { i288 = CS286 - 1;
                                i289 = i288 + 100;
                                whiff(2, i289); } } else {
                            ind = str.indexOf('}//w');
                            if (ind > -1) { CS286 = i287;
                                whiff2(i286); } else {
                                ind = str.indexOf('}//if');
                                if (ind > -1) { CS286 = i289;
                                    whiff2(i289); }
                            }
                        }
                    }
                }
                chg('PORTA', 'alerts();', false);
                chg('PORTB', 'alerts();', false);
                chg('PORTC', 'alerts();', false);
                chg('PORTD', 'alerts();', false);
                chg('delay_ms(', 'break; case ' + CS286 + ': ', true);
            } else { doff('delay_ms('); };
            doff('delay_us(');
            doch('UDR;', 4, 'UDRD[UDRi]; UDRp +=UDRD[UDRi]; mainFORM.out.value=UDRp;  UDRi++; if(UDRi>3) UDRi=0;');
            //doff2('UDR =',5); if (ind>-1) { str='UDRp +='+str+'mainFORM.out.value=UDRp;'; }
        }
        text = text + str;
    }

    // mainFORM.out.value=text;  
    var text2 = "if(tick==0) { OpenCanvas('plotCanvas',canvasW,canvasH); plotCanvas.clear();" + A286;
    text2 += "F_CPU=8000000; MODE_10_BIT=10; MODE_8_BIT=8; TRIMPOT=6; FlgRED=0; FlgGREEN=0; TimShwMK=50; FlgShwMK=true;";
    text2 += "UDRD=['D','E','M','O']; UDR=''; UDRi=0; UDRp=''; FLGTCNTO=false; TCNT0=0; CS00=0; CS01=1; CS02=2; OCR0=255; TCCR0=0; TIMSK=0;";
    text2 += "OCIE0=1; TOIE0=0; UCSRA=1; RXC=0; UDRE=0; GIMSK=0; INT0=0; MCUCR=0; ISC00=0; ISC01=1;";
    text2 += "PIND=0; PIND0=0; PIND1=1; PIND2=2; PIND3=3; PIND4=4; PIND5=5; PIND6=6; PIND7=7; PINC=0; PINC0=0; PINC1=1; PINC2=2; PINC3=3; PINC4=4; PINC5=5; PINC6=6; PINC7=7;";
    text2 += "PD0=0; PD1=1; PD2=2; PD3=3; PD4=4; PD5=5; PD6=6; PD7=7;  PC0=0; PC1=1; PC2=2; PC3=3; PC4=4; PC5=5; PC6=6; PC7=7;  PB0=0; PB1=1; PB2=2; PB3=3; PB4=4; PB5=5; PB6=6; PB7=7;";
    text2 += "DDRA=0; DDRB=0; DDRC=0;  DDRD=0; PORTA=0; PORTB=0; PORTC=0; PORTD=0;  PORTA286=false; PORTB286=false; PORTC286=false; PORTD286=false;";
    text2 += "restart(0);}else{  if(FLGTCNTO) timer0ovr(); FLGTCNTO=false; ";
    text2 += "function clear() { showMK(0); } function showMK(PD){ TimShwMK=Math.abs(PD); FlgShwMK=(PD>0);}";
    text2 += "function alertss(F,F2) { if(FlgShwMK) { plotCanvas.clear(); if(F==1){if(F2==1){ " + A286 + C286 + B286 + " }else{ " + A286 + C286 + " }}else{if (F2==1){ " + A286 + B286 + " }else{ " + A286 + " }} plotCanvas.paint();}};";
    text2 += "function alerts() { var F=getflag(PORTC,PC5); var F2=getflag(PORTD,PD0); alertss(F,F2);";
    text2 += "if(PORTA286) mainFORM.out.value+='PORTA='+PORTA+' '; if(PORTB286) mainFORM.out.value+='PORTB='+PORTB+' ';}";
    text2 += "if(PORTC286) mainFORM.out.value+='PORTC='+PORTC+' ';} if(PORTD286) mainFORM.out.value+='PORTD='+PORTD+' ';";
    text2 += "function Button(PD) { return Math.round(Math.random())*_BV(PD); } function _BV(PD) { return Math.pow(2,PD); }";
    text2 += "function getflag(PORT,PD) {  var P=PORT; var D=128; var i=8;  while(i>PD) { var P2=Math.floor(P/D); P=P-P2*D; var F=(P2==1); i--; D=D/2; } return F; }";
    text2 += "function _delay_ms(msecs){ restart(msecs); } function delay_ms(msecs){restart(msecs);}";
    text2 += "function red_led(C) { FlgRED=C; alertss(FlgRED,FlgGREEN);} function green_led(C) { FlgGREEN=C; alertss(FlgRED,FlgGREEN);}";
    text2 += "function sei() {TIMSK=1; if(TCNT0==0) interr236();}; main();";
    text = text2 + text + '}';
    // mainFORM.out.value=text;  
    return text;
}
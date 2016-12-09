'use strict';

let fs = require('fs');
let os = require('os');
let gulp = require('gulp');
let eslint = require('gulp-eslint');
let gulpopen = require('gulp-open');
let open = require('gulp-open');
let results = [];

gulp.task('lint', () => {
    let src = './src/*.js'; // 검사 파일
    let rules = { // eslint 규칙
        'camelcase': 1,
        'comma-dangle': 1,
        'quotes': [1, 'single'],
        'semi': 2,
        'indent': [1, 4],
        'brace-style': 1
    };

    let parserOptions = {
        'ecmaVersion': 6
    };

    return gulp.src(src)
        .pipe(eslint({ rules, parserOptions }))
        .pipe(eslint.format())
        .pipe(eslint.result((r) => {
            results.push(r);
        }));
});

gulp.task('default', ['lint'], () => {
    writeLog();
    generateHtml();
});


let writeLog = () => {
    let r = results;
    let log = '';
    let logText = '';
    let totalProblemCount = 0;
    let totalWarningCount = 0;
    let totalErrorCount = 0;


    for(let i=0; i<r.length; i++) {
        let filePath = r[i].filePath;
        let warningCount = r[i].warningCount;
        let errorCount = r[i].errorCount;
        let messages = r[i].messages;

        totalProblemCount += warningCount + errorCount;
        totalWarningCount += warningCount;
        totalErrorCount   += errorCount;

        logText += i > 0 ? '\n\n\n' : '';
        logText +=  filePath + '\n\n';
        logText += '* Warnig Count : ' + warningCount + '\n';
        logText += '* Error Count : ' + errorCount + '\n\n';

        for(let j=0; j<messages.length; j++) {
            let msg = messages[j];
            logText += (i+1) + '-' + (j+1) + '. ';
            logText += msg.severity === 1 ? 'warning' : 'error';
            logText += ' ' + msg.line + ':' + msg.column + ' ==> ' + msg.message + '\n';
        }
    }

    log += '*** ' + totalProblemCount + ' problem';
    log += totalProblemCount > 1 ? 's' : '';
    log += ' (' + totalErrorCount + ' error';
    log += totalErrorCount > 1 ? 's' : '';
    log += ', ' + totalWarningCount + ' warning';
    log += totalWarningCount > 1 ? 's' : '';
    log += ') ***\n\n\n';
    log += logText;

    let date = new Date();
    let yyyy = date.getFullYear().toString();
    let MM = _addZero((date.getMonth()+1).toString());
    let dd = _addZero(date.getDate().toString());
    let hh = _addZero(date.getHours().toString());
    let mm = _addZero(date.getMinutes().toString());
    let ss = _addZero(date.getSeconds().toString());
    let SSS = date.getMilliseconds().toString();

    let fileName = 'log_' + yyyy + MM + dd + "_" + hh + mm + ss + "_" + SSS + ".log";

    fs.writeFileSync("./logs/" + fileName, log , 'utf-8');
};

let generateHtml = () => {
    let r = results;
    let log = '';
    let logText = '';
    let totalProblemCount = 0;
    let totalWarningCount = 0;
    let totalErrorCount = 0;


    log += '<link rel="stylesheet" href="./index.css"/>';

    for(let i=0; i<r.length; i++) {
        let filePath = r[i].filePath;
        let warningCount    = r[i].warningCount;
        let errorCount = r[i].errorCount;
        let messages = r[i].messages;

        totalProblemCount += warningCount + errorCount;
        totalWarningCount += warningCount;
        totalErrorCount   += errorCount;

        logText += i > 0 ? '<br><br><br>' : '';
        logText += '<h3>' + filePath + '</h3>';
        logText += '<h4 class="problem">* Warnig Count : ' + warningCount + '</h4>';
        logText += '<h4 class="problem">* Error Count : ' + errorCount + '</h4><br>';

        for(let j=0; j<messages.length; j++) {
            let msg = messages[j];

            if(msg.severity === 1) {
                logText += '<h5 class="warning">'
            } else {
                logText += '<h5 class="error">'
            }
            logText += (i+1) + '-' + (j+1) + '. ';
            logText += msg.severity === 1 ? 'warning' : 'error';
            logText += ' ' + msg.line + ':' + msg.column + ' ==> ' + msg.message;
            logText += '</h5>';
        }
    }

    let date = new Date();
    let yyyy = date.getFullYear().toString();
    let MM = _addZero((date.getMonth()+1).toString());
    let dd = _addZero(date.getDate().toString());
    let hh = _addZero(date.getHours().toString());
    let mm = _addZero(date.getMinutes().toString());
    let ss = _addZero(date.getSeconds().toString());
    let SSS = date.getMilliseconds().toString();

    log += logText;

    let file = 'log_' + yyyy + MM + dd + "_" + hh + mm + ss + "_" + SSS + ".html";

    fs.writeFileSync("./htdocs/" + file, log , 'utf-8');

    gulp.src(__filename)
        .pipe(open({
        uri: './htdocs/' + file,
        app: 'google chrome'
    }));
};

let _addZero = i => {
    if(Number(i) < 10) {
        i = "0" + i;
    }
    return i;
}

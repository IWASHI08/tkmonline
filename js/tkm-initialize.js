﻿var Tkm = function () { };

Tkm.Audio = function () { };
Tkm.Audio.WEB_AUDIO_API = 0;
Tkm.Audio.CREATE_JS = 1;
Tkm.Sound = function () { };
Tkm.Sound.BELL = 0;
Tkm.Sound.BUILD = 1;
Tkm.Sound.CHAT = 2;
Tkm.Sound.DICE = 3;
Tkm.Sound.ENDING = 4;
Tkm.Sound.GET = 5;
Tkm.Sound.JOIN = 6;
Tkm.Sound.OPENING = 7;
Tkm.Sound.PASS = 8;
Tkm.Sound.ROBBER = 9;

Tkm.view = null;
Tkm.wsurl = 'ws://210.152.156.23:7911';
Tkm.ws = null;
Tkm.roomIndex = null;
Tkm.userList = [];
Tkm.audio = null;
Tkm.soundUrlList = [
      '../mp3/bell.mp3'
    , '../mp3/build.mp3'
    , '../mp3/chat.mp3'
    , '../mp3/dice.mp3'
    , '../mp3/ending.mp3'
    , '../mp3/get.mp3'
    , '../mp3/join.mp3'
    , '../mp3/opening.mp3'
    , '../mp3/pass.mp3'
    , '../mp3/robber.mp3'
];
Tkm.webAudioContext = null;
Tkm.soundList = [];
Tkm.volume = 0.05;
Tkm.isMuteSE = false;
Tkm.isMuteBell = false;

Tkm._sound = function (type) {
    try {
        if (Tkm.audio === Tkm.Audio.WEB_AUDIO_API) {
            setTimeout((function () {
                return function() {
                    var gainNode = Tkm.webAudioContext.createGain();
                    var source = Tkm.webAudioContext.createBufferSource();

                    source.buffer = Tkm.soundList[type];
                    source.connect(gainNode);
                    gainNode.connect(Tkm.webAudioContext.destination);
                    gainNode.gain.value = Tkm.volume;

                    source.start();
                };
            })(), 0);
        } else {
            var instance = createjs.Sound.createInstance(type);

            instance.setVolume(Tkm.volume);
            instance.play();
        }
    } catch (e) { }
}

Tkm.sound = function (type) {
    if(!Tkm.isMuteSE) { Tkm._sound(type); }
}

Tkm.send = function (message) {
    this.ws.send(String.fromCharCode(Tkm.roomIndex) + message);
}

Tkm.splitSyntaxType1 = function(source) {
    return source.substring(1);
}

Tkm.splitSyntaxType2 = function(source) {
    var result = /^([^ ]*) ([^ ]*) ?(.*)$/.exec(source.substring(1));
    result.shift();
    return result;
}

Tkm.splitSyntaxType3 = function (source) {
    return source.substring(1).split(' ');
}

Tkm.updateUserList = function () {
    var html = '';

    var i;
    var len1 = this.userList.length;
    for (i = 0; i < len1; i++) {
        var token = this.userList[i].split('%');

        html += '<div class="user">';

        if (token[0] === this.view.cid) {
            html += '<span class="owner-icon"></span>';
        } else {
            html += '<span class="common-icon"></span>';
        }

        if (token[0] === this.view.uid) {
            html += '<span class="my-icon"></span>';
        } else {
            html += '<span class="user-icon"></span>';
        }

        html += '<span class="uid">' + token[0] + '</span>';

        if (token.length > 1) {
            html += '◆<span class="trip">' + token[1] + '</span>';
        }

        html += '</div>'
    }

    if (Tkm.view.uid === null) {
        document.getElementById('login-user-list').innerHTML = html;
    } else {
        document.getElementById('play-user-list').innerHTML = html;
    }
}
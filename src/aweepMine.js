var sweepMine = {
    dif: 1,
    num: 10,
    len: 10,
    wid: 10,
    mine: [],
    clicked: [],
    isSetTime: false,
    isRender: false,
    init: function () {
        this.creatDom();
        this.setMine();
        if(!this.isRender){
            this.isRender = true;
            this.renderDom();
        }
        $('.wrapper').bind('contextmenu', function (e) {
            return false;
        });
    },
    setMine: function () {
        for (var i = 0; i < this.len; i++) { //初始化雷区数组
            this.mine[i] = [];
            this.clicked[i] = [];
        }
        for (var i = 0; i < this.num; i++) { //布雷
            var x = 0 | Math.random() * this.len;
            var y = 0 | Math.random() * this.wid;
            if (this.mine[x][y] != -1) {
                this.mine[x][y] = -1;
                this.clicked[x][y] = true;
            } else {
                i--;
            }
        }
        for (i = 0; i < this.len; i++) { //雷区信息计算
            for (var j = 0; j < this.wid; j++) {
                if (this.mine[i][j] != -1) {
                    this.mine[i][j] = 0;
                    this.clicked[i][j] = true;
                    this.setInfo(i, j);
                }
            }
        }
    },
    creatDom: function () {
        $('.wrapper ul').html('');
        for (var i = 0; i < this.len * this.wid; i++) {
            $('.wrapper ul').append('<li> </li>');
        }
    },
    setInfo: function (x, y) {
        sweepMine.remainder = sweepMine.len * sweepMine.wid;
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                var k = x + i - 1;
                var l = y + j - 1;
                if (k >= 0 && k < this.len && l >= 0 && l < this.wid && this.mine[k][l] == -1) {
                    this.mine[x][y]++;
                }
            }
        }
    },
    renderDom: function () {
        var _this = this;
        $('.wrapper ul').on('click', 'li', function (e) { //点击挖雷
            var n = $(e.target).index();
            var x = 0 | n / _this.wid;
            var y = 0 | n % _this.wid;
            if(!sweepMine.isSetTime){
                 sweepMine.startTime = new Date();
                 sweepMine.isSetTime = setInterval(function(){
                    $('.info .time span').html(0 | (new Date() - sweepMine.startTime) / 1000);
                 } , 200);

            }
           
            if (_this.clicked[x][y]) {
                _this.isMine(_this.mine[x][y], x, y, true);
                _this.isSucceed();
            }
        });
        $('.wrapper ul').on('mousedown', 'li', function (e) {//右击标记
            if (e.button == 2) {
                $(this).one('mouseup', function (e) {
                    var n = $(this).index();
                    var x = 0 | n / _this.wid;
                    var y = 0 | n % _this.wid;
                    if (sweepMine.clicked[x][y] && e.button == 2) {
                        $(this).toggleClass('warn');
                        $('.info .warn-info span').html('× ' + (sweepMine.num - $('.warn').length) );
                    }
                })
            }
        })
    },
    searchAround: function (x, y, cb) {
        var rx, ry;
        for (rx = x - 1; rx <= x + 1; rx++) {
            for (ry = y - 1; ry <= y + 1; ry++) {
                if (rx >= 0 && rx < sweepMine.len && ry >= 0 && ry < sweepMine.wid) {
                    cb(sweepMine.mine[rx][ry], rx, ry, false);
                }
            }
        }

    },
    isMine: function (m, x, y, f) {
        if (m != -1) { //不是雷
            if (m == 0 && sweepMine.clicked[x][y]) { //周围无雷且未搜索过搜索周围
                sweepMine.clicked[x][y] = false;
                $('.wrapper ul li').eq(x * sweepMine.wid + y).css('background-image', 'url(./src/img/5.png)');
                sweepMine.remainder--;
                sweepMine.searchAround(x, y, sweepMine.isMine);
            }

            if (m > 0 && sweepMine.clicked[x][y]) { //周围有雷且未搜索过则标记雷数
                $('.wrapper ul li').eq(x * sweepMine.wid + y).css('background-image', 'url(./src/img/5.png)').html(sweepMine.mine[x][y]);
                sweepMine.remainder--;
                sweepMine.clicked[x][y] = false;
            }
        } else if (f) { //主动点击雷显示全部雷游戏结束（f==true为点击false为被动搜索）
            sweepMine.fail();
        }
    },
    fail: function () { //游戏失败显示所有雷
        for (var i = 0; i < sweepMine.len; i++) {
            for (var j = 0; j < sweepMine.wid; j++) {
                if (sweepMine.mine[i][j] == -1) {
                    $('.wrapper ul li').eq(i * sweepMine.wid + j).css('background-color', 'red').removeClass('wran').addClass('boom');

                }
            }

        }
        sweepMine.end('f');
    },
    isSucceed: function () {
        if (sweepMine.remainder == sweepMine.num) {
            sweepMine.end('s');
        }
    },
    end: function(str){
        $('.end').addClass('active');
        var $end = $('.end .end-wrapper');
        if(str == 's'){
            $end.find('h1').html('胜 利');
        }else if(str == 'f'){
            $end.find('h1').html('Game Over!!!');
        }
        clearInterval(sweepMine.isSetTime);
        sweepMine.isSetTime = false;
        $end.find('.end-time').html('用时' +  $('.info .time span').html() + 's');
        $end.find('.sure').one('click' , function(){
            $('.start').removeClass('start');
            $('.active').removeClass('active');
            $('.info .time span').html(0);
        })
    }
}

$('.control .play').on('click', function () {
    $('.wrapper').addClass('start'); 
    $('.control').addClass('start')
    sweepMine.init();
})
$('.control .grade').on('click', function () {
    $('.control .gra-ul').addClass('set').one('click', 'li', function (e) {
        switch ($(this).index()) {
            case 0:
                sweepMine.len = 10;
                sweepMine.wid = 10;
                sweepMine.num = 10;
                $('.wrapper').removeClass('shen fan').addClass('chu');
                $('.set').removeClass('set');
                break;
            case 1:
                sweepMine.len = 15;
                sweepMine.wid = 17;
                sweepMine.num = 39;
                $('.wrapper').removeClass('chu fan').addClass('shen');
                $('.set').removeClass('set');
                break;
            case 2:
                sweepMine.len = 16;
                sweepMine.wid = 20;
                sweepMine.num = 64;
                $('.wrapper').removeClass('shen chu').addClass('fan');
                $('.set').removeClass('set');
                break;
        }
    });
})
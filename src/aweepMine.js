var sweepMine = {
    dif : 1,
    num : 10,
    len : 10,
    wid : 10,
    mine : [],
    clicked : [],
    init : function (){
        this.creatDom();
        this.setMine();
        this.renderDom();
        $('.wrapper').bind('contextmenu' , function(e){
            return false;
        });
    },
    setMine : function(){
        for(var i = 0 ; i < this.len ; i++){//初始化雷区数组
            this.mine[i] = [];
            this.clicked[i] = [];
        }
        for(var i = 0 ; i < this.num ; i++){//布雷
            var x = 0 | Math.random() * this.len;
            var y = 0 | Math.random() * this.wid;
            if(this.mine[x][y] != -1){
                this.mine[ x ][ y ] = -1;
                this.clicked[ x ][ y ] = true;
            }else{
                i--;
            }  
        }
        for ( i = 0 ; i < this.len ; i++) {//雷区信息计算
            for(var j = 0 ; j < this.wid ; j++){
                if(this.mine[i][j] != -1){
                    this.mine[i][j] = 0;
                    this.clicked[ i ][ j ] = true;
                    this.setInfo(i , j);
                }
            } 
        }
    },
    creatDom : function(){
        for(var i = 0; i < this.len * this.wid; i++){
            $('.wrapper ul').append('<li> </li>');
        } 
    },
    setInfo : function(x , y){
        sweepMine.remainder = sweepMine.len * sweepMine.wid;
        for(var i = 0 ; i < 3 ; i++){
            for(var j = 0 ; j < 3 ; j++){
                var k = x + i - 1;
                var l = y + j - 1;
                if (k >= 0 && k < this.len && l >= 0 && l < this.wid && this.mine[k][l] == -1) {
                    this.mine[x][y]++;
                }
            }
        }   
    },
    renderDom : function(){
        var _this = this;
        $('.wrapper ul').on('click' , 'li' , function (e){//点击挖雷
            var n = $(e.target).index();
            var x = 0 | n / _this.wid;
            var y = 0 | n % _this.wid;
            if(_this.clicked[x][y]){
                _this.isMine(_this.mine[x][y] , x , y , true);
                _this.isSucceed();
            }   
        });
        $('.wrapper ul').on('mousedown' , 'li' , function (e){
            if(e.button == 2){
                $(this).one('mouseup' , function(e){
                    var n = $(this).index();
                    var x = 0 | n / _this.wid;
                    var y = 0 | n % _this.wid;
                    if(sweepMine.clicked[x][y]){
                        $(this).toggleClass('warn');
                    }
                })
            }
        })
    },
    searchAround : function(x , y , cb){//////////可用双层循环i！=j////////////
        var rx = x;
        var ry = y - 1;//左
        if(rx >= 0 && rx < sweepMine.len && ry >= 0 && ry < sweepMine.wid){
            cb(sweepMine.mine[rx][ry] , rx , ry , false);
        }
        ry += 2;//右
        if(rx >= 0 && rx < sweepMine.len && ry >= 0 && ry < sweepMine.wid){
            cb(sweepMine.mine[rx][ry] , rx , ry , false);
        }
        ry -= 1;
        rx -= 1;//上
        if(rx >= 0 && rx < sweepMine.len && ry >= 0 && ry < sweepMine.wid){
            cb(sweepMine.mine[rx][ry] , rx , ry , false);
        }
        rx += 2;//下
        if(rx >= 0 && rx < sweepMine.len && ry >= 0 && ry < sweepMine.wid){
            cb(sweepMine.mine[rx][ry] , rx , ry , false);
        }
    },
    isMine : function(m , x , y , f){
        if(m != -1){//不是雷
            if(m == 0 && sweepMine.clicked[x][y]){//周围无雷且未搜索过搜索周围
                sweepMine.clicked[x][y] = false;
                $('.wrapper ul li').eq(x * sweepMine.wid + y).css('background-color' , '#ccc');
                sweepMine.remainder--;
                sweepMine.searchAround(x , y , sweepMine.isMine);
            }

            if(m > 0 && sweepMine.clicked[x][y]){//周围有雷且未搜索过则标记雷数
                $('.wrapper ul li').eq(x * sweepMine.wid + y).css('background-color' , '#ccc').html( sweepMine.mine[x][y]);
                sweepMine.remainder--;
                sweepMine.clicked[x][y] = false;
            }   
        }else if(f){//主动点击雷显示全部雷游戏结束（f==true为点击false为被动搜索）
            sweepMine.fail();
        }
    },
    fail : function(){//游戏失败显示所有雷
        for ( var i = 0 ; i <  sweepMine.len ; i++) {
            for(var j = 0 ; j <  sweepMine.wid ; j++){
                if( sweepMine.mine[i][j] == -1){
                   $('.wrapper ul li').eq(i * sweepMine.wid + j).css('background-color' , 'red').removeClass('wran').addClass('boom');
                   
                }
            }
            
        }
    },
    isSucceed : function(){
        if (sweepMine.remainder == sweepMine.num) {
            alert('游戏胜利');
        }
    }
}
sweepMine.init();

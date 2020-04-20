let per = 0;
let timer;
timer = setInterval(function(){
    $('.bar').css('width',per + '%');
    per += 1;
    if(per > 100){
        $('.pageLoading').addClass('complete');
        clearInterval(timer);
    }
},30);
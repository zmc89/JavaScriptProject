//点击开始函数
let go = document.getElementById("go");
let main = document.getElementById("main");
let speed = 5, num = 0, timer, flag = true;
function clickStart(){
    go.addEventListener("click",function(){
        go.style.display = "none";
        move();
    });
}
clickStart();

//运动函数
function move(){
    timer = setInterval(function(){
       let step = parseInt(main.offsetTop) + speed;
        main.style.top = step + 'px';
        if(parseInt(main.offsetTop) >= 0){
            main.style.top = '-150px';
            cDiv();
        }
        var len = main.childNodes.length;
        if(len  == 6 ){
            for(let i = 0; i < 4; i++){
                if(main.childNodes[len-1].childNodes[i].classList.contains("i")){
                    alert("游戏结束，得分:" + num );
                    clearInterval(timer);
                    flag = false;
                }
            }
            main.removeChild(main.childNodes[len-1]);
        }
    },20);
    bindEvent();
    
}

//创建行和列
function cDiv(){
 let oDiv = document.createElement("div");
 let index = Math.floor(Math.random() * 4);
 oDiv.setAttribute('class','row');
 for (let j = 0; j < 4; j++) {
     let iDiv = document.createElement("div");
     oDiv.appendChild(iDiv);
 } 
 if(main.childNodes.length == 0){
     main.appendChild(oDiv);
 }else{
     main.insertBefore(oDiv,main.childNodes[0]);
 }
        let clickDiv = main.childNodes[0].childNodes[index];
        clickDiv.setAttribute("class","i");
        clickDiv.style.backgroundColor = "black";
}

//点击方块
function bindEvent(){
    main.addEventListener("click", function(e){
        if(flag){
            let tar = e.target;
            if(tar.className == "i"){
                tar.style.backgroundColor = "#ccc";
                tar.classList.remove("i");
                num++;
            }else{
                alert("游戏结束，得分:" + num );
                clearInterval(timer);
                flag = false;
            }
            if(num % 10 == 0){
                speed++;
            }
        }
    })
}
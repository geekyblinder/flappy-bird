 
 //variables

 //the background
 let background,context;
 let backgroundHeight=640;
 let backgroundWidth=360;

 //the bird

 let bird={
    width:34,
    height:24,
    x:backgroundWidth/8,
    y:backgroundHeight/2
 }

//obstruction

let obsArray = [];
let obsWidth = 64; 
let obsHeight = 512;
let obsX = backgroundWidth;
let obsY = 0;

let topObsImg;
let bottomObsImg;

//velocity

let velocityX=-2;
let velocityY=0;
let gravity=0.4;
let isGameOver=false;
let score=0;

    window.onload = ()=>{
            background=document.getElementById('main');
            background.width=backgroundWidth;
            background.height=backgroundHeight;
            context=background.getContext("2d");

            birdImage=new Image();
            birdImage.src="./assests/flappybird.png";
            birdImage.onload =() =>{
                context.drawImage(birdImage,bird.x,bird.y,bird.width,bird.height)
            }
            topObsImg=new Image();
            topObsImg.src="./assests/obs_top.png"

            bottomObsImg=new Image();
            bottomObsImg.src="./assests/obs_bottom.png";
            
            requestAnimationFrame(updateFrame);
            setInterval(getObstructions,1500);
            document.addEventListener('keydown',moveBird);
    }


    function updateFrame(){
        //display frames
            requestAnimationFrame(updateFrame);
            if(isGameOver){
                return;
            }
            context.clearRect(0,0,background.width,background.height);
            velocityY+=gravity;
            bird.y=Math.max(0,bird.y+velocityY);
            context.drawImage(birdImage,bird.x,bird.y,bird.width,bird.height);
            if(bird.y>background.height){
                isGameOver=true;
            }
        //display obstructions
            obsArray.forEach((element) => {
                element.x+=velocityX;
                context.drawImage(element.img,element.x,element.y,element.width,element.height);

                if (!element.isCleared && bird.x > element.x + element.width) {
                    score += 0.5; 
                    element.isCleared = true;
                }

                if(detectCollision(bird,element)){
                    isGameOver=true;
                }
            });
            while (obsArray.length > 0 && obsArray[0].x < -obsWidth) {
                obsArray.shift();
            }
            context.fillStyle = "white";
            context.font="45px sans-serif";
            context.fillText(score, 5, 45);
    }

    function getObstructions(){
        if(isGameOver){
            return;
        }
        let randomPosY=obsY-obsHeight/4-Math.random()*obsHeight/2;
        let escapeSpace=backgroundHeight/4;
            let topObs={
                img:topObsImg,
                x:obsX,
                y:randomPosY,
                width:obsWidth,
                height:obsHeight,
                isCleared:false
            }
            obsArray.push(topObs);
            let bottomObs={
                img:bottomObsImg,
                x:obsX,
                y:randomPosY+obsHeight+escapeSpace,
                width:obsWidth,
                height:obsHeight,
                isCleared:false
            }
            obsArray.push(bottomObs);
    }

    function moveBird(event){
        if(event.code==='Space'|| event.code==='ArrowUp'|| event.code==='KeyX'){
            velocityY=-6;
        }
        if (isGameOver) {
            bird.y = backgroundHeight/2;
            obsArray = [];
            score = 0;
            isGameOver = false;
        }
    }
    

    function detectCollision(a, b) {
        return a.x < b.x + b.width &&  
               a.x + a.width > b.x &&   
               a.y < b.y + b.height &&  
               a.y + a.height > b.y;  
    }
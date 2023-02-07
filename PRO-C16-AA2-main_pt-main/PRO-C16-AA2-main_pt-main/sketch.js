var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;

var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound


function preload(){
  trex_running = loadAnimation("homen1.png","homen2.png","homen3.png","homen4.png", "homen5.png", "homen6.png", "homen7.png", "homen8.png","homen9.png" );
  trex_collided = loadAnimation("homen1.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
   restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkpoint.mp3")
}





function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(50, height - 50, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.1;
  
  ground = createSprite(width/2, height -20, width,125);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
   gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);


 



  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(width/2,height-10,width,125);
  invisibleGround.visible = false;
  
  //criar grupos de obstáculos e nuvens
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  console.log("Olá" +5);
  
  //trex.setCollider("circle",0,0,40);
  //trex.debug = true
  
  score = 0;
  
}



//FUNÇÃO DRAW








function draw() {
  
  background(255);
  //exibir pontuação
  text("Pontuação: "+ score, 500,50);
  
  console.log("isto é ",gameState)
  
  
  if(gameState === PLAY){
    gameOver.visible = false
    restart.visible = false
    //mover o solo
    ground.velocityX = -(4 + score/1000)
    //pontuação
    score = score + Math.round(getFrameRate()/60);
    if (score > 0 && score % 100 === 0 ){
      checkPointSound.play()
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2
    }
    
    //pular quando a tecla de espaço for pressionada
    if(keyDown("space")&& trex.y >= 100) {
        trex.velocityY = -12;
        jumpSound.play()
    }
    
    //adicione gravidade
    trex.velocityY = trex.velocityY + 0.8
  
    //gerar as nuvens
    spawnClouds();
  
    //gerar obstáculos no solo
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        dieSound.play();
    }
  }

   else if (gameState === END) {
     console.log("hey")
      gameOver.visible = true;
      restart.visible = true;
      score = 0;
      trex.changeAnimation("collided",trex_collided);
      ground.velocityX = 0;
      trex.velocityY = 0


      
     
      //mudar a animação do trex
    
     
      //definir a vida útil dos objetos do jogo para que nunca sejam destruídos
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);


    if (mousePressedOver(restart)){
      reset()
    }


   }
 
  
 
  //impedir que o trex caia
  trex.collide(ground);
  
  
  
  drawSprites();
}










function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width-10 ,height-30 ,20 ,300);
   obstacle.velocityX = -(6 + score/500);
   
    //gerar obstáculos aleatórios
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //atribuir escala e vida útil ao obstáculo           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //adicione cada obstáculo ao grupo
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //escreva o código aqui para gerar as nuvens
  if (frameCount % 60 === 0) {
     cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //atribuir tempo de vida à variável
    cloud.lifetime = 134;
    
    //ajustar a profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adicionando nuvem ao grupo
   cloudsGroup.add(cloud);
    }
}







function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  ground.velocityX =  -4;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0;
}
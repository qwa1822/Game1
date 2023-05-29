// 캔버스 세팅
let canvas;
let ctx;

canvas = document.createElement("canvas"); //canvas생성
ctx = canvas.getContext("2d"); //2d를 가지고옴

canvas.width = 500;
canvas.height = 700;

// 배경은 (0,0) 위
// 배경(500,700)  아래

document.body.appendChild(canvas);

let backgroundImage, spaceImage, bulletImage, enemyImage, gameOverImage;

let gameOver = false; //true 게임 End false이면 게임끝남

let score = 0;
// 우주선 x좌표
let spaceshipX = canvas.width / 2 - 32;

//우주선 y 캔버스크기 - 이미지높이크기
let spaceshipY = canvas.height - 64;

/**
//  생성 x,y,init
 * 적군은 위치가 랜덤하다
 * 적군은 1초마다 새로생성
 * 적군은 아래로 떨어짐
 *  적군의 우주선이 바닥에닿으면 게임오버
 * 적군과 총알이 만나면 우주선이 사라진다 점수1점획득
*/

let bulletList = []; //총알들을 저장하는 리스트
let enemyList = [];

function Bullet(x, y) {
  this.x = 0;
  this.y = 0;
  this.alive = true;
  this.init = function () {
    this.x = spaceshipX + 20;
    this.y = spaceshipY;

    bulletList.push(this);
  };

  this.update = function () {
    this.y -= 7;
  };
  this.checkHit = function () {
    for (let i = 0; i < enemyList.length; i++) {
      if (
        this.y <= enemyList[i].y &&
        this.x >= enemyList[i].x &&
        this.x <= enemyList[i].x + 64
      ) {
        score++;
        this.alive = false;
        enemyList.splice(i, 1);
      }
    }
  };
}

function generateRandomValue(min, max) {
  let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;

  return randomNum;
}

function Enemy() {
  this.x = 0;
  this.y = 0;

  this.init = function () {
    this.y = 0; //최상단
    this.x = generateRandomValue(0, canvas.width - 64);

    enemyList.push(this);
  };

  // 적군내려오게 설정
  this.update = function () {
    this.y += 8;

    if (this.y >= canvas.height - 64) {
      //우주선의높이보다 커질라한다

      gameOver = true;
      console.log("gameOver");
    }
  };
}

function createEnemy() {
  // setInterval=호출하고싶은함수, 시간
  const interval = setInterval(function () {
    let e = new Enemy();
    e.init();
  }, 1000);

  return interval;
}

let isboolean = false;
function change() {
  return (isboolean = !isboolean);
}

function loadImage() {
  backgroundImage = document.createElement("img");
  backgroundImage.src = `img/gamebackground.jpg`;

  spaceImage = document.createElement("img");
  spaceImage.src = `img/icons8-space-60.png`;

  enemyImage = document.createElement("img");

  enemyImage.src = change()
    ? `img/icons8-monster3.png`
    : `img/icons8-monster1.png`;

  bulletImage = document.createElement("img");
  bulletImage.src = `img/icons8-총알-24.png`;

  gameOverImage = document.createElement("img");
  gameOverImage.src = `img/gameover.jpg`;
}

let keysDown = {}; //어떤버튼이 눌린지 저장하는 객체

// 객체구성
// 있으면 눌린거
// 없으면 뗀것 우주선이 오른쪽으로 간다: x좌표값이 증가
// 우주선이 왼쪽으로간다 x좌표값이 감소

function setupKeyboardListener() {
  document.addEventListener("keydown", event => {
    //버튼을 눌렀을때
    // event.keycode=왼쪽 37 오른쪽 39 위 38  아래 40
    keysDown[event.keyCode] = true; //있으면 눌린거
  });
  document.addEventListener("keyup", event => {
    //버튼을 똇을때
    delete keysDown[event.keyCode];

    // space=32
    if (event.keyCode === 32) {
      createBullet(); //총알 생성
    }
  });
}

function createBullet() {
  console.log("총알 생성 !");
  let b = new Bullet(); //총알 하나생성

  b.init();

  console.log("새로운 총알리스트", bulletList);
}

function update() {
  if (39 in keysDown) {
    spaceshipX += 5;
  } //right
  if (37 in keysDown) {
    spaceshipX -= 5;
  }
  if (38 in keysDown) {
    spaceshipY -= 5;
  }
  if (40 in keysDown) {
    spaceshipY += 5;
  }

  // 나갈라하면 고정 왼쪽 <<
  if (spaceshipX <= 0) {
    spaceshipX = 0;
  }

  // 나갈라하면 고정 >>
  if (spaceshipX >= canvas.width - 64) {
    spaceshipX = canvas.width - 64;
  }

  // y고정
  if (spaceshipY <= 0) {
    spaceshipY = 0;
  }

  //밑에고정
  if (spaceshipY >= canvas.height - 64) {
    spaceshipY = canvas.height - 64;
  }
  // 우주선의 좌표값이 무한대로 업데이트 가 되는게아닌 ! 경기장 안에서만 있게하려면?

  //총알 y좌표 업데이트하는 호출
  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      bulletList[i].update();
      bulletList[i].checkHit();
    }
  }

  // 적군은 밑으로 내려온다 밑으로증가
  for (let i = 0; i < enemyList.length; i++) {
    enemyList[i].update();
  }
}

// 렌더를 계속불러와줘야함
function render() {
  // 시작지점 종료지점 너비 높이

  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(spaceImage, spaceshipX, spaceshipY);

  // 총알
  for (let i = 0; i < bulletList.length; i++) {
    if (bulletList[i].alive) {
      //살아있는 총알이면 보여줘
      ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
    }
  }

  // 적군
  for (let i = 0; i < enemyList.length; i++) {
    ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
  }
}

// 그래서 main을 생성
function main() {
  if (!gameOver) {
    update(); //좌표값을 업데이트하고
    render(); //계속 그려주고

    requestAnimationFrame(main); //main을 계속불러주고 render보여줌
  } else {
    ctx.drawImage(gameOverImage, 10, 100, 380, 380);
  }
}

loadImage();
setupKeyboardListener();
createEnemy();
main();

// 방향키를 누르면
// 우주선의 xy좌표가 바뀌고
// 다시 render 그려준다

// 총알만들기
// 1.스페이스바를 누르면 총알발사
// 2. 총알이 발사= 총알은 위로올라가야하기떄문에 감소 x=우주선의좌표
// y=감소

//발사된 총알들은 총알 배열에 저장을 한다
// 4.총알들은 x,y좌표값이 있어야한다.
// 5.총알 배열을 가지고 render그려준다.

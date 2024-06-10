document.addEventListener('DOMContentLoaded', () => {
    const blueCharacter = document.querySelector('.blue-character');
    const pinkCharacter = document.querySelector('.pink-character');
    const ball = document.querySelector('.ball');
    const gameArea = document.querySelector('.game-area');
    const gameContainer = document.querySelector('.game-container');
    const scoreElement = document.querySelector('.score');
    const net = document.querySelector('.net');

    let blueX = 50;
    let pinkX = gameContainer.clientWidth - 150;
    let ballX = gameContainer.clientWidth / 2 - 25;
    let ballY = gameArea.clientHeight / 2;
    let ballSpeedX = 3;  // Velocidade consistente
    let ballSpeedY = 3;  // Velocidade consistente
    let blueScore = 0;
    let pinkScore = 0;

    function moveCharacter(character, x) {
        character.style.left = `${x}px`;
    }

    function checkCollision(character) {
        const charRect = character.getBoundingClientRect();
        const ballRect = ball.getBoundingClientRect();
        
        return !(charRect.right < ballRect.left ||
                 charRect.left > ballRect.right ||
                 charRect.bottom < ballRect.top ||
                 charRect.top > ballRect.bottom);
    }

    function checkPoint() {
        const redZoneHeight = 10;
        const redZoneY = gameArea.clientHeight - redZoneHeight;
        
        if (ballY + ball.clientHeight >= redZoneY) {
            if (ballX < gameContainer.clientWidth / 2) {
                pinkScore++;
            } else {
                blueScore++;
            }
            // Ajuste da velocidade
            ballSpeedX += 2;
            ballSpeedY += 2;
            updateScore();
            resetBall();
        }
    }    

    function updateScore() {
        scoreElement.textContent = `${blueScore} - ${pinkScore}`;
    }

    function resetBall() {
        ballX = gameContainer.clientWidth / 2 - 25;
        ballY = gameArea.clientHeight / 2;
        ballSpeedX = 3;
        ballSpeedY = 3;
    }

    function moveBall() {
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        if (ballX <= 0 || ballX + ball.clientWidth >= gameContainer.clientWidth) {
            ballSpeedX *= -1;
        }

        if (ballY <= 0) {
            ballSpeedY *= -1;
        }

        checkPoint();

        if (checkCollision(blueCharacter)) {
            ballSpeedX = Math.abs(ballSpeedX);
            ballSpeedY = -Math.abs(ballSpeedY);
        }

        if (checkCollision(pinkCharacter)) {
            ballSpeedX = -Math.abs(ballSpeedX);
            ballSpeedY = -Math.abs(ballSpeedY);
        }

        // Verificando colisão com a barra preta
        if (checkCollision(net)) {
            // Verificando se a bola está vindo de cima
            if (ballSpeedY > 0) {
                // Invertendo a direção vertical da bola
                ballSpeedY *= -1;
                // Ajustando a posição da bola para que ela não fique presa na barra
                ballY = net.getBoundingClientRect().top - ball.clientHeight;
            }
        }

        ball.style.left = `${ballX}px`;
        ball.style.top = `${ballY}px`;

        requestAnimationFrame(moveBall);
    }

    function movePinkCharacter() {
        const step = 2;
        const pinkCenterX = pinkX + pinkCharacter.clientWidth / 2;

        if (ballX > gameContainer.clientWidth / 2) {
            if (pinkCenterX < ballX) {
                pinkX += step;
            } else if (pinkCenterX > ballX) {
                pinkX -= step;
            }
            moveCharacter(pinkCharacter, pinkX);
        }

        requestAnimationFrame(movePinkCharacter);
    }

    document.addEventListener('keydown', (e) => {
        const step = 30;
        if (e.key === 'ArrowLeft' && blueX > 0) {
            blueX -= step;
            moveCharacter(blueCharacter, blueX);
        } else if (e.key === 'ArrowRight' && blueX < gameContainer.clientWidth / 2 - blueCharacter.clientWidth) {
            blueX += step;
            moveCharacter(blueCharacter, blueX);
        }
    });


    moveCharacter(blueCharacter, blueX);
    moveCharacter(pinkCharacter, pinkX);
    moveBall();
    movePinkCharacter();
});

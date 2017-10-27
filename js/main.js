;(function() {

    var CANVAS_WIDTH = 48;
    var CANVAS_HEIGHT = 28;
    var BULLET_SPEED = 3;
    var MAX_ENEMIES = 8;
    var MAX_BULLETS = 1;
    var KEY_LEFT = 37;
    var KEY_RIGHT = 39;
    var KEY_UP = 38;
    var KEY_DOWN = 40;
    var KEY_SPACE = 32;

    var activeKeys = {
        37: false,
        38: false,
        39: false,
        40: false,
        32: false
    };

    var canvas = document.getElementById('canvas');

    var screenBuffer = [];

    var bullets = [];

    var enemies = [];

    var player = {
        x: 4,
        y: 10,
        w: 6,
        h: 4,
        dx: 0,
        dy: 0,
        speed: 1,
        sprite: '100000110000111110111111'
    };

    function randomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function isKeyDown(keyCode) {
        return activeKeys[keyCode] == true;
    }

    function handleKeys() {

        if (isKeyDown(KEY_LEFT) || isKeyDown(KEY_RIGHT)) {
            player.dx = isKeyDown(KEY_LEFT) ? -player.speed : player.speed;
        }

        if (isKeyDown(KEY_UP) || isKeyDown(KEY_DOWN)) {
            player.dy = isKeyDown(KEY_UP) ? -player.speed : player.speed;
        }

        if (isKeyDown(KEY_SPACE)) {
            spawnBulletAt(player.x + player.w - BULLET_SPEED, player.y + player.h - 1);
        }

    }

    function spawnBulletAt(x, y) {

        if (bullets.length >= MAX_BULLETS) {
            return;
        }

        bullets.push({
            x: x,
            y: y,
            w: 2,
            h: 1,
            speed: BULLET_SPEED,
            sprite: '11'
        });

    }

    function spawnEnemyAt(x, y) {

        var enemy = {
            x: x,
            y: y,
            w: 5,
            h: 5,
            dirY: 1,
            speed: 1,
            sprite: '0111011111101011111110101'
        };

        enemies.push(enemy);

        return enemy;

    }

    for (var i = 0; i < CANVAS_HEIGHT; i++) {

        var row = document.createElement('div');

        canvas.appendChild(row);

        for (var j = 0; j < CANVAS_WIDTH; j++) {
            var input = document.createElement('input');
            input.type = 'checkbox';
            row.appendChild(input);
            screenBuffer.push(input);
        }

    }

    function clearCanvas() {

        screenBuffer.forEach(function(pixel) {
            pixel.checked = false;
        });

    }

    function drawPixelAt(x, y) {

        if (x < 0 || x >= CANVAS_WIDTH || y < 0 || y >= CANVAS_HEIGHT) {
            return;
        }

        var index = Math.round(x) + Math.round(y) * CANVAS_WIDTH;

        if (screenBuffer[index]) {
            screenBuffer[index].checked = true;
        }

    }

    function drawSprite(sprite, x, y, w, h) {

        for (var i = 0; i < w * h; i++) {
            parseInt(sprite[i]) && drawPixelAt(x + i % w, parseInt(i / w) + y);
        }

    }

    function drawBullets() {

        for (var i = 0; i < bullets.length; i++) {

            if (bullets[i].x + bullets[i].w +  bullets[i].speed > CANVAS_WIDTH) {

                bullets.splice(i, 1);

            } else {

                bullets[i].x += bullets[i].speed;

                drawSprite(
                    bullets[i].sprite,
                    bullets[i].x,
                    bullets[i].y,
                    bullets[i].w,
                    bullets[i].h
                );

            }

        }

    }

    function drawEnemies() {

        if (enemies.length < MAX_ENEMIES) {
            var enemy = spawnEnemyAt(randomBetween(CANVAS_WIDTH, CANVAS_WIDTH * 2), 0);
            enemy.y = randomBetween(0, CANVAS_HEIGHT - enemy.h);
        }

        for (var i = 0; i < enemies.length; i++) {

            if (enemies[i].x < -enemies[i].w) {

                enemies.splice(i, 1);

            } else {

                if (enemies[i].y < 0 || enemies[i].y > CANVAS_HEIGHT - enemies[i].h) {
                    enemies[i].dirY = -enemies[i].dirY;
                }

                enemies[i].x -= enemies[i].speed;
                enemies[i].y += enemies[i].dirY * enemies[i].speed;

                drawSprite(
                    enemies[i].sprite,
                    enemies[i].x,
                    enemies[i].y,
                    enemies[i].w,
                    enemies[i].h
                );

            }

        }

    }

    function drawPlayer() {

        var nextX = player.x + player.dx;
        var nextY = player.y + player.dy;

        if (nextX >= 0 && nextX + player.w <= CANVAS_WIDTH) {
            player.x = nextX;
        }

        if (nextY >= 0 && nextY + player.h <= CANVAS_HEIGHT) {
            player.y = nextY;
        }

        drawSprite(player.sprite, player.x, player.y, player.w, player.h);

        player.dx = player.dy = 0;

    }

    function checkCollisions() {

        for (i = 0; i < bullets.length; i++) {

            for (j = 0; j < enemies.length; j++) {

                if (bullets[i].x < enemies[j].x + enemies[j].w &&
                    bullets[i].x + bullets[i].w + bullets[i].speed > enemies[j].x &&
                    bullets[i].y < enemies[j].y + enemies[j].h &&
                    bullets[i].y + 1 > enemies[j].y) {

                        enemies.splice(j, 1);
                        bullets.splice(i, 1);
                        return;

                    }

                }

            }

    }

    document.addEventListener('keydown', function(e) {
        if (activeKeys.hasOwnProperty(e.keyCode)) {
            e.preventDefault();
            activeKeys[e.keyCode] = true;
        }
    }, false);

    document.addEventListener('keyup', function(e) {
        if (activeKeys.hasOwnProperty(e.keyCode)) {
            e.preventDefault();
            activeKeys[e.keyCode] = false;
        }
    }, false);

    function update() {
        clearCanvas();
        drawBullets();
        drawEnemies();
        drawPlayer();
        handleKeys();
        checkCollisions();
    }

    window.setInterval(function() {
        update();
    }, 1000 / 30);

}());

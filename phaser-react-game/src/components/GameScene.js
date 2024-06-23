// src/components/GameScene.js
import Phaser from 'phaser';

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.score = 0;
        this.scoreText = null;
        this.snake = null;
        this.food = null;
        this.cursors = null;
    }

    preload() {
        this.load.image('wall', 'images/wall.png'); // Ensure the path is correct
        this.load.image('food', 'images/food.png'); // Ensure the path is correct
        this.load.image('body', 'images/body.png'); // Ensure the path is correct
        this.load.image('background', 'images/background.png'); // Ensure the path is correct
    }

    create() {
        // Add the background image
        this.add.image(0, 0, 'background').setOrigin(0, 0).setScale(1);

        this.createWalls();
        this.food = new Food(this, 3, 4);
        this.snake = new Snake(this, 8, 8);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '32px', fill: '#000' });
    }

    createWalls() {
        for (let y = 0; y < 20; y++) {
            for (let x = 0; x <= 40; x++) {
                this.add.image(x * 32, y * 32, 'wall').setOrigin(0).setScale(1.0);
            }
        }
    }

    update(time, delta) {
        if (!this.snake.alive) {
            return;
        }
        if (this.cursors.left.isDown) {
            this.snake.faceLeft();
        } else if (this.cursors.right.isDown) {
            this.snake.faceRight();
        } else if (this.cursors.up.isDown) {
            this.snake.faceUp();
        } else if (this.cursors.down.isDown) {
            this.snake.faceDown();
        }
        if (this.snake.update(time)) {
            if (this.snake.collideWithFood(this.food)) {
                this.repositionFood();
            }
        }
    }

    repositionFood() {
        const testGrid = [];
        for (let y = 0; y < 20; y++) {
            testGrid[y] = [];
            for (let x = 0; x < 40; x++) {
                testGrid[y][x] = true;
            }
        }
        this.snake.updateGrid(testGrid);
        const validLocations = [];
        for (let y = 0; y < 20; y++) {
            for (let x = 0; x < 40; x++) {
                if (testGrid[y][x] === true) {
                    validLocations.push({ x: x, y: y });
                }
            }
        }
        if (validLocations.length > 0) {
            const pos = Phaser.Math.RND.pick(validLocations);
            this.food.setPosition(pos.x * 32, pos.y * 32);
            return true;
        } else {
            return false;
        }
    }
}

class Food extends Phaser.GameObjects.Image {
    constructor(scene, x, y) {
        super(scene, x * 32, y * 32, 'food');
        this.setOrigin(0);
        this.total = 0;
        scene.add.existing(this);
    }

    eat() {
        this.total++;
    }
}

class Snake {
    constructor(scene, x, y) {
        this.scene = scene;
        this.headPosition = new Phaser.Geom.Point(x, y);
        this.body = scene.add.group();
        this.head = this.body.create(x * 32, y * 32, 'body');
        this.head.setOrigin(0);
        this.head.setScale(1.0);
        this.alive = true;
        this.speed = 150;
        this.moveTime = 0;
        this.tail = new Phaser.Geom.Point(x, y);
        this.heading = 3; // RIGHT
        this.direction = 3; // RIGHT
    }

    update(time) {
        if (time >= this.moveTime) {
            return this.move(time);
        }
    }

    faceLeft() {
        if (this.direction === 0 || this.direction === 1) {
            this.heading = 2; // LEFT
        }
    }

    faceRight() {
        if (this.direction === 0 || this.direction === 1) {
            this.heading = 3; // RIGHT
        }
    }

    faceUp() {
        if (this.direction === 2 || this.direction === 3) {
            this.heading = 0; // UP
        }
    }

    faceDown() {
        if (this.direction === 2 || this.direction === 3) {
            this.heading = 1; // DOWN
        }
    }

    move(time) {
        switch (this.heading) {
            case 2:
                this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x - 1, 0, 40);
                break;
            case 3:
                this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x + 1, 0, 40);
                break;
            case 0:
                this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y - 1, 0, 20);
                break;
            case 1:
                this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y + 1, 0, 20);
                break;
        }
        this.direction = this.heading;
        Phaser.Actions.ShiftPosition(this.body.getChildren(), this.headPosition.x * 32, this.headPosition.y * 32, 1, this.tail);
        let hitBody = false;
        if (hitBody) {
            this.alive = false;
            return false;
        } else {
            this.moveTime = time + this.speed;
            return true;
        }
    }

    grow() {
        const newPart = this.body.create(this.tail.x, this.tail.y, 'body');
        newPart.setOrigin(0);
    }

    collideWithFood(food) {
        if (this.head.x === food.x && this.head.y === food.y) {
            this.grow();
            food.eat();
            this.scene.score += 10;
            this.scene.scoreText.setText('Score: ' + this.scene.score);
            if (this.speed > 20 && food.total % 5 === 0) {
                this.speed -= 5;
            }
            return true;
        } else {
            return false;
        }
    }

    updateGrid(grid) {
        this.body.children.each(function (segment) {
            const bx = segment.x / 32;
            const by = segment.y / 32;
            if (grid[by] && grid[by][bx] !== undefined) {
                grid[by][bx] = false;
            }
        });
        return grid;
    }
}

export default GameScene;

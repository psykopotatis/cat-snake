import { Snake } from './Snake.js';

const TILE_SIZE = 32;
const TILES_X = 40;
const TILES_Y = 20;

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
        this.load.image('wall', 'grass_32.png');
        this.load.image('food', 'proplan_32.png');
        this.load.image('body', 'andiamo_32.png');
    }

    create() {
        this.createWalls();
        this.food = new Food(this, 3, 4);
        this.snake = new Snake(this, 8, 8);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '32px', fill: '#000' });
    }

    createWalls() {
        for (let y = 0; y < TILES_Y; y++) {
            for (let x = 0; x <= TILES_X; x++) {
                this.add.image(x * TILE_SIZE, y * TILE_SIZE, 'wall').setOrigin(0).setScale(1.0);
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
        for (let y = 0; y < TILES_Y; y++) {
            testGrid[y] = [];
            for (let x = 0; x < TILES_X; x++) {
                testGrid[y][x] = true;
            }
        }
        this.snake.updateGrid(testGrid);
        const validLocations = [];
        for (let y = 0; y < TILES_Y; y++) {
            for (let x = 0; x < TILES_X; x++) {
                if (testGrid[y][x] === true) {
                    validLocations.push({ x: x, y: y });
                }
            }
        }
        if (validLocations.length > 0) {
            const pos = Phaser.Math.RND.pick(validLocations);
            this.food.setPosition(pos.x * TILE_SIZE, pos.y * TILE_SIZE);
            return true;
        } else {
            return false;
        }
    }
}

class Food extends Phaser.GameObjects.Image {
    constructor(scene, x, y) {
        super(scene, x * TILE_SIZE, y * TILE_SIZE, 'food');
        this.setOrigin(0);
        this.total = 0;
        scene.add.existing(this);
    }

    eat() {
        this.total++;
    }
}

export { GameScene };

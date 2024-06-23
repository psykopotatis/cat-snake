const TILE_SIZE = 32;
const TILES_X = 40;
const TILES_Y = 20;
const INITIAL_SPEED = 150;

let score = 0;
let scoreText;
let snake, food, cursors;

// Direction constants
const UP = 0;
const DOWN = 1;
const LEFT = 2;
const RIGHT = 3;

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.image('wall', 'grass_32.png');
        this.load.image('food', 'proplan_32.png');
        this.load.image('body', 'andiamo_32.png');
    }

    create() {
        this.createWalls();
        food = new Food(this, 3, 4);
        snake = this.createSnake(8, 8);

        cursors = this.input.keyboard.createCursorKeys();
        scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '32px', fill: '#000' });
    }

    createWalls() {
        for (let y = 0; y < TILES_Y; y++) {
            for (let x = 0; x <= TILES_X; x++) {
                this.add.image(x * TILE_SIZE, y * TILE_SIZE, 'wall').setOrigin(0).setScale(1.0);
            }
        }
    }

    createSnake(x, y) {
        const Snake = new Phaser.Class({
            initialize: function Snake(scene, x, y) {
                this.headPosition = new Phaser.Geom.Point(x, y);
                this.body = scene.add.group();
                this.head = this.body.create(x * TILE_SIZE, y * TILE_SIZE, 'body');
                this.head.setOrigin(0);
                this.head.setScale(1.0);
                this.alive = true;
                this.speed = INITIAL_SPEED;
                this.moveTime = 0;
                this.tail = new Phaser.Geom.Point(x, y);
                this.heading = RIGHT;
                this.direction = RIGHT;
            },
            update: function (time) {
                if (time >= this.moveTime) {
                    return this.move(time);
                }
            },
            faceLeft: function () {
                if (this.direction === UP || this.direction === DOWN) {
                    this.heading = LEFT;
                }
            },
            faceRight: function () {
                if (this.direction === UP || this.direction === DOWN) {
                    this.heading = RIGHT;
                }
            },
            faceUp: function () {
                if (this.direction === LEFT || this.direction === RIGHT) {
                    this.heading = UP;
                }
            },
            faceDown: function () {
                if (this.direction === LEFT || this.direction === RIGHT) {
                    this.heading = DOWN;
                }
            },
            move: function (time) {
                switch (this.heading) {
                    case LEFT:
                        this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x - 1, 0, TILES_X);
                        break;
                    case RIGHT:
                        this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x + 1, 0, TILES_X);
                        break;
                    case UP:
                        this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y - 1, 0, TILES_Y);
                        break;
                    case DOWN:
                        this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y + 1, 0, TILES_Y);
                        break;
                }
                this.direction = this.heading;
                Phaser.Actions.ShiftPosition(this.body.getChildren(), this.headPosition.x * TILE_SIZE, this.headPosition.y * TILE_SIZE, 1, this.tail);
                let hitBody = false;
                if (hitBody) {
                    this.alive = false;
                    return false;
                } else {
                    this.moveTime = time + this.speed;
                    return true;
                }
            },
            grow: function () {
                const newPart = this.body.create(this.tail.x, this.tail.y, 'body');
                newPart.setOrigin(0);
            },
            collideWithFood: function (food) {
                if (this.head.x === food.x && this.head.y === food.y) {
                    this.grow();
                    food.eat();
                    score += 10;
                    scoreText.setText('Score: ' + score);
                    if (this.speed > 20 && food.total % 5 === 0) {
                        this.speed -= 5;
                    }
                    return true;
                } else {
                    return false;
                }
            },
            updateGrid: function (grid) {
                this.body.children.each(function (segment) {
                    const bx = segment.x / TILE_SIZE;
                    const by = segment.y / TILE_SIZE;
                    if (grid[by] && grid[by][bx] !== undefined) {
                        grid[by][bx] = false;
                    }
                });
                return grid;
            }
        });
        return new Snake(this, x, y);
    }

    update(time, delta) {
        if (!snake.alive) {
            return;
        }
        if (cursors.left.isDown) {
            snake.faceLeft();
        } else if (cursors.right.isDown) {
            snake.faceRight();
        } else if (cursors.up.isDown) {
            snake.faceUp();
        } else if (cursors.down.isDown) {
            snake.faceDown();
        }
        if (snake.update(time)) {
            if (snake.collideWithFood(food)) {
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
        snake.updateGrid(testGrid);
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
            food.setPosition(pos.x * TILE_SIZE, pos.y * TILE_SIZE);
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

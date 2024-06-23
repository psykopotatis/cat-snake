const TILE_SIZE = 32;
const INITIAL_SPEED = 150;
const UP = 0;
const DOWN = 1;
const LEFT = 2;
const RIGHT = 3;

class Snake {
    constructor(scene, x, y) {
        this.scene = scene;
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
    }

    update(time) {
        if (time >= this.moveTime) {
            return this.move(time);
        }
    }

    faceLeft() {
        if (this.direction === UP || this.direction === DOWN) {
            this.heading = LEFT;
        }
    }

    faceRight() {
        if (this.direction === UP || this.direction === DOWN) {
            this.heading = RIGHT;
        }
    }

    faceUp() {
        if (this.direction === LEFT || this.direction === RIGHT) {
            this.heading = UP;
        }
    }

    faceDown() {
        if (this.direction === LEFT || this.direction === RIGHT) {
            this.heading = DOWN;
        }
    }

    move(time) {
        switch (this.heading) {
            case LEFT:
                this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x - 1, 0, 40); // Adjust 40 based on TILES_X value
                break;
            case RIGHT:
                this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x + 1, 0, 40); // Adjust 40 based on TILES_X value
                break;
            case UP:
                this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y - 1, 0, 20); // Adjust 20 based on TILES_Y value
                break;
            case DOWN:
                this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y + 1, 0, 20); // Adjust 20 based on TILES_Y value
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
            const bx = segment.x / TILE_SIZE;
            const by = segment.y / TILE_SIZE;
            if (grid[by] && grid[by][bx] !== undefined) {
                grid[by][bx] = false;
            }
        });
        return grid;
    }
}

export { Snake };

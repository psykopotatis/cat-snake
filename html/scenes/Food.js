const TILE_SIZE = 32;

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

export { Food };
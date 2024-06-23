class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    preload() {
        this.load.image('startImage', 'start_image.png'); // Ensure the path is correct
    }

    create() {
        this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'startImage').setOrigin(0.5);
        this.input.once('pointerdown', function () {
            this.scene.start('GameScene');
        }, this);
    }
}

export { StartScene };

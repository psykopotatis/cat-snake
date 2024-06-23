// src/components/StartScene.js
import Phaser from 'phaser';

class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    preload() {
        this.load.image('startImage', 'images/start_image.png'); // Ensure the path is correct
        this.load.image('startButton', 'path/to/start_button.png'); // Load the start button image
    }

    create() {
        // Add the background image
        this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'startImage').setOrigin(0.5);

        // Add the start button image
        const startButton = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2 + 100, 'startButton').setOrigin(0.5);

        // Enable the button to be interactive
        startButton.setInteractive();

        // Add a click event listener
        startButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}

export default StartScene;

// src/components/PhaserGame.js
import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import StartScene from "./StartScene";
import GameScene from "./GameScene";

const PhaserGame = () => {
    const gameRef = useRef(null);

    useEffect(() => {
        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            backgroundColor: '#fff',
            parent: gameRef.current,
            scene: [StartScene, GameScene],
        };

        const game = new Phaser.Game(config);

        return () => {
            game.destroy(true);
        };
    }, []);

    return <div ref={gameRef}></div>;
};

export default PhaserGame;

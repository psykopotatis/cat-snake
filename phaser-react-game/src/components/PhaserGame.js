// src/components/PhaserGame.js
import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import StartScene from "./StartScene";
import GameScene from "./GameScene";

const PhaserGame = () => {
    const gameRef = useRef(null);
    const MARGIN = 10;

    useEffect(() => {
        const config = {
            type: Phaser.AUTO,
            width: window.innerWidth - MARGIN,
            height: window.innerHeight - MARGIN,
            backgroundColor: '#fff',
            parent: gameRef.current,
            // scene: [StartScene, GameScene],
            scene: [GameScene],
        };

        const game = new Phaser.Game(config);

        return () => {
            game.destroy(true);
        };
    }, []);

    return <div ref={gameRef}></div>;
};

export default PhaserGame;

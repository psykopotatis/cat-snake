// src/App.js
import React, {useState} from 'react';
import { Button } from 'antd';
import './App.css';
import PhaserGame from './components/PhaserGame';

function App() {
    const [startGame, setStartGame] = useState(false);

    const handleStartGame = () => {
        setStartGame(true);
    };

    function renderStartScreen() {
        if (!startGame) {
            return (
                <div className="start-screen">
                    <h1 className="title">Cat Snake</h1>
                    <img src="images/start_image.png" alt="Start" className="start-image"/>
                    <Button type="primary" size="large" onClick={handleStartGame} className="start-button">Start game</Button>
                </div>
            );
        }
    }

    return (
        <div className="App">
            {renderStartScreen()}
            {startGame && <PhaserGame/>}
        </div>
    );
}

export default App;

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

  return (
      <div className="App">
        <header className="App-header">
            {!startGame && <Button type="primary" onClick={handleStartGame}>Start</Button>}
            {startGame && <PhaserGame />}
        </header>
      </div>
  );
}

export default App;

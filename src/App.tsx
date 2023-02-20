import { useState, useEffect } from 'react';
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import { io } from 'socket.io-client';
import { Error } from '../types/Error';
import { TurnData } from '../types/TurnData';
import { Game } from './components/Game/Game';
import { Menu } from './components/Menu/Menu';
import './App.scss';

const socket = io('https://tic-tac-toe-multiplayer.onrender.com',
  { transports: ['websocket', 'polling', 'flashsocket'] });

function App() {
  const [playerId, setPlayerId] = useState(0);
  const [roomId, setRoomId] = useState(0);
  const [playerOneStatus, setPlayerOneStatus] = useState(false);
  const [playerTwoStatus, setPlayerTwoStatus] = useState(false);
  const [waiting, setWaiting] = useState(true);
  const [game, setGame] = useState(Array(9).fill(''));
  const [xo, setXO] = useState('X');
  const [winner, setWinner] = useState(false);
  const [myTurn, setMyTurn] = useState(true);
  const [turnNumber, setTurnNumber] = useState(0);
  const [turnData, setTurnData] = useState<null | TurnData>(null);
  const [error, setError] = useState<null | Error>(null);

  const navigate = useNavigate();

  const handleCreateRoom = (id: string) => {
    setError(null);
    socket.emit('create_room', id);
  };

  const handleJoinRoom = (id: string) => {
    setError(null);
    socket.emit('join_room', id);
  };

  const handleJoinRandomRoom = () => {
    setError(null);
    socket.emit('join_random_room');
  };

  const handleTurn = (index: number) => {
    if (!game[index] && !winner && myTurn && playerTwoStatus) {
      socket.emit('choose', { index, value: xo, roomId });
    }
  };

  const handleRestart = () => {
    socket.emit('restart', roomId);
  };

  useEffect(() => {
    socket.on('show_error', (err) => {
      setError(err);
    });

    socket.on('room_created', (id) => {
      setPlayerId(1);
      setRoomId(id);
      if (!error) {
        navigate('/game');
      }
    });

    socket.on('room_joined', (id) => {
      setPlayerId(2);
      setRoomId(id);
      setPlayerOneStatus(true);
      if (!error) {
        navigate('/game');
      }
    });

    socket.on('player_1_connected', () => {
      setPlayerOneStatus(true);
    });

    socket.on('player_2_connected', () => {
      setPlayerTwoStatus(true);
      setWaiting(false);
    });

    socket.on('player_turn', (data) => {
      setTurnData(data);
    });

    socket.on('player_1_disconnected', () => {
      setPlayerOneStatus(false);
      setPlayerTwoStatus(false);
      navigate('/');
      setWaiting(true);
    });

    socket.on('player_2_disconnected', () => {
      setPlayerTwoStatus(false);
      setWaiting(true);
    });

    socket.on('restart', () => {
      setGame(Array(9).fill(''));
      setWinner(false);
      setTurnNumber(0);
      setMyTurn(false);
    });

    return () => {
      socket.off('show_error');
      socket.off('room_created');
      socket.off('room_joined');
      socket.off('player_turn');
      socket.off('player_1_connected');
      socket.off('player_2_connected');
      socket.off('player_1_disconnected');
      socket.off('player_2_disconnected');
      socket.off('restart');
    };
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={(
            <Menu
              error={error}
              handleCreateRoom={handleCreateRoom}
              handleJoinRoom={handleJoinRoom}
              handleJoinRandomRoom={handleJoinRandomRoom}
            />
          )}
        />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route
          path="/game"
          element={(
            <Game
              game={game}
              setGame={setGame}
              playerId={playerId}
              playerOneStatus={playerOneStatus}
              playerTwoStatus={playerTwoStatus}
              xo={xo}
              setXO={setXO}
              waiting={waiting}
              turnNumber={turnNumber}
              setTurnNumber={setTurnNumber}
              myTurn={myTurn}
              setMyTurn={setMyTurn}
              winner={winner}
              setWinner={setWinner}
              turnData={turnData}
              setTurnData={setTurnData}
              handleTurn={handleTurn}
              handleRestart={handleRestart}
            />
          )}
        />
        <Route path="*" element={<h1>Page not found</h1>} />
      </Routes>
    </div>
  );
}

export default App;

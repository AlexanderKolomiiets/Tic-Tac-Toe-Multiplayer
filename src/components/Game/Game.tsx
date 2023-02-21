import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { TurnData } from '../../../types/TurnData';
import 'bulma/css/bulma.min.css';
import './Game.scss';

type Props = {
  game: string[],
  setGame: (value: string[]) => void;
  playerId: number;
  playerOneStatus: boolean;
  playerTwoStatus: boolean;
  xo: string;
  setXO: (value: string) => void;
  waiting: boolean;
  turnNumber: number;
  setTurnNumber: (value: number) => void;
  myTurn: boolean;
  setMyTurn: (value: boolean) => void;
  winner: boolean;
  setWinner: (value: boolean) => void;
  turnData: null | TurnData;
  setTurnData: (value: null | TurnData) => void;
  handleTurn: (index: number) => void;
  handleRestart: () => void;
};

type Cell = {
  index: number;
  turn: (index: number) => void;
  value: string;
};

export const Game: React.FC<Props> = ({
  game,
  setGame,
  playerId,
  playerOneStatus,
  playerTwoStatus,
  xo,
  setXO,
  waiting,
  turnNumber,
  setTurnNumber,
  myTurn,
  setMyTurn,
  winner,
  setWinner,
  turnData,
  setTurnData,
  handleTurn,
  handleRestart,
}) => {
  const [player, setPlayer] = useState('');
  const [playerScore, setPlayerScore] = useState(0);
  const [enemyScore, setEnemyScore] = useState(0);

  const combinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  useEffect(() => {
    if (playerId !== 1) {
      setXO('O');
      setMyTurn(false);
    } else {
      setMyTurn(true);
    }
  }, [playerId]);

  useEffect(() => {
    combinations.forEach((comb) => {
      if (game[comb[0]] === game[comb[1]]
        && game[comb[0]] === game[comb[2]]
        && game[comb[0]] !== '') {
        setWinner(true);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        player === 'X'
          ? setPlayerScore(prev => prev + 1)
          : setEnemyScore(prev => prev + 1);
      }
    });

    if (turnNumber === 0) {
      setMyTurn(xo === 'X');
    }
  }, [game, turnNumber, xo]);

  useEffect(() => {
    if (turnData) {
      const data = turnData;
      const newGame = [...game];

      if (!newGame[data.index] && !winner) {
        newGame[data.index] = data.value;
        setGame(newGame);
        setTurnNumber(turnNumber + 1);
        setTurnData(null);
        setMyTurn(!myTurn);
        setPlayer(data.value);
      }
    }
  }, [turnData, game, turnNumber, winner, myTurn]);

  const Cell = ({ index, turn, value }: Cell) => {
    return (
      <div
        className="cell box"
        onClick={() => turn(index)}
        role="presentation"
      >
        {value}
      </div>
    );
  };

  return (
    <div
      className="block-row"
      style={{ flexDirection: 'column' }}
    >
      <div className={classNames('title', { 'is-hidden': !waiting })}>
        <p>Waiting for another player to join...</p>
      </div>

      <div className="block-row block" id="players">
        <div id="player-1">
          <span className={classNames('dot', { connected: playerOneStatus })} />
          <span className="subtitle">
            {playerId === 1 ? 'You (Player 1)' : 'Enemy (Player 1)'}
          </span>
        </div>

        <div id="player-2">
          <span className={classNames('dot', { connected: playerTwoStatus })} />
          <span className="subtitle">
            {playerId === 1 ? 'Enemy (Player 2)' : 'You (Player 2)'}
          </span>
        </div>
      </div>

      <div className="block-row block">
        <div className="row">
          <Cell index={0} turn={handleTurn} value={game[0]} />
          <Cell index={1} turn={handleTurn} value={game[1]} />
          <Cell index={2} turn={handleTurn} value={game[2]} />
        </div>
        <div className="row">
          <Cell index={3} turn={handleTurn} value={game[3]} />
          <Cell index={4} turn={handleTurn} value={game[4]} />
          <Cell index={5} turn={handleTurn} value={game[5]} />
        </div>
        <div className="row">
          <Cell index={6} turn={handleTurn} value={game[6]} />
          <Cell index={7} turn={handleTurn} value={game[7]} />
          <Cell index={8} turn={handleTurn} value={game[8]} />
        </div>
      </div>

      <div className="block-row block" id="score">
        <span className="tag is-link is-normal">
          You:
          <span id="my-score" style={{ marginLeft: '5px' }}>
            {playerId === 1 ? playerScore : enemyScore}
          </span>
        </span>
        <span className="tag is-link is-normal">
          Enemy:
          <span id="enemy-score" style={{ marginLeft: '5px' }}>
            {playerId === 1 ? enemyScore : playerScore}
          </span>
        </span>
      </div>

      <p
        className="block-row"
        style={{ alignItems: 'center' }}
      >
        {winner || turnNumber === 9 ? (
          <button
            type="button"
            className="button is-link"
            onClick={handleRestart}
          >
            Restart
          </button>
        ) : null}
        {winner
          ? (
            <span>
              {`We have a winner: ${player}`}
            </span>
          ) : turnNumber === 9
            ? (
              <span>It is a tie!</span>
            ) : <br />}
      </p>
    </div>
  );
};

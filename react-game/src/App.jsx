import React, { useEffect, useReducer } from "react";
import Board from "./components/Board";
import Start from "./components/Start";
import Result from "./components/Result";
import {
  BOARD_SIZE,
  PLAYER_ONE,
  PLAYER_TWO,
  UNIT,
  GAME_ENDED,
  GAME_PLAYING,
  GAME_READY
} from "./config/const";
import useInterval from "./hooks/useInterval";
import sumCoordinates from "./utils/sumCoordinates";
import getCellKey from "./utils/getCellKey";
import getPlayableCells from "./utils/getPlayableCells";
import playerCanChangeToDirection from "./utils/playerCanChangeToDirection";
import "./App.css";

let result = null
const players = [PLAYER_ONE, PLAYER_TWO];
const initialState = {
  players,
  playableCells: getPlayableCells(
    BOARD_SIZE,
    UNIT,
    players.map(player => getCellKey(player.position.x, player.position.y))
  ),
  gameStatus: GAME_READY
};

const updateGame = (game, action) => {
  if (action.type === "move") {
    const newPlayers = game.players.map(player => ({
      ...player,
      position: sumCoordinates(player.position, player.direction)
    }));

    const newPlayersWithCollision = newPlayers.map(player => {
      const myCellKey = getCellKey(player.position.x, player.position.y);
      return {
        ...player,
        hasDied:
          !game.playableCells.includes(myCellKey) ||
          newPlayers
            .filter(p => p.id !== player.id)
            .map(p => getCellKey(p.position.x, p.position.y))
            .includes(myCellKey)
      };
    });

    const newOcupiedCell = game.players.map(player =>
      getCellKey(player.position.x, player.position.y)
    );
    const playableCells = game.playableCells.filter(
      playableCells => !newOcupiedCell.includes(playableCells)
    );

    return { players: newPlayersWithCollision, playableCells: playableCells, gameStatus: newPlayersWithCollision.filter(player => player.hasDied).length ===  0 ? GAME_PLAYING : GAME_ENDED };
  }

  if (action.type === "changeDirection") {
    const newPlayers = game.players.map(player => ({
      ...player,
      direction:
        player.keys[action.key] &&
        playerCanChangeToDirection(player.direction, player.keys[action.key])
          ? player.keys[action.key]
          : player.direction
    }));

    return { players: newPlayers, playableCells: game.playableCells, gameStatus: game.gameStatus };
  }
  if (action.type === "start"){
    return {...initialState, gameStatus: GAME_PLAYING}
  }
  if (action.type === "restart") {
    return { ...initialState, gameStatus: GAME_READY }
  }
};

function App() {
  const [game, gameDispatch] = useReducer(updateGame, initialState);
  const players = game.players;
  const diedPlayer = players.filter(player => player.hasDied);
  const audio = new Audio("../audioGame.mp3");

  useInterval(
    () => {
      gameDispatch({ type: "move" });
    },
    game.gameStatus !== GAME_PLAYING ? null : 100
  );

  useEffect(() => {
    const handleKeyPress = ({ keyCode }) =>
      gameDispatch({ type: "changeDirection", key: `${keyCode}` });
    document.addEventListener("keydown", handleKeyPress);
    return function clearUp() {
      document.addEventListener("keydown", handleKeyPress);
    };
  }, []);

const handleStart = () => {
  audio.play()
  gameDispatch({type: "start"})
}
const handleRestart = () => gameDispatch({type: "restart"})

if (game.gameStatus === GAME_ENDED){
  const winningPlayers = game.players.filter(player => !player.hasDied)
  if (winningPlayers.length === 0) {result = "Empate"}
  else {result = `Ganador: ${winningPlayers.map(player => `jugador ${player.id}`).join('.')}`}
}

  return (
    <div className="App">
      {game.gameStatus === GAME_READY && <Start onClick={handleStart} />}
      {game.gameStatus === GAME_ENDED && <Result onClick={handleRestart} result={result} />}
      <Board players={game.players} gameStatus={game.gameStatus}/>
    </div>
  );
}

export default App;

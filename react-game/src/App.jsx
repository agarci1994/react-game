import React, { useEffect, useReducer } from "react";
import Board from "./components/Board";
import { BOARD_SIZE, PLAYER_ONE, PLAYER_TWO, UNIT } from "./config/const";
import useInterval from "./hooks/useInterval";
import sumCoordinates from "./utils/sumCoordinates";
import playerCanChangeToDirection from "./utils/playerCanChangeToDirection";
import "./App.css";

const players = [PLAYER_ONE, PLAYER_TWO];
const game = { players, playableCells: "hoa" };

const updateGame = (players, action) => {
  if (action.type === "move") {
    const newPlayers = players.map(player => ({
      ...player,
      position: sumCoordinates(player.position, player.direction)
    }));
    return newPlayers;
  }
  if (action.type === "changeDirection") {
    const newPlayers = players.map(player => ({
      ...player,
      direction:
        player.keys[action.key] &&
        playerCanChangeToDirection(player.direction, player.keys[action.key])
          ? player.keys[action.key]
          : player.direction
    }));

    return newPlayers;
  }
};

function App() {
  const [players, gameDispatch] = useReducer(updateGame, initialState);

  useInterval(() => {
    gameDispatch({ type: "move" });
  }, 100);

  useEffect(() => {
    const handleKeyPress = ({ keyCode }) =>
      gameDispatch({ type: "changeDirection", key: `${keyCode}` });
    document.addEventListener("keydown", handleKeyPress);
    return function clearUp() {
      document.addEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div className="App">
      <Board players={players} />
    </div>
  );
}

export default App;

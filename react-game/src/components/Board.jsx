import React, { useEffect, useRef } from "react";
import { UNIT, BOARD_SIZE, GAME_READY } from "../config/const";

const Board = ({ players, gameStatus }) => {
  const canvasRef = useRef();
  useEffect(() => {
      if (gameStatus === GAME_READY){
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, BOARD_SIZE, BOARD_SIZE)

    context.beginPath();
    context.strokeStyle = "#001900";
    for (let i = UNIT * 2; i <= BOARD_SIZE; i += UNIT * 2) {
      context.moveTo(i, 0);
      context.lineTo(i, BOARD_SIZE);
    }
    for (let i = UNIT * 2; i <= BOARD_SIZE; i += UNIT * 2) {
      context.moveTo(0, i);
      context.lineTo(BOARD_SIZE, i);
    }
    context.stroke();
    context.closePath();
}
  }, [gameStatus]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    players.forEach(player => {
      context.fillStyle = player.color;
      context.fillRect(player.position.x, player.position.y, UNIT, UNIT);
    });
  }, [players]);

  return (
    <>
      <canvas
        ref={canvasRef}
        width={BOARD_SIZE}
        height={BOARD_SIZE}
        className="board"
      />
      <div className="instructions">
        {players.map(player => (
          <div
            className="instructions_player"
            style={{ color: player.color }}
            key={player.id}
          >
            <p>{`${player.id}: ${player.instructions}`}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Board;

import React, { useState, useRef } from 'react';
import image1 from '../Assets/cross.png';
import image2 from '../Assets/circle.png';
import winningSound from '../Assets/winning.mp3';
import xMoveSound from '../Assets/click.mp3';
import oMoveSound from '../Assets/click.mp3'; 



const TicTacToeGame = () => {
  const initialBoard = Array(9).fill(null);
  const [board, setBoard] = useState(initialBoard);
  const [isXNext, setIsXNext] = useState(true);
  const [winningSquares, setWinningSquares] = useState([]);
  const [isGameWon, setIsGameWon] = useState(false);

  const audioRef = useRef(); // Create a ref for the Audio element

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return [a, b, c];
      }
    }

    return null;
  };


  const handleClick = async (index) => {
    if (board[index] || calculateWinner(board)) {
      return;
    }
  
    const newBoard = board.slice();
    newBoard[index] = isXNext ? 'X' : 'O';
  
    setBoard(newBoard);
  
    // Play the move sound based on the current player
    const moveSound = isXNext ? xMoveSound : oMoveSound;
    if (audioRef.current) {
      audioRef.current.src = moveSound;
      await audioRef.current.play();
    }
  
    setIsXNext(!isXNext);
  
    const winnerSquares = calculateWinner(newBoard);
    if (winnerSquares) {
      setWinningSquares(winnerSquares);
      setIsGameWon(true);
  
      // Reset the audio source before playing the winning sound
      if (audioRef.current) {
        audioRef.current.src = '';
        audioRef.current.src = winningSound;
        await audioRef.current.play();
      }
    }
  };
  

  const renderSquare = (index) => {
    const isWinningSquare = winningSquares && winningSquares.includes(index);

    return (
      <button
        className={`square ${board[index]} ${isWinningSquare ? 'winning-square' : ''}`}
        onClick={() => handleClick(index)}
      >
        {board[index] === 'X' && <img src={image1} className='w-14 mx-auto' alt="X" />}
        {board[index] === 'O' && <img src={image2} className='w-14 mx-auto' alt="O" />}
      </button>
    );
  };

  const resetGame = () => {
    setBoard(initialBoard);
    setIsXNext(true);
    setWinningSquares([]);
    setIsGameWon(false);
  };

  const winner = calculateWinner(board);
  let status;

  if (winner) {
    status = `${board[winner[0]]} : wins`;
  } else if (board.every((square) => square !== null) && !winner) {
    status = 'Match Draw!';
  } else {
    status = ` ${isXNext ? 'You : X' : 'Next player : O'}`;
  }


  return (
    <>
    <div className="w-96 mx-auto text-center">
      <div className="mt-6 text-white text-4xl">{status}</div>
      <div className="board-row mt-14 sm:ps-0 sm:pe-0 ps-5 pe-5">
        {Array.from({ length: 3 }, (_, col) => renderSquare(col))}
      </div>
      <div className="board-row sm:ps-0 sm:pe-0 ps-5 pe-5">
        {Array.from({ length: 3 }, (_, col) => renderSquare(3 + col))}
      </div>
      <div className="board-row sm:ps-0 sm:pe-0 ps-5 pe-5">
        {Array.from({ length: 3 }, (_, col) => renderSquare(6 + col))}
      </div>

      {(winner || status === 'Match Draw!') && (
        <button
          className="reset-button bg-[#203c49] rounded-full text-xl tracking-wider hover:bg-[#14303d] px-20 text-cyan-300 py-4 mt-5"
          onClick={resetGame}
        >
          Play Again
        </button>
      )}

      <audio ref={audioRef} src={winningSound} />
    </div>
    </>
  );
};


export default TicTacToeGame;
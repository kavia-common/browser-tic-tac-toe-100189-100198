import React, { useState, useEffect, useMemo } from 'react';
import './App.css';

/**
 * Calculate the winner of a tic tac toe board.
 * Returns 'X' or 'O' if a winner exists, 'draw' if all cells filled with no winner, or null if ongoing.
 */
function calculateWinner(squares) {
  const lines = [
    // rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // cols
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // diagonals
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  if (squares.every(Boolean)) {
    return { winner: 'draw', line: [] };
  }
  return { winner: null, line: [] };
}

/**
 * Single Square button component
 */
function Square({ value, onClick, highlight, index, disabled }) {
  return (
    <button
      className={`ttt-square${highlight ? ' highlight' : ''}`}
      onClick={onClick}
      aria-label={`Square ${index + 1}${value ? `, occupied by ${value}` : ', empty'}`}
      aria-disabled={disabled}
      disabled={disabled}
    >
      {value}
    </button>
  );
}

/**
 * Board component showing 9 squares.
 */
function Board({ squares, onPlay, winningLine, isDisabled }) {
  const renderSquare = (i) => {
    const highlight = winningLine.includes(i);
    return (
      <Square
        key={i}
        index={i}
        value={squares[i]}
        onClick={() => onPlay(i)}
        highlight={highlight}
        disabled={isDisabled || Boolean(squares[i])}
      />
    );
  };

  return (
    <div className="ttt-board" role="grid" aria-label="Tic Tac Toe Board">
      <div className="ttt-row" role="row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="ttt-row" role="row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="ttt-row" role="row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** Theme handling */
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  /** Game state */
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const { winner, line } = useMemo(() => calculateWinner(squares), [squares]);

  const statusText = useMemo(() => {
    if (winner === 'draw') return 'It’s a draw 🤝';
    if (winner === 'X') return 'Player X wins! 🏆';
    if (winner === 'O') return 'Player O wins! 🏆';
    return `Turn: ${xIsNext ? 'X' : 'O'}`;
  }, [winner, xIsNext]);

  const isBoardLocked = Boolean(winner);

  const handlePlay = (index) => {
    if (squares[index] || winner) return; // ignore if filled or game over
    const next = squares.slice();
    next[index] = xIsNext ? 'X' : 'O';
    setSquares(next);
    setXIsNext(!xIsNext);
  };

  // PUBLIC_INTERFACE
  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  return (
    <div className="App">
      <header className="App-header">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>

        <div className="ttt-container">
          <h1 className="ttt-title">Tic Tac Toe</h1>
          <p className={`ttt-status${winner ? ' done' : ''}`} role="status" aria-live="polite">
            {statusText}
          </p>

          <Board
            squares={squares}
            onPlay={handlePlay}
            winningLine={line}
            isDisabled={isBoardLocked}
          />

          <div className="ttt-actions">
            <button className="ttt-btn" onClick={resetGame} aria-label="Reset game">
              Reset
            </button>
          </div>

          <div className="ttt-footer">
            <small>Two-player local game. Click a square to place a mark.</small>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;

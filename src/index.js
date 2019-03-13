import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={`square ${props.value} ${props.win && 'win'}`} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        win={this.props.winSquare && this.props.winSquare.includes(i)}
      />
    );
  }

  render() {
    let board = [];
    for (let i = 0; i < 3; i++) {
      let row = [];
      for (let j = 0; j < 3; j++) {
        let index = i * 3 + j;
        row.push(this.renderSquare(index));
      }
      board.push(
        <div key={i} className="board-row">{row}</div>
      );
    }

    return (
      <div>
        {board}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          move: null,
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      historyOrderAsc: false,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          move: i,
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winSquare = calculateWinner(current.squares);
    const winner = winSquare && current.squares[winSquare[0]];
    const moves = history.map((step, move) => {
      const desc = move ?
        `Go to move #${move}, (${step.move % 3},${Math.floor(step.move / 3)})` :
        'Go to game start';
      return (
        <li key={move}>
          <button className={`${move === this.state.stepNumber ? 'bold' : 'none'}`} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      if (history.length === 10) {
        status = "Draw the game.";
      } else {
        status = "Next player: " + (this.state.xIsNext ? "X" : "O");
      }
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            winSquare={winSquare}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button
            onClick={() => this.setState({ historyOrderAsc: !this.state.historyOrderAsc })}
          >toggle order</button>
          <ol>{this.state.historyOrderAsc ? moves.reverse() : moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      //return squares[a];
      return lines[i];
    }
  }
  return null;
}

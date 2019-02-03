import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';

function Square(props) {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      XIsNext: true,
      stepNumber: 0,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current  = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.XIsNext ? 'X' : 'O';

    this.setState({
      history: history.concat([{squares: squares}]),
      stepNumber: history.length,
      XIsNext: !this.state.XIsNext,
    });
  }

  jumpTo(step) {
    const history = this.state.history.slice(0, step + 1);
    this.setState({
      history: history,
      stepNumber: step,
      XIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const doWeHaveWinner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'go to move #' + move :
        'let start';

        return (
          <li key={move}>
            <a onClick={() => this.jumpTo(move)}> { desc } </a>
          </li>
        )
    });

    let status;
    if (doWeHaveWinner) {
      status = 'Winner: ' + doWeHaveWinner;
    } else {
      status = 'Next player: ' + (this.state.XIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i) }
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>

    );
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

// ========================================
// ========================================
// ========================================
// ========================================
// ========================================
// ========================================
// ========================================
// ========================================
// ========================================
// ========================================
// ========================================
// ========================================
// ========================================
// ========================================
// ========================================
// ========================================
// ========================================
// ========================================
// ========================================
// ========================================
// DONE

import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';

function Square(props) {
  return (
    <button
      className="square"
      onClick={ props.onClick }
    >
      {props.value}
    </button>
  )
}

function checkWinner(squares) {
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
    const target = lines[i];
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[c]) {
      return true;
    }
  }

  return false;
}

class Board extends React.Component {
  constructor(props) {
    super(props);
  }

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    )
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>

        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>

        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      squares: Array(9).fill(null),
    };

    this.mark = 'O';
  }

  handleClick(i) {
    const tt = this.state.squares;
    if (this.gotWinner || tt[i]) return;

    tt[i] = this.mark;
    this.mark = this.mark === 'X' ? 'O' : 'X';
    this.setState({
      squares: tt,
    });
  }

  render() {
    this.gotWinner = checkWinner(this.state.squares)
    if (this.gotWinner) {
      this.mark = this.mark === 'X' ? 'O' : 'X';
      this.next = `congratulations player ${this.mark}`;
    } else {
      this.next = `next player : ${this.mark}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={this.state.squares}
            onClick={(i) => this.handleClick(i)}
          />
          <ul>
            <li>{this.next}</li>
          </ul>
        </div>
      </div>
    )
  }
}


ReactDOM.render(
  <Game/>,
  document.getElementById('root')
);

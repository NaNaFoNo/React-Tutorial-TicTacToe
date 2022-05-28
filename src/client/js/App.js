import React from 'react';

/* class Square extends React.Component {  
  render() {
      return (
        <button 
          className="square" 
          onClick={() => this.props.onClick()}
        >
          {this.props.value}
        </button>
      );
    }
} */

function Square(props) {
  if (props.win){
    return (
      <button 
          className="square" 
          onClick={props.onClick}
          style={{ color: 'red' }}
        >
          {props.value}
        </button>
    )
  } else {
    return (
      <button 
          className="square" 
          onClick={props.onClick}
        >
          {props.value}
        </button>
    )
  }
  
}

class Board extends React.Component {
  /* constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  } */
  /* handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
       squares: squares,
       xIsNext: !this.state.xIsNext,
    });
  } */
  renderSquare(i) {
    return (
      <Square 
        value={this.props.squares[i]}
        onClick={ () => this.props.onClick(i)}
        win={this.props.win.move[i]}
      />
    );
  }

  renderCol(cols, row) {
    const col = []
    for (let i=0; i<cols; i++)
      {
        col.push(this.renderSquare(row * 3 + i))
      }      
    return col;
  }

  renderRow(cols, row) {
    return (
      <div key={row} className="board-row">
        {this.renderCol(cols, row)}
      </div>
    );
  }

  renderBoard(cols, rows) {
    const board = [];
    for (let i=0; i<rows; i++)
      {
        board.push(this.renderRow(cols, i));
      }
    return board;
  }

  render() {
    return (
      <div>
        { this.renderBoard(3,3)}
      </div>
    )
  }

  /* render() {
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
  } */
}
  

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      pos: [{
        col: null,
        row: null
      }],
      historyOrder: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const pos = this.state.pos.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const row = Math.trunc(i/3)+1;
    const col = (i % 3)+1;

    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
        history: history.concat([{
          squares: squares,
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
        pos: pos.concat([{
          col: col,
          row: row
        }])
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  changeOrderClick(){
    this.setState({
      historyOrder: !this.state.historyOrder
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const win = calculateWinner(current.squares);
    const pos = this.state.pos;
    const historyOrder = this.state.historyOrder;

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + ' (' + pos[move].col + '/' + pos[move].row + ')':
        'Go to game start (Column/Row)';
      
      if (move === this.state.stepNumber) {
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)} style={{ fontWeight: 600 }}>{desc}</button>
          </li>
        );
      };

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
      
    });

    let status;
    if (win.winner) {
      status = 'Winner: ' + win.winner;
    } else {
      if (this.state.stepNumber === 9) {
        status = 'Match ended in a draw!';
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
      
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={ (i) => this.handleClick(i)}
            win={win}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          
          <ol>{historyOrder ? moves : moves.reverse()}</ol>
          <button onClick={() => this.changeOrderClick()}>Toggle Order Asc/Desc</button>
        </div>
      </div>
    );
  }
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
  ];
  let win = {
    winner: null,
    move:Array(9).fill(false)
  };
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      win.winner = squares[a];
      win.move[a] = true;
      win.move[b] = true;
      win.move[c] = true;
      return win;
    }
  }
  return win;
}


export function App() {
  return (
    <>
      <Game />
    </>
  )
}
import { Box, Button, Typography } from "@material-ui/core";
import Chessboard from "chessboardjsx";
import { createRef, useCallback, useEffect, useRef, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { useStyles } from "./styles";
import React from "react";
import { Move, Square } from 'chess.js'
import Timer, { TimerFunctions } from "./Timer";
import io from 'socket.io-client'
const Chess = require('chess.js')

export default function Game() {

  const classes = useStyles()
  const params: any = useParams()

  const { search } = useLocation()
  const timerRef = useRef<TimerFunctions>()
  const timer2Ref = useRef<TimerFunctions>()
  const [game, setGame] = useState(new Chess())
  const [history, setHistory] = useState<Move[]>([])
  const [fen, setFen] = useState<string>('start')
  const [width, setWidth] = useState(600)
  const { id } = params
  const [socket, setSocket] = useState<SocketIOClient.Socket>(io('http://localhost:3001/'))
  const [finalMessage, setFinalMessage] = useState('')


  // setTimeout(() => {
  //   console.log('changing to 59')
  //   setPlayer1Time(59)
  // }, 10000)

  const handleDrop = useCallback(function (sourceSquare: Square, targetSquare: Square) {
    if(game.game_over())
      return
    // see if the move is legal
    let move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q" // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return;
    setFen(game.fen())
    setHistory(game.history({verbose: true}))
  }, [game])

  useEffect(() => {
    socket.emit('userData', {
      userId: 123
    })
    socket.emit('joinGame', {
      gameId: id
    })
    socket.on('gameover', (data: any) => {
      if(data.reason === 'checkmate') {
        const color = new URLSearchParams(search).get('color') as "white" | "black"
        if(data.winner === color) {
          setFinalMessage("You Won the game!")
        }
        else {
          setFinalMessage("Your opponent won the game!")
        }
      }
      else if(data.reason === 'draw') {
        setFinalMessage("The game finished with a draw.")
      }
      else if(data.reason === 'resign') {
        const color = new URLSearchParams(search).get('color') as "white" | "black"
        if(data.winner === color) {
          setFinalMessage("You Won the game! Your opponent resigned.")
        }
        else {
          setFinalMessage("Your opponent won the game! You resigned.")
        }
      }
      else if(data.reason === 'timeout') {
        const color = new URLSearchParams(search).get('color') as "white" | "black"
        if(data.winner === color) {
          setFinalMessage("You Won the game! Your opponent ran out of time.")
        }
        else {
          setFinalMessage("Your opponent won the game! You ran out of time.")
        }
      }
      timerRef.current?.stop()
      timer2Ref.current?.stop()
    })
    socket.on('madeMove', (data: any) => {
      handleDrop(data.de, data.para)
      const timer1 = timerRef.current as TimerFunctions
      const timer2 = timer2Ref.current as TimerFunctions
      if(data.color === new URLSearchParams(search).get('color') as "white" | "black") {
        timer1.stop()
        timer1.changeValue(data.tempo)
        timer2.start()
      }
      else {
        const timer2 = timer2Ref.current as TimerFunctions
        timer2.stop()
        timer2.changeValue(data.tempo)
        timer1.start()
      }
    })
  }, [game, handleDrop, id, search, socket])

  return (
    <Box width='100%' className={classes.box}>
      {finalMessage !== '' && 
        <Typography align="center">
          {finalMessage}
        </Typography>
      }
      <Box width={width}>
        <Typography>
          Opponent
        </Typography>
        <Timer 
          startTime={Number.parseInt((new URLSearchParams(search).get('rithm') as string).split('+')[0])} 
          ref={timer2Ref}
        />
      </Box>
      <Chessboard 
        orientation={new URLSearchParams(search).get('color') as "white" | "black"}
        onDrop={({sourceSquare, targetSquare}) => {
          if((game.history({verbose:true}).length % 2 === 0 && new URLSearchParams(search).get('color') === 'black') ||
          (game.history({verbose:true}).length % 2 !== 0 && new URLSearchParams(search).get('color') === 'white'))
            return
          socket.emit('move', {
            from: sourceSquare,
            to: targetSquare
          })
        }}
        position={fen} calcWidth={({screenWidth}) => {
        setWidth(600)
        return 600
      }}/>
      <Box width={width}>
        <Typography>
          You
        </Typography>
        <Timer 
          startTime={Number.parseInt((new URLSearchParams(search).get('rithm') as string).split('+')[0])} 
          ref={timerRef}
        />
        <Button onClick={() => {
          socket.emit('resign')
        }}>RESIGN</Button>
      </Box>
    </Box>
  )

}
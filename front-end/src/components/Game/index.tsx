import { Box, Typography } from "@material-ui/core";
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
  const [player2Turn, setPlayer2Turn] = useState(false)
  const [game, setGame] = useState(new Chess())
  const [history, setHistory] = useState<Move[]>([])
  const [fen, setFen] = useState<string>('start')
  const [width, setWidth] = useState(600)
  const { id } = params
  const [socket, setSocket] = useState<SocketIOClient.Socket>(io('http://localhost:3001/'))


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
    socket.on('message', (data: any) => {
      console.log(data.message)
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
      <Box width={width}>
        <Typography>
          Player 1
        </Typography>
        <button onClick={() => (timerRef.current as TimerFunctions).start()}>Change this</button>
        <button onClick={() => (timerRef.current as TimerFunctions).stop()}>Stop</button>
        <Timer startTime={Number.parseInt((new URLSearchParams(search).get('rithm') as string).split('+')[0])} ref={timerRef}/>
        <Timer startTime={Number.parseInt((new URLSearchParams(search).get('rithm') as string).split('+')[0])} ref={timer2Ref}/>
      </Box>
      <Chessboard 
        orientation={new URLSearchParams(search).get('color') as "white" | "black"}
        onDrop={({sourceSquare, targetSquare}) => {socket.emit('move', {
          from: sourceSquare,
          to: targetSquare
        })}}
        position={fen} calcWidth={({screenWidth}) => {
        setWidth(600)
        return 600
      }}/>
    </Box>
  )

}
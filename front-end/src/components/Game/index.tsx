import { Box, Typography } from "@material-ui/core";
import Chessboard from "chessboardjsx";
import { createRef, useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useStyles } from "./styles";
import React from "react";
import { Move, Square } from 'chess.js'
import Timer, { TimerFunctions } from "./Timer";
const Chess = require('chess.js')

export default function Game() {

  const classes = useStyles()
  const urlHistory = useHistory()
  const params: any = useParams()

  const timerRef = useRef<TimerFunctions>()
  const timer2Ref = useRef<TimerFunctions>()
  const [player2Turn, setPlayer2Turn] = useState(false)
  const [game, setGame] = useState(new Chess())
  const [history, setHistory] = useState<Move[]>([])
  const [fen, setFen] = useState<string>('start')
  const [width, setWidth] = useState(600)
  const { id } = params

  // setTimeout(() => {
  //   console.log('changing to 59')
  //   setPlayer1Time(59)
  // }, 10000)

  const handleDrop = (sourceSquare: Square, targetSquare: Square) => {
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
    const timer2 = (timer2Ref.current as TimerFunctions)
    const timer1 = (timerRef.current as TimerFunctions)
    if(player2Turn) {
      timer2.stop()
      timer1.start()
    }
    else {
      timer1.stop()
      timer2.start()
    }
    setPlayer2Turn(!player2Turn)
  } 

  return (
    <Box width='100%' className={classes.box}>
      <Box width={width}>
        <Typography>
          Player 1
        </Typography>
        <button onClick={() => (timerRef.current as TimerFunctions).start()}>Change this</button>
        <button onClick={() => (timerRef.current as TimerFunctions).stop()}>Stop</button>
        <Timer ref={timerRef}/>
        <Timer ref={timer2Ref}/>
      </Box>
      <Chessboard 
        onDrop={({sourceSquare, targetSquare}) => handleDrop(sourceSquare, targetSquare)}
        position={fen} calcWidth={({screenWidth}) => {
        setWidth(600)
        return 600
      }}/>
    </Box>
  )

}
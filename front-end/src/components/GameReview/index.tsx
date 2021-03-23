import { Box, Typography, Button } from '@material-ui/core'
import Chessboard from 'chessboardjsx'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { authAtom, UserInfo } from '../../atoms/auth'
import { PlayerGameWithMoves } from '../../atoms/game'
import { getGame } from '../../services/gameServices'
import Timer, { TimerFunctions } from '../Game/Timer'
import { useStyles } from './styles'
import { Move, Square } from 'chess.js'
const Chess = require('chess.js')

export default function GameReview() {

  const classes = useStyles()
  const { id } = useParams() as any
  const [auth,] = useRecoilState(authAtom)
  const [dbGame, setDbGame] = useState<PlayerGameWithMoves>()
  const [perspective, setPerspective] = useState<'white' | 'black'>('white')
  const timerRef = useRef<TimerFunctions>()
  const timer2Ref = useRef<TimerFunctions>()
  const [game, setGame] = useState(new Chess())
  const [history, setHistory] = useState<Move[]>([])
  const [fen, setFen] = useState<string>('start')
  const [width, setWidth] = useState(600)
  const [sequencial, setSequencial] = useState(0)

  const concreteAuth = auth as UserInfo

  useEffect(() => {
    const getData = async () => {
      const dbGame = await getGame(concreteAuth.jwt, id)
      setDbGame(dbGame)
    }
    getData()
  }, [concreteAuth.jwt, id])

  useEffect(() => {
    if(dbGame) {
      const timer1 = timerRef.current as TimerFunctions
      const timer2 = timer2Ref.current as TimerFunctions
      timer1.changeValue(Number.parseInt(dbGame.game.rithm.split('+')[0]) * 60)
      timer2.changeValue(Number.parseInt(dbGame.game.rithm.split('+')[0]) * 60)
      setSequencial(0)
      setFen('start')
      setHistory([])
    }
  }, [dbGame])

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
    if (move === null) {
      console.log('move is null')
      return;
    }
    setFen(game.fen())
    setHistory(game.history({verbose: true}))
  }, [game])

  const handlePrevMove = () => {
    const timer1 = timerRef.current as TimerFunctions
    const timer2 = timer2Ref.current as TimerFunctions
    if(!dbGame || sequencial === 0)
      return
    if(sequencial === 1) {
      return
    }
    else {
      game.undo()
      game.undo()
      const gameTime = Number.parseInt(dbGame.game.rithm.split('+')[0]) * 60
      const move = sequencial - 4 >= 0 ? dbGame.moves[sequencial - 4] : {time: gameTime}
      const move2 = sequencial - 3 >= 0 ? dbGame.moves[sequencial - 3] : {time: gameTime}
      setFen(game.fen())
      setHistory(game.history({verbose: true}))
      if(sequencial % 2 === 0) {
        if(perspective === 'white') {
          timer1.changeValue(move.time)
          timer2.changeValue(move2.time)
        }
        else {
          timer2.changeValue(move.time)
          timer1.changeValue(move2.time)
        }
      }
      else {
        if(perspective === 'white') {
          timer1.changeValue(move2.time)
          timer2.changeValue(move.time)
        }
        else {
          timer2.changeValue(move2.time)
          timer1.changeValue(move.time)
        }
      }
      setSequencial(sequencial - 2)
    }
  }

  const handleNextMove = () => {
    if(!dbGame)
      return
    if(sequencial === dbGame.moves.length)
      return
    const move = dbGame.moves[sequencial]
    handleDrop(move.from as Square, move.to as Square)
    const timer1 = timerRef.current as TimerFunctions
    const timer2 = timer2Ref.current as TimerFunctions
    if(sequencial % 2 === 0) {
      if(perspective === 'white')
        timer1.changeValue(move.time)
      else
        timer2.changeValue(move.time)
    }
    else {
      if(perspective === 'white')
        timer2.changeValue(move.time)
      else
        timer1.changeValue(move.time)
    }
    setSequencial(sequencial + 1)
  }

  const handleChangePerspective = () => {
    if(!dbGame)
      return
    setPerspective(perspective === 'white' ? 'black' : 'white')
    const timer1 = timerRef.current as TimerFunctions
    const timer2 = timer2Ref.current as TimerFunctions
    const gameTime = Number.parseInt(dbGame.game.rithm.split('+')[0]) * 60
    const move = sequencial - 2 >= 0 ? dbGame.moves[sequencial - 2] : {time: gameTime}
    const move2 = sequencial - 1 >= 0 ? dbGame.moves[sequencial - 1] : {time: gameTime}
    if(sequencial % 2 === 0) {
      timer1.changeValue(move2.time)
      timer2.changeValue(move.time)
    }
    else {
      timer1.changeValue(move.time)
      timer2.changeValue(move2.time)
    }
  }

  return (
    <Box width='100%' className={classes.box}>
      <div>
        <Button style={{padding: 10}} onClick={handlePrevMove}>Previous Move</Button>
        <Button style={{padding: 10}} onClick={handleNextMove}>Next Move</Button>
        <Button style={{padding: 10}} onClick={handleChangePerspective}>Change Perspective</Button>
      </div>
      {dbGame && sequencial === dbGame.moves.length && 
        <Typography align="center">
          {dbGame.game.reasonEnd === 'draw' ? `The game ended in a draw.` : `${dbGame.game.winner} wins by ${dbGame.game.reasonEnd}.`}
        </Typography>
      }
      <Box width={width}>
        <Typography>
          {dbGame ? perspective === 'black' ? dbGame.game.whitePlayer.name : dbGame.game.blackPlayer.name : 'Loading Info...'}
        </Typography>
        <Timer 
          startTime={dbGame ? Number.parseInt(dbGame.game.rithm.split('+')[0]) * 60 : 0} 
          ref={timer2Ref}
        />
      </Box>
      <Chessboard 
        orientation={perspective}
        onDrop={({sourceSquare, targetSquare}) => {}}
        position={fen} calcWidth={({screenWidth}) => {
        setWidth(600)
        return 600
      }}/>
      <Box width={width}>
        <Typography>
          {dbGame ? perspective === 'white' ? dbGame.game.whitePlayer.name : dbGame.game.blackPlayer.name : 'Loading Info...'}
        </Typography>
        <Timer 
          startTime={dbGame ? Number.parseInt(dbGame.game.rithm.split('+')[0]) * 60 : 0} 
          ref={timerRef}
        />
      </Box>
    </Box>
  )

}
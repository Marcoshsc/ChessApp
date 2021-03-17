import { Box, Button, ButtonGroup, FormControl, Grid, InputLabel, Select } from "@material-ui/core"
import React, { useState } from "react"
import { useStyles } from "./styles"
import { useStyles as useChessStyles } from '../ChessBoard/styles'
import { useHistory, Switch, Route } from "react-router-dom"
import Game from "../Game"
import io from 'socket.io-client'

export default function PlayPage() {

  const classes = useStyles()
  const chessClasses = useChessStyles()
  const history = useHistory()
  const [rithm, setRithm] = useState<string>()

  const handleCreateGame = () => {
    const socket = io('http://localhost:3001/')
    socket.emit('userData', {
      userId: 123
    })
    socket.emit('waitGame', {
      rithm: rithm
    })
    socket.on('gameCreated', (data: any) => {
      socket.disconnect()
      history.replace(`/play/${data.gameId}?color=${data.color}&rithm=${data.ritmo}`)
    })
  }

  return (
    <Box width="100%" className={classes.box}>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel htmlFor="game-time" style={{backgroundColor: '#fafafa', padding: 2}} >Time</InputLabel>
        <Select
          native
          value={!rithm ? '' : rithm}
          onChange={(e) => {
            setRithm(e.target.value as string)
          }}
          inputProps={{
            name: 'Time',
            id: 'game-time',
          }}
        >
          <option aria-label="None" value="" />
          <option value={'1+0'}>1 Minute (No increment)</option>
          <option value={'1+1'}>1 Minute (1 second increment)</option>
          <option value={'3+0'}>3 Minutes (No increment)</option>
          <option value={'3+2'}>3 Minutes (2 seconds increment)</option>
          <option value={'5+0'}>5 Minutes (No increment)</option>
          <option value={'5+3'}>5 Minutes (3 seconds increment)</option>
          <option value={'10+0'}>10 Minutes (No increment)</option>
          <option value={'10+5'}>10 Minutes (5 seconds increment)</option>
          <option value={'15+15'}>15 Minutes (15 seconds increment)</option>
          <option value={'30+30'}>30 Minutes (30 seconds increment)</option>
        </Select>
      </FormControl>
      <ButtonGroup>
        <Button variant="outlined" color="primary">Play against a friend</Button>
        <Button variant="outlined" color="primary">Play against the machine</Button>
        <Button onClick={handleCreateGame} variant="outlined" color="primary">Play against a random opponent</Button>
      </ButtonGroup>
    </Box>
  )

}
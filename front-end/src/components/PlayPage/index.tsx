import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  Typography,
} from '@material-ui/core'
import { useState } from 'react'
import { useStyles } from './styles'
import { useHistory } from 'react-router-dom'
import io from 'socket.io-client'
import { useRecoilState } from 'recoil'
import { authAtom } from '../../atoms/user'

export default function PlayPage() {
  const classes = useStyles()
  const history = useHistory()
  const [rithm, setRithm] = useState<string>()
  const [auth] = useRecoilState(authAtom)
  const [waiting, setWaiting] = useState(false)

  const handleCreateGame = () => {
    if (!rithm) return
    setWaiting(true)
    const socket = io('http://localhost:3001/')
    socket.emit('userData', {
      token: auth?.jwt,
    })
    socket.emit('waitGame', {
      rithm: rithm,
    })
    socket.on('gameCreated', (data: any) => {
      setWaiting(false)
      socket.disconnect()
      history.replace(
        `/play/${data.gameId}?color=${data.color}&rithm=${data.ritmo}`,
      )
    })
  }

  return (
    <Box width="100%" className={classes.box}>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel
          htmlFor="game-time"
          style={{ backgroundColor: '#fafafa', padding: 2 }}
        >
          Time
        </InputLabel>
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
        <Button onClick={handleCreateGame} variant="outlined" color="primary">
          Play
        </Button>
      </ButtonGroup>
      {waiting && (
        <div
          style={{
            padding: 10,
            display: 'flex',
            flexDirection: 'row',
            gap: 20,
          }}
        >
          <Typography>Searching for a game...</Typography>
          <CircularProgress />
        </div>
      )}
    </Box>
  )
}

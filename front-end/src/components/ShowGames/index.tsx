import { Button, Card, FormControl, InputLabel, MenuItem, Select, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { authAtom, UserInfo } from "../../atoms/user";
import { PlayerGame } from "../../atoms/game";
import { getGames } from "../../services/gameServices";
import { formatDate } from "../../util/dateUtils";
import { useStyles } from "./styles";

export default function ShowGames() {
  const [auth,] = useRecoilState(authAtom)
  const [games, setGames] = useState<PlayerGame[]>([])

  const history = useHistory()
  const { id } = useParams() as any

  type FilterResultType = 'all' | 'victory' | 'defeat'
  type FilterRithmType = 'all' | '1+0' | '1+1' | '3+0' | '3+2' | '5+0' | '5+3' | '10+0' | '10+5' | '15+15' | '30+30'
  type FilterColorType = 'all' | 'white' | 'black'
  type FilterReasonendType = 'all' | 'draw' | 'checkmate' | 'resign' | 'timeout'

  const [filterResult, setFilterResult] = useState<FilterResultType>('all')
  const [filterRithm, setFilterRithm] = useState<FilterRithmType>('all')
  const [filterColor, setFilterColor] = useState<FilterColorType>('all')
  const [filterReasonend, setFilterReasonend] = useState<FilterReasonendType>('all')

  const classes = useStyles()

  const concreteAuth = auth as UserInfo

  useEffect(() => {
    async function loadData() {
      const dbGames = await getGames(concreteAuth.jwt, id)
      setGames(dbGames)
    }
    loadData()
  }, [auth, concreteAuth.jwt, setGames, id])

  return (
    <div className={classes.box}>
      <Typography component="h5" align="center" className={classes.title}>Played Games</Typography>
      <div>
        <FormControl className={classes.formControl}>
          <InputLabel id="filter-by-result-select">Filter By Result</InputLabel>
          <Select
            labelId="filter-by-result-select"
            id="filter-by-result"
            value={filterResult}
            onChange={(e) => setFilterResult(e.target.value as FilterResultType)}
          >
            <MenuItem value={'all'}>All Results</MenuItem>
            <MenuItem value={'victory'}>Victory</MenuItem>
            <MenuItem value={'defeat'}>Defeat</MenuItem>
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel id="filter-by-rithm-select">Filter By Rithm</InputLabel>
          <Select
            labelId="filter-by-rithm-select"
            id="filter-by-rithm"
            value={filterRithm}
            onChange={(e) => setFilterRithm(e.target.value as FilterRithmType)}
          >
            <MenuItem value={'all'}>All rithms</MenuItem>
            <MenuItem value={'1+0'}>1 Minute (No increment)</MenuItem>
            <MenuItem value={'1+1'}>1 Minute (1 second increment)</MenuItem>
            <MenuItem value={'3+0'}>3 Minutes (No increment)</MenuItem>
            <MenuItem value={'3+2'}>3 Minutes (2 seconds increment)</MenuItem>
            <MenuItem value={'5+0'}>5 Minutes (No increment)</MenuItem>
            <MenuItem value={'5+3'}>5 Minutes (3 seconds increment)</MenuItem>
            <MenuItem value={'10+0'}>10 Minutes (No increment)</MenuItem>
            <MenuItem value={'10+5'}>10 Minutes (5 seconds increment)</MenuItem>
            <MenuItem value={'15+15'}>15 Minutes (15 seconds increment)</MenuItem>
            <MenuItem value={'30+30'}>30 Minutes (30 seconds increment)</MenuItem>
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel id="filter-by-color-select">Filter By Color</InputLabel>
          <Select
            labelId="filter-by-color-select"
            id="filter-by-color"
            value={filterColor}
            onChange={(e) => setFilterColor(e.target.value as FilterColorType)}
          >
            <MenuItem value={'all'}>All Colors</MenuItem>
            <MenuItem value={'white'}>White</MenuItem>
            <MenuItem value={'black'}>Black</MenuItem>
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel id="filter-by-reasonend-select">Filter By End Reason</InputLabel>
          <Select
            labelId="filter-by-reasonend-select"
            id="filter-by-reasonend"
            value={filterReasonend}
            onChange={(e) => setFilterReasonend(e.target.value as FilterReasonendType)}
          >
            <MenuItem value={'all'}>All Reasons</MenuItem>
            <MenuItem value={'checkmate'}>Checkmate</MenuItem>
            <MenuItem value={'draw'}>Draw</MenuItem>
            <MenuItem value={'timeout'}>Timeout</MenuItem>
            <MenuItem value={'resign'}>Resign</MenuItem>
          </Select>
        </FormControl>
      </div>
      {games.filter(game => {
        const color = game.blackPlayer.id === (Number.parseInt(id)) ? 'black' : 'white'
        if(filterResult !== 'all' && game.reasonEnd === 'draw')
          return false
        if(filterResult !== 'all' && ((game.winner !== color && filterResult === 'victory') || (game.winner === color && filterResult === 'defeat')))
          return false
        if(filterColor !== 'all' && color !== filterColor)
          return false
        if(filterReasonend !== 'all' && game.reasonEnd !== filterReasonend)
          return false
        if(filterRithm !== 'all' && game.rithm !== filterRithm)
          return false
        return true
      }).map(game => {
        const color = game.blackPlayer.id === (Number.parseInt(id)) ? 'black' : 'white'
        const opponent = game.blackPlayer.id === (Number.parseInt(id)) ? game.whitePlayer : game.blackPlayer
        const victory = (game.blackPlayer.id === (Number.parseInt(id)) && game.winner === 'black') ||
        (game.whitePlayer.id === (Number.parseInt(id)) && game.winner === 'white')
        const draw = game.reasonEnd === 'draw'
        return (
          <Card key={game.id} className={classes.card}>
            <Typography align="center">{`Game against ${opponent.name} with ${color} pieces at ${formatDate(game.creationDate)}`}</Typography>
            <Typography>{`Rithm: ${game.rithm}`}</Typography>
            <Typography>{`Result: ${draw ? 'draw' : victory ? 'Victory' : 'Defeat'}`}</Typography>
            {!draw && <Typography>{`Reason end: ${game.reasonEnd}`}</Typography>}
            <div style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <Button className={classes.button} onClick={() => history.replace(`/review/${game.id}`)}>See game details</Button>
            </div>
          </Card>
        )
      })}
    </div>
  )

}
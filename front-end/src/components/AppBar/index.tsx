import React, { useState } from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import InputBase from '@material-ui/core/InputBase'
import SearchIcon from '@material-ui/icons/Search'
import { useStyles } from './styles'
import { useRecoilState } from 'recoil'
import { authAtom } from '../../atoms/user'
import { useHistory } from 'react-router'

export default function PrimarySearchAppBar() {
  const classes = useStyles()
  const [auth] = useRecoilState(authAtom)
  const history = useHistory()
  const [username, setUsername] = useState('')

  const handleSearch = () => {
    history.replace(`/search/${username}`)
    setUsername('')
  }

  return (
    <div className={classes.grow}>
      <AppBar className={classes.appbar}>
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            {`Welcome to MyChess, ${auth?.nome}!`}
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch()
              }}
            />
          </div>
        </Toolbar>
      </AppBar>
    </div>
  )
}

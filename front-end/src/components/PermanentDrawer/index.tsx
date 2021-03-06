import React from 'react'
import Drawer from '@material-ui/core/Drawer'
import CssBaseline from '@material-ui/core/CssBaseline'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import GamepadIcon from '@material-ui/icons/Gamepad'
import PeopleIcon from '@material-ui/icons/People'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import { useStyles } from './styles'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import PrimarySearchAppBar from '../AppBar'
import { Link, Route, Switch, useHistory } from 'react-router-dom'
import UnstyledLink from '../UnstyledLink'
import PlayPage from '../PlayPage'
import Game from '../Game'
import ShowGames from '../ShowGames'
import GameReview from '../GameReview'
import Profile from '../Profile'
import { useRecoilState } from 'recoil'
import { authAtom, UserInfo } from '../../atoms/user'
import FollowingPage from '../FollowingPage'
import { Button } from '@material-ui/core'
import SearchPage from '../SearchPage'

export default function PermanentDrawerLeft() {
  const classes = useStyles()
  const [auth, setAuth] = useRecoilState(authAtom)
  const history = useHistory()

  const handleLogOut = () => {
    setAuth(undefined)
    history.replace('/')
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <PrimarySearchAppBar />
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <Typography
          align="center"
          style={{ width: '100%', padding: 20, fontSize: 18 }}
        >
          Play Chess Online Free.
        </Typography>
        <Divider />
        <List>
          <ListItem button>
            <ListItemIcon>
              <PlayArrowIcon />
            </ListItemIcon>
            <ListItemText
              primary={<UnstyledLink to="/play">Play</UnstyledLink>}
            />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <GamepadIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                <UnstyledLink to={`/games/${(auth as UserInfo).id}`}>
                  My Games
                </UnstyledLink>
              }
            />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                <UnstyledLink to={`/following/${(auth as UserInfo).id}`}>
                  Follow Interface
                </UnstyledLink>
              }
            />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText
              primary={
                <UnstyledLink to={`/profile/${(auth as UserInfo).id}`}>
                  My Profile
                </UnstyledLink>
              }
            />
          </ListItem>
          <ListItem button onClick={handleLogOut}>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary={'Log Out'} />
          </ListItem>
          {/* <Button onClick={handleLogOut}>Log out</Button> */}
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Switch>
          <Route path="/play/:id">
            <Game />
          </Route>
          <Route path="/play">
            <PlayPage />
          </Route>
          <Route path="/profile/:id">
            <Profile />
          </Route>
          <Route path="/following/:id">
            <FollowingPage />
          </Route>
          <Route path="/games/:id">
            <ShowGames />
          </Route>
          <Route path="/review/:id">
            <GameReview />
          </Route>
          <Route path="/search/:username">
            <SearchPage />
          </Route>
        </Switch>
      </main>
    </div>
  )
}

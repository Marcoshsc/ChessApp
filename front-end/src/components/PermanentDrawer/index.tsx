import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import GamepadIcon from '@material-ui/icons/Gamepad';
import PeopleIcon from '@material-ui/icons/People';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { useStyles } from './styles';
import PrimarySearchAppBar from '../AppBar';
import { Link, Route, Switch } from 'react-router-dom'
import UnstyledLink from '../UnstyledLink';
import PlayPage from '../PlayPage';
import Game from '../Game';
import ShowGames from '../ShowGames';
import GameReview from '../GameReview';
import Profile from '../Profile';
import { useRecoilState } from 'recoil';
import { authAtom, UserInfo } from '../../atoms/auth';

export default function PermanentDrawerLeft() {
  const classes = useStyles();
  const [auth,] = useRecoilState(authAtom)

  return (
    <div className={classes.root}>
      <CssBaseline />
      <PrimarySearchAppBar/>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <Typography align="center" style={{width: '100%', padding: 20, fontSize: 18}}>
          Play Chess Online Free.
        </Typography>
        <Divider />
        <List>
          <ListItem button>
            <ListItemIcon><PlayArrowIcon/></ListItemIcon>
            <ListItemText primary={<UnstyledLink to="/play">Play</UnstyledLink>} />
          </ListItem>
          <ListItem button>
            <ListItemIcon><GamepadIcon/></ListItemIcon>
            <ListItemText primary={<UnstyledLink to={`/games/${(auth as UserInfo).id}`}>My Games</UnstyledLink>} />
          </ListItem>
          <ListItem button>
            <ListItemIcon><PeopleIcon/></ListItemIcon>
            <ListItemText primary={<UnstyledLink to="/friends">Friends</UnstyledLink>} />
          </ListItem>
          <ListItem button>
            <ListItemIcon><AccountCircleIcon/></ListItemIcon>
            <ListItemText primary={<UnstyledLink to={`/profile/${(auth as UserInfo).id}`}>My Profile</UnstyledLink>} />
          </ListItem>
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Switch>
          <Route path="/play/:id" >
            <Game/>
          </Route>
          <Route path="/play">
            <PlayPage/>
          </Route>
          <Route path="/profile/:id">
            <Profile/>
          </Route>
          <Route path="/friends">
            <h1>friends</h1>
          </Route>
          <Route path="/games/:id">
            <ShowGames/>
          </Route>
          <Route path="/review/:id">
            <GameReview/>
          </Route>
        </Switch>
      </main>
    </div>
  );
}

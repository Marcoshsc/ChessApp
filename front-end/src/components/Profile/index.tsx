import { Button, Grid, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { authAtom, UserInfo, UserInfoProfile } from '../../atoms/user'
import { followOrUnfollow, getProfile } from '../../services/userServices'
import { formatDate } from '../../util/dateUtils'
import { useStyles } from './styles'

interface Info {
  won: number
  lost: number
  drawn: number
}

export default function Profile() {

  const [auth,] = useRecoilState(authAtom)
  const classes = useStyles()
  const history = useHistory()
  const gameRithms = ['1+0', '1+1', '3+0', '3+2', '5+0', '5+3', '10+0', '10+5','15+15', '30+30']

  const { id } = useParams() as any
  const [userInfo, setUserInfo] = useState<UserInfoProfile>()

  useEffect(() => {
    const getData = async () => {
      const profile = await getProfile((auth as UserInfo).jwt, id)
      setUserInfo(profile)
    }
    getData()
  }, [auth, id])

  if(!userInfo) {
    return (
      <h1>Loading profile...</h1>
    )
  }

  const { nome, memberSince } = userInfo.user

  let totalGamesPlayed = 0
  const infoMap: Map<string, Info> = new Map()
  gameRithms.forEach(el => infoMap.set(el, { won: 0, lost: 0, drawn: 0}))
  userInfo.gamesInfo.won.forEach(el => {
    (infoMap.get(el.rithm) as Info).won = el.total
    totalGamesPlayed += el.total
  })
  userInfo.gamesInfo.lost.forEach(el => {
    (infoMap.get(el.rithm) as Info).lost = el.total
    totalGamesPlayed += el.total
  })
  userInfo.gamesInfo.drawn.forEach(el => {
    (infoMap.get(el.rithm) as Info).drawn = el.total
    totalGamesPlayed += el.total
  })

  const handleSeeGames = () => {
    history.replace(`/games/${id}`)
  }

  const handleFollow = async () => {

    console.log('got here')
    await followOrUnfollow((auth as UserInfo).jwt, id)

    const profile = await getProfile((auth as UserInfo).jwt, id)
    setUserInfo(profile)
  }

  return (
    <div>
      <Typography align='center' className={classes.title}>{`Profile of ${nome}`}</Typography>
      <Typography align='center'>{`Member since ${formatDate(memberSince)}`}</Typography>
      {(auth as UserInfo).id !== Number.parseInt(id) && <Button onClick={handleFollow}>{userInfo.isFollowing ? 'Unfollow' : 'Follow'}</Button>}
      <div style={{padding: 10}}>
        <Typography className={classes.title}>{`Statistics`}</Typography>
        <Typography align="center" style={{fontSize: 20, paddingBottom: 20}}>{`Total played games: ${totalGamesPlayed}`}</Typography>
        {
          gameRithms.map(gr => {
            const info = infoMap.get(gr) as Info
            const total = info.drawn + info.lost + info.won
            return (
              <Grid style={{padding: 10}} key={gr} container spacing={2}>
                <Grid item xs={3}>{`Total ${gr} games played: ${total}`}</Grid>
                <Grid item xs={3}>{`Won games: ${info.won} (${total ? (info.won / total) * 100 : 0}%)`}</Grid>
                <Grid item xs={3}>{`Drawn games: ${info.drawn} (${total ? (info.drawn / total) * 100 : 0}%)`}</Grid>
                <Grid item xs={3}>{`Lost games: ${info.lost} (${total ? (info.lost / total) * 100 : 0}%)`}</Grid>
              </Grid>
            )
          })
        }
        <Button style={{ width: '100%', fontSize: 20, color: 'purple'}} onClick={handleSeeGames}>See games</Button>
      </div>
    </div>
  )

}
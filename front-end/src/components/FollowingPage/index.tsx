import { Button, Card, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import { useRecoilState } from 'recoil'
import { authAtom, FollowInfo, FollowSingle, UserInfo } from '../../atoms/user'
import { followOrUnfollow, getFollowInfo } from '../../services/userServices'
import { formatDate } from '../../util/dateUtils'
import { useStyles } from './styles'

export default function FollowingPage() {
  const classes = useStyles()
  const [auth] = useRecoilState(authAtom)
  const { id } = useParams() as any
  const [followers, setFollowers] = useState<FollowSingle[]>([])
  const [following, setFollowing] = useState<FollowSingle[]>([])
  const history = useHistory()

  console.log(followers)
  console.log(following)

  useEffect(() => {
    async function getData() {
      const followInfo = await getFollowInfo((auth as UserInfo).jwt, id)
      setFollowers(followInfo.followers)
      setFollowing(followInfo.following)
    }
    getData()
  }, [auth, id])

  const handleUnfollow = (userId: number) => {
    return async () => {
      await followOrUnfollow((auth as UserInfo).jwt, userId)
      const followInfo = await getFollowInfo((auth as UserInfo).jwt, id)
      setFollowers(followInfo.followers)
      setFollowing(followInfo.following)
    }
  }

  function FollowCard({
    info,
    following,
  }: {
    info: FollowSingle
    following: boolean
  }) {
    return (
      <Card className={classes.followCard}>
        <Typography align="center">{info.info.nome}</Typography>
        <Typography align="center">{`Since ${formatDate(
          info.creationDate,
        )}`}</Typography>
        <div style={{ display: 'flex', flexDirection: 'row', gap: 20, marginBottom: 10 }}>
          <Button
            style={{
              flexGrow: following && Number.parseInt(id) === auth?.id ? 0.5 : 1,
            }}
            onClick={() => history.replace(`/profile/${info.info.id}`)}
          >
            See Profile
          </Button>
          {following && Number.parseInt(id) === auth?.id && (
            <Button
              style={{ flexGrow: 0.5 }}
              onClick={handleUnfollow(info.info.id)}
            >
              Unfollow
            </Button>
          )}
        </div>
      </Card>
    )
  }

  return (
    <div className={classes.mainDiv}>
      <div className={classes.followDiv}>
        <Typography align="center">Followers</Typography>
        {followers.map((el) => (
          <FollowCard key={el.info.id} following={false} info={el} />
        ))}
      </div>
      <div className={classes.followDiv}>
        <Typography align="center">Following</Typography>
        {following.map((el) => (
          <FollowCard key={el.info.id} following={true} info={el} />
        ))}
      </div>
    </div>
  )
}

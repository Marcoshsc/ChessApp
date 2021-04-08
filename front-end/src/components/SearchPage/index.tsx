import { Button, Card, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import { authAtom, UserInfo } from '../../atoms/user'
import { searchUser } from '../../services/userServices'
import { formatDate } from '../../util/dateUtils'
import { useStyles } from './styles'

export default function SearchPage() {
  const [auth] = useRecoilState(authAtom)
  const classes = useStyles()
  const { username } = useParams() as any
  const [foundUsers, setFoundUsers] = useState<
    (Omit<UserInfo, 'jwt'> & { data_criacao: Date })[]
  >([])
  const history = useHistory()

  useEffect(() => {
    const userInfo = auth as UserInfo
    async function getData() {
      const users = await searchUser(userInfo.jwt, username)
      setFoundUsers(users)
    }
    getData()
  }, [auth, username])

  return (
    <>
      <Typography align="center" style={{ fontSize: 24, padding: 10 }}>
        User Search
      </Typography>
      <div className={classes.mainDiv}>
        {foundUsers.map((el) => (
          <Card key={el.id} className={classes.userCard}>
            <Typography align="center">{el.nome}</Typography>
            <Typography align="center">{`Member since ${formatDate(
              el.data_criacao,
            )}`}</Typography>
            <div style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
              <Button
                style={{
                  flexGrow: 1,
                }}
                onClick={() => history.replace(`/profile/${el.id}`)}
              >
                See Profile
              </Button>
            </div>
          </Card>
        ))}
        {foundUsers.length === 0 && (
          <Typography align="center">No Users found.</Typography>
        )}
      </div>
    </>
  )
}

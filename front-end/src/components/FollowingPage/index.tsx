import React from 'react'
import { useRecoilState } from 'recoil'
import { authAtom } from '../../atoms/user'

export default function FollowingPage() {

  const [auth,] = useRecoilState(authAtom)

  return (
    <h1>following!</h1>
  )

}
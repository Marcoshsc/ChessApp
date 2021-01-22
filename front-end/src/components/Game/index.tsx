import { Box, Typography } from "@material-ui/core";
import Chessboard from "chessboardjsx";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useStyles } from "./styles";
import React from "react";
import Timer from "./Timer";
import TimerFinal from "./Timer";

export default function Game() {

  const classes = useStyles()
  const params: any = useParams()

  const [player1Time, setPlayer1Time] = useState(50)
  const [width, setWidth] = useState(600)
  const { id } = params

  setTimeout(() => {
    console.log('changing to 59')
    setPlayer1Time(59)
  }, 10000)

  return (
    <Box width='100%' className={classes.box}>
      <Box width={width}>
        <Typography>
          Player 1
        </Typography>
        <TimerFinal/>
      </Box>
      <Chessboard position="start" calcWidth={({screenWidth}) => {
        setWidth(600)
        return 600
      }}/>
    </Box>
  )

}
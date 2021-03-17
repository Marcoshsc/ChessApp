import React, { useEffect } from "react";
import { forwardRef, useImperativeHandle, useState } from "react"

export interface TimerFunctions {
  changeValue(n: number): void
  stop(): void
  start(): void
}

export interface TimerProps {
  startTime: number
}

const Timer = forwardRef(({ startTime }: TimerProps, ref) => {
  
  const [value, setValue] = useState(startTime * 60);
  const [stopped, setStopped] = useState(true)

  useEffect(() => {
    setValue(startTime * 60)
  }, [startTime])

  
  useEffect(() => {
    var timerID = setInterval(() => setValue(stopped ? value : value - 1), 1000);
    console.log()
    return function cleanup() {
        clearInterval(timerID);
      };
  });

  useImperativeHandle(ref, () => ({

    changeValue(n: number) {
      setValue(n)
    },

    stop() {
      setStopped(true)
    },

    start() {
      setStopped(false)
    }

  }));
  
  return (
    <div style={{fontSize: 30}}>{Math.floor(value / 60)}:{value % 60}</div>
  )
})

export default Timer;
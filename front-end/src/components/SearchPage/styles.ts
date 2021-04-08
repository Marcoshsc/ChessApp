import { makeStyles, Theme, createStyles } from '@material-ui/core'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    userCard: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      gap: 10,
      padding: 10,
    },
    mainDiv: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 10,
      padding: 10,
    },
  }),
)

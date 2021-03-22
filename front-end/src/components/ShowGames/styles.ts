import { makeStyles, Theme, createStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      padding: 10,
      margin: 5
    },
    box: {
      overflow: 'auto'
    },
    title: {
      fontSize: 25,
      paddingBottom: 10
    },
    button: {
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    }
  }),
);
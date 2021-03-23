import { makeStyles, Theme, createStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      fontSize: 25,
      paddingBottom: 10
    },
  }),
);
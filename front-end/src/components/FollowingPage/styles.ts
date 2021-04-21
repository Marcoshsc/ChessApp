import { makeStyles, Theme, createStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    followCard: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      gap: 20,
      margin: 10,
      padding: 10,
    },
    mainDiv: {
      display: "flex",
      flexDirection: "row",
    },
    followDiv: {
      width: "50%",
      padding: 10,
      overflow: "auto",
      display: "flex",
      flexDirection: "column",
    },
  })
);

import { makeStyles, Theme, createStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    main: {
      textDecoration: 'none',
      color: theme.palette.grey[800]
    }
  }),
);
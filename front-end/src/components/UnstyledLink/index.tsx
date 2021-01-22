import { Link } from "react-router-dom";
import { useStyles } from "./styles";

interface LinkProps {
  to: string
  children: React.ReactNode
}

export default function UnstyledLink({to, children}: LinkProps) {
  
  const classes = useStyles()
  
  return (
    <Link to={to} className={classes.main}>
      {children}
    </Link>
  )
}
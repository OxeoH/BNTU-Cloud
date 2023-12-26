import { Link, Typography } from "@mui/material";

export default function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {" © "}
      <Link color="inherit" href="https://bntu.by/">
        БНТУ
      </Link>
      {", "}
      {new Date().getFullYear()}
    </Typography>
  );
}

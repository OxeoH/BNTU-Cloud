import { Box } from "@mui/material";
import { ReactComponent as BNTUIcon } from "../../shared/assets/bntu-logo.svg";

export const Logo = ({ size }: { size: number }) => {
  return (
    <Box
      sx={{
        width: 100,
        height: 100,
        backgroundColor: "#FFF", //"#F5F6F9",
        borderRadius: "50%",
        padding: 10,
      }}
    >
      <Box sx={{ objectFit: "contain" }}>
        <BNTUIcon />
      </Box>
    </Box>
  );
};

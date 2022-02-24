import Box from "@mui/material/Box";
import { SxProps, Theme } from "@mui/material/styles";

// wrapper component to create white cards with a hover effect
// can provide custom styles and/or override styles via sx
// example:
// <HoverCard sx={{p: 4}}>
//     <Typography textAlign="left">hello</Typography>
// </HoverCard>
export default function Evaluation(props: {
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
  specialCourseHeaderFlex?: boolean;
}) {
  const darkGrey = "#dfe0e2";
  const lightGrey = "#f4f4f5";
  return (
    <Box
      sx={{
        background: darkGrey,
        borderRadius: "0.75rem",
        display: props.specialCourseHeaderFlex ? "flex" : null,
        flexGrow: props.specialCourseHeaderFlex ? 1 : null,
      }}
    >
      <Box
        sx={{
          display: props.specialCourseHeaderFlex ? "flex" : null,
          flexDirection: props.specialCourseHeaderFlex ? "column" : null,
          flexGrow: props.specialCourseHeaderFlex ? 1 : null,
          background: "white",
          boxShadow:
            "rgba(0, 0, 0, 0.03) 0px 0px 16px, rgba(0, 0, 0, 0.03) 0px 0px 16px;",
          border: `1px solid ${lightGrey}`,
          borderRadius: "0.75rem",
          transition: "transform 250ms ease 0s, filter 250ms ease 0s",
          "&:hover": { transform: "translateY(-8px)" },
          ...props.sx,
        }}
      >
        {props.children}
      </Box>
    </Box>
  );
}

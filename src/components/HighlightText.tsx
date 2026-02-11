import { Box } from "@mui/material";

type HighlightTextProps = {
  text: string;
  searchText: string;
};

export const HighlightText = ({ text, searchText }: HighlightTextProps) => {
  if (!searchText.trim()) {
    return <>{text}</>;
  }

  const regex = RegExp(`(${searchText})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <Box
            key={index}
            component="span"
            sx={{
              backgroundColor: 'yellow',
              color: 'black',
              fontWeight: 'bold',
              padding: '2px 6px',
              borderRadius: '4px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
            }}
          >
            {part}
          </Box>
        ) : (
          part
        )
      )}
    </>
  );
};

import {
  Paper,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";
import type { Colors } from "../types";

type SearchBarProps = {
  searchText: string;
  colors: Colors;
  onSearchTextChange: (text: string) => void;
};

export const SearchBar = ({
  searchText,
  colors,
  onSearchTextChange,
}: SearchBarProps) => {
  return (
    <Paper
      elevation={2}
      sx={{ p: 2, mb: 3, background: colors.surface, borderRadius: 2 }}
    >
      <TextField
        fullWidth
        placeholder="メッセージを検索..."
        value={searchText}
        onChange={(e) => onSearchTextChange(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchText && (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => onSearchTextChange("")}
                  sx={{
                    '&:hover': {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
    </Paper>
  );
};

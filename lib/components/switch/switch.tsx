import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";

export const StyledSwitch = styled(Switch)(({ theme }) => ({
	"& .MuiSwitch-track": {
		backgroundColor: "#7F879E",
	},
	"& .MuiSwitch-thumb": {
		color: "#cc0303",
	},
	"& .MuiSwitch-switchBase.Mui-checked": {
		color: "#cc0303",
	},
	"& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
		backgroundColor: "#a80202",
	},
}));

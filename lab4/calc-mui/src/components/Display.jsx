import React from "react";
import { TextField } from "@mui/material";

//how the display looks 
export default function Display({ value }) {
    return (
        <TextField value={value} InputProps={{readOnly: true, sx: {fontSize: "1.8rem", textAlign: "right"}}} inputProps={{style: {textAlign: "right"}}} fullWidth variant="outlined" color="info" aria-label="calculator display"/>
    );
}

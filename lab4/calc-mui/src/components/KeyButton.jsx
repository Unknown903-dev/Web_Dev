import React from "react";
import { Button } from "@mui/material";

//how display looks 
export default function KeyButton({ label, onClick, color = "", variant = "outlined", className = "", disabled = false, sx = {} }) {
    return (
        <Button variant={variant} color={color} onClick={() => onClick(label)} className={className} disabled={disabled} sx={{ fontSize: "1.1rem", paddingY: 1.5, borderRadius: 2}} fullWidth>
            {label}
        </Button>
    );
}

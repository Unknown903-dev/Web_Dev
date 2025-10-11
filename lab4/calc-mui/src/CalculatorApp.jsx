import React, { useState } from "react";
import { Box } from "@mui/material";
import KeyButton from "./components/KeyButton";
import Display from "./components/Display";
import "./styles/Calculator.css";

export default function CalculatorApp() {
    const [current, setCurrent] = useState("0");
    const [prev, setPrev] = useState(null);
    const [op, setOp] = useState(null);
    const [lastOp, setLastOp] = useState(null);
    const [lastVal, setLastVal] = useState(null);
    const [justEvaluated, setJustEvaluated] = useState(false);

    const display = current === "" ? (prev ?? 0) : current;

    //appends the nums
    const appendDigit = (d) => {
        if (justEvaluated && op == null) {
            setPrev(null);
            setLastOp(null);
            setLastVal(null);
            setCurrent(d === "." ? "0." : d);
            setJustEvaluated(false);
            return;
        }
        setJustEvaluated(false);

        if (current === "0" && d !== ".") { setCurrent(d); return; }

        if (d === ".") {
            if (current.includes(".")) return;
            setCurrent(current === "" ? "0." : current + ".");
            return;
        }

        setCurrent(current + d);
    };
    
    //covert to num
    const toNumber = (s) => {
        const n = parseFloat(s);
        return Number.isNaN(n) ? 0 : n;
    };

    // calculate the nums
    const compute = (a, operator, b) => {
        if (operator === "+"){
            return a + b;
        }
        if (operator === "-") {
            return a - b;
        }
        if (operator === "*") {
            return a * b;
        }
        if (operator === "/") {
            return b === 0 ? "Error" : a / b;
        }
        return b;
    };

    //handles the operators 
    const Operator = (symbol) => {
        if (op && current !== "") {
            const a =prev ?? 0;
            const b =toNumber(current);
            const out =compute(a, op, b);
            if (out === "Error") { 
                clearAll(); 
                setCurrent("Error"); 
                setJustEvaluated(true); 
                return; 
            }
            setPrev(out);
            setCurrent("");
            setOp(symbol);
            setLastOp(null);
            setLastVal(null);
            setJustEvaluated(false);
            return;
        }

        if (current !== "") { 
            setPrev(toNumber(current)); 
            setCurrent(""); 
        }
        setOp(symbol);
        setJustEvaluated(false);
    };

    //check for errors
    const Equal = () => {
        if (op && (current !== "" || prev != null)) {
            const a = prev ?? 0;
            const b = current === "" ? a : toNumber(current);
            const out = compute(a, op, b);
            if (out === "Error") {
                clearAll(); 
                setCurrent("Error"); 
                setJustEvaluated(true); 
                return; 
            }
            setPrev(out);
            setCurrent("");
            setLastOp(op);
            setLastVal(b);
            setOp(null);
            setJustEvaluated(true);
            return;
        }
        
        if (!op && lastOp && prev != null) {
            const out = compute(prev, lastOp, lastVal ?? prev);
            if (out === "Error") {
                clearAll(); 
                setCurrent("Error"); 
                setJustEvaluated(true); 
                return; 
            }
            setPrev(out);
            setJustEvaluated(true);
        }
    };

    //clear everything and free variables
    const clearAll = () => {
        setCurrent("0");
        setPrev(null);
        setOp(null);
        setLastOp(null);
        setLastVal(null);
        setJustEvaluated(false);
    };

    const isActive = (symbol) => op === symbol;
  

    return (
        <Box className="calc-root">
            <Box className="calc-grid">
                <Box className="span-3 display-wrap">
                    <Display value={String(display)}/>
                </Box>
                <KeyButton label="C" value="C" onClick={() => clearAll()} color="error" variant="contained"/>

        
                <KeyButton label="7" onClick={appendDigit}/>
                <KeyButton label="8" onClick={appendDigit}/>
                <KeyButton label="9" onClick={appendDigit}/>
                <KeyButton label={"/"} value="/" onClick={() => Operator("/")} color="warning" variant={isActive("/") ? "contained" : "outlined"}/>

        
                <KeyButton label="4" onClick={appendDigit}/>
                <KeyButton label="5" onClick={appendDigit}/>
                <KeyButton label="6" onClick={appendDigit}/>
                <KeyButton label={"*"} value="*" onClick={() => Operator("*")} color="warning" variant={isActive("*") ? "contained" : "outlined"}/>

                <KeyButton label="1" onClick={appendDigit}/>
                <KeyButton label="2" onClick={appendDigit}/>
                <KeyButton label="3" onClick={appendDigit}/>
                <KeyButton label={"-"} value="-" onClick={() => Operator("-")} color="warning" variant={isActive("-") ? "contained" : "outlined"}/>

                <KeyButton label="0" onClick={appendDigit} className="span-1" />
                <KeyButton label="." onClick={appendDigit} />
                <KeyButton label="=" value="=" onClick={Equal} color="success" variant="contained"/>
                <KeyButton label={"+"} value="+" onClick={() => Operator("+")} color="warning" variant={isActive("+") ? "contained" : "outlined"}/>
            </Box>
        </Box>
    );
}


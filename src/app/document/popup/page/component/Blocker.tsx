import React from "react";
import "../../../../../asset/style/main.css";
import { BlockedData } from "../model/BlockedData";

function Blocker(data: BlockedData)
{
    return (
        <div>
            <p className="font-style blocker-font-size pos-center">Blocked on this page</p>
            <p className="font-style blocker-font-size pos-center">{data.length} ADs</p>
        </div>
    )
}

export default Blocker;
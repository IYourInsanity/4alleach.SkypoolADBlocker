import React from "react";
import "../../../../../asset/style/main.css";
import { PopupData } from "../../../../../common/model/PopupData";

function Blocker(data: PopupData)
{
    return (
        <div>
            <p className="font-style blocker-font-size pos-center">Blocked on this page</p>
            <p className="font-style blocker-font-size pos-center">{data.BlockedNodes.length} ADs</p>
        </div>
    )
}

export default Blocker;
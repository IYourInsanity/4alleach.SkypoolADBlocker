import React from "react";
import "../../../../../asset/style/main.css";
import { PopupData } from "../../../../../common/model/PopupData";

function Url(data: PopupData)
{
    return ( 
        <div className="url-container">
            <p className="font-style url-font-size pos-center url-location">{data.ActiveTabUrl}</p>
        </div>
     )
}

export default Url;
import React, { useState, useEffect } from "react";
import "../../../../asset/style/main.css";
import Title from "./component/Titles";
import Url from "./component/Url";
import Blocker from "./component/Blocker";
import { PopupData } from "../../../../common/model/PopupData";

export class Page extends React.Component<PopupData, PopupData>
{
    private readonly model: PopupData;

    public update: (data: PopupData) => void;

    constructor(model: PopupData)
    {
        super(model);

        this.model = model;

        this.render = this.render.bind(this);
        this.app = this.app.bind(this);
    }

    public render(): React.ReactNode 
    {
        return React.createElement(this.app);
    }

    private app(): JSX.Element
    {
        const $this = this;
        const [data, setData] = useState<PopupData>($this.model);

        $this.update = ((popupData: PopupData) => 
        {   

            setData({...data, 
                        BlockedNodes: popupData.BlockedNodes, 
                        ActiveTabUrl: popupData.ActiveTabUrl });

        }).bind($this);

        /*useEffect(() => 
        {
            console.log('Data changed - ', data);
        }, [data]);*/

        return (
            <div>
                <Title/>
                <div className="div-separator"/>
                <Url BlockedNodes={data.BlockedNodes} ActiveTabUrl={data.ActiveTabUrl}/>
                <div className="div-separator"/>
                <Blocker BlockedNodes={data.BlockedNodes} ActiveTabUrl={data.ActiveTabUrl}/>
            </div>
        );
    }
}
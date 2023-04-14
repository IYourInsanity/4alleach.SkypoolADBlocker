import React, { useState, useEffect } from "react";
import { BlockedData } from "./model/BlockedData";
import "../../../../asset/style/main.css";
import Title from "./component/Titles";
import Url from "./component/Url";
import Blocker from "./component/Blocker";

export class Page extends React.Component<BlockedData, BlockedData>
{
    private readonly model: BlockedData;

    public update: (length: number) => void;

    constructor(model: BlockedData)
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
        const [data, setData] = useState<BlockedData>($this.model);

        $this.update = ((length: number) => 
        {   
            setData({...data, length: data.length + length});
        }).bind($this);

        useEffect(() => 
        {
            console.log('Data changed - ', data);
        }, [data]);

        return (
            <div>
                <Title/>
                <div className="div-separator"/>
                <Url/>
                <div className="div-separator"/>
                <Blocker length={data.length}/>
            </div>
        );
    }
}
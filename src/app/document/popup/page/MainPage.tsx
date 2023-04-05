import React from "react";
import IPage from "./abstraction/IPage";

export default class MainPage implements IPage
{
    get(): JSX.Element 
    {
        return (
            <div>
                <h1>Hello Kitty</h1>
            </div>
        )
    }
}
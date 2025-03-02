import { CSSProperties, PropsWithChildren } from "react";

export interface CommonComponentProps extends PropsWithChildren{
    id: number;
    name: string;
    //设置style传递给组件便于在输入框中设置style
    styles?:CSSProperties;
    [key: string]: any
}
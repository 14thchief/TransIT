import { ReactNode } from "react";

export interface ActionType {
    onClick: (item: { label: string })=> void;
    label:string
    icon?: ReactNode
    customComponent?: ReactNode,
    show?: boolean
}

export interface TableDropdownActionProp {
    actions: ActionType[]
    className?: string   
}
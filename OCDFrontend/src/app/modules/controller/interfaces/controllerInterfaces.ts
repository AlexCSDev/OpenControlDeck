export interface Dashboard {
    id: number,
    name: string,
    items: DashboardItem[]
}
  
export interface DashboardItem {
    id: number,
    itemType: DashboardItemType,
    image: string,
    text: string,
    commandName: string,
    commandValue: string,
    sizeX: number,
    sizeY: number,
    posX: number,
    posY: number,
    dashboardId: number
}

export interface Command {
    name: string,
    commandName: string,
    helpText: string
}

export enum DashboardItemType {
    Text = 1,
    Button = 2
}

export interface ElementPosition {
    x: number;
    y: number;
}
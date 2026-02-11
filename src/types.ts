export type Colors = {
    primary: string;
    surface: string;
    gradient: string;
    background: string;
};

export type Message = {
    id: string;
    text: string;
    date: string;
    image?: string;
    imageName?: string;
    createdAt: Date;
    updateAt?: Date;
};
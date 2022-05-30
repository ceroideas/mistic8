import { Observable } from "rxjs";
import { User } from "./user.interface";

export interface Photo {
    title: string;
    descripcion: string;
    isSelected: boolean;
    file: string;
    nota: number;
    id: string;
    date: Date;
    views: number;
    size: number;
    photoName: string;
    owner: string;
    totalVotes:number;
    votos:[Voto];
}

export interface Voto{
    author: string;
    score: number;
}
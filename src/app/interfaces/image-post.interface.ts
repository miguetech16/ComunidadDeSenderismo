import { user } from "./user.interface";

export interface imagePost {
    
    user: user;
    postId: string;
    imageUrl: string;
    tittle: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    likes: number;
    comments: number;

  }
  
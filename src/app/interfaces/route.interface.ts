
export interface route {
    
    routeId: string;
    userId: string;
    title: string;
    description: string;
    recommendations: string;
    difficulty: string;
    distance: string;
    images: string[];
    ubication: string[];
    location: {
      lat: number;
      lng: number;
    } | null; 
  }
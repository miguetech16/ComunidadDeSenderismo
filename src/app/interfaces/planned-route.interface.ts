
export interface plannedRoute {
  id?: string; 
  routeId: string;
  creatorId: string;
  creatorAvatar: string;
  creatorName: string;
  plannedRouteTitle: string;
  routePicture: string;
  date: string;      
  hour: string;       
  planType: boolean; 
  users: string[]; 
}

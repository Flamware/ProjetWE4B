export interface MyCourse {
  id: string; // Adjusted to string based on the provided query response
  type: string; // Represents the 'type' field from the query response
  description: string;
  title: string; // Renamed 'nom' to 'title' to match the query response
  date: string;
  image: string;
  rate : number;
  mediaUrls: string[];
}


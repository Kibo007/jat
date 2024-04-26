export type PositionStatus =
  | "applied"
  | "interview"
  | "offer"
  | "rejected"
  | "pending";

  export type Position = {
    company: string;
    contact: string;
    createdAt: string;
    description: string;
    hourlyRate: number;
    id: number;
    jobTitle: string;
    location: string;
    positionUrl: string;
    status: PositionStatus;
  };
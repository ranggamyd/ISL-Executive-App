export interface SalaryOffer {
    id: string;
    candidateId: string;
    candidateName: string;
    position: string;
    proposedSalary: number;
    benefits: string[];
    status: "pending" | "approved" | "rejected";
    createdDate: string;
}

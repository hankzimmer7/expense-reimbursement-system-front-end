class Reimbursement {
    reimbursementId: number;
    author: number | string;
    amount: number;
    dateSubmitted: Date;
    dateResolved: Date;
    description: string;
    resolver: number | string;
    status: number;
    type: number;

    constructor(reimbursementId = 0, author = 0, amount = 0, dateSubmitted?, dateResolved?, description = '', resolver = 0, status = 0, type = 0) {
        this.reimbursementId = reimbursementId;
        this.author = author;
        this.amount = amount;
        this.dateSubmitted = dateSubmitted;
        this.dateResolved = dateResolved;
        this.description = description;
        this.resolver = resolver;
        this.status = status;
        this.type = type;
    }
}

export default Reimbursement;
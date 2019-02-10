export class ReimbursementStatus {
    statusId: number;
    status: string;

    constructor(statusId = 0, status = 'Pending') {
        this.statusId = statusId;
        this.status = status;
    }
}
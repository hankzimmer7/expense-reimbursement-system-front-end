export class ReimbursementType {
    typeId: number;
    type: string;

    constructor (typeId = 0, type = '') {
        this.typeId = typeId;
        this.type = type;
    }
}
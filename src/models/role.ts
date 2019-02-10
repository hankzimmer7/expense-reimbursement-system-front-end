export class Role {
    roleId: number;
    role: string;

    constructor(roleId = 0, role = '') {
        this.roleId = roleId;
        this.role = role;
    }
}
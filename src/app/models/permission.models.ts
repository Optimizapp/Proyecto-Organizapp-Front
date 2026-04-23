export interface Permission {   
    id: number;
    codigo: string;
    descripcipon: string;
    roleId: number;
}

export interface PermissionRequest {
    codigo: string;
    descripcipon?: string;
    roleId: number;
}
export declare function registerUser(email: string, password: string): Promise<{
    id: string;
    createdAt: Date;
    email: string;
    password: string;
}>;
export declare function loginUser(email: string, password: string): Promise<string>;
//# sourceMappingURL=auth.service.d.ts.map
export type CreateAccountInput = {
    username: string;
    name?: string;
};

export type UpdateAccountInput = {
    username?: string;
    name?: string | null;
};

export type AccountResponse = {
    id: string;
    username: string;
    name: string | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
};

export type AccountWithImages = AccountResponse & {
    images: {
        id: string;
        url: string;
        isPrimary: boolean;
        createdAt: Date;
    }[];
};
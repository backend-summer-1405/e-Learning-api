import type { WalletTransactionType } from "@prisma/client";

export type WalletResponse = {
    id: string;
    userId: string;
    balance: number;
    createdAt: Date;
    updatedAt: Date;
};

export type WalletTransactionResponse = {
    id: string;
    walletId: string;
    type: WalletTransactionType;
    amount: number;
    description: string | null;
    referenceId: string | null;
    createdAt: Date;
};

export type TopupInput = {
    amount: number;
};

export type TopupResult = {
    paymentId: string;
    paymentUrl: string;
    authority: string;
};

export type WalletWithTransactions = WalletResponse & {
    transactions: WalletTransactionResponse[];
};

export type WithdrawInput = {
    amount: number;
    iban: string;
    fullName: string;
};

export type WithdrawResult = {
    id: string;
    userId: string;
    amount: number;
    iban: string;
    fullName: string;
    status: string;
    createdAt: Date;
};
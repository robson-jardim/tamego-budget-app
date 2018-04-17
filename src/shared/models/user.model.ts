export interface User {
    userId: string;
    email: string;
    emailVerified: boolean;
    timeCreated: Date;
    customerId: string;
    subscriptionId: string;
    premium: PremiumStatus;
    cardDetails: null | CardDetails;
}

export interface TemporaryStartupUser {
    userId: string;
    email: string;
    premium: {
        active: boolean
    };
}

export interface PremiumStatus {
    active: boolean;
    isTrial: boolean;
    trialEnd: Date | null;
}

export interface CardDetails {
    cardId: string;
    brand: string;
    expirationMonth: string;
    expirationYear: string;
    lastFour: string;
}



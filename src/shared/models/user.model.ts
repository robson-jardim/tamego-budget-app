export interface User {
    userId: string | null;
    email: string;
    timeCreated: Date;
    emailVerified: boolean;
    isPremium: boolean;
    customerId: string;
    cardDetails: null | CardDetails;
    subscriptionId: string;
    trial: {
        isTrial: boolean;
        trialEnd: Date | null;
    };
}

export interface CardDetails {
    cardId: string;
    brand: string;
    expirationMonth: string;
    expirationYear: string;
    lastFour: string;
}



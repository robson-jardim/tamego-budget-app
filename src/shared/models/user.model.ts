export interface User {
    userId: string | null;
    email: string;
    timeCreated: Date;
    emailVerified: boolean;
    isPremium: boolean;
    customerId: string;
    subscriptionId: string;
    trial: {
        isTrial: boolean;
        trialEnd: Date | null;
    };
}

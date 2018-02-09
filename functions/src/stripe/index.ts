import { User } from '@models/user.model';
import { createStripeCustomer } from './create-customer';
import { createStripeSubscription } from './create-subscription';

export async function signUpForTrial(email: string): Promise<any> {
    const customerId = await createStripeCustomer(email);
    const subscription = await createStripeSubscription(customerId);
    return {customerId, ...subscription};
}

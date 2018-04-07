import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { UserRecord } from 'firebase-functions/lib/providers/auth';

const db = admin.firestore();

// Stripe
import { createStripeCustomer, createStripeSubscription } from '../stripe';
import { Subscription } from '../stripe/stripe-subscription';

// Models
import { User } from '@models/user.model';
import { Customer } from '@models/customer.model';
import { Budget } from '@models/budget.model';
import { Account } from '@models/budget-account.model';

import { EventContext } from 'firebase-functions/lib/cloud-functions';
import { CategoryGroup } from '@models/category-group.model';
import { Category } from '@models/category.model';


export const onUserCreate = functions.auth.user()
    .onCreate(async (userRecord: UserRecord, context: EventContext) => {

        const nowTimestamp = new Date();
        const user: User = {
            userId: userRecord.uid,
            email: userRecord.email || null,
            emailVerified: false,
            timeCreated: nowTimestamp,
            customerId: null,
            subscriptionId: null,
            cardDetails: null,
            premium: {
                active: false,
                isTrial: false,
                trialEnd: null
            }
        };

        try {
            user.customerId = await createStripeCustomer(user.email);
        }
        catch (error) {
            console.error('[Stripe] Unable to add customer');
            console.error(error);
            throw error;
        }

        try {
            const subscription: Subscription = await createStripeSubscription(user.customerId);
            user.subscriptionId = subscription.subscriptionId;
            user.premium = subscription.premium;
        } catch (error) {
            console.error('[Stripe] Unable to add subscription');
            console.error(error);
            throw error;
        }

        try {
            await createDemoBudget(user.userId);

            const batch = admin.firestore().batch();

            const userDocRef = db.doc(`users/${user.userId}`);
            batch.set(userDocRef, user);

            const customerUserRef = db.doc('customers/' + user.customerId);
            const customer: Customer = {
                userId: user.userId,
                customerId: user.customerId
            };
            batch.set(customerUserRef, customer);

            await batch.commit();
            console.log('User added: ' + user.userId);
        } catch (error) {
            console.error('Failed to add user document');
            console.error(error);
            throw error;
        }

    });

async function createDemoBudget(userId: string) {

    const promises: Array<Promise<any>> = [];

    const nowTimestamp = new Date();

    const budgetCollection = db.collection('budgets');
    const demoBudget: Budget = {
        userId: userId,
        budgetName: 'Demo Budget',
        currencyCode: 'USD',
        timeCreated: nowTimestamp,
        lastModified: nowTimestamp
    };

    const demoBudgetRef = await budgetCollection.add(demoBudget);
    const demoBudgetId = demoBudgetRef.id;

    const accountCollection = db.collection(`budgets/${demoBudgetId}/accounts`);
    const demoCheckingAccount: Account = {
        accountName: 'Checking',
        position: 0
    };

    const demoSavingsAccount: Account = {
        accountName: 'Savings',
        position: 1
    };

    promises.push(accountCollection.add(demoCheckingAccount));
    promises.push(accountCollection.add(demoSavingsAccount));

    const categoryGroups = db.collection('budgets/' + demoBudgetId + '/categoryGroups');

    const responsibilitiesGroup: CategoryGroup = {
        groupName: 'Immediate Responsibilities',
        position: 0
    };
    const responsibilitiesGroupRef = await categoryGroups.add(responsibilitiesGroup);
    const responsibilitiesGroupId = responsibilitiesGroupRef.id;

    const entertainmentGroup: CategoryGroup = {
        groupName: 'Entertainment',
        position: 1
    };
    const entertainmentGroupRef = await categoryGroups.add(entertainmentGroup);
    const entertainmentGroupId = entertainmentGroupRef.id;

    const categoriesCollection = db.collection(`budgets/${demoBudgetId}/categories`);


    // Group 1 - Category 1
    const incomeCategory: Category = {
        groupId: responsibilitiesGroupId,
        categoryName: 'Income',
        position: 0
    };
    promises.push(categoriesCollection.add(incomeCategory));

    // Group 1 - Category 2
    const rentCategory: Category = {
        groupId: responsibilitiesGroupId,
        categoryName: 'Rent/Mortgage',
        position: 1
    };
    promises.push(categoriesCollection.add(rentCategory));

    // Group 1 - Category 3
    const groceriesCategory: Category = {
        groupId: responsibilitiesGroupId,
        categoryName: 'Groceries',
        position: 2
    };
    promises.push(categoriesCollection.add(groceriesCategory));


    // Group 2 - Category 1
    const eatingOutCategory: Category = {
        groupId: entertainmentGroupId,
        categoryName: 'Eating Out',
        position: 0
    };
    promises.push(categoriesCollection.add(eatingOutCategory));

    // Group 2 - Category 1
    const musicCategory: Category = {
        groupId: entertainmentGroupId,
        categoryName: 'Music',
        position: 1
    };
    promises.push(categoriesCollection.add(musicCategory));

    // Group 2 - Category 2
    const gamingCategory: Category = {
        groupId: entertainmentGroupId,
        categoryName: 'Gaming',
        position: 2
    };
    promises.push(categoriesCollection.add(gamingCategory));


    await Promise.all(promises);
}

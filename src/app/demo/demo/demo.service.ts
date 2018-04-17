import { Injectable } from '@angular/core';
import { FirestoreReferenceService } from '@shared/services/firestore-reference/firestore-reference.service';
import { Budget } from '@models/budget.model';
import { Account } from '@models/budget-account.model';
import { FirestoreService } from '@shared/services/firestore/firestore.service';
import { demoConfig } from './demo-config';
import { CategoryGroup } from '@models/category-group.model';
import { Category } from '@models/category.model';
import { Payee } from '@models/payee.model';
import { Transaction } from '@models/transaction.model';
import { UtilityService } from '@shared/services/utility/utility.service';

@Injectable()
export class DemoService {

    constructor(private firestore: FirestoreService, private references: FirestoreReferenceService, private utility: UtilityService) {
    }

    public async createDemo(userId: string): Promise<any> {
        return this.createDemoBudget(userId)
            .then(budgetId => {
                return Promise.all([
                    this.createAllAccounts(budgetId),
                    this.createCategories(budgetId)
                ]);
            });
    }

    private async createDemoBudget(userId): Promise<string> {
        const budgetCollection = this.references.getBudgetCollectionRef(userId);
        const nowTimestamp = new Date();

        const demoBudgetId = this.firestore.createId();
        const demoBudget: Budget = {
            userId: userId,
            budgetName: 'Demo Budget',
            currencyCode: 'USD',
            timeCreated: nowTimestamp,
            lastModified: nowTimestamp
        };

        return budgetCollection.add(demoBudget).then(doc => {
            return doc.id;
        });
    }

    private createAllAccounts(budgetId: string): Promise<any> {
        const accountsCollection = this.references.getAccountsCollectionRef(budgetId);
        const payeeCollection = this.references.getPayeeCollectionRef(budgetId);
        const transactionCollection = this.references.getTransactionCollectionRef(budgetId);
        const promises = [];

        const utcToday = this.utility.convertToUtc(new Date());

        for (let ix = 0; ix < demoConfig.accounts.length; ix++) {
            const account: Account = {
                accountName: demoConfig.accounts[ix].accountName,
                position: ix
            };

            promises.push(
                accountsCollection.add(account).then(({id: accountId}) => {
                    const startingBalance: Transaction = {
                        transactionDate: utcToday,
                        accountId: accountId,
                        payeeId: null,
                        categoryId: null,
                        splits: [],
                        memo: 'Starting Balance',
                        amount: demoConfig.accounts[ix].initialBalance,
                        cleared: false,
                        locked: false,
                    };

                    return transactionCollection.add(startingBalance);
                })
            );

            const transferPayee: Payee = {
                payeeName: `Transfer: ${demoConfig.accounts[ix].accountName}`
            };
            promises.push(
                payeeCollection.add(transferPayee)
            );
        }

        return Promise.all(promises);
    }


    private createCategories(budgetId: string) {

        const groupCollection = this.references.getGroupsCollectionRef(budgetId);
        const categoriesCollection = this.references.getCategoriesCollectionRef(budgetId);

        const promises = [];

        for (let ix = 0; ix < demoConfig.budget.length; ix++) {
            const group: CategoryGroup = {
                groupName: demoConfig.budget[ix].groupName,
                position: ix
            };

            promises.push(
                groupCollection.add(group).then(({id: groupId}) => {

                    const promises = [];

                    for (let i = 0; i < demoConfig.budget[group.position].categories.length; i++) {
                        const category: Category = {
                            groupId: groupId,
                            categoryName: demoConfig.budget[group.position].categories[i],
                            position: i
                        };

                        promises.push(categoriesCollection.add(category));
                    }

                    return Promise.all(promises);
                })
            );
        }

        return Promise.all(promises);
    }
}

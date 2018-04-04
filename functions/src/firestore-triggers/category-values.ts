import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';
import { Change, EventContext } from 'firebase-functions/lib/cloud-functions';

import { CategoryValueId } from '@models/category-value.model';

export const onValueCreate = functions.firestore.document('budgets/{budgetId}/categoryValues/{categoryValueId}')
    .onCreate(async (snapshot: DocumentSnapshot, context: EventContext) => {

        const categoryValue: CategoryValueId = {
            categoryValueId: context.params.categoryValueId,
            ...snapshot.data() as any
        };

        const isValid = validateCategoryValue(categoryValue);

        if (isValid) {
            return;
        }

        try {
            const budgetId = context.params.budgetId;
            await db.doc(`budgets/${budgetId}/categoryValues/${categoryValue.categoryValueId}`).delete();
        }
        catch (error) {
            console.error(error);
            console.error('Database error');
            throw error;
        }
    });

export const onValueUpdate = functions.firestore.document('budgets/{budgetId}/categoryValues/{categoryValueId}')
    .onUpdate(async (change: Change<DocumentSnapshot>, context: EventContext) => {

        const categoryValue: CategoryValueId = {
            categoryValueId: context.params.categoryValueId,
            ...change.after.data() as any
        };

        const isValid = validateCategoryValue(categoryValue);

        if (isValid) {
            return;
        }

        try {
            const budgetId = context.params.budgetId;
            const previousVersion = change.before.data();
            await db.doc(`budgets/${budgetId}/categoryValues/${categoryValue.categoryValueId}`).update(previousVersion);
        }
        catch (error) {
            console.error(error);
            console.error('Database error');
            throw error;
        }
    });


function isValidBudgetMonth(categoryValue: CategoryValueId) {
    const parsedId = parseIdFromCategoryValue(categoryValue.categoryValueId);

    const year = parsedId.year;
    const month = parsedId.month - 1;   // 1 month must be subtracted here because months on the date object
                                        // are indexed by 0, while the month stored in the ID are indexed by 1

    const dateFromId = new Date(year, month, 1); // Select the first day of the specified month
    const dateFromProperty = new Date(categoryValue.budgetMonth);

    if (dateFromId.getTime() !== dateFromProperty.getTime()) {
        console.error('Date on categoryValueId and budgetMonth property are not equal');
        console.error('Category value ID date: ' + dateFromId);
        console.error('Budgeted month: ' + dateFromProperty);
        return false;
    }
    else {
        return true;
    }
}

function validateCategoryValue(categoryValue: CategoryValueId) {

    if (!isValidCategoryValueId(categoryValue)) {
        return false;
    }

    // Assume these are numbers based on the Firestore rules in place
    if (!isTwoDecimalPlaces(categoryValue.budgeted)) {
        console.error(`More than 2 decimal places were found on the budgeted property: ${categoryValue.budgeted}`);
        return false;
    }

    if (!isTwoDecimalPlaces(categoryValue.offset)) {
        console.error(`More than 2 decimal places were found on the offset property: ${categoryValue.offset}`);
        return false;
    }

    if (!isValidBudgetMonth(categoryValue)) {
        return false;
    }

    return true;
}

function isValidCategoryValueId(categoryValue: CategoryValueId) {

    const parsedId = parseIdFromCategoryValue(categoryValue.categoryValueId);

    // Assume category document exists based on the Firestore rules in place
    if (categoryValue.categoryId !== parsedId.categoryId) {
        console.error('Category ID property and on value ID do not match');
        console.error('Dategory property ID: ' + categoryValue.categoryValueId);
        console.error('Dategory value ID: ' + categoryValue.categoryValueId);
        return false;
    }

    if (!Number.isSafeInteger(parsedId.month)) {
        console.error(`Month within value ID is not an integer: ${parsedId.month}`);
        return false;
    }

    if (!isValidMonth(parsedId.month)) {
        console.error(`Month within value ID was not between 1-12: ${parsedId.month}`);
        return false;
    }

    if (!Number.isSafeInteger(parsedId.year)) {
        console.error(`Year within value ID is not an integer: ${parsedId.year}`);
        return false;
    }

    return true;

}

function parseIdFromCategoryValue(categoryValueId: string) {
    try {
        const [categoryId, belongsToMonthYear] = categoryValueId.split('_');
        const [yearString, monthString] = belongsToMonthYear.split('-');

        const month = Number(monthString);
        const year = Number(yearString);

        return { categoryId, month, year }
    } catch (error) {
        console.error(error);
        console.error('Category value ID not formatted correctly: ' + categoryValueId);
        throw error;
    }
}

function isValidMonth(month) {
    const num = Number(month);
    return num <= 12 && num >= 1;
}

function isTwoDecimalPlaces(number) {
    const original = Number(number);
    const fixedPrecision = Number(number.toFixed(2));
    return original === fixedPrecision;
}


import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { CategoryValueId } from '../../../models/category-value.model';

const db = admin.firestore();

// No data integrity checks need to be made onDelete for categoryValues

export const onValueCreate = functions.firestore.document('budgets/{budgetId}/categoryValues/{categoryValueId}').onCreate(async event => {
    const validated = await validateCategoryValue(event);

    if (validated) {
        return;
    }

    try {
        const budgetId = event.params.budgetId;
        const categoryValueId = event.params.categoryValueId;
        await db.doc(`budgets/${budgetId}/categoryValues/${categoryValueId}`).delete();
    }
    catch (error) {
        console.log('Database error', error);
        throw error;
    }
});

export const onValueUpdate = functions.firestore.document('budgets/{budgetId}/categoryValues/{categoryValueId}').onUpdate(async event => {
    const validated = await validateCategoryValue(event);

    if (validated) {
        return;
    }

    try {
        const budgetId = event.params.budgetId;
        const categoryValueId = event.params.categoryValueId;
        const previousVersion = event.data.previous.data();
        await db.doc(`budgets/${budgetId}/categoryValues/${categoryValueId}`).update(previousVersion);
    }
    catch (error) {
        console.log('Database error', error);
        throw error;
    }
});

async function validateCategoryValue(event) {

    const budgetId = event.params.budgetId;
    const categoryValueId = event.params.categoryValueId;

    const categoryValue: CategoryValueId = {
        categoryValueId,
        ...event.data.data()
    };

    const valueIdDelimiter = categoryValue.categoryValueId.split('-');
    const categoryId = valueIdDelimiter[0];
    let year = valueIdDelimiter[1];
    let month = valueIdDelimiter[2];

    if (valueIdDelimiter.length !== 3) {
        console.error('Invalid value ID structure');
        return false;
    }

    if (!isNumeric(year)) {
        console.error('Year within value ID was not numeric');
        return false;
    }

    if (!isNumeric(month)) {
        console.error('Month within value ID was not numeric');
        return false;
    }

    if (!isValidMonth(month)) {
        console.error('Month within value ID was not between 1-12');
        return false;
    }

    const yearTemp = Number(year);
    const monthTemp = Number(month);

    const dateFromId = new Date(yearTemp, monthTemp, 1);
    const dateFromProperty = new Date(categoryValue.time);

    if (dateFromProperty.getDate() !== 1) {
        console.error('Date property is not set to the first of the month');
        return false;
    }

    if (dateFromId.getTime() !== dateFromProperty.getTime()) {
        console.error('Dates from ID and property do not match');
        return false;
    }

    // We can assume these are numbers based on the firestore rules in place
    if (!isTwoDecimalPlaces(categoryValue.budgeted)) {
        console.error('More than 2 decimal places were found on the budgeted property');
        return false;
    }

    if (!isTwoDecimalPlaces(categoryValue.offset)) {
        console.error('More than 2 decimal places were found on the offset property');
        return false;
    }

    if (categoryValue.categoryId !== categoryId) {
        console.error('Category ID property and on value ID do not match');
        return false;
    }

    try {
        const categoryDoc = await db.doc('budgets/' + budgetId + '/categories/' + categoryId).get();

        if (!categoryDoc.exists) {
            console.error('Category Document does not exists');
            return false;
        }
    } catch (error) {
        console.error('Database error', error);
        return false;
    }

    return true;
}

function isValidMonth(month) {
    const num = Number(month);
    return num <= 12 && num >= 1;
}

function isNumeric(num: any) {
    return !isNaN(num);
}

function isTwoDecimalPlaces(num) {
    const num1 = Number(num.toFixed(2));
    const num2 = Number(num);
    return num1 === num2;
}


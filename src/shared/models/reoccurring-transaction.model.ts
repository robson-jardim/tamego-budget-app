import { Transaction } from '@models/transaction.model';

export interface RepeatTransaction extends Transaction{
    nextOccurrenceDate: Date;
    frequency: number;
}

export interface RepeatTransactionId extends RepeatTransaction {
    repeatTransactionId: string;
}

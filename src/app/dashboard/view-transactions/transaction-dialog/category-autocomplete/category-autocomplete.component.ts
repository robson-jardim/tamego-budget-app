import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { map, startWith } from 'rxjs/operators';
import { CategoryId } from '@models/category.model';
import { TransactionFormNames } from '../../shared/transaction-form-names.enum';

@Component({
    selector: 'app-category-autocomplete',
    templateUrl: './category-autocomplete.component.html',
    styleUrls: ['./category-autocomplete.component.scss']
})
export class CategoryAutocompleteComponent implements OnInit, OnChanges {

    @Input() transactionForm: FormGroup;
    @Input() groups;
    @Input() selectedCategoryId: string;
    @Input() disabled;
    public TransactionFormNames = TransactionFormNames;

    public filteredGroups$: Observable<any>;

    constructor() {
    }

    ngOnInit() {
        this.groups.map(group => {
            group.categories.map((category: CategoryId) => {
                if (category.categoryId === this.selectedCategoryId) {
                    const initialCategoryValue = new Object();
                    initialCategoryValue[TransactionFormNames.Category] = category;
                    this.transactionForm.patchValue(initialCategoryValue);
                }
            });
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.disabled) {
            this.setCategoryDisableState();
        }

        if (changes.groups) {
            this.filterAutocompleteOptions();
        }
    }

    private setCategoryDisableState() {
        if (this.disabled) {
            this.transactionForm.controls[TransactionFormNames.Category].disable();
            const value = new Object();
            value[TransactionFormNames.Category] = null;
            this.transactionForm.patchValue(value);
        }
        else {
            this.transactionForm.controls[TransactionFormNames.Category].enable();
        }
    }

    private filterAutocompleteOptions() {
        this.filteredGroups$ = this.transactionForm.controls[TransactionFormNames.Category].valueChanges
            .pipe(
                startWith(null),
                map(input => {
                    if (input && input.categoryName) {
                        // Defines the case that the input is currently a CategoryId object
                        return input.categoryName;
                    }
                    else {
                        return input;
                    }
                }),
                map(input => input ? this.filterGroups(input) : this.groups.slice())
            );
    }

    public filterGroups(userInput: any) {

        userInput = userInput.toLowerCase();

        return this.groups.reduce((total, group) => {

            if (group.groupName.toLowerCase().includes(userInput)) {
                return [...total, group];
            }

            const filteredCategories = group.categories.reduce((categories, category: CategoryId) => {
                if (category.categoryName.toLowerCase().includes(userInput)) {
                    return [...categories, category];
                }
                else {
                    return [...categories];
                }
            }, []);

            if (filteredCategories.length) {
                const filteredGroup = {
                    ...group, categories: filteredCategories
                };

                return [...total, filteredGroup];
            }

            return [...total];
        }, []);
    }

    public displayCategoryName(category: CategoryId) {
        if (category) {
            return category.categoryName;
        }
        else {
            return category;
        }
    }
}

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

    public TransactionFormNames = TransactionFormNames;
    public transactionForm: FormGroup;

    @Input() groups;
    @Input() selectedCategoryId: string;

    public filteredGroups$: Observable<any>;

    constructor(private controlContainer: ControlContainer) {
    }

    ngOnInit() {
        this.transactionForm = this.controlContainer.control as FormGroup;

        this.groups.map(group => {
            group.categories.map((category: CategoryId) => {
                if (category.categoryId === this.selectedCategoryId) {
                    this.transactionForm.patchValue({
                        category
                    });
                }
            });
        });

        this.filterAction();
    }

    ngOnChanges(changes: SimpleChanges): void {
        // ngOnChanges if called before ngOninit. Therefore transaction form is not yet available
        // to grab value
        if (this.transactionForm) {
            this.filterAction();
        }
    }

    private filterAction() {
        this.filteredGroups$ = this.transactionForm.get(TransactionFormNames.Category).valueChanges
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

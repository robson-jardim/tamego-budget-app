import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { filter, map, startWith } from 'rxjs/operators';
import { MatAutocomplete } from '@angular/material';
import { CategoryId } from '@models/category.model';

@Component({
    selector: 'app-category-autocomplete',
    templateUrl: './category-autocomplete.component.html',
    styleUrls: ['./category-autocomplete.component.scss']
})
export class CategoryAutocompleteComponent implements OnInit, OnChanges {


    public transactionForm: FormGroup;

    @Input() groups;
    @Input() selectedCategoryId: string;

    public filteredGroups$: Observable<any>;
    @ViewChild(MatAutocomplete) matAutocomplete: MatAutocomplete;

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
        this.filteredGroups$ = this.transactionForm.get('category').valueChanges
            .pipe(
                filter(x => typeof x === 'string'), // Do not go past here if a saved entity is selected
                map(userInput => userInput ? this.filterGroups(userInput) : this.groups.slice())
            );
    }

    public filterGroups(name: any) {

        name = name.toLowerCase();

        return this.groups.reduce((total, group) => {

            if (group.groupName.toLowerCase().includes(name)) {
                return [...total, group];
            }
            else {

                const res = group.categories.reduce((tot, category: CategoryId) => {
                    if (category.categoryName.toLowerCase().includes(name)) {
                        return [...tot, category];
                    }
                    else {
                        return [...tot];
                    }
                }, []);

                if (res.length > 0) {
                    const refinedCategorySearch = {
                        ...group, categories: res
                    };

                    return [...total, refinedCategorySearch];
                }
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


    public highlightFirstOption(event): void {
        if (event.key == 'ArrowDown' || event.key == 'ArrowUp') {
            return;
        }

        this.matAutocomplete._keyManager.setFirstItemActive();
    }


}

import { Component, Input, OnInit, ViewChild } from '@angular/core';
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
export class CategoryAutocompleteComponent implements OnInit {


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

        this.filteredGroups$ = this.transactionForm.get('category').valueChanges
            .pipe(
                startWith(null),
                filter(x => typeof x === 'string'), // Do not go past here if a saved entity is selected
                map(userInput => userInput ? this.filterGroups(userInput) : this.groups.slice())
            );

        // this.filteredGroups$.subscribe(x => console.log(x));
    }

    public filterGroups(name: any) {


        // const x = this.groups.filter(group => {
        //     const data = group.categories.filter((category: CategoryId) => {
        //         return category.categoryName.toLowerCase().indexOf(name.toLowerCase()) === 0;
        //     });
        //
        //     return data.length > 0;
        // });

        name = name.toLowerCase();

        const x = this.groups.reduce((total, group) => {

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

        console.log(x);

        //
        // const x = this.groups.reduce((total, current) => {
        //
        //     if (current.groupName.toLowerCase().includes(name)) {
        //         total.push(current);
        //     }
        //     else {
        //
        //         const res = current.reduce((total, current) => {
        //             if (current.toLowerCase().includes(name)) {
        //                 total.push(current);
        //             }
        //         }, []);
        //
        //         if (res.length > 0) {
        //             const obj = {
        //                 ...current, categories: res
        //             };
        //
        //             total.push(current);
        //         }
        //     }
        // }, []);


        return this.groups;


        // return this.groups.filter(group => {
        //     return group.groupName.toLowerCase().indexOf(name.toLowerCase()) === 0;
        // });
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
        if (event.key == "ArrowDown" || event.key == "ArrowUp") {
            return;
        }

        this.matAutocomplete._keyManager.setFirstItemActive();
    }
}

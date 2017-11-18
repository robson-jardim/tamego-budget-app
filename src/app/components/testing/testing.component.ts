import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFirestore } from "angularfire2/firestore";
import { User } from "../../services/auth-service/auth.service";
import { Budget } from "../../services/database/database.service";

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TestingComponent implements OnInit {

  constructor(private afs: AngularFirestore) { }

  ngOnInit() {
      const data: Budget = {
          userId: 'Ayq6YA5pS1XXJtKfSLJNpvanzSj1',
          budgetName: 'b',
          currencyType: 'usd'
      };

      this.afs.collection('budgets').add(data);

      //Read - get test
      // this.afs.doc('/budgets/IHbuKGDQRFnM0YAm8znX').valueChanges().subscribe(x => {
      //     console.log(x);
      // });

      //Read - list test

      //Update
      // this.afs.doc('/budgets/IHbuKGDQRFnM0YAm8znX').update(data);

  }

}


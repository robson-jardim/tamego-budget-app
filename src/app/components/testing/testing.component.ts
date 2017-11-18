import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFirestore } from "angularfire2/firestore";
import { User } from "../../services/auth-service/auth.service";

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TestingComponent implements OnInit {

  constructor(private afs: AngularFirestore) { }

  ngOnInit() {
      const user: any = {
          userId: 'Ayq6YA5pS1XXJtKfSLJNpvanzSj1',
          email: 'asdf',
      };

      this.afs.doc('users/Ayq6YA5pS1XXJtKfSLJNpvanzSj1').set(user);

      // this.afs.doc('users/Ayq6YA5pS1XXJtKfSLJNpvanzSj1').valueChanges().subscribe(x => {
      //     console.log(x);
      // })
      //
      // // this.afs.collection('users', ref => ref.where('userId', '==', 'Ayq6YA5pS1XXJtKfSLJNpvanzSj1')).valueChanges().subscribe(x => {
      // //     console.log(x);
      // // });


  }

}


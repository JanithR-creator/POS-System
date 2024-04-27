import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {CurrencyPipe, NgForOf} from "@angular/common";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {AngularFireStorage} from "@angular/fire/compat/storage";

@Component({
  selector: 'app-customer-all',
  standalone: true,
  imports: [
    NgForOf,
    MatButton,
    MatIconButton,
    MatIcon,
    RouterLink,
    CurrencyPipe
  ],
  templateUrl: './customer-all.component.html',
  styleUrl: './customer-all.component.scss'
})
export class CustomerAllComponent implements OnInit{

  constructor(private db:AngularFirestore,private storage:AngularFireStorage) {
  }

  customers:any[]=[];
    ngOnInit(): void {
        this.db.collection('customers').get().subscribe(
          querySnapshot=>{
          querySnapshot.forEach(doc=> {
            this.customers.push({id:doc.id, data:doc.data()});
          })
        })
    }

    deleteCustomer(id:any,avatar:any){
      if(confirm('are youe sure?')){
        this.db.collection('customers').doc(id).delete();
        this.storage.storage.refFromURL(avatar).delete();
      }
    }
}

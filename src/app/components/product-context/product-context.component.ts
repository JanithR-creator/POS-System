import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AsyncPipe, CurrencyPipe, NgForOf, NgIf} from "@angular/common";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import {AngularFireStorage} from "@angular/fire/compat/storage";

@Component({
  selector: 'app-product-all',
  standalone: true,
  imports: [
    NgForOf,
    MatButton,
    MatIconButton,
    MatIcon,
    RouterLink,
    CurrencyPipe,
    NgIf,
    AsyncPipe
  ],
  templateUrl: './product-context.component.html',
  styleUrl: './product-context.component.scss'
})
export class ProductContextComponent implements OnInit{

  constructor(private db: AngularFirestore,
              private storage: AngularFireStorage,) {

  }

  productList: any[] = [];

  ngOnInit(): void {
    this.db.collection('products').get().subscribe(
      querySnapshot => {
        querySnapshot.forEach(doc => {
          this.productList.push({id: doc.id, data: doc.data()});
        })
      })
  }

  deleteCustomer(id: any, avatar: any) {
    if (confirm('are you sure?')) {
      this.db.collection('products').doc(id).delete();
      this.storage.storage.refFromURL(avatar).delete();
    }
  }
}

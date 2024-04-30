import {Component, OnInit} from '@angular/core';
import {CurrencyPipe, NgForOf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {RouterLink} from "@angular/router";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {AngularFireStorage} from "@angular/fire/compat/storage";

@Component({
  selector: 'app-product-all',
  standalone: true,
    imports: [
        CurrencyPipe,
        MatIcon,
        MatIconButton,
        NgForOf,
        RouterLink
    ],
  templateUrl: './product-all.component.html',
  styleUrl: './product-all.component.scss'
})
export class ProductAllComponent implements OnInit{

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

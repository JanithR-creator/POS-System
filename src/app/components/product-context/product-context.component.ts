import {Component, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Component({
  selector: 'app-product-context',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './product-context.component.html',
  styleUrl: './product-context.component.scss'
})
export class ProductContextComponent implements OnInit{
  constructor(private db:AngularFirestore) {
  }

  productList:any[]=[];
  ngOnInit(): void {
    this.db.collection('products').get().subscribe(
      quarySnapShot=>{
        quarySnapShot.forEach(doc=>{
          this.productList.push(doc.data());
        })
      }
    )
  }

}

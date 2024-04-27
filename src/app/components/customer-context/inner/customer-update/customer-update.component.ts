import {Component} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {finalize, Observable} from "rxjs";
import {MatProgressBar} from "@angular/material/progress-bar";
import {AsyncPipe, NgIf} from "@angular/common";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {ActivatedRoute} from "@angular/router";
import {response} from "express";

@Component({
  selector: 'app-customer-new',
  standalone: true,
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    ReactiveFormsModule,
    MatProgressBar,
    AsyncPipe,
    NgIf
  ],
  templateUrl: './customer-update.component.html',
  styleUrl: './customer-update.component.scss'
})
export class CustomerUpdateComponent {

  constructor(private storage: AngularFireStorage,
              private db: AngularFirestore,
              private activateRoute:ActivatedRoute,
              private snackbarService: MatSnackBar) {
    activateRoute.paramMap.subscribe(response=>{
      this.selectedCustomerId = response.get('id');
    })
  }

  selectedCustomerId:any;
  loading: boolean = false;
  selectedAvatar: any;
  // @ts-ignore
  uploadRate: Observable<number | undefined>;
  // @ts-ignore
  downloadLink: Observable<string | undefined>;

  form = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    salary: new FormControl('', [Validators.required]),
    avatar: new FormControl('', [Validators.required])
  })

  updateCustomer() {

    this.loading = true;

    const path = 'avatar/' + this.form.value.fullName + '/' + this.selectedAvatar.name;
    const fileRef = this.storage.ref(path);
    const task = this.storage.upload(path, this.selectedAvatar);

    this.uploadRate = task.percentageChanges();//back end hadanawanm mewa api write karanna ooni dewal

    task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadLink = fileRef.getDownloadURL();
      })
    ).subscribe();

    task.then(() => {

      this.downloadLink.subscribe(res => {
        let customer = {
          fullName: this.form.value.fullName,
          address: this.form.value.address,
          salary: this.form.value.salary,
          avatar: res
        }

        //-----------------------
        const customerRef=this.db.collection('customers').doc(this.selectedCustomerId);
        customerRef.update(customer)
          .then((docRef) => {
            this.snackbarService.open('Customer Saved!', 'Close', {
              duration: 5000,
              verticalPosition: 'top',
              horizontalPosition: 'end',
              direction: 'ltr'
            });
            this.loading = false;
          }).catch(er => {
          console.log(er);
          this.loading = false;
        })
        //-----------------------
      })

    }).catch(error => {
      console.log(error);
      this.loading = false;
    })


  }

  onChangeFile(event: any) {
    this.selectedAvatar = event.target.files[0];
  }
}

import {Component} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {finalize, Observable} from "rxjs";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {MatProgressBar} from "@angular/material/progress-bar";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-customer-new',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    MatLabel,
    MatButton,
    FormsModule,
    ReactiveFormsModule,
    MatProgressBar,
    AsyncPipe
  ],
  templateUrl: './customer-new.component.html',
  styleUrl: './customer-new.component.scss'
})
export class CustomerNewComponent {

  constructor(private storage: AngularFireStorage) {
  }

  loading: boolean = false;
  selectedAvatar: any;
  // @ts-ignore
  uploadRate: Observable<number | undefined>;
  // @ts-ignore
  downloadLink: Observable<string | undefined>;

  form: FormGroup = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    salary: new FormControl('', [Validators.required]),
    avatar: new FormControl('', [Validators.required]),
  })

  saveCustomer() {

    const path = 'avatar/' + this.form.value.fullName + '/' + this.selectedAvatar.name;
    const fileRef = this.storage.ref(path);
    const task = this.storage.upload(path, this.selectedAvatar);

    this.uploadRate = task.percentageChanges();

    task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadLink = fileRef.getDownloadURL();
      })
    ).subscribe();//yawana request eka exwcute wenawa

    task.then(() => {
      console.log('saved');
    }).catch(error => {
      console.log(error);
    })

    let customer = {
      fullName: this.form.value.fullName,
      address: this.form.value.address,
      salary: this.form.value.salary,
      avatar: this.selectedAvatar,
    }
    console.log(customer);
  }

  onChangeFile(event: any) {
    this.selectedAvatar = event.target.files[0];//target means the value that we need to take
  }
}

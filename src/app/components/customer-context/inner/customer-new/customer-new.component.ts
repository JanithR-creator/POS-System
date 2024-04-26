import {Component} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AngularFireStorage} from "@angular/fire/compat/storage";

@Component({
  selector: 'app-customer-new',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    MatLabel,
    MatButton,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './customer-new.component.html',
  styleUrl: './customer-new.component.scss'
})
export class CustomerNewComponent {

  constructor(private storage: AngularFireStorage) {
  }

  loading: boolean = false;
  selectedAvatar: any;

  form: FormGroup = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    salary: new FormControl('', [Validators.required]),
    avatar: new FormControl('', [Validators.required]),
  })

  saveCustomer() {

    const path = 'avatar/' + this.form.value.fullName + '/' + this.selectedAvatar.name;

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

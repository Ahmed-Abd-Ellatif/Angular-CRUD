import { Component, OnInit } from '@angular/core';
import { FormBuilder ,FormGroup } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { ApiService } from '../shared/api.service';
import { UserModel } from './userlist.model';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {
formValue!: FormGroup;
userModelObj:UserModel = new UserModel(); //create a new object
users:any[]=[]
showAdd!:boolean;
showUpdate!:boolean;

  constructor(private formBuilder:FormBuilder, private api:ApiService , private toast:NgToastService) { }

  ngOnInit(): void {
    this.formValue=this.formBuilder.group({
      firstName:[''],
      lastName:[''],
      email:[''],
      mobile:[''],
      salary:[''],
    })
    this.getAllUSer()
  }
  ClickAddUser(){
    this.formValue.reset();
    this.showAdd=true;
    this.showUpdate= false;
  }
  postUserDetails(){
    this.userModelObj.firstName=this.formValue.value.firstName;
    this.userModelObj.lastName=this.formValue.value.lastName;
    this.userModelObj.email=this.formValue.value.email;
    this.userModelObj.mobile=this.formValue.value.mobile;
    this.userModelObj.salary=this.formValue.value.salary;

    this.api.postUser(this.userModelObj).subscribe(
      ()=>{
        this.toast.success({detail:'success Message',summary:'Success Add User',duration:5000})

        //close pup up
        let ref= document.getElementById('cancel');
       ref?.click();
       //reset form
        this.formValue.reset();
        // get All Users
        this.getAllUSer()
    }
    )
  }
  getAllUSer(){
    this.api.getUser().subscribe(res=>{
      this.users=res
    })
  }
  deleteUser(user:any){
    this.api.deleteUser(user.id).subscribe(
      ()=>{this.toast.error({detail:'DELETED',summary:'Delete User',duration:5000})
      this.getAllUSer()},

    );
  }
onEdit(user:any){
  this.showAdd=false;
  this.showUpdate= true;
  this.userModelObj.id=user.id;
  this.formValue.controls['firstName'].setValue(user.firstName);
  this.formValue.controls['lastName'].setValue(user.lastName);
  this.formValue.controls['email'].setValue(user.email);
  this.formValue.controls['mobile'].setValue(user.mobile);
  this.formValue.controls['salary'].setValue(user.salary);
}
updateUser(){
  this.userModelObj.firstName=this.formValue.value.firstName;
  this.userModelObj.lastName=this.formValue.value.lastName;
  this.userModelObj.email=this.formValue.value.email;
  this.userModelObj.mobile=this.formValue.value.mobile;
  this.userModelObj.salary=this.formValue.value.salary;

  this.api.updateUser(this.userModelObj,this.userModelObj.id).subscribe(
    ()=>{
      this.toast.success({detail:'UPDATE',summary:'Update User',duration:5000});
      let ref = document.getElementById('cancel');
      ref?.click();
      this.formValue.reset();
      this.getAllUSer();
  }
  )
}}


import { Component } from "@angular/core";
import { User } from "../models/user";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent {
  /*
  email = "";
  password = "";
  name = "";
  */
  user: User;

  constructor(private authService: AuthService) {}

  reciver(email_: string, password_: string, name_: string) {
    this.authService.siginUp(name_, email_, password_).subscribe(result => {
      if (result.uid === "") {
        //サインアップ失敗
        console.log("サインアップ失敗");
      } else {
        //サインアップ成功
        console.log("サインアップ成功");
      }
    });
  }
}

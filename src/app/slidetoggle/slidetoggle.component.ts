import { Component } from "@angular/core";
import { User } from "../models/user";
import { AuthService } from "../services/auth.service";
import { EEXIST } from "constants";
import { Observable } from "rxjs";

@Component({
  selector: "slide-toggle",
  templateUrl: "./slidetoggle.component.html",
  styleUrls: ["./slidetoggle.component.css"]
})
export class SlidetoggleComponent {
  //loginしてる時だけ表示する
  //toggleが押されたとき、その変更を反映するために情報を返す
  //
  login = true;
  st = false;
  user: User;

  constructor(private authService: AuthService) {
    this.authService.setSlidetoggleComponent(this);
  }

  public fireLogin() {
    this.user = this.authService.getCurrentUserData();
    console.log(this.user);
    if (this.user != undefined) {
      console.log(this.user.uid);
      if (this.user.uid != "") {
        //TODO: slidetoggleの有効化
        console.log("ログインした");
      }
    }
  }

  onChanged(e) {
    console.log("a");
    if (this.user == undefined) {
      this.user = this.authService.getCurrentUserData();
    }
    console.log(this.user);
    console.log(this.user.uid);
    if (this.user.uid === "") {
      //ログインしていない
      console.log("ログインしていない");
    } else {
      console.log("b");
      if (e.target.checked) {
        this.user.nomi = 1;
        console.log("on");
      } else {
        this.user.nomi = 0;
        console.log("off");
      }
      console.log(this.user.uid);
      this.authService.updateUserData(this.user);
    }
  }
}

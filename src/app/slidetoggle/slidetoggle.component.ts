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
  user: Observable<User>;

  constructor(private authService: AuthService) {
    this.authService.setSlidetoggleComponent(this);
  }

  public fireLogin() {
    this.user = this.authService.getCurrentUserData();
    if (this.user != undefined) {
      this.user.subscribe(result => {
        if (result.uid != "") {
          //TODO: slidetoggleの有効化
        }
      });
    }
  }

  onChanged(e) {
    this.authService.getCurrentUserData().subscribe(result => {
      var res = result;
      console.log(res.uid);
      if (res.uid === "") {
        //ログインしていない
        console.log("ログインしていない");
      } else {
        if (e.target.checked) {
          res.nomi = 1;
          console.log("on");
        } else {
          res.nomi = 0;
          console.log("off");
        }
        console.log(res.uid);
        this.authService.updateUserData(res);
      }
    });
  }
}

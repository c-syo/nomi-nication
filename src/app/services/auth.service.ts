import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
// 以下追加したもの
import { AngularFireAuth } from "angularfire2/auth";
import {
  AngularFirestore,
  AngularFirestoreDocument
} from "angularfire2/firestore";
import * as firebase from "firebase/app";
import { Observable } from "rxjs/Observable";
import { of } from "rxjs";
import { switchMap } from "rxjs/operators";
import { User } from "./../models/user";
import { SlidetoggleComponent } from "../slidetoggle/slidetoggle.component";

@Injectable()
export class AuthService {
  private afStore: AngularFirestore;
  private afAuth: AngularFireAuth;
  private stComponent: SlidetoggleComponent;
  private nullUserData: User = {
    uid: "",
    email: "",
    password: "",
    name: "",
    gid: [""],
    photoURL: "",
    nomi: 0
  };
  private currentObUserData: Observable<User>;
  private currentUserData: User;
  private tmpObUserData: Observable<User>;

  constructor() {}

  setSlidetoggleComponent(stComponent: SlidetoggleComponent) {
    this.stComponent = stComponent;
  }

  getCurrentObUserData() {
    return this.getUserData(this.currentUserData);
  }

  siginUp(name: string, email: string, password: string) {
    const data: User = {
      uid: email,
      email: email,
      password: password,
      name: name,
      gid: this.nullUserData.gid,
      photoURL: this.nullUserData.photoURL,
      nomi: this.nullUserData.nomi
    };
    this.currentUserData = Object.assign({}, this.nullUserData);
    this.tmpObUserData = this.getUserData(data);
    if (this.tmpObUserData != undefined) {
      this.tmpObUserData.subscribe(result => {
        if (result) {
          this.currentUserData = Object.assign({}, this.nullUserData);
        }
      });
    }
    if (this.tmpObUserData.uid == "") {
      return this.tmpObUserData;
    }
    this.createUserData(data);
    return this.login(email, password);
  }

  login(email: string, password: string): Observable<User> {
    const data: User = {
      uid: email,
      email: email,
      password: password,
      name: this.nullUserData.name,
      gid: this.nullUserData.gid,
      photoURL: this.nullUserData.photoURL,
      nomi: this.nullUserData.nomi
    };
    this.currentUserData = Object.assign({}, this.nullUserData);
    this.tmpObUserData = this.getUserData(data);
    this.currentObUserData = this.tmpObUserData;
    if (this.tmpObUserData != undefined) {
      this.tmpObUserData.subscribe(result => {
        if (result.password === password) {
          this.currentUserData.uid = result.uid;
          this.currentUserData.email = result.email;
          this.currentUserData.password = result.password;
          this.currentUserData.name = result.name;
          this.currentUserData.gid = result.gid;
          this.currentUserData.photoURL = result.photoURL;
          this.currentUserData.nomi = result.nomi;
          this.currentObUserData = this.tmpObUserData;
          if (this.currentUserData.uid != "" && this.stComponent) {
            console.log("fire");
            this.stComponent.fireLogin();
          }
        } else {
          this.currentObUserData = of(this.nullUserData);
        }
      });
    }
    return this.currentObUserData;
  }
  /*
  logout() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(["/login"]);
    });
  } */
  private createUserData(user: User) {
    const data: User = {
      uid: user.uid,
      email: user.email,
      password: user.password,
      name: user.name || "",
      gid: user.gid || [""],
      photoURL: user.photoURL || "",
      nomi: user.nomi
    };
    this.afStore.doc(`items/${user.uid}`).set(data);
  }
  public updateUserData(user: User) {
    const data: User = {
      uid: user.uid,
      email: user.email,
      password: user.password,
      name: user.name || "",
      gid: user.gid || [""],
      photoURL: user.photoURL || "",
      nomi: user.nomi
    };
    this.afStore.doc(`items/${user.uid}`).set(data);
  }
  public getUserData(user: User) {
    var rtnValue: Observable<User> = this.afStore
      .doc<User>(`items/${user.uid}`)
      .valueChanges();
    rtnValue.subscribe(result => {
      if (result == null) {
        rtnValue = of(this.nullUserData);
      }
    });
    return rtnValue;
  }
  public getUsersData(nomi: number) {
    return this.afStore
      .collection<User>("items", ref => ref.where("nomi", "==", nomi))
      .valueChanges();
  }
  public setAfStore(afStore: AngularFirestore) {
    this.afStore = afStore;
  }
  public setAfAuth(afAuth: AngularFireAuth) {
    this.afAuth = afAuth;
  }
}

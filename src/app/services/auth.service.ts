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
  private currentUserData: Observable<User>;
  private user: User;

  constructor() {}

  setSlidetoggleComponent(stComponent: SlidetoggleComponent) {
    this.stComponent = stComponent;
  }

  getCurrentUserData() {
    return this.currentUserData;
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
    this.createUserData(data);
    this.currentUserData = this.getUserData(data);
    this.stComponent.fireLogin();
    return this.currentUserData;
  }

  login(email: string, password: string) {
    const data: User = {
      uid: email,
      email: email,
      password: password,
      name: this.nullUserData.name,
      gid: this.nullUserData.gid,
      photoURL: this.nullUserData.photoURL,
      nomi: this.nullUserData.nomi
    };
    this.currentUserData = this.getUserData(data);
    this.stComponent.fireLogin();
    return this.currentUserData;
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

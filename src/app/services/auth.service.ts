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

@Injectable()
export class AuthService {
  private user: Observable<User | null>;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private afStore: AngularFirestore
  ) {
    this.user = this.afAuth.authState.switchMap(user => {
      if (user) {
        return this.afStore.doc<User>(`users/${user.uid}`).valueChanges();
      } else {
        return Observable.of(null);
      }
    });
  }

  siginUp(name: string, email: string, password: string) {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        return this.updateUserData(user);
      })
      .catch(err => console.log(err));
  }

  login(email: string, password: string): Promise<any> {
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(user => {
        return this.updateUserData(user);
      })
      .catch(err => console.log(err));
  }

  logout() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(["/login"]);
    });
  }

  public createUserData(user: User) {
    this.afStore.collection("items").add(user.uid);
    const data: User = {
      uid: user.uid,
      email: user.email,
      name: user.name || "",
      gid: user.gid,
      photoURL: user.photoURL || "",
      nomi: user.nomi
    };
    this.afStore.doc(`items/${user.uid}`).set(data);
  }

  public updateUserData(user: User) {
    var docUser: AngularFirestoreDocument<User> = this.afStore.doc(
      `items/${user.uid}`
    );

    const data: User = {
      uid: user.uid,
      email: user.email,
      name: user.name || "",
      gid: user.gid,
      photoURL: user.photoURL || "",
      nomi: user.nomi
    };
    return docUser.set(data);
  }

  public getUserData(user: User) {
    const docUser: AngularFirestoreDocument<User> = this.afStore.doc(
      `items/${user.uid}`
    );

    var tmp = docUser.valueChanges();
    const rtnValue: User = {
      uid: tmp.uid,
      email: tmp.email,
      name: user.name || "",
      gid: user.gid,
      photoURL: user.photoURL || "",
      nomi: user.nomi
    };
    return ur;
  }
}

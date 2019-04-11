import { Component } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import { User } from "./../models/user";

@Component({
  selector: "put_table",
  templateUrl: "./put_table.component.html",
  styleUrls: ["./put_table.component.css"]
})
export class Put_tableComponent {
  /** 取得したコレクションを格納 */
  private itemsCollection: AngularFirestoreCollection<User>;

  /** コレクションのストリームを格納 */
  items: Observable<User[]>;

  // constructor(private afs: AngularFirestore) {
  //   /** itemsコレクションを取得してitemDocumentに代入 */
  //   this.itemsCollection = afs.collection<User>("items");

  //   /** 取得したコレクションをストリームに変換 */
  //   this.items = this.itemsCollection.valueChanges();
  // }
  constructor(private authService: AuthService) {
    this.items = this.authService.getUsersData(1);
  }
}

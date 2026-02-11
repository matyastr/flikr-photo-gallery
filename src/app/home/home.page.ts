import { Component, inject, signal } from "@angular/core";
import {
  RefresherCustomEvent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonRefresher,
  IonButton,
  IonInput,
  IonRefresherContent,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonList,
} from "@ionic/angular/standalone";
import { MessageComponent } from "../message/message.component";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { DataService, Message } from "../services/data.service";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
  imports: [
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonList,
    IonButton,
    IonInput,
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
    MessageComponent,
  ],
})
export class HomePage {
  searchControl = new FormControl("");
  private data = inject(DataService);

  photos = signal<any>([]);

  // NOTE: This is a publicly available key found in the Pixabay API documentation here: https://pixabay.com/api/docs/#api_search_images
  // App requirements state this needs to be a completely runnable application, so chose to leave this public key in the repo.
  // In a normal scenario, this API key would be a stored secret in a CI/CD pipeline, not in the repo.
  private key = "54604089-e8772ff396a4c1520781746c0";
  private searchUrl = "https://pixabay.com/api/";

  constructor(private http: HttpClient) {}

  refresh(ev: any) {
    setTimeout(() => {
      (ev as RefresherCustomEvent).detail.complete();
    }, 3000);
  }

  // TODO: Clean up
  getMessages(): Message[] {
    return this.data.getMessages();
  }

  onSearch() {
    const searchTerm = this.searchControl.value;

    if (!searchTerm) return;

    const params = {
      key: this.key,
      q: searchTerm,
      // Note: chose to default to 40 for the time being.
      per_page: 40,
    };

    this.http.get<any>(this.searchUrl, { params }).subscribe({
      next: (res) => {
        this.photos.set(res.hits);
      },
      error: (err) => console.error(err),
    });
  }
}

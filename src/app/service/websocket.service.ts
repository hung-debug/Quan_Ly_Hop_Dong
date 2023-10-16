import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  public socket$: WebSocketSubject<any>;
  private isConnected = false;
  
  constructor() {
  }
  
  connect(): Promise<boolean> {
    this.socket$ = webSocket('wss://127.0.0.1:8987/GetVersion');
    this.isConnected = false
    return new Promise((resolve, reject) => {
      this.socket$.subscribe({
        next: msg => {
          this.isConnected = true
          resolve(true)
        } , // Called whenever there is a message from the server.
        error: err => reject(false), // Called if at any point WebSocket API signals some kind of error.
        complete: () => console.log('complete') // Called when connection is closed (for whatever reason).
      })
      this.socket$.next({ message: 'get version' })
    })
  }
  closeConnection(): void {
    if (this.socket$ && !this.socket$.closed) {
      this.socket$.complete(); // Close the WebSocket connection gracefully
    }
  }
}
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError, timer } from 'rxjs';
import { concatMap, retryWhen } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  public socket$: WebSocketSubject<any>;
  private isConnected = true;
  private connectionStatus$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
  constructor() {
    // Replace 'wss://your-websocket-server-url' with your WebSocket server's URL.
    // this.socket$ = webSocket('wss://127.0.0.1:8987/GetVersion');
    this.connect()
    // console.log('this.socket$',this.socket$);
  }

  connect() {
    this.socket$ = webSocket('wss://127.0.0.1:8987/GetVersion');
    this.socket$.subscribe(
      () => {
        this.isConnected = true
        this.getConnectionStatus()
      },
      () => {
        this.isConnected = false
      }
    );
  }

  async sendMessage(message: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.socket$.next({ event: 'message', data: message });
      resolve();
    });
  }

  getMessages() {
    return this.socket$.asObservable();
  }

  getConnectionStatus() {
    if (!this.isConnected) {
      this.connect()
    }
    return this.isConnected
  }
  closeConnection(): void {
    if (this.socket$ && !this.socket$.closed) {
      this.socket$.complete(); // Close the WebSocket connection gracefully
    }
  }
}
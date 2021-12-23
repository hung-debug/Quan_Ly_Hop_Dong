import {Injectable} from "@angular/core";
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class DigitalSignatureService {
  urlSignUsbToken = 'https://soundcloud.com/oembed?url=http%3A//soundcloud.com/forss/flickermood&format=json';


  constructor() {

  }

  getJson() {
  }
}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  mostrarHeader: boolean = true;

  constructor() { }
}

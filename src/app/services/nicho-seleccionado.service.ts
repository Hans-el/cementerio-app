import { Injectable } from '@angular/core';
import { Nicho } from '../models/nicho.model';
import { signal } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class NichoSeleccionadoService {
  nichoSeleccionado = signal<Nicho | null>(null);


  constructor() { }
  setSelectedNicho(nicho: Nicho) {
    this.nichoSeleccionado.set(nicho);
  }
  getSelectedNicho(): Nicho | null {
    return this.nichoSeleccionado();
  }

  clearSelectedNicho() {
    this.nichoSeleccionado.set(null);
  }

}

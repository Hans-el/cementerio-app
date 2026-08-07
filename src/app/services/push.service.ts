import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PushService {
  private apiUrl = environment.apiUrl + '/push';


  constructor(
    private http: HttpClient
  ) { }
  getVapidKey(): Promise<string> {
    return this.http.get<{ publicKey: string }>(`${this.apiUrl}/vapid-key`)
      .toPromise()
      .then(res => res!.publicKey);
  }

  async suscribir(): Promise<boolean> {
    try {
      // Verificar soporte del navegador
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.log('Push no soportado en este navegador.');
        return false;
      }

      // Pedir permiso al usuario
      const permiso = await Notification.requestPermission();
      if (permiso !== 'granted') {
        console.log('Permiso de notificaciones denegado.');
        return false;
      }

      // Obtener clave VAPID del backend
      const vapidKey = await this.getVapidKey();

      // Obtener service worker registrado
      const registration = await navigator.serviceWorker.ready;

      // Suscribirse al push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(vapidKey) as BufferSource,
      });

      // Enviar suscripción al backend
      await this.http.post(`${this.apiUrl}/suscribir`, {
        subscription: subscription.toJSON(),
      }, { withCredentials: true }).toPromise();

      console.log('Suscripción push registrada.');
      return true;

    } catch (error) {
      console.error('Error al suscribirse a push:', error);
      return false;
    }
  }

  async desuscribir(): Promise<void> {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await this.http.post(`${this.apiUrl}/desuscribir`, {
          endpoint: subscription.endpoint,
        }, { withCredentials: true }).toPromise();
        await subscription.unsubscribe();
      }
    } catch (error) {
      console.error('Error al desuscribirse:', error);
    }
  }

  async estasSuscrito(): Promise<boolean> {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      return !!subscription;
    } catch {
      return false;
    }
  }

  // Convierte la clave VAPID a Uint8Array que espera el navegador
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
  }
}
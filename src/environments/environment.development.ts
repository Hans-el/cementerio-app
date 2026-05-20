//Cada vez que nos conectemos a un nuevo internet debemos poner la IP aquí, es la IP de tu PC en la red local. Revisamos con ipcomfig en windows o ipa en linux. Luego ponemos la ip y listo
export const environment = {
  production: false,

  // IP real de mi backend. (Actulamente es la misma que en producción porque estoy trabajando desde el mismo lugar, pero se deja preparada para cuando llegue el momento de desplegar en producción y así no tener que cambiar nada en el código)
  apiUrl: 'https://cementerio-app-backend.onrender.com/api',
};

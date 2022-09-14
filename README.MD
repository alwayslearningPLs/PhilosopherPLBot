> `1. Instalacion de paquetes`
**Tener en cuenta que se necesita de [NodeJS](https://nodejs.dev/) para ejecutar este proyecto**
```zsh
npm i 
```

> `2. Configuramos settings.ts`
**Este archivo se situa dentro de /src/, veremos algo igual:**
```ts
import { Settings } from "./types/ConfigurationType";

export const Token: string =
  "AQUI EL TOKEN DEL BOT";
export const configuration: Settings = {
  serverID: "SERVER ID",
  testing: true || false,
  mongoData: {
    uri: "MONGO URI DE TU MONGODB",
  },
  devs: [
    "992146567555448934" /** ex&#2993 */,
    "IDs de los developers (ID de Discord)"
  ],
};

 // Categorias (POR DEFECTO) no necesario tocar
export const categorys = ["Utils"];

// Colores (POR DEFECTO) no necesario tocar
export enum Colors {
  Error = "#eb4034",
  Success = "#6ad966",
  Warn = "#e69627",
  Default = "#7289da",
  Invisible = "#2c2f33",
}
```
**Remplazaremos cualquier valor que veamos que deberia ser configurado, y una vez hecho eso ahora vamos a ejecutar el bot...**

```zsh
npm run dev
```



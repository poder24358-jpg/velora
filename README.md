# Colecciones VELORA

Página de colecciones con 5 colecciones públicas visibles. Las portadas se muestran completas, sin recorte. Al tocar una portada se abre la ficha con sus dos vistas previas completas; tocá cualquiera para ampliarla sin recorte y cerrala con el botón, tocando fuera o usando Escape. Las otras 25 pertenecen al área VIP y no se muestran ni cargan en la página principal.

## Abrir en VS Code

1. Abrí esta carpeta en Visual Studio Code.
2. Abrí `index.html` en tu navegador, o usá la extensión **Live Server**.

Las imágenes de cada colección se encuentran en `images/coleccion-1/`, `images/coleccion-2/` y las demás carpetas. Cada una contiene `portada.png`, `vista-previa-1.png` y `vista-previa-2.png`.

## Aplicación Android (APK)

La app Android se genera con Capacitor y contiene las cinco colecciones públicas. El script `npm run build:web` prepara `www/` copiando solo las páginas, scripts, imágenes de pago/portada y recursos de `coleccion-1` a `coleccion-5`; las carpetas de colecciones VIP no se incluyen.

Requisitos: Node.js 22, Android Studio, JDK 21 y Android SDK instalado.

1. Ejecutá `npm install`.
2. Ejecutá `npx cap add android` una sola vez para crear el proyecto nativo.
3. Ejecutá `npm run android:debug` para sincronizar el sitio y compilar el APK de prueba.
4. El archivo se genera en `android/app/build/outputs/apk/debug/app-debug.apk`.

El APK debug sirve para probar o instalar manualmente; para distribuir en Google Play hace falta una compilación release firmada y revisar las políticas vigentes. La app está destinada exclusivamente a personas adultas y solo debe incluir contenido legal de adultos. Como el sitio es estático, pagos, comprobantes y acceso VIP no se verifican ni se protegen en el APK.

## Ruleta y pagos

La ruleta está en `ruleta.html`, separada de la página principal. Muestra 10 premios: 3 minutos, 30 minutos (dos casillas), 1, 2, 4, 8, 12 o 24 horas, y acceso permanente. El premio indica que habilita el área VIP y todo el contenido disponible por el tiempo indicado. El precio de participación es $3.000 ARS por transferencia o 2 USDT en la red TRC20. Para transferencias argentinas, el responsable debe facilitar un alias/CBU/CVU real. La dirección USDT mostrada es la proporcionada para TRC20; verificá que esté configurada para recibir el pago antes de publicar.

La ruleta, el VIP y las colecciones ofrecen los mismos medios de pago: transferencia al alias `v.g.lemon` (Lemon Cash, titular Alan Robledo) o 2 USDT a la dirección TRC20 indicada. La transferencia en pesos muestra el precio correspondiente a cada producto. Estos datos fueron proporcionados por el propietario del sitio y no se verifican aquí; quien pague debe confirmar los datos del titular en su banco y la red/dirección antes de transferir.

La interfaz permite seleccionar un método y un archivo de comprobante, pero este proyecto es una página estática: no envía ni almacena comprobantes y no cuenta con una pantalla de revisión/aprobación. Por eso, el giro y el contenido VIP quedan bloqueados; no se debe considerar pagado ni aprobado por cargar un archivo. Hace falta un backend seguro para recibir y proteger los comprobantes, permitir la aprobación manual del responsable y habilitar el acceso únicamente después de la aprobación. Los formularios muestran `images/pago.jpeg` al pie de las instrucciones.

La imagen informativa al pie del pago está en `images/pago.jpeg`. No se incluye ninguna afirmación sobre una ley o exención legal; consultá asesoramiento profesional para determinar qué requisitos legales aplican.

La página principal solo renderiza las primeras 5 colecciones; cada colección pública cuesta $10.000 ARS. Las otras 25 no se muestran allí, pero los archivos de imágenes correspondientes siguen presentes dentro del proyecto; ocultarlas en una página estática no las protege de quien pueda acceder a esos archivos. Para mantenerlas privadas, mové sus archivos a un almacenamiento protegido y serví el acceso desde un backend que valide el pago, la aprobación y el vencimiento del premio.

El botón "Desbloquear todo" abre una solicitud de acceso VIP por $25.000 ARS y pide un comprobante. El proyecto no tiene backend para recibir comprobantes, verificar pagos o habilitar el acceso; el mensaje de demostración mantiene las colecciones VIP bloqueadas. La imagen `images/pago.jpeg` aparece al pie de los formularios de pago de ruleta, VIP y colecciones.

## Pagos

Las instrucciones de pago comparten los mismos datos en todos los formularios; no hay procesamiento ni verificación de transferencias o criptoactivos en esta página estática.

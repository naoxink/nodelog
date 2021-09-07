# nodelog
 
### Uso:

```javascript
// Requerir la clase
Log = require('./helpers/Log.js')

// Configurar módulo de logging
Log.setMode('file')
Log.setDir('./logs')

// Añadir los tipos de logs extras que vamos a usar
Log.addLogType('access')
Log.addLogType('mongodb')
Log.addLogType('mongodbError')

// Uso
Log.access('Acceso desde xx.xx.xx.xx')
Log.mongodb('Conectado a mongodb')
```

---

### Modos

* `console`: Usa los métodos de consola (log, info, error)
* `file`: Escribe un archivo por cada tipo de log (Se pueden crear todos los que se quiera)

### Métodos

* `setDir`: Establece el directorio donde se guardarán los archivos de logs (Sólo en modo `file`)
* `setLogPrefix`: Establece el prefijo del archivo de log (Sólo en modo `file`)
* `setMode`: Establece el modo de funcionamiento (`console` o `file`)

También estarán disponibles todos los tipos de log creados (en modo `file`) automáticamente.

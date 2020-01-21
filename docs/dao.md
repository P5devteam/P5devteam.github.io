---
id: dao
title: DAO
sidebar_label: DAO
---

La estructura de la API que hicimos para OVloop la estructuró Juani y es algo así:

## Folder structure

- SRC
  - CONTROLLERS
  - DAOS
  - DBMODELS
  - MODELS
  - PUBLIC
  - ROUTES
  - index.js
  - package.json
  - Dockerfile
  - Cualquier archivo de config

La papa está dentro de `src` cuando entra un request http o del tipo que sea, el flow funciona de la siguiente manera:
REQ====>ruta===>controlador===>modelo===>DAO--->modelo---->controlador--->RES

## CONTROLADOR:

Son funciones que reciben req, res y opconalmente next como parámetros, osea que son llamadas directamente por el router. En esta parte se debe chequear que el pedido tenga toda la información necesaria para poder procesarlo correctamente; esto es que el req.body exista y tenga todos los campos obligatorios y con el tipo de dato requerido, guardar los req.params y campos del req.body en variables.

Si está todo OK, se llama a algun método del modelo con toda la data obtenida. En caso contrario, se envía una respuesta con el status code y un mensaje acorde. Lo mismo sucede al obtener la respuesta del modelo.

## MODELO:

Es la parte encargada de "armar" los modelos/estructuras que va a utilizar el dao. EJ: Armar un objeto con todos los campos necesarios para que el dao cree una instacia en la DB. La data para el objeto se recibe como parámetro (lo pasa el controlador), pero si es necesario agregar algún campo como puede ser generar un UUID o una fecha, se hace en esta parte del flow.
OTRO EJ: Se arma unn objeto filtro para que el dao ejecute una query según los campos que se reciban desde el controlador.
El modelo retorna lo que retorna el dao o directamente devuelve algún método del dao ejecutado con la estructura armada.
DAO (Data Access Object):
Es el paso encargado de comunicarse con la DB o ejecutar el fin último del request. Es importante por cuestiones de exposición y seguridad que solo el dao sea quien tenga accesso a la info almacenada en la DB.
Si la idea del request no era comunicarse con una DB sino por ejemplo mandar un mail, se hace en esta instancia y en los pasos anteriores se procesa toda la data y se arma el mail que se va a enviar. En este paso SOLO se envía el mail.
Una vez obtenida una respuesta, se retorna.

## OTRAS OBSERVACIONES:

Cada paso exporta una sola clase que lleva el nombre del paso precedido por el modelo de la base de datos al que afecta. Si el modelo de la base de datos se llama Users, los archivos y las clases dentro de cada archivo se llaman UsersController.js, UsersModel.js y UsersDAO.js y UsersController, UsersModel y UsersDAO respectivamente.
Cada clase tiene métodos que llevana cabo las distintas validaciones o arman los distintos objetos o le pegan a la db según sea requerido.
Además, cada paso es imprescindible. Por ejemplo, si en el modelo no es necesario armar nada, igual actúa como intermediario a pesar de que lo único que haga es llamar al dao. El controlador NO llama al DAO!
Acá un mini ejemplo bien acotado en el que el model está al re pedo:

```js
// Controller:
class MessagesController {
  static async getSingleMessage(req, res) {
    const requestId = req.params.requestId;
    const result = await MessagesModel.getSingleMessage(requestId);
    if (result == null) res.status(400);
    else res.status(200).send(result);
  }
}
// Model:
class MessagesModel {
  static async getSingleMessage(requestId) {
    return MessageDao.getSingleMessage(requestId);
  }
}
// Dao:
class MessagesDao {
  static getSingleMessage(requestId) {
    return Message.findOne({ requestId }).then(message => {
      return message;
    });
  }
}
```

Esto obviamente es lo que vi en base al proyecto e investigando que era un dao. No encontré en ningún lado que una api se organice de este modo (controller, model, dao). Vi que se usan controladores y daos en todos lados pero la parte de model no. Algunos a este paso intermedio lo llaman service pero hace otras cosas. Otros directamente lo omiten.

### PREGUNTAS PARA JUANI:

- Se que en el proyecto, si el dao ejecutaba una accion que no era comunicarse con la db (mandaba un mensaje), igual se hacía en esta instancia. ¿Se hace así realmente? Porque en lo que estuve investigando el dao es como una suerte de capa para comunicarse específicamente con algún servicio que almacene info y no creo que una acción que envíe un mensaje sea algo de ese estilo.
- La respuesta del dao, por lo que vi, es la data cruda de la base de datos. Si quiero darle forma a la respuesta y elegir que info enviar, tengo dos opciones, formatear la respuesta o directamente hacer una query que me traiga únicamente los campos necesarios. ¿Cuál es la mejor opción?
- Hay veces que de todos modos se necesita realizar alguna acción con la info obtenida del dao entes de enviarla. Ahí no puedo escapar a formatear mi respuesta. ¿Eso lo hago en el modelo?

- Otra inquietud es con respecto la rigidez del flow (controlador===>modelo===>DAO--->modelo---->controlador--->RESPUESTA). Me es muy facil imaginarme casos en los que el controlador necesite llamar a más de un método de modelo o el modelo a más de un método del dao, etc. Supongo que no está mal que así sea pero entiendo que se pierde un poco el fin de hacer el recorrido lo más simple posible. También se me ocurre que muchas de estas idas y vueltas se solucionarían si alguno de los pasos pudiera manejar alguna lógica que no debería. Entonces ¿Cuál es la mejor opción? ¿Se respeta el flow o se respetan las funcionalidades de cada paso del flow? Entiendo que es una pregunta muy abarcativa y que habría que contemplar cada caso pero ya que Juani la tiene clara se le puede pedir una sugerencia general.

---
id: lambda
title: Lambda Service
sidebar_label: lambda
---

## Investigación de lambdas aplicado a mailing (Santi)

Bueno, acá les resumo un poco lo que hice con las Lambda de AWS para el servicio de mailing.

## Primer aproach

AWS te permite hacer todo "manualmente" desde la página. Ahí podes poner el nuevo código de la función, configurar el entorno de desarrollo, etc. Peeero a mi parecer, para el usuario inexperto, el flow de la página es confuso.
Para hacer el deploy de una lambda podes escribir el código en el editor de la página o subir un .zip. Hay un montón de blueprints que podes usar de AWS para no tener que escribir tanto. Si todo el código pesa más de 250 MB lo tenés que subir si o si a un S3 (con toda la config que eso implica). Además, una vez que lo subiste, tenes que agregar los triggers, es decir, cuando se va a llamar a la función. Estos pueden ser distintos eventos de servicios de AWS (p.e de un S3 o de dynamoDB) o HTTP.
Como lo que nosotros queremos son HTTP, hay que configurar los endpoints con distintas API gateways que apunten a la lambda.
Esto todavía no se como hacerlo directamente desde el sitio de AWS pero es lo que voy a investigar en estos dias.

## Serverless framework

Por suerte encontre un framework que se llama "serverless framework" que ahorra muchos de los pasos manuales y te permite trabajar todo localmente, incluso hasta probar la función sin hacer el deploy. Una vez que está todo listo se corren unos comandos en la consola y el framework solito se encarga de hacer el deploy, subir el codigo a un S3 bucket y dejar las funciones ya escuchando. RE CHETO!
Con el framework ese es una pavada, incluso podés subir dependencias y librerías (mailgun en este caso) e ignora las devDependencies para el deploy.
Acá lo que hice:
Primero que nada cree en aws un nuevo usuario y un nuevo grupo con permisos de administrador (no es que hice una nueva cuenta, está dentro de p5) en la seccion IAM. Otro usuario que ya existía ahí es el de lumartex, por ejemplo. Creo que son como los roles de psql, ponele.
Bueno, entonces cree uno..
El Usuario se llama serverless-admin y el grupo serverless-group.
Despues instale aws-cli y serverless framework globalmente: npm i -g aws-cli serverless
Configure las credenciales de aws: te pide las claves y además una default region en la que usamos sa-east-1 y un default output format, ponemos json.
Despues configuramos serverless para aws:

```bash
    sls config credentials --provider aws --key <Access Key> --secret <Secret Access Key> --profile <Nombre del Usuario>
```

_en la terminal los comandos de serverless se pueden poner comenzando con "serverless" o con "sls", es lo mismo_

Joya, ya está todo configurado. Ahora con un comando podemos crear un boilerplate de una lambda hecha en Nodejs:

```bash
sls create --template aws-nodejs
```

Esto nos crea un `.gitignore`, un `handler.js` y un `serverless.yml`, Las ultimas dos son las unicas dos cosas indispensables para que funque.
En el handler va la funcion, y el el yml la config. Ahí mismo podes definir los endpoints y que función se le asigna a cada uno, está tremendo.
Para testear las cosas offline hay que instalar serverless-offline con el flag -D así despues es ignorado en el deploy.
Les explicaria más en detalle las configs pero son algunas cosas más y creo que es mejor si lo quieren saber que nos juntemos y lo veamos.
En fin, con el comando sls deploy (y hay algunos flags que te permiten elegir el staging, la región, etc) sale con fritas y ya queda funcionando en AWS. Con sls remove las bajas y chau.
Por ahora ya están funcionando las dos rutas que tiene la vieja api de mailing pero sin el pipedrive. Si bien funcionan flama hay algunas cosas que le preguntaría a juani en cuanto a la estructura de las lambdas:

- Conviene usar el serverless framework?
- Así como está diagramado, se suben todos los node_modules y archivos dentro del root directory: ¿es mejor hacerlo con las layers que te provee aws o para un archivo tan liviano y simple no tiene sentido?
- Son dos funciones, no hay ninguna estructura tipo controller>>>model>>>dao. Tiene sentido pq no hay ninguna DB involucrada todavía, pero llegado al caso, cuál es la idea: ¿Hago todo dentro del export de cada handler? ¿O divido y modularizo todo? Realmente no se que conviene con las lambda porque cuanto menor sea el runtime mejor, por lo menos económicamente hablando jajajaj

  Ah, y bueno, acá están las rutas, las dos POST:
  https://e4trp6her0.execute-api.us-east-1.amazonaws.com/dev/contacto
  https://e4trp6her0.execute-api.us-east-1.amazonaws.com/dev/aplicar
  En el body tienen que tener si o si los campos consulta, nombre e email y la ruta de aplicar tambien el campo curso, que puede ser solamente intro o bootcamp en string.

## Segundo aproach

Gueno, acá va un update de mis indagaciones en AWS-lambda.

Logré hacer lo mismo que les había comentado anteriormente con el serverless framework pero esta vez manualmente. Es bastante un quilombo entenderlo desde la documentación de AWS pero una vez que sale no es taaanto ni tan dificil.
No aprendí a usar la consola de AWS lambda pq son un montón de comandos y se puede hacer lo mismo con la interfaz gráfica.
De nuevo, si les pinta que les muestre como hacerlo nosju un ratito y lo vemos.
En fin, acá van algunos comentarios acerca de mis interacciones con la empresa de Jeff Bezos XD:

- Para hacer la función hay un editor online que está copado pq te deja crear carpetas y archivos y lo que quieras, funciona igual que si estuvieras en el editor de la compu. Si no se necesita trabajar con npm y la función es algo simple me parece una rápida y cómoda opción. Si hay que usar npm (o cualquier cosa para la que haya que correr comandos en una terminal) yo recomendaría trabajar todo localmente y después subirlo en un .zip, el resultado es realmente el mismo. Es más, aws lo descomprime sólo y te lo muestra en el editor que les decía!
- Ahora, la cosa se complica un poco para agregar los triggers. Hay que aprender a usar API gateway (oooootro servicio más de aws) que te permite crear una API rest y asignarle una lambda a cada endpoint. Cada endpoint requiere un poco de configuración pero nada del otro mundo. Si habilitas la opción de que las requests pasen por un proxy que tiene aws por ahí dando vueltas te ahorrás un montón de trabajo en cuanto a configs. Sobre todo por que si no habría que configurar cada param de la URL (si es que la ruta los tiene) y ni hablar los query strings. Habilitando el proxy le llega todo "parseado" al event de la funcion y listo para ser usado.
- Para incluir paquetes y demás, es como ya les había contado antes con el framework, ni un drama. El deploy de la lambda se hace por separado del de la API, osea, funcionan independientemente así que hay que asegurarse de que ambos estén funcionando en simultáneo.
  Realmente no me pareció tan complicado una vez que encontré las partes juuustas en la documentación. Peeero también entiendo que hay un montón de herramientas y configuraciones que estoy dejando de lado. Con lo que aprendí, con o sin el serverless framework, se puede hacer el servicio de mailing muy tranquilamente.
  De todos modos creo que hay varias cosas que estaría copado que juani nos las explique para optimizar la API y no consumir recursos al pedo.
  También me queda pendiente hacer las cosas con typescript. Estaría bueno hacerlas, luego transpilarlo y subir eso.

** SERVERLESS FRAMEWORK O NO? **

EL resultado después de hacer el deploy con el framework o subiendo un zip es EXACTAMENTE el mismo en cuanto a la estructura de la lambda, así que por ese lado no se consumen recursos adicionales. Ahora, una REEE ventaja que le encontré al framework es que ya directamente en el yml podés configurar los triggers y los endpoints. Osea, cuando hacés el deploy de la lambda con sls (serverless frmwrk) también se genera auntomáticamente una API con API gateway que encima usa el proxy de aws. En este sentido realmente se ahorra una buena cantidad de tiempo. Lo que no se es si de esta manera queda algo mal configurado o perdés algunas funcionalidades. Eso es lo que estaría bueno preguntarle a JUANI.

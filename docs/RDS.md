---
id: RDS
title: Amazon Relational Database Service
sidebar_label: RDS
---

## Introducción

Una RDS es una instancia de una base de datos relacional de varias opciones que te dan para elegir, nosotros usamos postgresql pero hay otras como por ejemplo MariaDB o MySQL. Una instancia de una base de datos es como tenerla montada en la compu normal pero en lugar de, por ejemplo, yo tenerla, digamos que se monta en un servidor de AWS.
Cuando la creas por primera vez te da dos opciones: configuras la seguridad, los backups, etc manualmente o ellos te dan un "boilerplate" de configuración que después se puede editar una vez creada la instancia. Si elegis la segunda opción (la easy osea el boilerplate) después de creada la base de datos hay que cambiar la configuración en la parte del acceso que se pone solo en privado, esto quiere decir que se puede usar solo dentro de la VPC (Amazon Virtual Private Cloud) de Amazon y por lo tanto no tiene una ip publica por lo que no es accesible luego desde una configuración de sequelize, o de pgadmin o psql desde la consola etc. Para poder acceder hay que poner esta configuración publica.

## Pricing

Tambien me acabo de dar cuenta que estoy usando un free tier asique es gratis por un año y te dan esto:
The Amazon RDS Free Tier is available to you for 12 months. Each calendar month, the free tier will allow you to use the Amazon RDS resources listed below for free:
750 hrs of Amazon RDS in a Single-AZ db.t2.micro Instance.
20 GB of General Purpose Storage (SSD).
20 GB for automated backup storage and any user-initiated DB Snapshots.
Learn more about AWS Free Tier.
When you free usage expires or if your application use exceeds the free usage tiers, you simply pay standard, pay-as-you-go service rates as described in the Amazon RDS Pricing page.
Asique re piola.
Agregando a esta wea cuando vos creas la instancia le podes poner una contraseña generada automaticamente que solo te la deja ver una vez asique si no la guardas te re cabió, igualmente te avisa de forma bastante clara pero bueno.
Y tambien cuando la creas viene con unos VCP security groups que no se muy bien como funcionan pero creo que podes ponerle que acepte request desde anywhere y entonces no tenes que hacer publica la instancia de la RDS pero no tengo ni puta idea asique por ahi estoy escribiendo cualquier boludez, pero en la doc te dice que si tenes un error de time out cuando te queres conectar que cambies eso. Yo cambie dos cosas (eso de la configuración que lo puse publico y el security group para que acepte inbounds desde cualquier lado) asique no estoy seguro cual es la manera correcta de hacerlo.
Para crear una base de datos dentro de la instancia se puede hacer desde pg admin una vez que linkeas el server le haces click derecho y creas una nueva database. Y sino desde la consola podes tambien como lo harias normalmente solo hay que agregar los flags correspondientes de host, port, username etc.
Despues es todo como si lo tuvieses en tu computadora solo hay que ponerle los flags y eso.

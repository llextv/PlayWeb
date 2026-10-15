# PlayWeb

PlayWeb est une plateforme de jeux en ligne codéveloppée par @gloxiou (frontend) et @llextv (backend et mise en production).

Cette plateforme centralise les connexions des joueurs à l'ensemble des jeux développés avec l'API PlayWeb et approuvés par la plateforme. Pour le moment, aucune soumission de jeu n'est encore acceptée, car l'API publique destinée aux développeurs est toujours en cours de développement.

À l'image de Steam, PlayWeb permet également aux joueurs d'ajouter des amis, de débloquer des succès (*achievements*) et de profiter d'une expérience unifiée entre plusieurs jeux.

## Technologies

- **Backend :** Node.js avec TypeScript
- **Frontend :** HTML, CSS et JavaScript natifs
- **Base de données :** MySQL avec Prisma ORM

## Comment ça marche ?

PlayWeb centralise l'authentification des joueurs sur les différents jeux affiliés et permet de gérer la transmission sécurisée des jetons d'authentification (*tokens*). Cette architecture permet aux joueurs d'utiliser un seul compte pour accéder à plusieurs jeux partenaires.

Chaque jeu doit d'abord être enregistré auprès du serveur PlayWeb. Il peut ensuite configurer ses propres succès. Lorsqu'un joueur débloque un succès en jeu, les informations correspondantes sont transmises au serveur PlayWeb via un canal sécurisé.

## Limites actuelles

Nous sommes conscients que la plateforme présente actuellement des risques de sécurité, notamment concernant la perte de compte ou le vol de jetons d'authentification (*tokens*).

PlayWeb étant encore en cours de développement, des améliorations de sécurité sont prévues afin de renforcer progressivement la protection des comptes et des données des utilisateurs.

**Quelques statistiques : plus de 100 joueurs se sont déjà connectés à la plateforme !**

**One platform, many games.**

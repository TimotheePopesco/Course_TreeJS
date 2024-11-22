# Course_TreeJS
A Tree.js animation of my annual Master 1 project: a connected rugby helmet. Feel free to send me feedback.

# Pop Shock - Projet 3D

Un casque de rugby intelligent pour prévenir les commotions cérébrales, intégrant des capteurs avancés et une visualisation 3D interactive.

## Table des matières
1. [Introduction](#introduction)
2. [Fonctionnalités principales](#fonctionnalités-principales)
3. [Bibliothèques et outils utilisés](#bibliothèques-et-outils-utilisés)
4. [Déploiement (Vercel)](#déploiement-vercel)
5. [Fonctionnalités des modèles (`cask` et `caskun`)](#fonctionnalités-des-modèles-cask-et-caskun)

---

## Introduction
Le projet **Pop Shock** combine l'électronique embarquée et la visualisation 3D pour simuler un casque de rugby intelligent.  
Ce projet vise à :
- **Détecter les chocs** avec des capteurs piézoélectriques.
- **Analyser les changements de direction** avec un accéléromètre.
- **Afficher une simulation interactive** en 3D via un site déployé sur Vercel.

---

## Fonctionnalités principales
- **Deux modèles 3D :**
  - **Cask :** Représente l'état normal. Permet de déclencher une animation de secousse ("Shake").
  - **Caskun :** Active des bulles d'information décrivant les composants embarqués.
- **Graphiques dynamiques :** Les chocs et mouvements sont visualisés avec des graphiques en bas de l'écran.
- **Interaction utilisateur :** Cliquez pour interagir, survolez pour afficher des informations.

---

## Bibliothèques et outils utilisés
### Front-End 3D
- **Three.js** : Création et rendu des modèles 3D, gestion des shaders et des animations.
- **GSAP** : Animation fluide des modèles 3D lors des interactions.
- **Chart.js** : Visualisation des données sous forme de graphique en temps réel.

### Électronique embarquée
- **ESP32-C3 Beetle** : Microcontrôleur compact pour la communication et la gestion des capteurs.
- **MPU6050** : Détecteur de mouvement et d'orientation.
- **Capteurs piézoélectriques** : Détection précise des chocs sur le casque.
- **Couture textile** : Fixation et intégration des composants dans une structure ergonomique.

---

## Déploiement (Vercel)
Le site est déployé sur **Vercel** pour une livraison rapide et optimisée :

1. Dépôt GitHub lié directement à Vercel.
2. Commandes de build : `npm run build`.
3. URL du projet : [pop-shock.vercel.app](https://pop-shock.vercel.app)

---

## Fonctionnalités des modèles (`cask` et `caskun`)
### Cask
- Modèle par défaut affichant le casque.
- Bouton **Shake** pour simuler un choc.
- Graphique dynamique en bas à gauche affichant les données simulées.

### Caskun
- Modèle interactif affichant des sphères cliquables.
- Infobulles descriptives pour chaque composant.
- Pas de graphique ou animation.

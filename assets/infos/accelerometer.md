# Accéléromètre MPU6050

## 1. Présentation
Le **MPU6050** est un capteur gyroscopique et accéléromètre. Il est utilisé pour détecter les changements de direction et les mouvements dans le casque.

---

## 2. Fonctionnalités
- **Mesure de l'accélération** sur 3 axes.
- **Mesure de la rotation** (gyroscope intégré).
- **Communication I2C** pour une intégration facile avec l'ESP32.

---

## 3. Pourquoi l'utiliser ?
- Permet de détecter les changements brusques de direction, par exemple lors d'un choc.
- Compatible avec l'ESP32 et facile à programmer.

---

## 4. Configuration
1. Connecter le capteur à l'ESP32 via I2C.
2. Utiliser une bibliothèque comme **MPU6050** pour l'IDE Arduino.
3. Lire les données des axes X, Y et Z pour détecter les mouvements.

---

## 5. Documentation supplémentaire
- [Datasheet MPU6050](https://invensense.tdk.com/products/motion-tracking/6-axis/mpu-6050/)
- [Exemple de code Arduino pour MPU6050](https://github.com/jrowberg/i2cdevlib/tree/master/Arduino/MPU6050)

Créer un site web HTML/CSS/JavaScript qui permet de calculer automatiquement la répartition d’une facture d’électricité entre plusieurs personnes à partir de leurs anciens et nouveaux index.
Le site doit être autonome, responsive, et sauvegarder les mois précédents dans le navigateur (localStorage).
Les calculs doivent être exacts comme ceux du mois de septembre ci-dessous.

📊 Exemple à intégrer par défaut (mois de septembre 2025)
Facture totale :
191 617 Ar

Détails individuels :
Nom	Ancien index	Nouvel index	Consommation (kWh)	Montant approximatif (Ar)
Jessica	120.0	125.2	5.2	≈ 3 750 Ar
Ravaka	200.0	246.3	46.3	≈ 33 380 Ar
Henintsoa	150.0	202.0	52.0	≈ 37 500 Ar
Kambana	80.0	115.6	35.6	≈ 25 670 Ar
Mitia	300.0	308.0	8.0	≈ 5 770 Ar
Lydia	50.0	122.6	72.6	≈ 52 330 Ar
Nathalie	400.0	446.1	46.1	≈ 33 240 Ar
Détail du calcul :

Consommation individuelle (kWh) = Nouvel index – Ancien index

Consommation totale = 265,8 kWh

Prix du kWh = 191 617 ÷ 265,8 ≈ 721,1 Ar/kWh

Montant individuel = Conso × 721,1

💻 Structure du projet
/kwhsplit/
│
├── index.html
├── style.css
└── script.js

🧩 Fonctionnalités demandées
🧮 Calculs automatiques

Chaque ligne contient :

Nom

Ancien index

Nouvel index

Conso (calculée automatiquement)

Montant (calculé automatiquement)

Bouton pour supprimer la ligne

Le tableau doit se recalculer automatiquement quand un index change.

📥 Champs généraux

Mois (ex. “Septembre 2025”)

Montant total de la facture (en Ar)

Boutons :

💰 Calculer la facture

💾 Sauvegarder le mois

📅 Voir l’historique

➕ Ajouter une personne

📊 Résumé en bas de page

Total des kWh

Prix du kWh

Total des montants individuels

Écart avec la facture totale (s’il y a un arrondi)

⚙️ Logique JavaScript à implémenter
// Exemple de formule pour les calculs :
conso = nouveauIndex - ancienIndex;
if (conso < 0) conso = 0;

totalKwh = somme de toutes les conso;
prixKwh = factureTotale / totalKwh;
montantIndividuel = conso * prixKwh;


Arrondir prixKwh à 1 décimale pour affichage, mais garder la valeur complète pour les calculs.

montantIndividuel doit être arrondi à l’unité (Math.round).

Calculer la somme totale des montants et comparer avec la facture totale.

Afficher la différence éventuelle (écart).

💾 Sauvegarde locale

Sauvegarder chaque mois dans localStorage :

{
  mois: "Septembre 2025",
  facture: 191617,
  totalKwh: 265.8,
  prixKwh: 721.1,
  personnes: [
    { nom: "Jessica", ancien: 120.0, nouveau: 125.2, conso: 5.2, montant: 3750 },
    { nom: "Ravaka", ancien: 200.0, nouveau: 246.3, conso: 46.3, montant: 33380 },
    { nom: "Henintsoa", ancien: 150.0, nouveau: 202.0, conso: 52.0, montant: 37500 },
    { nom: "Kambana", ancien: 80.0, nouveau: 115.6, conso: 35.6, montant: 25670 },
    { nom: "Mitia", ancien: 300.0, nouveau: 308.0, conso: 8.0, montant: 5770 },
    { nom: "Lydia", ancien: 50.0, nouveau: 122.6, conso: 72.6, montant: 52330 },
    { nom: "Nathalie", ancien: 400.0, nouveau: 446.1, conso: 46.1, montant: 33240 }
  ]
}


Permettre de consulter les mois précédents.

Afficher dans une petite table ou un modal les anciens résultats sauvegardés.

🎨 Style et interface

Utiliser Bootstrap 5 (CDN) pour un style propre et responsive.

Police lisible (Roboto ou Inter).

Couleurs douces (#e9ecef fond, #212529 texte).

Les champs doivent être alignés proprement.

Boutons avec emojis et effet hover léger.

🔒 Bonus (optionnel)

Bouton “🧾 Exporter en PDF” pour un mois sélectionné.

Option “Répartir l’écart” : distribuer la différence d’arrondi sur les plus grosses consommations.

🧪 Vérification (résultat attendu avec l’exemple)

Quand on entre les données ci-dessus :

Total kWh = 265,8

Prix du kWh = 721,1 Ar

Total des montants ≈ 191 617 Ar

Écart affiché ≈ 0 (ou quelques ariary selon arrondi)
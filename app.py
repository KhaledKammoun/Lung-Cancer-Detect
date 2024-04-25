import pandas as pn
import seaborn as sns
import matplotlib.pyplot as plt


import numpy as np
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

df = pn.read_csv("cancer_des_poumons.csv")

### 3.1. La phase de préparation de données


# 1 : Vérifier s’il existe des observations qui sont manquantes ou NaN, si c’est le cas alors remplacer les valeurs manquantes dans chaque colonne par la moyenne de la variable.

# le nombre des observations dans la base
nombre_observations = df.shape[0]
# le nombre des caractéristiques.
nombre_caract = df.shape[1]
print("nombre_observations : ", nombre_observations)
print("nombre_caractere : ", nombre_caract)

# 2 : 
for col in df.select_dtypes(include=['float64', 'int64']).columns:
    if df[col].isnull().sum() > 0:
        meanValue = df[col].mean()
        df[col].fillna(meanValue, inplace=True)

# print(df)


# Phase II : Transformations :

# Question 1 : transformer chaine en entier
colonnes_string = df.select_dtypes(exclude=['float64', 'int64']).columns
mappingCols = {}
for col in colonnes_string :
    unique_values = df[col].unique()
    
    for index, value in enumerate(unique_values) :
        print(value)
        df[col] = df[col].replace(value, index)

# print(df)

# normaliser les valeurs
# Question 2
mean = df.mean()
std = df.std()
print("Mean of DF : ", mean)
print("Standard Diviation of DF : ", std)
for col in df.columns :
    df[col] = (df[col] - mean[col]) / std[col]

mean = df.mean()
std = df.std()
print("New Mean of DF : ", round(mean, 2))
print("New Standard Diviation of DF : ", std)

# afficher la matrice de corrélation 
# Question 3
corr_matrix = df.corr()
# print(corr)

plt.figure(figsize=(10, 8))
sns.heatmap(corr_matrix, annot=True, cmap="coolwarm", fmt=".2f")
plt.title("Matrice de Corrélation")
#  plt.show()

### ANALYSE ::

"""
Les variables "GENDER" et "CHEST PAIN" ont une corrélation de -0.36, ce qui indique une forte corrélation négative. Cela suggère une relation où le genre et la douleur thoracique ont tendance à varier de manière opposée.
Les variables "GENDER" et "ALCOHOL CONSUMING" ont une corrélation de -0.45, ce qui indique une forte corrélation négative. Cela suggère une relation où le genre et la consommation d'alcool ont tendance à varier de manière opposée.
Les variables "YELLOW FINGERS" et "ANXIETY" ont une corrélation de 0.57, ce qui indique une forte corrélation positive. Cela suggère une relation où la présence de doigts jaunes et l'anxiété ont tendance à varier de manière similaire.
Les variables "YELLOW FINGERS" et "SWALLOWING DIFFICULTY" ont une corrélation de 0.35, ce qui indique une corrélation positive mais moins forte. Cela suggère une relation où la présence de doigts jaunes et les difficultés à avaler peuvent varier ensemble mais avec moins de force.
Les variables "ANXIETY" et "SWALLOWING DIFFICULTY" ont une corrélation de 0.49, ce qui indique une forte corrélation positive. Cela suggère une relation où l'anxiété et les difficultés à avaler ont tendance à varier de manière similaire.
Les variables "PEER PRESSURE" et "SWALLOWING DIFFICULTY" ont une corrélation de 0.37, ce qui indique une corrélation positive mais moins forte. Cela suggère une relation où la pression des pairs et les difficultés à avaler peuvent varier ensemble mais avec moins de force.
Les variables "FATIGUE" et "SHORTNESS OF BREATH" ont une corrélation de 0.44, ce qui indique une forte corrélation positive. Cela suggère une relation où la fatigue et le souffle court ont tendance à varier de manière similaire.
Les variables "ALLERGY" et "ALCOHOL CONSUMING" ont une corrélation de 0.34, ce qui indique une corrélation positive mais moins forte. Cela suggère une relation où les allergies et la consommation d'alcool peuvent varier ensemble mais avec moins de force.
Les variables "WHEEZING" et "COUGHING" ont une corrélation de 0.37, ce qui indique une corrélation positive mais moins forte. Cela suggère une relation où les sifflements et la toux peuvent varier ensemble mais avec moins de force.
Les variables "ALCOHOL CONSUMING" et "CHEST PAIN" ont une corrélation de 0.33, ce qui indique une corrélation positive mais moins forte. Cela suggère une relation où la consommation d'alcool et la douleur thoracique peuvent varier ensemble mais avec moins de force.

"""


### 3.2. La phase d’extraction des caractéristiques

"""
REMARQUE ::
Variance : 
En ACP, la variance est utilisée pour évaluer la quantité d'information contenue dans chaque variable.
Les variables avec une variance élevée contribuent davantage à la création des composantes principales
car elles ont plus d'impact sur la variation des données.
==> La variance mesure la dispersion des données dans chaque dimension (variable) .
Valeur Propre :
Les valeurs propres sont utilisées pour déterminer l'importance de chaque composante principale dans la représentation
des données.
Les composantes principales avec des valeurs propres élevées expliquent une grande partie
de la variation des données et sont donc considérées comme importantes.
==> Les valeurs propres mesurent la quantité de variance expliquée par chaque composante principale dans l'ACP.
"""

# Question 1 :: Appliquer sur la base une ACP normée. Interpréter les valeurs propres.

# Normaliser les données
scaler = StandardScaler()
X_scaled = scaler.fit_transform(df)

# Appliquer l'ACP
acp = PCA()
X_acp = acp.fit_transform(X_scaled)

# Afficher les valeurs propres
valeursPropres = acp.explained_variance_
print("Valeurs propres :", valeursPropres)

# Tracer la courbe des valeurs propres
plt.figure(figsize=(10, 6))
plt.plot(range(1, len(valeursPropres) + 1), valeursPropres, marker='o', linestyle='--')
plt.xlabel('Composantes principales')
plt.ylabel('Valeurs propres')
plt.title('Graphique des valeurs propres')
plt.grid(True)
plt.show()


# Question 2 :: Déterminer le pourcentage d’inertie à partir de l’éboulis des valeurs propres. Quelles sont les composantes principales à tirées ?

# Afficher les pourcentages d'inertie expliqués
print("Pourcentage d'inertie expliqué par chaque composante principale :")
explained_variance_ratio = valeursPropres / np.sum(valeursPropres)

for i, explained_var in enumerate(explained_variance_ratio):
    print(f"Composante principale {i+1}: {explained_var * 100:.2f}%")

# Quelles sont les composantes principales à tirées ?
# Les trois premières composantes principales sont à retenir, jusqu'au coude (~ 3 ou 4).

# Conservé les trois premières composantes principales
acp = PCA(n_components=3)
composantes_principales = acp.fit_transform(df)

# Obtenez les valeurs propres associées aux trois premières composantes principales
valeurs_propres = acp.explained_variance_

# Affichez les valeurs propres
print("Valeurs propres des trois premières composantes principales :", valeurs_propres)



import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from scipy.cluster.hierarchy import linkage, dendrogram


# Fichier PowerPoint :: pour la presentation des figure avec (comment tu a le faire)
# Fichier PDF :: presentation du code avec des explication




##################################################################
########## 3.1. La phase de préparation de données ###############
##################################################################

####### I - Prétraitement : ########
# Télécharger et lire la base de données cancer_des_poumons.csv existent dans votre Classroom.

df = pd.read_csv("cancer_des_poumons.csv")

# 1 : indiquer le nombre des observations dans la base ainsi que le nombre des caractéristiques.

# le nombre des observations dans la base
nombre_observations = df.shape[0]
# le nombre des caractéristiques.
nombre_caract = df.shape[1]
print("nombre_observations : ", nombre_observations)
print("nombre_caractere : ", nombre_caract)



# 2 :: 1 : Verifier S'il exist des valeurs manquante ::
nbManquant = 0
for col in df.select_dtypes(include=['float64', 'int64']).columns:
    if df[col].isnull().sum() > 0:
        nbManquant+= df[col].isnull().sum()

if (nbManquant > 0) :
    print(f"il ya {nbManquant} valeurs manquante")
else : 
    print("il n'a pas des valeurs manquante")

# 2 :: 2 : remplacer les valeurs manquantes dans chaque colonne par la moyenne de la variable.
for col in df.select_dtypes(include=['float64', 'int64']).columns:
    if df[col].isnull().sum() > 0:
        meanValue = df[col].mean()
        df[col].fillna(meanValue, inplace=True)

# print(df)




####### II : Transformations ########

colonnes_number = df.select_dtypes(include=['float64', 'int64']).columns

# Question 1 : transformer chaine en entier
colonnes_string = df.select_dtypes(exclude=['float64', 'int64']).columns
mappingCols = {}
for col in colonnes_string :
    unique_values = df[col].unique()
    
    for index, value in enumerate(unique_values) :
        print(value)
        df[col] = df[col].replace(value, index)
        print(f"{value} ==> {index}")
# print(df)




# Question 2 :: Vérifier si la base est normalisée ou non (centrée-réduite), effectuer les transformations nécessaires.
mean = df.mean()
std = df.std()


if ((abs(round(mean, 0)) == 0).all() and (abs(round(std, 0)) == 1).all()) :
    print("La Base de données et normalisé")

else :
    print("Mean of DF : ")
    print(mean) # mean is a list
    print("Standard Diviation of DF :")
    print(std)
    for col in df.columns :
        df[col] = (df[col] - mean[col]) / std[col]

    mean = df.mean()
    std = df.std()
    print("La Base est normalisé")
print("New Mean of DF : ", abs(round(mean, 0)))
print("New Standard Diviation of DF : ", abs(round(std, 0)))




# Question 3 ::: Afficher la matrice de corrélation puis analyser les dépendances des variables. Quels sont les couples de variables les plus corrélées.
corr_matrix = df.corr()
# print(corr)

plt.figure(figsize=(10, 8))
sns.heatmap(corr_matrix, annot=True, cmap="coolwarm", fmt=".2f")
plt.title("Matrice de Corrélation")
plt.show()




### ANALYSE ::

"""
Les variables "YELLOW FINGERS" et "ANXIETY" ont une corrélation de 0.57, ce qui indique une forte corrélation positive. Cela suggère une relation où la présence de doigts jaunes et l'anxiété ont tendance à varier de manière similaire.
"""
 
# Exemple de données pour la courbe
corr_threshold = 0.5  # Définir un seuil de corrélation (par exemple, 0.5)

highly_correlated_pairs = []

for i in range(len(corr_matrix.columns)):
    for j in range(i + 1, len(corr_matrix.columns)):
        if abs(corr_matrix.iloc[i, j]) > corr_threshold:
            pair = (corr_matrix.columns[i], corr_matrix.columns[j])
            highly_correlated_pairs.append(pair)

print("Couples de variables les plus corrélées :")
for pair in highly_correlated_pairs:
    print(pair)

# On utilise ces couples pour spécifié quelle sont les couple qui affecte a cette maladie




###########################################################################
############ 3.2. La phase d’extraction des caractéristiques ##############
###########################################################################



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


# Sélectionner uniquement les colonnes numériques
col_number = df.select_dtypes(include='number')

# Standardiser les données
scaler = StandardScaler()
df_std = scaler.fit_transform(col_number)

# Appliquer une ACP normée sur les données
acp = PCA(n_components=len(col_number.columns))
acp.fit(df_std)




# Create a DataFrame to store the results
components_df = pd.DataFrame(columns=['Composante Principale', 'Valeur Propre', 'Pourcentage', 'Pourcentage Cumulé'])

# Calculate the percentage of variance explained and cumulative percentage
explained_variance_ratio = acp.explained_variance_ratio_
cumulative_percentage = explained_variance_ratio.cumsum() * 100

# Fill in the DataFrame with the results
for i, (ev, cp) in enumerate(zip(acp.explained_variance_, cumulative_percentage)):
    components_df.loc[i] = [f'CP{i+1}', ev, explained_variance_ratio[i] * 100, cp]

# Display the table
print(components_df)




# Interpréter les valeurs propres
valeursPropres = acp.explained_variance_ratio_
print("Valeurs propres :", valeursPropres)

# Créer la figure
plt.figure(figsize=(10, 6))

# Tracer la courbe des valeurs propres avec plot
plt.plot(range(1, len(valeursPropres) + 1), valeursPropres, marker='o', linestyle='--', label='Valeurs propres')

# Tracer les barres des valeurs propres avec bar
plt.bar(range(1, len(valeursPropres) + 1), valeursPropres, alpha=0.5, label='Valeurs propres (Barres)')

# Étiqueter les axes et le titre
plt.xlabel('Composantes principales')
plt.ylabel('Valeurs propres')
plt.title('Graphique des valeurs propres')
plt.grid(True)
plt.legend()  # Ajouter une légende pour distinguer les deux représentations

# Afficher la figure
plt.show()




# Question 2 ::

# Question 2-1 :: Déterminer le pourcentage d’inertie à partir de l’éboulis des valeurs propres. Quelles sont les composantes principales à tirées ?

pourcentage_inertie = valeursPropres * 100

# Déterminer le pourcentage d'inertie à partir de l'éboulis des valeurs propres
inertie_cumulative = pourcentage_inertie.cumsum()
plt.plot(range(1, len(inertie_cumulative) + 1), inertie_cumulative, marker='o', linestyle='-')
plt.xlabel('Nombre de composantes principales')
plt.ylabel('Pourcentage d\'inertie cumulée')
plt.title('Pourcentage d\'inertie cumulée')
plt.show()



# Question 3 :: Afficher la saturation des variables et tracer le cercle de corrélation. 

# Tracer le cercle de corrélation
plt.figure(figsize=(8, 8))
plt.axhline(0, linestyle='--', linewidth=0.5)
plt.axvline(0, linestyle='--', linewidth=0.5)
plt.xlim(-1, 1)
plt.ylim(-1, 1)
plt.xlabel("PC1")
plt.ylabel("PC2")
plt.title("Cercle de Corrélation")

# Tracer le cercle unitaire
circle = plt.Circle((0, 0), 1, color='b', fill=False, linestyle='--')
plt.gca().add_artist(circle)


# Tracer les vecteurs des variables
for i in range(len(acp.components_[0])):
    plt.arrow(0, 0, acp.components_[0, i], acp.components_[1, i], color='r', alpha=0.5, head_width=0.05)
    plt.text(acp.components_[0, i]*1.1, acp.components_[1, i]*1.1, col_number.columns[i], color='g', ha='center', va='center')

plt.grid()
plt.show()





#####################################################
########### 3.3. La phase de data Mining ############
#####################################################


# Question 1
# Appliquer l'algorithme des K-means pour diviser les données en deux classes.


# Appliquer l'algorithme K-means avec 2 clusters
kmeans = KMeans(n_clusters=2, random_state=42)
clusters = kmeans.fit_predict(df_std)


df['Cluster'] = clusters

# Transform data onto the first two principal components
CP = acp.transform(df_std)
CP1 = CP[:, 0]
CP2 = CP[:, 1]


#### Question 2
# Afficher dans un graphe les centroïdes et les données appartenant à chaque classe.

# Obtenir les centroïdes des clusters
centroids = kmeans.cluster_centers_

# Projeter les centroïdes sur les deux premières composantes principales
centroid_pc1 = centroids.dot(acp.components_[:2].T)[:, 0]
centroid_pc2 = centroids.dot(acp.components_[:2].T)[:, 1]

plt.figure(figsize=(10, 8))
plt.scatter(CP1[clusters == 0], CP2[clusters == 0], s=50, c='lightblue', label='Cluster 0', edgecolors='black')
plt.scatter(CP1[clusters == 1], CP2[clusters == 1], s=50, c='orange', label='Cluster 1', edgecolors='black')
plt.scatter(centroid_pc1, centroid_pc2, s=200, c='red', label='Centroids', marker='X')
plt.title('Visualisation des Clusters et des Centroïdes avec ACP')
plt.xlabel('Première Composante Principale')
plt.ylabel('Deuxième Composante Principale')
plt.legend()
plt.grid(True)
plt.show()

# Question 3
# Appliquer l'algorithme Classification Ascendante Hiérarchique (CAH) pour diviser les données en deux classes.

CAH = linkage(df_std, method='ward')

# Afficher le dendrogramme pour la CAH
plt.figure(figsize=(10, 6))
dendrogram(CAH)
plt.title('Dendrogramme de la Classification Ascendante Hiérarchique (CAH)')
plt.xlabel('Indice de l\'échantillon')
plt.ylabel('Distance euclidienne')
plt.show()


# Question 4
# Comparer les résultats des deux algorithmes.



# Afficher les inerties totales


# Calculer l'inertie totale de K-means
inertie_kmeans = kmeans.inertia_


# Calculer l'inertie totale de la CAH
inertie_cah = CAH[-1, 2] 


print(f"Inertie totale de K-means : {inertie_kmeans}")
print(f"Inertie totale de la CAH : {inertie_cah}")


"""

Inertie totale de K-means : 3989.781913784595
Inertie totale de la CAH : 34.10028989982372

On constate que l'inertie totale de CAH est nettement plus faible que celle de K-means. Cette différence suggère que CAH a réalisé une réduction plus importante des distances intra-cluster, ce qui se traduit par la création de clusters plus compacts et mieux séparés.
"""
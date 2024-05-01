import json
from flask import Flask, request, jsonify
import pandas as pd
from flask_cors import CORS

import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs
import numpy as np
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from scipy.cluster.hierarchy import linkage, dendrogram

from io import BytesIO
import base64

app = Flask(__name__)
CORS(app)  # Initialize CORS with your Flask app

class DataFrame:
    df = None
    corr_matrix = None
    acp = None
    df_std = None
    valeursPropres = None
    col_number = None
    kmeans = None
    clusters = None
    CP = None
    CP1 = None
    CP2 = None
    CAH = None
    @app.route('/api/uploadFile', methods=['POST'])  # Corrected keyword here
    def upload_file():
        print("JSON Uploaded Successfully")
        # Check if a file was uploaded
        if 'csv_file' not in request.files:
            return jsonify({'error': 'No file part'})
        
        file = request.files['csv_file']
        
        # Check if the file is empty
        if file.filename == '':
            return jsonify({'error': 'No selected file'})

        # Check if the file is a CSV file
        if file and file.filename.endswith('.csv'):
            try:
                # Read the file as a DataFrame
                DataFrame.df = pd.read_csv(file)
                
                # Process the DataFrame as needed
                # For example, you can perform operations like df.head() to see the first few rows
                print(DataFrame.df)
                # Return a success response

                data_json = DataFrame.df.to_json(orient='records')
                
                # le nombre des observations dans la base
                nombre_observations = DataFrame.df.shape[0]

                # le nombre des caractéristiques.
                nombre_caractere = DataFrame.df.shape[1]
                
                print("nombre_observations : ", nombre_observations)
                print("nombre_caractere : ", nombre_caractere)

                return jsonify({
                    'success': True,
                    'message': 'File uploaded successfully',
                    'data': data_json,
                    'metadata': {
                        'nombre_observations': nombre_observations,
                        'nombre_caractere': nombre_caractere
                    }
                })
            except Exception as e:
                return jsonify({'error': str(e)})
        else:
            return jsonify({'error': 'Invalid file format. Only CSV files are allowed'})


    @app.route('/api/verifObservations', methods=['GET'])
    def verif_observations() :
        nbManquant = 0
        for col in DataFrame.df.select_dtypes(include=['float64', 'int64']).columns:
            if DataFrame.df[col].isnull().sum() > 0:
                nbManquant+= DataFrame.df[col].isnull().sum()

        message = ""

        if (nbManquant > 0) :
            message = f"il ya {nbManquant} valeurs manquante"
        else : 
            message = "il n'a pas des valeurs manquante"
        result = 1 if nbManquant > 0 else 0

        data_json = DataFrame.df.to_json(orient='records')

        return jsonify({
            'success': True,
            'message': message,
            'data': data_json,
            'result': result
        })


    @app.route('/api/replaceNullValues', methods=['GET'])
    def replace_null_values():
        for col in DataFrame.df.select_dtypes(include=['float64', 'int64']).columns:
            if DataFrame.df[col].isnull().sum() > 0:
                meanValue = DataFrame.df[col].mean()
                DataFrame.df[col].fillna(meanValue, inplace=True)
        data_json = DataFrame.df.to_json(orient='records')
        message = "Les Valeurs Manquantes ont été remplacées avec succès"
        return jsonify({
            'success': True,
            'data': data_json,
            'message': message,
            'result': 1
        })

    @app.route('/api/convertToInteger', methods=['GET'])
    def conver_to_integer() :
        colonnes_string = DataFrame.df.select_dtypes(exclude=['float64', 'int64']).columns
        for col in colonnes_string :
            unique_values = DataFrame.df[col].unique()
            
            for index, value in enumerate(unique_values) :
                DataFrame.df[col] = DataFrame.df[col].replace(value, index)

        data_json = DataFrame.df.to_json(orient='records')
        message = "M a été remplacée par 0 et F a été remplacée par 1"
        return jsonify({
            'success': True,
            'data': data_json,
            'message': message,
            'result': 1
        })


    # Question 2 :: Vérifier si la base est normalisée ou non (centrée-réduite), effectuer les transformations nécessaires.
    @app.route('/api/isNormalized', methods=['GET'])
    def is_normalized() :
        mean = DataFrame.df.mean()
        std = DataFrame.df.std()

        if ((abs(round(mean, 0)) == 0).all() and (abs(round(std, 0)) == 1).all()) :
            message = "La Base de données et normalisé"
        else :
            print("Mean of DF : ")
            print(mean) # mean is a list
            print("Standard Diviation of DF :")
            print(std)
            for col in DataFrame.df.columns :
                DataFrame.df[col] = (DataFrame.df[col] - mean[col]) / std[col]

            mean = DataFrame.df.mean()
            std = DataFrame.df.std()
            message = f"La Base a été normalisé avec succès, mean = 0, std = 1"

        data_json = DataFrame.df.to_json(orient='records')
        return jsonify({
            'success': True,
            'data': data_json,
            'message': message,
            'result': 1
        })


    # Question 3 ::: Afficher la matrice de corrélation puis analyser les dépendances des variables. Quels sont les couples de variables les plus corrélées.
    @app.route('/api/getCorrMatrix', methods=['GET'])
    def get_corr_matrix():
        # Generate correlation matrix
        DataFrame.corr_matrix = DataFrame.df.corr()

        # Plot the heatmap and save it as an image
        plt.figure(figsize=(10, 8))
        sns.heatmap(DataFrame.corr_matrix, annot=True, cmap="coolwarm", fmt=".2f")
        plt.title("Matrice de Corrélation")
        plt.tight_layout()

        # Save the plot as bytes
        buffer = BytesIO()
        plt.savefig(buffer, format='png')
        buffer.seek(0)
        image_data = buffer.getvalue()
        buffer.close()

        # Encode the image data to base64
        image_base64 = base64.b64encode(image_data).decode('utf-8')

        message = "La matrice de corrélation a été remplie avec succès"
        return jsonify({
            'success': True,
            'data': image_base64,
            'message': message,
            'result': 1
        })
    
    @app.route('/api/getCouplesVariables', methods=['GET'])
    def get_couple_variables() :
        # Exemple de données pour la courbe
        corr_threshold = 0.5  # Définir un seuil de corrélation (par exemple, 0.5)

        highly_correlated_pairs = []

        for i in range(len(DataFrame.corr_matrix.columns)):
            for j in range(i + 1, len(DataFrame.corr_matrix.columns)):
                if abs(DataFrame.corr_matrix.iloc[i, j]) > corr_threshold:
                    pair = (DataFrame.corr_matrix.columns[i], DataFrame.corr_matrix.columns[j])
                    highly_correlated_pairs.append(pair)

        message = "Couples de variables les plus corrélées : "
        correlated_pairs_message = ", ".join([f"{pair[0]} - {pair[1]}" for pair in highly_correlated_pairs])
        message += correlated_pairs_message

        return jsonify({
            'success': True,
            'message': message,
            'result': 1
        })

    @app.route('/api/applyAcpNorm', methods=['GET'])
    def apply_acp_norm() :
        # Sélectionner uniquement les colonnes numériques
        DataFrame.col_number = DataFrame.df.select_dtypes(include='number')

        # Standardiser les données
        scaler = StandardScaler()
        DataFrame.df_std = scaler.fit_transform(DataFrame.col_number)

        # Appliquer une ACP normée sur les données
        DataFrame.acp = PCA(n_components=len(DataFrame.col_number.columns))
        DataFrame.acp.fit(DataFrame.df_std)
        message = "L'ACP a été appliqué avec succès"
        return jsonify({
            'success': True,
            'message': message,
            'result': 1
        })

    @app.route('/api/getACPTable', methods=['GET'])
    def get_acp_table() :
        # Create a DataFrame to store the results
        components_df = pd.DataFrame(columns=['Composante Principale', 'Valeur Propre', 'Pourcentage', 'Pourcentage Cumulé'])

        # Calculate the percentage of variance explained and cumulative percentage
        explained_variance_ratio = DataFrame.acp.explained_variance_ratio_
        cumulative_percentage = np.cumsum(explained_variance_ratio) * 100

        # Fill in the DataFrame with the results
        for i, (ev, cp) in enumerate(zip(DataFrame.acp.explained_variance_, cumulative_percentage)):
            components_df.loc[i] = [f'CP{i+1}', ev, explained_variance_ratio[i] * 100, cp]

        data_json = components_df.to_json(orient='records')


        # Display the table
        print(components_df)
        message = "Le Tableau ACP a été crée avec succès"
        return jsonify({
            'success': True,
            'data': data_json,  
            'message': message,
            'result': 1
        })

    @app.route('/api/getValeursPropres', methods=['GET'])
    def get_valeurs_propres() :
        # Interpréter les valeurs propres
        DataFrame.valeursPropres = DataFrame.acp.explained_variance_ratio_

        # Créer la figure
        plt.figure(figsize=(10, 6))
        plt.plot(range(1, len(DataFrame.valeursPropres) + 1), DataFrame.valeursPropres, marker='o', linestyle='--', label='Valeurs propres')
        plt.bar(range(1, len(DataFrame.valeursPropres) + 1), DataFrame.valeursPropres, alpha=0.5, label='Valeurs propres (Barres)')
        plt.xlabel('Composantes principales')
        plt.ylabel('Valeurs propres')
        plt.title('Graphique des valeurs propres')
        plt.grid(True)
        plt.legend()

        buffer = BytesIO()
        plt.savefig(buffer, format='png')
        buffer.seek(0)
        image_data = buffer.getvalue()
        buffer.close()

        # Encode the image data to base64
        image_base64 = base64.b64encode(image_data).decode('utf-8')

        # Display the table
        message = "Les valeurs propres ont été interpréter avec succés"
        return jsonify({
            'success': True,
            'data': image_base64,  
            'message': message,
            'result': 1
        })


    @app.route('/api/getInertiePourcentage', methods=['GET'])
    def get_innertie_pourcentage() :
        # Question 2-1 :: Déterminer le pourcentage d’inertie à partir de l’éboulis des valeurs propres. Quelles sont les composantes principales à tirées ?

        pourcentage_inertie = DataFrame.valeursPropres * 100

        # Déterminer le pourcentage d'inertie à partir de l'éboulis des valeurs propres
        inertie_cumulative = np.cumsum(pourcentage_inertie)
        
        # Plot the graph
        plt.figure(figsize=(10, 6))
        plt.plot(range(1, len(inertie_cumulative) + 1), inertie_cumulative, marker='o', linestyle='-')
        plt.xlabel('Nombre de composantes principales')
        plt.ylabel('Pourcentage d\'inertie cumulée')
        plt.title('Pourcentage d\'inertie cumulée')
        plt.grid(True)

        # Save the plot as bytes
        buffer = BytesIO()
        plt.savefig(buffer, format='png')
        buffer.seek(0)
        image_data = buffer.getvalue()
        buffer.close()

        # Encode the image data to base64
        image_base64 = base64.b64encode(image_data).decode('utf-8')
        message = "Le pourcentage d'inertie a été determiner avec succès"

        return jsonify({
            'success': True,
            'data': image_base64,
            'message': message,
            'result': 1
        })

    @app.route('/api/getSaturation', methods=['GET'])
    def get_saturation() :
        
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
        for i in range(len(DataFrame.acp.components_[0])):
            plt.arrow(0, 0, DataFrame.acp.components_[0, i], DataFrame.acp.components_[1, i], color='r', alpha=0.5, head_width=0.05)
            plt.text(DataFrame.acp.components_[0, i]*1.1, DataFrame.acp.components_[1, i]*1.1, DataFrame.col_number.columns[i], color='g', ha='center', va='center')

        plt.grid()
        # Save the plot as bytes
        buffer = BytesIO()
        plt.savefig(buffer, format='png')
        buffer.seek(0)
        image_data = buffer.getvalue()
        buffer.close()

        # Encode the image data to base64
        image_base64 = base64.b64encode(image_data).decode('utf-8')
        message = "La Saturation des varialbes a été afficher avec succès"

        return jsonify({
            'success': True,
            'data': image_base64,
            'message': message,
            'result': 1
        })


    #####################################################
    ########### 3.3. La phase de data Mining ############
    #####################################################

    # Question 1
    # Appliquer l'algorithme des K-means pour diviser les données en deux classes.

    @app.route('/api/kMeans', methods=['GET'])
    def applyKmeans() :

        # Appliquer l'algorithme K-means avec 2 clusters
        DataFrame.kmeans = KMeans(n_clusters=2, random_state=42)
        DataFrame.clusters = DataFrame.kmeans.fit_predict( DataFrame.df_std)


        DataFrame.df['Cluster'] = DataFrame.clusters

        # Transform data onto the first two principal components
        DataFrame.CP =  DataFrame.acp.transform( DataFrame.df_std)
        DataFrame.CP1 = DataFrame.CP[:, 0]
        DataFrame.CP2 = DataFrame.CP[:, 1]

        message = "L'algorithme K-means a été appliquer avec succés"

        return jsonify({
            'success': True,
            'message': message,
            'result': 1
        })

    #### Question 2
    # Afficher dans un graphe les centroïdes et les données appartenant à chaque classe.

    @app.route('/api/centroides', methods=['GET'])
    def applyCentroides() :

        # Obtenir les centroïdes des clusters
        centroids = DataFrame.kmeans.cluster_centers_

        # Projeter les centroïdes sur les deux premières composantes principales
        centroid_pc1 = centroids.dot(DataFrame.acp.components_[:2].T)[:, 0]
        centroid_pc2 = centroids.dot(DataFrame.acp.components_[:2].T)[:, 1]

        plt.figure(figsize=(10, 8))
        plt.scatter(DataFrame.CP1[DataFrame.clusters == 0], DataFrame.CP2[DataFrame.clusters == 0], s=50, c='lightblue', label='Cluster 0', edgecolors='black')
        plt.scatter(DataFrame.CP1[DataFrame.clusters == 1], DataFrame.CP2[DataFrame.clusters == 1], s=50, c='orange', label='Cluster 1', edgecolors='black')
        plt.scatter(centroid_pc1, centroid_pc2, s=200, c='red', label='Centroids', marker='X')
        plt.title('Visualisation des Clusters et des Centroïdes avec ACP')
        plt.xlabel('Première Composante Principale')
        plt.ylabel('Deuxième Composante Principale')
        plt.legend()
        plt.grid(True)

        # Save the plot as bytes
        buffer = BytesIO()
        plt.savefig(buffer, format='png')
        buffer.seek(0)
        image_data = buffer.getvalue()
        buffer.close()

        # Encode the image data to base64
        image_base64 = base64.b64encode(image_data).decode('utf-8')
        message = "La Graphes des centroïdes et les données appartenant à chaque classe ont été afficher avec succès"

        return jsonify({
            'success': True,
            'data': image_base64,
            'message': message,
            'result': 1
        })


    @app.route('/api/applyCAH', methods=['GET'])
    def apply_CAH() :
        # Question 3
        # Appliquer l'algorithme Classification Ascendante Hiérarchique (CAH) pour diviser les données en deux classes.

        DataFrame.CAH = linkage(DataFrame.df_std, method='ward')

        # Afficher le dendrogramme pour la CAH
        plt.figure(figsize=(10, 6))
        dendrogram(DataFrame.CAH)
        plt.title('Dendrogramme de la Classification Ascendante Hiérarchique (CAH)')
        plt.xlabel('Indice de l\'échantillon')
        plt.ylabel('Distance euclidienne')

        # Save the plot as bytes
        buffer = BytesIO()
        plt.savefig(buffer, format='png')
        buffer.seek(0)
        image_data = buffer.getvalue()
        buffer.close()

        # Encode the image data to base64
        image_base64 = base64.b64encode(image_data).decode('utf-8')
        message = "L'algorithme Classification Ascendante Hiérarchique (CAH) a été appliquer avec succés"

        return jsonify({
            'success': True,
            'data': image_base64,
            'message': message,
            'result': 1
        })


    @app.route('/api/compareKmeansCAH', methods=['GET'])
    def compare_Kmeans_CAH() :
        # Question 4
        # Comparer les résultats des deux algorithmes.



        # Afficher les inerties totales



        # Calculer l'inertie totale de K-means
        inertie_kmeans = round(DataFrame.kmeans.inertia_, 3)

        # Calculer l'inertie totale de la CAH
        inertie_cah = round(DataFrame.CAH[-1, 2], 3) 
        print(f"Inertie totale de K-means : {inertie_kmeans}")
        print(f"Inertie totale de la CAH : {inertie_cah}")
       
        message = f"L'inertie totale de K-means, égale à {inertie_kmeans}, est {'supérieure' if inertie_kmeans > inertie_cah else 'inférieure'} à celle de la CAH, qui est {inertie_cah}."

        return jsonify({
            'success': True,
            'inertieKmeans': inertie_kmeans,
            'inertieCAH': inertie_cah,
            'message' : message,
            'result': 1
        })


if __name__ == '__main__':
    app.run(debug=True)

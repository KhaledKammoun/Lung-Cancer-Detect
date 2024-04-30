from flask import Flask, request, jsonify
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Initialize CORS with your Flask app

class DataFrame:
    df = None

    @app.route('/api/getcaractere', methods=['POST'])
    def getCaractere():
        print("New DF :::::")
        print(DataFrame.df)
        return jsonify({'success': 'File uploaded successfully', 'data': DataFrame.df.to_dict()})

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

if __name__ == '__main__':
    app.run(debug=True)

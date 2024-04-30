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
                return jsonify({'success': 'File uploaded successfully', 'data': DataFrame.df.to_dict()})
            except Exception as e:
                return jsonify({'error': str(e)})
        else:
            return jsonify({'error': 'Invalid file format. Only CSV files are allowed'})

if __name__ == '__main__':
    app.run(debug=True)

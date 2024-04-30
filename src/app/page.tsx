'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import styles from "./page.module.css";

import DataFrameTable from './components/DataFrameTable/page';

export default function Home() {
  const prefix_url = "http://localhost:5000";
  
  
  const [data, setData] = useState([]);

  const [nombre_observations, setNombre_observations] = useState(0) ;
  const [nombre_caractere, setNombre_caractere] = useState(0) ;
  const [dataUploaded, setDataUploaded] = useState(false) ;
  const [selectedItem, setSelectedItem] = useState(0) ;


  const fileName = "cancer_des_poumons.csv";

  const handleFileUpload = async (event : any) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('csv_file', file);

    try {
      const response = await fetch(`${prefix_url}/api/uploadFile`, {
        method: 'POST',
        body: formData, // Assuming formData is defined elsewhere
        headers: {
          'Accept': 'application/json' // Specify that JSON response is expected
        }
      });

      const fetchedData = await response.json();
      setData(JSON.parse(fetchedData.data));
      console.log(JSON.parse(fetchedData.data)) ;
      setNombre_caractere(fetchedData.metadata.nombre_caractere);
      setNombre_observations(fetchedData.metadata.nombre_observations);
      console.log(typeof(fetchedData.data)) ;

      setDataUploaded(true) ;
      
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleOpenDataBasePopUp = () => {
    console.log("Data Base Pop Up Opened !!")
  }

  return (

    <div className="antialiased bg-gray-50 dark:bg-gray-900">
      

      <div className={` p-1 text-white flex h-screen flex-row justify-center ${styles.mainContainer}`}>
        <div className={` w-30 m-1 bg-gray-200  p-6 border rounded-md dark:bg-gray-800 dark:border-gray-700 border-gray-400 ${styles.leftContainer}`}>
          <ol className="relative border-s border-gray-200 dark:border-gray-700">                  
            <li className="mb-10 ms-6">            
                <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                    <svg className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
                    </svg>
                </span>
                <h3 className="flex items-center mb-1 text-base font-semibold ">Préparation de données</h3>
            </li>

            {/* Child Element */}

            <li className="mb-10 ms-6">            
                <span className="absolute flex items-center justify-center ml-1 w-4 h-4 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                </span>
                <h3 className="flex items-center mb-1 text-sm font-semibold ">Lire la base de données</h3>
            </li>

            <li className="mb-10 ms-6">            
                <span className="absolute flex items-center justify-center ml-1 w-4 h-4 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                </span>
                <h3 className=" cursor-pointer p-2 w-64 flex items-center mb-1 text-sm font-semibold hover:bg-slate-600 rounded-lg transition duration-200 ease-in-out">
                  Indiquer le nombre des observations dans la base ainsi que le nombre des caractéristiques.
                </h3>
            </li>


            <li className="mb-10 ms-6">            
                <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                    <svg className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
                    </svg>
                </span>
                <h3 className="flex items-center mb-1 text-base font-semibold ">Extraction des caractéristiques</h3>

            </li>
            <li className="mb-10 ms-6">            
                <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="green" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                </span>
                <h3 className="flex items-center mb-1 text-base font-semibold ">Data Mining</h3>
                <p className=" mb-4 text-base font-normal text-gray-500 dark:text-gray-400">Get access to over 20+ pages.</p>
            </li>
          </ol>
        </div>
        

        <div className={` w-3/4 m-1 flex-1 bg-gray-300 p-4 border rounded-md border-gray-400 dark:bg-gray-800 dark:border-gray-700 ${styles.rightContainer}`}>
        {selectedItem === 0 && (
            <>
              {
                <div className="flex flex-col items-center justify-left w-full">
                  {(!dataUploaded) ? <><h1 className=' font-bold text-3xl p-4'>Import File Here :</h1><label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                          </svg>
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">CSV (MAX. 200MB)</p>
                      </div>
                      <input id="dropzone-file" type="file" className="hidden" onChange={handleFileUpload} accept=".csv"  />
                  </label></> : <div className=' flex flex-row items-center justify-left w-full' >
                        <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor" xmlns="http://www.w3.org/2000/svg" color="inherit" className="eyeqlp51 st-emotion-cache-4mjat2 ex0cdmw0"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"></path></svg>
                        <h1  className=' font-bold text-2xl p-4'>{fileName}</h1>
                        </div>
                      }
                </div> 
              }
              {(dataUploaded) && (
                <div>
                  <DataFrameTable data={data} />
          
                    <h2 className="bg-white dark:bg-gray-800 border-b border-gray-400 dark:border-gray-700 px-4 py-2.5 text-lg font-semibold mb-2 rounded-t-lg">nombre_observations : {nombre_observations}</h2>
                    <h2 className="bg-white dark:bg-gray-800 px-4 py-2.5 text-lg font-semibold rounded-b-lg">nombre_caractere : {nombre_caractere}</h2>

                </div>
              )}
            </>
        )}
          
        {selectedItem === 1 && (
          <>
            <h2 className="bg-white dark:bg-gray-800 border-b border-gray-400 dark:border-gray-700 px-4 py-2.5 text-lg font-semibold mb-2 rounded-t-lg">nombre_observations : {nombre_observations}</h2>
            <h2 className="bg-white dark:bg-gray-800 px-4 py-2.5 text-lg font-semibold rounded-b-lg">nombre_caractere : {nombre_caractere}</h2>
          </>

        )}
          
          

        </div>
      </div>
    </div>
  );
}

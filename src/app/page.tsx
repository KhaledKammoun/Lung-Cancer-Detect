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
  const [order, setOrder] = useState(0) ;

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

  const [listOne, setListOne] = useState(false) ;
  const [listTwo, setListTwo] = useState(false) ;

  const handleOpenCloseList = (listOrder : any) => {
    if (listOrder === 0) {
      setListOne(!listOne) ;
    }else {
      setListTwo(!listTwo) ;
    }
  }


  return (

    <div className="antialiased bg-gray-50 dark:bg-gray-900">
      

      <div className={` p-1 text-white flex h-screen flex-row justify-center ${styles.mainContainer}`}>
        <div className={`w-30 m-1 bg-gray-200 p-6 border rounded-md dark:bg-gray-800 dark:border-gray-700 border-gray-400 ${styles.leftContainer} overflow-y-auto`}>
          <ol className="relative border-s border-gray-200 dark:border-gray-700">                  
            <li className={`mb-10 ms-6 ${order >= 0 ? '' : 'opacity-50 pointer-events-none'}`}>            
                <div className='flex flex-row items-center'>
                
                <span className="absolute flex items-center justify-center w-7 h-7 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-gray-900">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-box"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>                </span>
                <h3 className="flex items-center ml-2 text-lg font-semibold ">Préparation de données</h3>
              </div>
            </li>
            <li className={`   mb-10 ms-6 ${order >= 0 ? '' : 'opacity-50 pointer-events-none'}`}>            
                <div className='flex flex-row items-center'>
                
                <span className="absolute flex items-center justify-center ml-1 w-4 h-4 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-gray-900">
                  {listOne ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-chevron-down"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-chevron-down transform rotate-90 scale-y-[-1]"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  )}
                </span>

                  <h3 onClick ={() => handleOpenCloseList(0)} className=" p-1 px-2 text-left cursor-pointer hover:bg-slate-600 rounded-lg transition duration-200 ease-in-out flex items-center text-base font-semibold ">Prétraitement</h3>
                  </div>
                  {
                    !listOne && 
                    <p className=" ml-2 mb-4 text-2xl font-bold text-gray-500 dark:text-gray-400">...</p>

                  }
            </li>


            {/* Child Element */}
            
            {
              listOne && 
            ( <> <li className={`mb-10 ms-6 ${order >= 0 ? '' : 'opacity-50 pointer-events-none'}`}>            
                <div className='flex flex-row items-center'>
                
                <span className="absolute flex items-center justify-center ml-1 w-4 h-4 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-gray-900">
                      { (order >= 0) ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                   : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-cloud-off"><path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"></path><line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                  }
                </span>
                <h3 className="flex items-center text-sm font-semibold ">Lire la base de données</h3>
              </div>
            </li>

            <li className={`mb-10 ms-6 ${order >= 2 ? '' : 'opacity-50 pointer-events-none'}`}>
                <div className='flex flex-row items-center'>
                
                <span className="absolute flex items-center justify-center ml-1 w-4 h-4 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-gray-900">
                { (order >= 2) ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                 : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-cloud-off"><path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"></path><line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                }
                </span>
                <h3 className=" cursor-pointer p-2 w-64 flex items-center text-sm font-semibold hover:bg-slate-600 rounded-lg transition duration-200 ease-in-out">
                  Indiquer le nombre des observations dans la base ainsi que le nombre des caractéristiques.
                </h3>
              </div>
            </li>

            <li className={`mb-10 ms-6 ${order >= 2 ? '' : 'opacity-50 pointer-events-none'}`}>            
                <div className='flex flex-row items-center'>
                
                <span className="absolute flex items-center justify-center ml-1 w-4 h-4 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-gray-900">
                                    { (order >= 2) ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                   : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-cloud-off"><path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"></path><line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                  }
                </span>
                <h3 className=" cursor-pointer p-2 w-64 flex items-center text-sm font-semibold hover:bg-slate-600 rounded-lg transition duration-200 ease-in-out">
                  Vérifier s’il existe des observations qui sont manquantes ou NaN                </h3>
              </div>
                <button type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                  Vérifier
                </button>
            </li>

            <li className={` mb-10 ms-6 ${order >= 2 ? '' : 'opacity-50 pointer-events-none'}`}>            
              <div className='flex flex-row items-center'>
                
                <span className="absolute flex items-center justify-center ml-1 w-4 h-4 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-gray-900">
                  { (order >= 2) ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                   : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-cloud-off"><path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"></path><line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                  }
                </span>
                  <h3 className=" cursor-pointer p-2 w-64 flex items-center text-sm font-semibold hover:bg-slate-600 rounded-lg transition duration-200 ease-in-out">
                    remplacer les valeurs manquantes dans chaque colonne par la moyenne de la variable.
                  </h3>
              </div>
              <button type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                Remplacer
              </button>
                
            </li>
            </>)
            }


            <li className={`mb-10 ms-6 ${order >= 2 ? '' : 'opacity-50 pointer-events-none'}`}>            
                <div className='flex flex-row items-center'>
                
                <span className="absolute flex items-center justify-center ml-1 w-4 h-4 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-gray-900">
                {listTwo ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-chevron-down"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-chevron-down transform rotate-90 scale-y-[-1]"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  )}
                </span>
                <h3  onClick ={() => handleOpenCloseList(1)} className="p-1 px-2 text-left cursor-pointer hover:bg-slate-600 rounded-lg transition duration-200 ease-in-out flex items-center text-base font-semibold ">Transformations</h3>

              </div>
                  {
                    !listTwo && 
                    <p className=" ml-2 mb-4 text-2xl font-bold text-gray-500 dark:text-gray-400">...</p>

                  }

              
            </li>


            { listTwo && (
              <>
            <li className={`mb-10 ms-6 ${order >= 2 ? '' : 'opacity-50 pointer-events-none'}`}>            
                <div className='flex flex-row items-center'>
                
                <span className="absolute flex items-center justify-center ml-1 w-4 h-4 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-gray-900">
                                    { (order >= 2) ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                   : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-cloud-off"><path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"></path><line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                  }
                </span>
                <h3 className=" cursor-pointer p-2 w-64 flex items-center text-sm font-semibold hover:bg-slate-600 rounded-lg transition duration-200 ease-in-out">
                  Appliquer le codage nécessaire pour transformer les caractéristiques dont les valeurs sont de type chaine de caractères en entier.
                </h3>
              </div>
                <button type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                  Appliquer le codage
                </button>
            </li>

            <li className={`mb-10 ms-6 ${order >= 2 ? '' : 'opacity-50 pointer-events-none'}`}>            
                <div className='flex flex-row items-center'>
                
                <span className="absolute flex items-center justify-center ml-1 w-4 h-4 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-gray-900">
                                    { (order >= 2) ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                   : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-cloud-off"><path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"></path><line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                  }
                </span>
                <h3 className=" cursor-pointer p-2 w-64 flex items-center text-sm font-semibold hover:bg-slate-600 rounded-lg transition duration-200 ease-in-out">
                  Vérifier si la base est normalisée ou non (centrée-réduite), effectuer les transformations nécessaires.            
                </h3>
              </div>
                <button type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                  Vérifier
                </button>
            </li>

            <li className={`mb-10 ms-6 ${order >= 2 ? '' : 'opacity-50 pointer-events-none'}`}>            
                <div className='flex flex-row items-center'>
                
                <span className="absolute flex items-center justify-center ml-1 w-4 h-4 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-gray-900">
                                    { (order >= 2) ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                   : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-cloud-off"><path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"></path><line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                  }
                </span>
                <h3 className=" cursor-pointer p-2 w-64 flex items-center text-sm font-semibold hover:bg-slate-600 rounded-lg transition duration-200 ease-in-out">
                  Afficher la matrice de corrélation
                </h3>
              </div>
                <button type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                  Afficher
                </button>
            </li>

            <li className={`mb-10 ms-6 ${order >= 2 ? '' : 'opacity-50 pointer-events-none'}`}>            
                <div className='flex flex-row items-center'>
                
                <span className="absolute flex items-center justify-center ml-1 w-4 h-4 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-gray-900">
                                    { (order >= 2) ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                   : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-cloud-off"><path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"></path><line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                  }
                </span>
                <h3 className=" cursor-pointer p-2 w-64 flex items-center text-sm font-semibold hover:bg-slate-600 rounded-lg transition duration-200 ease-in-out">
                  Analyser les dépendances des variables
                </h3>
              </div>
                <button type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                  Analyser
                </button>
            </li>

            <li className={`mb-10 ms-6 ${order >= 2 ? '' : 'opacity-50 pointer-events-none'}`}>            
                <div className='flex flex-row items-center'>
                
                <span className="absolute flex items-center justify-center ml-1 w-4 h-4 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-gray-900">
                                    { (order >= 2) ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                   : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-cloud-off"><path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"></path><line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                  }
                </span>
                <h3 className=" cursor-pointer p-2 w-64 flex items-center text-sm font-semibold hover:bg-slate-600 rounded-lg transition duration-200 ease-in-out">
                  Quels sont les couples de variables les plus corrélées.
                </h3>
              </div>
                <button type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                  Afficher
                </button>
            </li>
            </>
          )}



            <li className={`mb-10 ms-6 ${order >= 2 ? '' : 'opacity-50 pointer-events-none'}`}>            
                <div className='flex flex-row items-center'>
                
                <span className="absolute flex items-center justify-center w-7 h-7 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-gray-900">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-box"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                </span>
                <h3 className="flex items-center ml-2 text-lg font-semibold ">Extraction des caractéristiques</h3>
              </div>
            </li>


            {/* Childs ::: */}


            <li className={`mb-10 ms-6 ${order >= 2 ? '' : 'opacity-50 pointer-events-none'}`}>            
                <div className='flex flex-row items-center'>
                
                <span className="absolute flex items-center justify-center ml-1 w-4 h-4 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-gray-900">
                                    { (order >= 2) ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                   : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-cloud-off"><path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"></path><line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                  }
                </span>
                <h3 className=" cursor-pointer p-2 w-64 flex items-center text-sm font-semibold hover:bg-slate-600 rounded-lg transition duration-200 ease-in-out">
                  Appliquer sur la base une ACP normée.
                </h3>
              </div>
                <button type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                  Appliquer
                </button>
            </li>

            <li className={`mb-10 ms-6 ${order >= 2 ? '' : 'opacity-50 pointer-events-none'}`}>            
                <div className='flex flex-row items-center'>
                
                <span className="absolute flex items-center justify-center ml-1 w-4 h-4 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-gray-900">
                                    { (order >= 2) ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                   : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-cloud-off"><path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"></path><line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                  }
                </span>
                <h3 className=" cursor-pointer p-2 w-64 flex items-center text-sm font-semibold hover:bg-slate-600 rounded-lg transition duration-200 ease-in-out">
                  Interpréter les valeurs propres.
                </h3>
              </div>
                <button type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                  Interpréter
                </button>
            </li>

            <li className={`mb-10 ms-6 ${order >= 2 ? '' : 'opacity-50 pointer-events-none'}`}>            
                <div className='flex flex-row items-center'>
                
                <span className="absolute flex items-center justify-center ml-1 w-4 h-4 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-gray-900">
                                    { (order >= 2) ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                   : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-cloud-off"><path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"></path><line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                  }
                </span>
                <h3 className=" cursor-pointer p-2 w-64 flex items-center text-sm font-semibold hover:bg-slate-600 rounded-lg transition duration-200 ease-in-out">
                  Déterminer le pourcentage d’inertie à partir de l’éboulis des valeurs propres.
                </h3>
              </div>
                <button type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                  Déterminer
                </button>
            </li>

            <li className={`mb-10 ms-6 ${order >= 2 ? '' : 'opacity-50 pointer-events-none'}`}>            
                <div className='flex flex-row items-center'>
                
                <span className="absolute flex items-center justify-center ml-1 w-4 h-4 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-gray-900">
                                    { (order >= 2) ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                   : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-cloud-off"><path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"></path><line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                  }
                </span>
                <h3 className=" cursor-pointer p-2 w-64 flex items-center text-sm font-semibold hover:bg-slate-600 rounded-lg transition duration-200 ease-in-out">
                  Quelles sont les composantes principales à tirées ?
                </h3>
              </div>
                <button type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                  Afficher
                </button>
            </li>

            <li className={`mb-10 ms-6 ${order >= 2 ? '' : 'opacity-50 pointer-events-none'}`}>            
                <div className='flex flex-row items-center'>
                
                <span className="absolute flex items-center justify-center ml-1 w-4 h-4 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-gray-900">
                                    { (order >= 2) ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                   : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-cloud-off"><path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"></path><line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                  }
                </span>
                <h3 className=" cursor-pointer p-2 w-64 flex items-center text-sm font-semibold hover:bg-slate-600 rounded-lg transition duration-200 ease-in-out">
                  Afficher la saturation des variables et tracer le cercle de corrélation.
                </h3>
              </div>
                <button type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                  Afficher
                </button>
            </li>
            <li className={`mb-10 ms-6 ${order >= 2 ? '' : 'opacity-50 pointer-events-none'}`}>            
                <div className='flex flex-row items-center'>
                
                <span className="absolute flex items-center justify-center ml-1 w-4 h-4 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-gray-900">
                                    { (order >= 2) ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                   : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-cloud-off"><path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"></path><line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                  }
                </span>
                <h3 className=" cursor-pointer p-2 w-64 flex items-center text-sm font-semibold hover:bg-slate-600 rounded-lg transition duration-200 ease-in-out">
                  Interpréter les résultats.
                </h3>
              </div>
                <button type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                  Interpréter
                </button>
            </li>

            <li className={`mb-10 ms-6 ${order >= 2 ? '' : 'opacity-50 pointer-events-none'}`}>            
                <div className='flex flex-row items-center'>
                
                <span className="absolute flex items-center justify-center w-7 h-7 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-gray-900">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-box"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                </span>
                <h3 className="flex items-center ml-2 text-lg font-semibold ">Data Mining</h3>
              </div>
                {/* <p className=" mb-4 text-base font-normal text-gray-500 dark:text-gray-400">Get access to over 20+ pages.</p> */}

            </li>

            {/* Childs */}

            <li className={`mb-10 ms-6 ${order >= 2 ? '' : 'opacity-50 pointer-events-none'}`}>            
                <div className='flex flex-row items-center'>
                
                <span className="absolute flex items-center justify-center ml-1 w-4 h-4 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-gray-900">
                                    { (order >= 2) ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                   : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-cloud-off"><path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"></path><line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                  }
                </span>
                <h3 className=" cursor-pointer p-2 w-64 flex items-center text-sm font-semibold hover:bg-slate-600 rounded-lg transition duration-200 ease-in-out">
                  Appliquer l'algorithme des K-means pour diviser les données en deux classes.
                </h3>
              </div>
                <button type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                  Appliquer
                </button>
            </li>

            <li className={`mb-10 ms-6 ${order >= 2 ? '' : 'opacity-50 pointer-events-none'}`}>            
                <div className='flex flex-row items-center'>
                
                <span className="absolute flex items-center justify-center ml-1 w-4 h-4 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-gray-900">
                                    { (order >= 2) ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                   : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-cloud-off"><path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"></path><line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                  }
                </span>
                <h3 className=" cursor-pointer p-2 w-64 flex items-center text-sm font-semibold hover:bg-slate-600 rounded-lg transition duration-200 ease-in-out">
                  Afficher dans un graphe les centroïdes et les données appartenant à chaque classe.
                </h3>
              </div>
                <button type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                  Afficher
                </button>
            </li>

            <li className={`mb-10 ms-6 ${order >= 2 ? '' : 'opacity-50 pointer-events-none'}`}>            
                <div className='flex flex-row items-center'>
                
                <span className="absolute flex items-center justify-center ml-1 w-4 h-4 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-gray-900">
                                    { (order >= 2) ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                   : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-cloud-off"><path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"></path><line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                  }
                </span>
                <h3 className=" cursor-pointer p-2 w-64 flex items-center text-sm font-semibold hover:bg-slate-600 rounded-lg transition duration-200 ease-in-out">
                  Appliquer l'algorithme Classification Ascendante Hiérarchique (CAH) pour diviser les données en deux classes.
                </h3>
              </div>
                <button type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                  Appliquer
                </button>
            </li>

            <li className={`mb-10 ms-6 ${order >= 2 ? '' : 'opacity-50 pointer-events-none'}`}>            
                <div className='flex flex-row items-center'>
                
                <span className="absolute flex items-center justify-center ml-1 w-4 h-4 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-gray-900">
                                    { (order >= 2) ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                   : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-cloud-off"><path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"></path><line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                  }
                </span>
                <h3 className=" cursor-pointer p-2 w-64 flex items-center text-sm font-semibold hover:bg-slate-600 rounded-lg transition duration-200 ease-in-out">
                  Comparer les résultats des deux algorithmes.
                </h3>
              </div>
                <button type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                  Comparer
                </button>
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
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                
                          <span className="font-semibold">Click to upload</span> or drag and drop</p>
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

'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import styles from "./page.module.css";

import DataFrameTable from './components/DataFrameTable/page';
import dotenv from 'dotenv';
dotenv.config();
const prefix_url = "http://localhost:5000";
  

export default function Home() {

  
  const [data, setData] = useState([]);


  // Question 1-1-1
  const [nombre_observations, setNombre_observations] = useState(0) ;
  const [nombre_caractere, setNombre_caractere] = useState(0) ;
  const [dataUploaded, setDataUploaded] = useState(false) ;

  // Question 1-1-2
  const [verifObservationResult, setVerifObservationResult] = useState(false) ;
  const [verifObservationMessage, setVerifObservationMessage] = useState("") ;

  // Question 1-1-3
  const [replaceNullValues, setReplaceNullValues] = useState(false) ;
  const [replaceNullValuesMessage, setReplaceNullValuesMessage] = useState("") ;

  // Question 1-2-1
  const [convertInteger, setConvertInteger] = useState(false) ;
  const [convertIntegerMessage, setConvertIntegerMessage] = useState("") ;


  // Question 1-2-2
  const [isNormalized, setIsNormalized] = useState(false) ;
  const [isNormalizedMessage, setIsNormalizedMessage] = useState("") ;

  // Question 1-2-3

  const [corrMatrix, setCorrMatrix] = useState([]) ;
  const [getCorrMatrix, setGetCorrMatrix] = useState(false) ;
  const  [getCorrMatrixMessage, setGetCorrMatrixMessage] = useState("") ;
        
  
  // Question 1-2-4
  const [getCouplesVariables, setGetCouplesVariables] = useState(false) ;
  const [getCouplesVariablesMessage, setGetCouplesVariablesMessage] = useState("") ;


  // Question 2-1-1
  const [applyAcpNorm, setApplyAcpNorm] = useState(false) ;
  const [applyAcpNormMessage, setApplyAcpNormMessage] = useState("") ;


  // Question 2-1-2
  const [acpTable, setACPTable] = useState([]) ;
  const [getAcpTable, setGetAcpTable] = useState(false) ;
  const [getAcpTableMessage, setGetAcpTableMessage] = useState("") ;


  const [valeursPropres, setValeursPropres] = useState([]) ;
  const [getValeursPropres, setgetValeursPropres] = useState(false) ;
  const [getValeursPropresMessage, setgetValeursPropresMessage] = useState("") ;


  // Question 2-2-1
  const [inertiePourcentage, setInertiePourcentage] = useState([]) ;
  const [getInertiePourcentage, setGetInertiePourcentage] = useState(false) ;
  const [getInertiePourcentageMessage, setInertiePourcentageMessage] = useState("") ;

  const [saturation, setSaturation] = useState([]) ;
  const [getSaturation, setGetSaturation] = useState(false) ;
  const [getSaturationMessage, setGetSaturationMessage] = useState("") ;


  // Q 3-1-1
  const [kMeans, setKMeans] = useState(false) ;
  const [kMeansMessage, setKMeansMessage] = useState("") ;

  const [centroides, setCentroides] = useState([]) ;
  const [getCentroides, setGetCentroides] = useState(false) ;
  const [getCentroidesMessage, setGetCentroidesMessage] = useState("") ;

  const [cah, setCAH] = useState([]) ;
  const [getCAH, setGetCAH] = useState(false) ;
  const [getCAHMessage, setGetCAHMessage] = useState("") ;

  const [inertieKmeans, setInertieKmeans] = useState(0.0) ;
  const [inertieCAH, setInertieCAH] = useState(0.0) ;
  const [compareKmeansCAH, setCompareKmeansCAH] = useState(false) ;
  const [compareKmeansCAHMessage, setCompareKmeansCAHMessage] = useState("") ;

  
  // selectedComponent State, to move from component to an other with it's index
  const [selectedComponent, setSelectedComponent] = useState(0) ;

  // order State, used to show and able element in the List, to avoid clicking on element still not having its order .
  // example, it's impossible to click on the element 4 for the first time, before clicking on an element < 4
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

      setOrder(1) ;

      handleOpenCloseList(0) ;

      setDataUploaded(true) ;
      
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleVerifObservations = async () => {
    try {
      if (!verifObservationResult){
        const response = await fetch(`${prefix_url}/api/verifObservations`);

        const fetchedData = await response.json();
        setVerifObservationResult(JSON.parse(fetchedData.result));
        console.log("Verif Observations :: ") ;
        console.log(JSON.parse(fetchedData.result)) ;
        setVerifObservationMessage(fetchedData.message) ;

        setData(JSON.parse(fetchedData.data)) ;

        if (JSON.parse(fetchedData.result)){
          setOrder(2) ;
        }else {
          setOrder(3) ;
          setReplaceNullValues(true) ;
        }
    }
    } catch (error) {
      console.error('Error Getting result:', error);
    }
  }

  const handleReplaceNullValues = async () => {
    try {
      if (!replaceNullValues) {
        const response = await fetch(`${prefix_url}/api/replaceNullValues`);
        
        const fetchedData = await response.json() ;
        console.log("Replace Null Values :: ") ;
        setReplaceNullValues(JSON.parse(fetchedData.result)) ;
        setReplaceNullValuesMessage(fetchedData.message) ;
        setData(JSON.parse(fetchedData.data)) ;
        handleOpenCloseList(1) ;
      }

    }catch(err) {
      console.log("ERROR", err) ;
    }
  }

  const handleConvertToInteger = async () => {
    try {
      if (!convertInteger) {
        const response = await fetch(`${prefix_url}/api/convertToInteger`);
        
        const fetchedData = await response.json() ;
        console.log("Codage des valeurs :: ") ;
        setConvertInteger(JSON.parse(fetchedData.result)) ;
        setConvertIntegerMessage(fetchedData.message) ;
        setData(JSON.parse(fetchedData.data)) ;

      }

    }catch(err) {
      console.log("ERROR", err) ;
    }
  }

  const handleIsNormalized = async () => {
    
    try {
      if (!isNormalized) {
        const response = await fetch(`${prefix_url}/api/isNormalized`);
        
        const fetchedData = await response.json() ;
        console.log("normalisation de la base :: ") ;
        setIsNormalized(JSON.parse(fetchedData.result)) ;
        setIsNormalizedMessage(fetchedData.message) ;
        setData(JSON.parse(fetchedData.data)) ;

      }

    }catch(err) {
      console.log("ERROR", err) ;
    }
  }

  const handleGetCorrMatrix = async () => {
    try {
      if (!getCorrMatrix) {
        const response = await fetch(`${prefix_url}/api/getCorrMatrix`);
        
        const fetchedData = await response.json() ;
        console.log("get corr matrix :: ") ;

        setCorrMatrix(fetchedData.data) ;
        
        setGetCorrMatrix(JSON.parse(fetchedData.result)) ;
        setGetCorrMatrixMessage(fetchedData.message) ;
      }
      handleSelectedComponent(1) ;

    }catch(err) {
      console.log("ERROR", err) ;
    }
  }

  const handleGetCouplesVariables = async () => {
    try {
      if (!getCouplesVariables) {
        const response = await fetch(`${prefix_url}/api/getCouplesVariables`);
        
        const fetchedData = await response.json() ;
        console.log("get Couples :: ") ;
        
        setGetCouplesVariables(fetchedData.result) ;
        setGetCouplesVariablesMessage(fetchedData.message) ;
      }
    }catch(err) {
      console.log("ERROR", err) ;
    }
  }

  const handleApplyAcpNorm = async () => {
    try {
      if (!applyAcpNorm) {
        const response = await fetch(`${prefix_url}/api/applyAcpNorm`);
        
        const fetchedData = await response.json() ;
        console.log("Apply ACP Norm :: ") ;
        
        setApplyAcpNorm(fetchedData.result) ;
        setApplyAcpNormMessage(fetchedData.message) ;
      }
    }catch(err) {
      console.log("ERROR", err) ;
    }
  }

  const handleGetAcpTable = async () => {
    try {
      if (!getAcpTable) {
        const response = await fetch(`${prefix_url}/api/getACPTable`);
        
        const fetchedData = await response.json() ;
        console.log("get ACP Table :: ") ;
        
        setACPTable(JSON.parse(fetchedData.data)) ;
        setGetAcpTable(fetchedData.result) ;
        setGetAcpTableMessage(fetchedData.message) ;
      }
      handleSelectedComponent(2) ;

    }catch(err) {
      console.log("ERROR", err) ;
    }
  }

  const handleValeursPropres = async () => {
    
    try {
      if (!getValeursPropres) {
        const response = await fetch(`${prefix_url}/api/getValeursPropres`);
        
        const fetchedData = await response.json() ;
        console.log("get Valeurs Propres :: ") ;
        
        setValeursPropres(fetchedData.data) ;
        setgetValeursPropres(fetchedData.result) ;
        setgetValeursPropresMessage(fetchedData.message) ;
      }
      handleSelectedComponent(3) ;

    }catch(err) {
      console.log("ERROR", err) ;
    }
  }
  
  const handleGetInertiePourcentage = async () => {
    
    try {
      if (!getInertiePourcentage) {
        const response = await fetch(`${prefix_url}/api/getInertiePourcentage`);
        
        const fetchedData = await response.json() ;
        console.log("get Valeurs Propres :: ") ;
        
        setInertiePourcentage(fetchedData.data) ;
        setGetInertiePourcentage(fetchedData.result) ;
        setInertiePourcentageMessage(fetchedData.message) ;
      }
      handleSelectedComponent(4) ;

    }catch(err) {
      console.log("ERROR", err) ;
    }
  }

  const handleGetSaturation = async () => {
    try {
      if (!getSaturation) {
        const response = await fetch(`${prefix_url}/api/getSaturation`);
        
        const fetchedData = await response.json() ;
        console.log("get Saturation :: ") ;
        
        setSaturation(fetchedData.data) ;
        setGetSaturation(fetchedData.result) ;
        setGetSaturationMessage(fetchedData.message) ;
      }
      handleSelectedComponent(5) ;

    }catch(err) {
      console.log("ERROR", err) ;
    }
  }

  const handleKMeans = async () => {
    try {
      if (!kMeans) {
        const response = await fetch(`${prefix_url}/api/kMeans`);
        
        const fetchedData = await response.json() ;
        console.log("Appliquer K-means :: ") ;
        
        setKMeans(fetchedData.result) ;
        setKMeansMessage(fetchedData.message) ;
      }

    }catch(err) {
      console.log("ERROR", err) ;
    }
  }

  const handleCentroides = async () => {
    try {
      if (!getCentroides) {
        const response = await fetch(`${prefix_url}/api/centroides`);
        
        const fetchedData = await response.json() ;
        console.log("get Centroides :: ") ;
        
        setCentroides(fetchedData.data) ;
        setGetCentroides(fetchedData.result) ;
        setGetCentroidesMessage(fetchedData.message) ;
      }
      handleSelectedComponent(6) ;

    }catch(err) {
      console.log("ERROR", err) ;
    }
  }



  const handleApplyCAH = async () => {
    try {
      if (!getCAH) {
        const response = await fetch(`${prefix_url}/api/applyCAH`);
        
        const fetchedData = await response.json() ;
        console.log("get CAH :: ") ;
        
        setCAH(fetchedData.data) ;
        setGetCAH(fetchedData.result) ;
        setGetCAHMessage(fetchedData.message) ;
      }
      handleSelectedComponent(7) ;

    }catch(err) {
      console.log("ERROR", err) ;
    }
  }

  const handleCompareKmeansCAH = async () => {
    try {
      if (!compareKmeansCAH) {
        const response = await fetch(`${prefix_url}/api/compareKmeansCAH`);
        
        const fetchedData = await response.json() ;
        console.log("Compare Kmeans et CAH :: ") ;
        
        setInertieKmeans(fetchedData.inertieKmeans) ;
        setInertieCAH(fetchedData.inertieCAH) ;

        setCompareKmeansCAH(fetchedData.result) ;
        setCompareKmeansCAHMessage(fetchedData.message) ;
      }
      handleSelectedComponent(8) ;

    }catch(err) {
      console.log("ERROR", err) ;
    }
  }

  useEffect(() => {
    handleSelectedComponent(1) ;
  }, [getCorrMatrix]) ;

  useEffect(() => {
    if (getAcpTable){
      handleSelectedComponent(2) ;
    }

  }, [acpTable]) ;

  useEffect(() => {
    if (getValeursPropres){
      handleSelectedComponent(3) ;
    }
  }, [valeursPropres]) ;

  useEffect(() => {
    if (getInertiePourcentage){
      handleSelectedComponent(4) ;
    }
  }, [inertiePourcentage])

  useEffect(() => {
    if (getSaturation){
      handleSelectedComponent(5) ;
    }
  }, [saturation])

  useEffect(() => {
    if (getCentroides){
      handleSelectedComponent(6) ;
    }
  }, [centroides])

  useEffect(() => {
    if (getCAH){
      handleSelectedComponent(7) ;
    }
  }, [cah])

  useEffect(() => {
    if (compareKmeansCAH) {
      handleSelectedComponent(8) ;
    }
  }, [compareKmeansCAHMessage])

  useEffect(() => {
    console.log("Data Changed") ;
  }, [data]) ;



  const handleOpenDataBasePopUp = () => {
    console.log("Data Base Pop Up Opened !!")
  }

  const handleSelectedComponent = (index : any) => {
    if (index === 0 && dataUploaded) {
      setSelectedComponent(index) ;
    }
    if (index === 1 && getCorrMatrix) {
      setSelectedComponent(index) ;
    }
    
    if (index === 2 && acpTable) {
      setSelectedComponent(index) ;
    }
    
    if (index === 3 && valeursPropres) {
      setSelectedComponent(index) ;
    }

    if (index === 4 && inertiePourcentage){
      setSelectedComponent(index) ;
    }
    
    if (index === 5 && saturation){
      setSelectedComponent(index) ;
    }

    if (index === 6 && centroides){
      setSelectedComponent(index) ;
    }

    if (index === 7 && cah) {
      setSelectedComponent(index) ;
    }

    if (index === 8 && compareKmeansCAH) {
      setSelectedComponent(index) ; 
    }

    console.log("Selected Componenent ::", index) ;
    console.log("order ::: ", order) ;
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
                      { (order >= 1) ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                   : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-cloud-off"><path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"></path><line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                  }
                </span>
                <h3 className="flex items-center text-sm font-semibold ">Lire la base de données</h3>
              </div>
                <button type="button" onClick = {() => handleSelectedComponent(0)} className=" mt-2 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                  Voir La Base de Données
                </button>
            </li>

            <li className={`mb-10 ms-6 ${(order >= 1 || dataUploaded) ? '' : 'opacity-50 pointer-events-none'}`}>
                <div className='flex flex-row items-center'>
                
                <span className="absolute flex items-center justify-center ml-1 w-4 h-4 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-gray-900">
                { (order >= 1  || dataUploaded) ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                 : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-cloud-off"><path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"></path><line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                }
                </span>
                <h3 className=" cursor-pointer p-2 w-64 flex items-center text-sm font-semibold hover:bg-slate-600 rounded-lg transition duration-200 ease-in-out">
                  Indiquer le nombre des observations dans la base ainsi que le nombre des caractéristiques.
                </h3>
              </div>
            </li>

            <li className={`mb-10 ms-6 ${dataUploaded ? '' : 'opacity-50 pointer-events-none'}`}>            
                <div className='flex flex-row items-center'>
                
                <span className="absolute flex items-center justify-center ml-1 w-4 h-4 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-gray-900">
                  { (verifObservationResult) ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                   : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-cloud-off"><path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"></path><line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                  }
                </span>
                <h3 className=" cursor-pointer p-2 w-64 flex items-center text-sm font-semibold hover:bg-slate-600 rounded-lg transition duration-200 ease-in-out">
                  Vérifier s’il existe des observations qui sont manquantes ou NaN
                </h3>
              </div>
                <button onClick={() => handleVerifObservations()} type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                  {
                    (verifObservationResult) ? "Vérifié" : "Vérifier"
                  }
                </button>
                {(verifObservationMessage) && <p className=" mb-4 text-base font-normal text-gray-500 dark:text-gray-400">{verifObservationMessage}</p>}

            </li>

            <li className={` mb-10 ms-6 ${verifObservationResult ? '' : 'opacity-50 pointer-events-none'}`}>            
              <div className='flex flex-row items-center'>
                
                <span className="absolute flex items-center justify-center ml-1 w-4 h-4 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-gray-900">
                  { (replaceNullValues) ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                   : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-cloud-off"><path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"></path><line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                  }
                </span>
                  <h3 className=" cursor-pointer p-2 w-64 flex items-center text-sm font-semibold hover:bg-slate-600 rounded-lg transition duration-200 ease-in-out">
                    remplacer les valeurs manquantes dans chaque colonne par la moyenne de la variable.
                  </h3>
              </div>
              <button onClick={() => handleReplaceNullValues()} type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                {(replaceNullValues) ? "Remplacé" : "remplacer"}
              </button>
              {(replaceNullValuesMessage) && <p className=" w-64 mb-4 text-base font-normal text-gray-500 dark:text-gray-400">{replaceNullValuesMessage}</p>}

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
            <li className={`mb-10 ms-6 ${(replaceNullValues) ? '' : 'opacity-50 pointer-events-none'}`}>            
                <div className='flex flex-row items-center'>
                
                <span className="absolute flex items-center justify-center ml-1 w-4 h-4 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-gray-900">
                                    { (convertInteger) ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                   : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-cloud-off"><path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"></path><line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                  }
                </span>
                <h3 className=" cursor-pointer p-2 w-64 flex items-center text-sm font-semibold hover:bg-slate-600 rounded-lg transition duration-200 ease-in-out">
                  Appliquer le codage nécessaire pour transformer les caractéristiques dont les valeurs sont de type chaine de caractères en entier.
                </h3>
              </div>
                <button onClick={() => handleConvertToInteger()} type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                  {(convertInteger) ? "La Base a été Codé " : "Appliquer le codage"}
                </button>
                {(convertIntegerMessage) && <p className=" w-64 mb-4 text-base font-normal text-gray-500 dark:text-gray-400">{convertIntegerMessage}</p>}

            </li>

            <li className={`mb-10 ms-6 ${convertInteger ? '' : 'opacity-50 pointer-events-none'}`}>            
                <div className='flex flex-row items-center'>
                
                <span className="absolute flex items-center justify-center ml-1 w-4 h-4 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-gray-900">
                                    { (isNormalized) ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                   : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-cloud-off"><path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"></path><line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                  }
                </span>
                <h3 className=" cursor-default p-2 w-64 flex items-center text-sm font-semibold ">
                  Vérifier si la base est normalisée ou non (centrée-réduite), effectuer les transformations nécessaires.            
                </h3>
              </div>
                <button onClick={() => handleIsNormalized()} type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                  {(isNormalized) ? "Vérifiée" : "Vérifier"}
                </button>
                {(isNormalizedMessage) && <p className=" w-64 mb-4 text-base font-normal text-gray-500 dark:text-gray-400">{isNormalizedMessage}</p>}

            </li>

            <li className={`mb-10 ms-6 ${isNormalizedMessage ? '' : 'opacity-50 pointer-events-none'}`}>            
                <div className='flex flex-row items-center'>
                
                <span className="absolute flex items-center justify-center ml-1 w-4 h-4 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-gray-900">
                                    { (getCorrMatrixMessage) ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                   : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-cloud-off"><path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"></path><line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                  }
                </span>
                <h3 className=" cursor-pointer p-2 w-64 flex items-center text-sm font-semibold hover:bg-slate-600 rounded-lg transition duration-200 ease-in-out">
                  Afficher la matrice de corrélation
                </h3>
              </div>
                <button onClick={() => handleGetCorrMatrix()} type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                  Afficher
                </button>
                {(getCorrMatrixMessage) && <p className=" w-64 mb-4 text-base font-normal text-gray-500 dark:text-gray-400">{getCorrMatrixMessage}</p>}

            </li>

            <li className={`mb-10 ms-6 ${getCorrMatrixMessage ? '' : 'opacity-50 pointer-events-none'}`}>            
                <div className='flex flex-row items-center'>
                
                <span className="absolute flex items-center justify-center ml-1 w-4 h-4 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-gray-900">
                                    { (getCouplesVariables) ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                   : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-cloud-off"><path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"></path><line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                  }
                </span>
                <h3 className=" cursor-pointer p-2 w-64 flex items-center text-sm font-semibold hover:bg-slate-600 rounded-lg transition duration-200 ease-in-out">
                  Quels sont les couples de variables les plus corrélées.
                </h3>
              </div>
                <button onClick={() => handleGetCouplesVariables()} type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                  Déterminer
                </button>
                {(getCouplesVariablesMessage) && <p className=" w-64 mb-4 text-base font-normal text-gray-500 dark:text-gray-400">{getCouplesVariablesMessage}</p>}

            </li>
            </>
          )}



            <li className={`mb-10 ms-6 ${getCouplesVariables ? '' : 'opacity-50 pointer-events-none'}`}>            
                <div className='flex flex-row items-center'>
                
                <span className="absolute flex items-center justify-center w-7 h-7 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-gray-900">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-box"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                </span>
                <h3 className="flex items-center ml-2 text-lg font-semibold ">Extraction des caractéristiques</h3>
              </div>
            </li>


            {/* Childs ::: */}


            <li className={`mb-10 ms-6 ${getCouplesVariables ? '' : 'opacity-50 pointer-events-none'}`}>            
                <div className='flex flex-row items-center'>
                
                <span className="absolute flex items-center justify-center ml-1 w-4 h-4 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-gray-900">
                                    { (applyAcpNorm) ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                   : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-cloud-off"><path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"></path><line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                  }
                </span>
                <h3 className=" cursor-pointer p-2 w-64 flex items-center text-sm font-semibold hover:bg-slate-600 rounded-lg transition duration-200 ease-in-out">
                  Appliquer sur la base une ACP normée.
                </h3>
              </div>
                <button onClick = {() => handleApplyAcpNorm()} type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                  {(applyAcpNorm) ? "La base a été normée" : "Appliquer"}
                </button>
                {(applyAcpNormMessage) && <p className=" w-64 mb-4 text-base font-normal text-gray-500 dark:text-gray-400">{applyAcpNormMessage}</p>}

            </li>

            <li className={`mb-10 ms-6 ${applyAcpNorm ? '' : 'opacity-50 pointer-events-none'}`}>            
                <div className='flex flex-row items-center'>
                
                <span className="absolute flex items-center justify-center ml-1 w-4 h-4 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-gray-900">
                                    { (getAcpTable) ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                   : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-cloud-off"><path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"></path><line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                  }
                </span>
                <h3 className=" cursor-pointer p-2 w-64 flex items-center text-sm font-semibold hover:bg-slate-600 rounded-lg transition duration-200 ease-in-out">
                  Afficher le tableau de L'ACP.
                </h3>
              </div>
                <button onClick={() => handleGetAcpTable()} type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                  Afficher
                </button>
                {(getAcpTableMessage) && <p className=" w-64 mb-4 text-base font-normal text-gray-500 dark:text-gray-400">{getAcpTableMessage}</p>}

            </li>

            <li className={`mb-10 ms-6 ${getAcpTable ? '' : 'opacity-50 pointer-events-none'}`}>            
                <div className='flex flex-row items-center'>
                
                <span className="absolute flex items-center justify-center ml-1 w-4 h-4 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-gray-900">
                                    { (getValeursPropres) ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                   : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-cloud-off"><path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"></path><line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                  }
                </span>
                <h3 className=" cursor-pointer p-2 w-64 flex items-center text-sm font-semibold hover:bg-slate-600 rounded-lg transition duration-200 ease-in-out">
                  Interpréter les valeurs propres.
                </h3>
              </div>
                <button onClick={() => handleValeursPropres()} type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                  {(getValeursPropres) ? "Afficher" : "Interpréter"}
                </button>
                {(getValeursPropresMessage) && <p className=" w-64 mb-4 text-base font-normal text-gray-500 dark:text-gray-400">{getValeursPropresMessage}</p>}

            </li>

            <li className={`mb-10 ms-6 ${getValeursPropres ? '' : 'opacity-50 pointer-events-none'}`}>            
                <div className='flex flex-row items-center'>
                
                <span className="absolute flex items-center justify-center ml-1 w-4 h-4 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-gray-900">
                                    { (getInertiePourcentage) ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                   : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-cloud-off"><path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"></path><line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                  }
                </span>
                <h3 className=" cursor-pointer p-2 w-64 flex items-center text-sm font-semibold hover:bg-slate-600 rounded-lg transition duration-200 ease-in-out">
                  Déterminer le pourcentage d’inertie à partir de l’éboulis des valeurs propres.
                </h3>
              </div>
                <button onClick={() => handleGetInertiePourcentage()} type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                  {(inertiePourcentage) ? "Afficher" : "Déterminer"}
                </button>
                {(getInertiePourcentageMessage) && <p className=" w-64 mb-4 text-base font-normal text-gray-500 dark:text-gray-400">{getInertiePourcentageMessage}</p>}
            </li>

            <li className={`mb-10 ms-6 ${getInertiePourcentage ? '' : 'opacity-50 pointer-events-none'}`}>            
                <div className='flex flex-row items-center'>
                
                <span className="absolute flex items-center justify-center ml-1 w-4 h-4 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-gray-900">
                                    { (getSaturation) ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                   : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-cloud-off"><path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"></path><line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                  }
                </span>
                <h3 className=" cursor-pointer p-2 w-64 flex items-center text-sm font-semibold hover:bg-slate-600 rounded-lg transition duration-200 ease-in-out">
                  Afficher la saturation des variables et tracer le cercle de corrélation.
                </h3>
              </div>
                <button onClick={() => handleGetSaturation()} type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                  Afficher
                </button>
                {(getSaturationMessage) && <p className=" w-64 mb-4 text-base font-normal text-gray-500 dark:text-gray-400">{getSaturationMessage}</p>}

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

            <li className={`mb-10 ms-6 ${getSaturation ? '' : 'opacity-50 pointer-events-none'}`}>            
                <div className='flex flex-row items-center'>
                
                <span className="absolute flex items-center justify-center ml-1 w-4 h-4 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-gray-900">
                                    { (kMeans) ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                   : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-cloud-off"><path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"></path><line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                  }
                </span>
                <h3 className=" cursor-pointer p-2 w-64 flex items-center text-sm font-semibold hover:bg-slate-600 rounded-lg transition duration-200 ease-in-out">
                  Appliquer l'algorithme des K-means pour diviser les données en deux classes.
                </h3>
              </div>
                <button onClick={() => handleKMeans()} type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                  {(kMeans) ? "Appliqué" : "Appliquer"}
                </button>
                {(kMeansMessage) && <p className=" w-64 mb-4 text-base font-normal text-gray-500 dark:text-gray-400">{kMeansMessage}</p>}

            </li>

            <li className={`mb-10 ms-6 ${kMeans ? '' : 'opacity-50 pointer-events-none'}`}>            
                <div className='flex flex-row items-center'>
                
                <span className="absolute flex items-center justify-center ml-1 w-4 h-4 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-gray-900">
                                    { (getCentroides) ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                   : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-cloud-off"><path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"></path><line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                  }
                </span>
                <h3 className=" cursor-pointer p-2 w-64 flex items-center text-sm font-semibold hover:bg-slate-600 rounded-lg transition duration-200 ease-in-out">
                  Afficher dans un graphe les centroïdes et les données appartenant à chaque classe.
                </h3>
              </div>
                <button onClick={() => handleCentroides()} type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                  Afficher
                </button>
                {(getCentroidesMessage) && <p className=" w-64 mb-4 text-base font-normal text-gray-500 dark:text-gray-400">{getCentroidesMessage}</p>}

            </li>

            <li className={`mb-10 ms-6 ${getCentroides ? '' : 'opacity-50 pointer-events-none'}`}>            
                <div className='flex flex-row items-center'>
                
                <span className="absolute flex items-center justify-center ml-1 w-4 h-4 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-gray-900">
                                    { (getCAH) ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                   : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-cloud-off"><path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"></path><line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                  }
                </span>
                <h3 className=" cursor-pointer p-2 w-64 flex items-center text-sm font-semibold hover:bg-slate-600 rounded-lg transition duration-200 ease-in-out">
                  Appliquer l'algorithme Classification Ascendante Hiérarchique (CAH) pour diviser les données en deux classes.
                </h3>
              </div>
                <button onClick={() => handleApplyCAH()} type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                  {(getCAH) ? "Afficher" : "Appliquer"}
                </button>
                {(getCAHMessage) && <p className=" w-64 mb-4 text-base font-normal text-gray-500 dark:text-gray-400">{getCAHMessage}</p>}

            </li>

            <li className={`mb-10 ms-6 ${getCAH ? '' : 'opacity-50 pointer-events-none'}`}>            
                <div className='flex flex-row items-center'>
                
                <span className="absolute flex items-center justify-center ml-1 w-4 h-4 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-gray-900">
                                    { (compareKmeansCAH) ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                   : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-cloud-off"><path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"></path><line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                  }
                </span>
                <h3 className=" cursor-pointer p-2 w-64 flex items-center text-sm font-semibold hover:bg-slate-600 rounded-lg transition duration-200 ease-in-out">
                  Comparer les résultats des deux algorithmes.
                </h3>
              </div>
                <button onClick={() => handleCompareKmeansCAH()} type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                  Comparer
                </button>
                {(compareKmeansCAHMessage) && <p className=" w-64 mb-4 text-base font-normal text-gray-500 dark:text-gray-400">{compareKmeansCAHMessage}</p>}
            </li>

          </ol>
        </div>
        

        <div className={` w-3/4 m-1 flex-1 bg-gray-300 p-4 overflow-y-auto border rounded-md border-gray-400 dark:bg-gray-800 dark:border-gray-700 ${styles.rightContainer}`}>
        {selectedComponent === 0 && (
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
        {selectedComponent === 1 && (
          <>
            {corrMatrix && (
              <img 
                src={`data:image/png;base64,${corrMatrix}`}
                alt="Correlation Matrix" 
                className="w-full h-auto"
              />
            )}
          </>

        )}
          
        {selectedComponent === 2 && (
        <>
          {acpTable && (
            <DataFrameTable data={acpTable} />

          )}
        </>

        )}

        {selectedComponent === 3 && (
          <>
            {valeursPropres && (
              <img 
                src={`data:image/png;base64,${valeursPropres}`}
                alt="Valeurs propres" 
                className="w-full h-auto"
              />
            )}
          </>

        )}
         {selectedComponent === 4 && (
          <>
            {inertiePourcentage && (
              <img 
                src={`data:image/png;base64,${inertiePourcentage}`}
                alt="Pourcentage Inertie" 
                className="w-full h-auto"
              />
            )}
          </>

        )}

        {selectedComponent === 5 && (
          <>
            {saturation && (
              <img 
                src={`data:image/png;base64,${saturation}`}
                alt="Saturation" 
                className=" w-3/5 h-auto"
              />
            )}
          </>

        )}

        {selectedComponent === 6 && (
          <>
            {centroides && (
              <img 
                src={`data:image/png;base64,${centroides}`}
                alt="Saturation" 
                className=" w-3/4 h-auto"
              />
            )}
          </>

        )}

        {selectedComponent === 7 && (
          <>
            {cah && (
              <img 
                src={`data:image/png;base64,${cah}`}
                alt="Saturation" 
                className=" w-3/4 h-auto"
              />
            )}
          </>
        )}
        {selectedComponent === 8 && (
          <>
            <div className=' flex flex-row'>
              {centroides && (
                <img 
                  src={`data:image/png;base64,${centroides}`}
                  alt="Kmeans" 
                  className=" w-1/2 h-auto"
                />
              )}
              {cah && (
                <img 
                  src={`data:image/png;base64,${cah}`}
                  alt="CAH" 
                  className=" w-1/2 h-auto"
                />
              )}
            </div>
            {
              compareKmeansCAHMessage && (
                <>
                  <h1 className=' mt-2 text-left font-bold text-xl'>Inertie totale de K-means : {inertieKmeans}</h1>
                  <h1 className=' mt-2 text-left font-bold text-xl border-b pb-3 border-gray-400 dark:border-gray-700'>Inertie totale de la CAH : {inertieCAH}</h1>

                  <h1 className='mt-4 text-slate-200 text-left font-bold text-2xl'>
                    On constate que l'inertie totale de CAH est nettement plus {(inertieKmeans > inertieCAH) ? "faible" : "forte"} que celle de K-means. Cette différence suggère que {(inertieKmeans > inertieCAH) ? "CAH" : "K-means"} a réalisé une réduction plus importante des distances intra-cluster, ce qui se traduit par la création de clusters plus compacts et mieux séparés.
                  </h1>
                </>
              )
            }
          </>

        )}
        </div>
      </div>
    </div>
  );
}

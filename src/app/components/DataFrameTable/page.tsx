import React from 'react';
import styles from "./page.module.css";
import { getServerSideProps } from 'next/dist/build/templates/pages';

type Props = Awaited<ReturnType<typeof getServerSideProps>>['props']

const DataFrameTable: React.FC<Props>= ({ data }) => {
  
  return (
    <div className={` ${styles.table_container} relative overflow-x-auto`}>
      <table className={` ${styles.table} table-auto overflow-scroll w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400`}>
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-2 py-3" key={-1}></th>
            {Object.keys(data[0]).map((key) => (
              <th scope="col" className=" text-center px-2 py-3" key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody className={`${styles.table_body}`}>
          {data.map((row : any, rowIndex : any) => (
            <tr key={rowIndex}>
              <td scope="col" className=" text-center px-2 py-2" key={rowIndex}>{rowIndex}</td>
     
              {Object.values(row).map((value : any, colIndex) => (
                <td scope="col" className=" text-center px-2 py-2" key={colIndex}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataFrameTable;

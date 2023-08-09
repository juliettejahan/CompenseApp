import { SelectList } from 'react-native-dropdown-select-list'
import React, { useState, useEffect } from 'react';
import { sendRequest } from './sendRequest';

export default DropDownList = ({authToken, setSelected}) => {
    const [categorie, setCategorie] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasPermissionError, setPermissionError] = useState(false);

    const getAllCategoRequest = () => {
        setIsLoading(true);
        sendRequest('/categorie', 'GET', { token: authToken }, (status, data) => {
          setIsLoading(false);
          if (status == 200) {
            const parsedData = data.map(user => ({
              key: user[1], value: user[0]
            }))
            console.log("parsedData:",parsedData);
            setCategorie(parsedData);
            setPermissionError(false);
          } else if(status == 403) {
            setPermissionError(true);
          }
        }, () => {setIsLoading(false);});
      }
    

    useEffect(() => {
        getAllCategoRequest();
      }, [authToken]);

    const data = categorie;
    console.debug("categorie:",categorie);
  
    return(
      <SelectList 
          setSelected={(val) => setSelected(val)} 
          data={data} 
          save="value"
      />
    )
  
  };
import { MultipleSelectList } from 'react-native-dropdown-select-list'
import React, { useState, useEffect } from 'react';
import { sendRequest } from './sendRequest';


export default MultipleSelectListForExpertise = ({ selected, setSelected }) => {

  const [categorie, setCategorie] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermissionError, setPermissionError] = useState(false);

  const getAllCategoRequest = () => {
    setIsLoading(true);
    sendRequest('/categorie_register', 'GET', null, (status, data) => {
      setIsLoading(false);
      if (status == 200) {
        const parsedData = data.map(user => ({
          key: user[1], value: user[0]
        }))
        console.log("parsedData:", parsedData);
        setCategorie(parsedData);
        setPermissionError(false);
      } else if (status == 403) {
        setPermissionError(true);
      }
    }, () => { setIsLoading(false); });
  }


  useEffect(() => {
    getAllCategoRequest();
  }, []);

  console.debug("selected:", selected);
  console.debug("selectedtype:", typeof (selected));

  return (
    <MultipleSelectList
      setSelected={setSelected}
      fontFamily='lato'
      data={categorie}
      search={false}
      boxStyles={{ borderRadius: 0 }} //override default styles
      placeholder="Mes expertises"
      dropdownStyles={{ backgroundColor: "white" }}
      dropdownItemStyles={{ color: "white" }}
    />
  )

};

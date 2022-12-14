import React, { useState, useEffect } from "react";
import Header from "./components/Header/Header";
import List from "./components/List/List";
import Map from "./components/Map/Map";
import { getPlacesData, getWeatherData } from "./api";

import { CssBaseline, Grid } from "@material-ui/core";

const App = () => {
    const [places, setPlaces] = useState([]);

    const [weatherData, setWeatherData] = useState([]);

    const [coordinates, setCoordinates] = useState({});
    const [bounds, setBounds] = useState({});

    const [isLoading, setIsLoading] = useState(false);

    const [childClicked, setChildClicked] = useState(null);

    const [type, setType] = useState("restaurants");
    const [rating, setRating] = useState(null);

    const [filteredPlaces, setFilteredPlaces] = useState([]);

  
  



  useEffect(()=>{
        navigator.geolocation.getCurrentPosition(({coords:{latitude,longitude}})=>{
        setCoordinates({lat: latitude, lng: longitude});
        })
    },[])

    useEffect(()=>{
        const filteredPlaces = places?.filter((place)=> place.rating >rating)
        setFilteredPlaces(filteredPlaces);
    },[rating])

  useEffect(() => {
    if(bounds.sw && bounds.ne){
    setIsLoading(true);

    getWeatherData(coordinates.lat, coordinates.lng)
        .then((data)=>setWeatherData(data));


    getPlacesData(type,bounds.sw, bounds.ne).then((data) => {
      console.log(data);
      setPlaces(data?.filter((place)=> place.name && place.num_reviews > 0));
      setFilteredPlaces([])
      setIsLoading(false)
    })};
  }, [type, bounds]);
  return (
    <>
      <CssBaseline />
      <Header setCoordinates={setCoordinates} />
      <br />
      <br />
      <br />
      <Grid container spacing={3} style={{ width: "100%" }}>
        <Grid item xs={12} md={4}>
          <List places={filteredPlaces.length ? filteredPlaces : places} 
                isLoading={isLoading}  
                childClicked={childClicked} 
                type={type}
                rating={rating}
                setType={setType}
                setRating={setRating}
            />
        </Grid>
        <Grid item xs={12} md={8}>
         
          <br />
          <br />
          <Map
            setCoordinates ={setCoordinates}
            coordinates={coordinates}
            setBounds={setBounds}
            places={filteredPlaces.length ? filteredPlaces : places}     
            setChildClicked={setChildClicked}
            weatherData={weatherData}
             />
        </Grid>
      </Grid>
    </>
  );
};

export default App;

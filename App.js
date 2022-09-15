import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import * as Location from "expo-location";
import Moment from "moment";
import "moment/locale/fr";

import axios from "axios";
import { useEffect, useState } from "react";

const apiKey = "31211e007ef432a5605ec6173339d1b5";
const urlLondon = `http://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=31211e007ef432a5605ec6173339d1b5`;
const urlNext = `https://api.openweathermap.org/data/2.5/weather?`;
const date = Moment().locale("fr").format("LL");

axios
  .get(urlLondon)
  .then(function (response) {
    // console.log("response", response);
  })
  .catch(function (error) {
    console.log("catch", error);
  })
  .then(function () {});

export default function App() {
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [mainTemp, setMainTemp] = useState(0);
  const [city, setCity] = useState("");
  const [weatherMain, setWeatherMain] = useState("");
  const [weatherIcon, setWeatherIcon] = useState("");
  const formatDate = Moment().format("LLL");

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      // console.log("lcoation", location);

      setLat(location.coords.latitude);
      setLon(location.coords.longitude);
      const currentWeatherData = `${urlNext}lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      axios
        .get(currentWeatherData)
        .then(function (response) {
          // console.log("data", response.data);
          console.log("weather", response.data.weather[0].main);
          setCity(response.data.name);
          setMainTemp(response.data.main.temp);
          setWeatherMain(response.data.weather[0].main);
          setWeatherIcon(response.data.weather[0].icon);
        })
        .catch(function (error) {
          console.log("catch", error);
        })
        .then(function () {});
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Météo de Bordeaux {city}</Text>
      <Text>{mainTemp}°</Text>
      <Text>weather main : {weatherMain}</Text>
      <Text>Aujourd'hui</Text>
      <Text>{date}</Text>
      <Image
        style={styles.tinyLogo}
        source={{
          uri: `http://openweathermap.org/img/wn/${weatherIcon}.png`,
        }}
      ></Image>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  tinyLogo: {
    width: 250,
    height: 250,
  },
});

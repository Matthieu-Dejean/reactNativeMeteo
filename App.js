import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, TextInput, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import Moment from "moment";
import "moment/locale/fr";

import axios from "axios";
import React, { useEffect, useState } from "react";

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

function HomeScreen() {
  const [cityUser, onChangeCityUser] = useState("");
  const [mainTemp, setMainTemp] = useState(0);
  const [city, setCity] = useState("");

  const getValues = () => {
    const cityCall = `https://api.openweathermap.org/data/2.5/weather?q=${cityUser}&appid=${apiKey}&units=metric`;
    axios
      .get(cityCall)
      .then(function (response) {
        console.log("city call data", response.data);
        setCity(response.data.name);
        setMainTemp(response.data.main.temp);
      })
      .catch(function (error) {
        console.log("catch", error);
      })
      .then(function () {});
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Météo</Text>
      <Text>Voici ma première app React Native</Text>
      <TextInput
        style={styles.input}
        onChangeText={(cityUser) => onChangeCityUser(cityUser)}
      />
      <Button title="Valider" onPress={() => getValues()} />
      <Text>La météo de {city}</Text>
      <Text>
        Il fait {mainTemp}° à {city}
      </Text>
    </View>
  );
}

function DetailsScreen() {
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [mainTemp, setMainTemp] = useState(0);
  const [city, setCity] = useState("");
  const [weatherMain, setWeatherMain] = useState("");
  const [weatherIcon, setWeatherIcon] = useState("");

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

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Details") {
              iconName = focused ? "cloud-sharp" : "cloud-outline";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "About" }}
        />
        <Tab.Screen
          name="Details"
          component={DetailsScreen}
          options={{ title: "Détails" }}
        />
      </Tab.Navigator>
    </NavigationContainer>
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
  input: {
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

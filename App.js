import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  FlatList,
  ImageBackground,
} from "react-native";
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
const urlNext = `https://api.openweathermap.org/data/2.5/weather?`;
const date = Moment().locale("fr").format("LL");

function HomeScreen() {
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [mainTemp, setMainTemp] = useState(0);
  const [city, setCity] = useState("");
  const [weatherMain, setWeatherMain] = useState("");
  const [weatherIcon, setWeatherIcon] = useState("");
  const image = {
    uri: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1065&q=80",
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      setLat(location.coords.latitude);
      setLon(location.coords.longitude);
      const currentWeatherData = `${urlNext}lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=fr`;
      axios
        .get(currentWeatherData)
        .then(function (response) {
          setCity(response.data.name);
          setMainTemp(response.data.main.temp);
          setWeatherMain(response.data.weather[0].description);
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
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Text style={[styles.text, { fontSize: 30 }]}>Météo</Text>
          <Text style={styles.text}>Voici ma première app React Native</Text>
          <Text style={styles.text}>Météo : {city}</Text>
          <Text style={styles.text}>{date}</Text>
          <Text style={styles.text}>Actuellement : {weatherMain}</Text>
          <Text style={styles.text}>Température : {Math.round(mainTemp)}°</Text>
        </View>
      </ImageBackground>
    </View>
  );
}

function SearchScreen({ navigation }) {
  const [cityUser, onChangeCityUser] = useState("");
  const [mainTemp, setMainTemp] = useState(0);
  const [city, setCity] = useState("");
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [weatherIcon, setWeatherIcon] = useState("");
  const [date, setDate] = useState("");

  const getValues = async () => {
    const cityCall = `https://api.openweathermap.org/data/2.5/weather?q=${cityUser}&appid=${apiKey}&units=metric`;
    axios
      .get(cityCall)
      .then(function (response) {
        setCity(response.data.name);
        setLat(response.data.coord.lat);
        setLon(response.data.coord.lon);
        setMainTemp(response.data.main.temp);
        setWeatherIcon(response.data.weather[0].icon);
        setDate(response.data.dt_txt);
      })
      .catch(function (error) {
        console.log("catch", error);
      });
  };
  useEffect(() => {
    if (city)
      navigation.navigate("DetailCity", {
        city: city,
        lat: lat,
        lon: lon,
        mainTemp: Math.round(mainTemp),
        weatherIcon: weatherIcon,
        date: date,
      });
  }, [city, mainTemp, weatherIcon, date]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Météo des prochains jours</Text>
      <TextInput
        style={styles.input}
        onChangeText={(cityUser) => onChangeCityUser(cityUser)}
      />
      <Button
        title="Valider"
        onPress={async () => {
          await getValues();
        }}
      />
    </View>
  );
}

function DetailCityScreen({ route }) {
  const { lat } = route.params;
  const { lon } = route.params;
  const { city } = route.params;
  const { mainTemp } = route.params;
  const { weatherIcon } = route.params;
  const { date } = route.params;
  const [fiveDays, setFiveDays] = useState([]);
  const [cityCalled, setCityCalled] = useState("");
  const [nextDaysMeteoState, setNextDaysMeteoState] = useState([]);
  let nextDays = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=fr`;
  useEffect(() => {
    setCityCalled(city);
    (async () => {
      axios
        .get(nextDays)
        .then(function (response) {
          setFiveDays(response.data.list);
          setCityCalled(response.data.city.name);
        })
        .catch(function (error) {
          console.log("catch detailCItyScreen", error);
        })
        .then();
    })();
  }, []);

  useEffect(() => {
    let nextDaysMeteo = [];
    fiveDays.map((day) => {
      if (day.dt_txt.includes("12:00:00")) {
        nextDaysMeteo.push(day);
      }
    });
    setNextDaysMeteoState(nextDaysMeteo);
  }, [city, fiveDays]);

  return (
    <View style={styles.container}>
      <View style={styles.todayBloc}>
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: 20,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 30,
            }}
          >
            Aujourd'hui
          </Text>
          <Text style={styles.text}>
            {Moment(date).locale("fr").format("LL")}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "column",
            justifyContent: "flex-center",
            alignContent: "flex-end",
            height: "auto",
            width: 220,
          }}
        >
          <Image
            style={styles.bigLogo}
            source={{
              uri: `http://openweathermap.org/img/wn/${weatherIcon}.png`,
            }}
          ></Image>
          <Text style={styles.mainTempToday}>{mainTemp}°</Text>
        </View>
      </View>
      <FlatList
        data={nextDaysMeteoState}
        renderItem={({ item }) => (
          <View style={styles.weekList}>
            <View>
              <Text style={styles.weekDay}>
                {Moment(item.dt_txt).locale("fr").format("dddd")}
              </Text>
              <Text style={styles.text}>
                {Moment(item.dt_txt).locale("fr").format("LL")}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "column",
                justifyContent: "flex-start",
                alignContent: "flex-end",
                height: "auto",
                width: 250,
              }}
            >
              <Image
                style={styles.tinyLogo}
                source={{
                  uri: `http://openweathermap.org/img/wn/${item.weather[0].icon}.png`,
                }}
              ></Image>
              <Text style={styles.mainTemp}>{Math.round(item.main.temp)}°</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const Tab = createBottomTabNavigator();

function Main() {
  return (
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
        component={SearchScreen}
        options={{ title: "Search" }}
      />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen
          name="DetailCity"
          component={DetailCityScreen}
          options={{ title: "Detail" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  text: {
    padding: 10,
    color: "#c1c1c1",
  },
  weekDay: {
    fontSize: 30,
    color: "white",
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  nextDays: {
    justifyContent: "flex-end",
  },
  todayBloc: {
    backgroundColor: "#151F28",
    height: 300,
    width: "auto",
    flexDirection: "row",
  },
  tinyLogo: {
    width: 100,
    height: 100,
    alignSelf: "flex-end",
  },
  weekList: {
    flexDirection: "row",
    backgroundColor: "#37464F",
    borderColor: "#151F28",
    borderWidth: 5,
  },
  bigLogo: {
    width: 170,
    height: 170,
    alignSelf: "flex-end",
  },
  mainTemp: {
    color: "white",
    alignSelf: "flex-end",
    fontSize: 50,
    paddingRight: 10,
  },
  mainTempToday: {
    color: "white",
    alignSelf: "flex-end",
    fontSize: 90,
    paddingRight: 10,
  },
  input: {
    height: 40,
    width: 200,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

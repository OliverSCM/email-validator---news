import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ImageBackground, TouchableOpacity, Linking, Image, TextInput, Button } from 'react-native';
import axios from 'axios';

const Proyecto = () => {
  const [news, setNews] = useState([]);
  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(true);
  const [emailValidated, setEmailValidated] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://newsdata.io/api/1/news?apikey=pub_38320d497f119198f435a7430b9fa56f76843&q=pegasus&language=en');
        // Excluir la primera noticia
        const filteredNews = response.data.results.slice(1);
        setNews(filteredNews);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handlePress = (url) => {
    Linking.openURL(url);
  };

  const handleTranslatePress = async (text) => {
    try {
      const options = {
        method: 'POST',
        url: 'https://lecto-translation.p.rapidapi.com/v1/translate/text',
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': 'f0b39b592fmsh8a0733f1f7443a2p15bef0jsnc6422d6213e6',
          'X-RapidAPI-Host': 'lecto-translation.p.rapidapi.com'
        },
        data: {
          texts: [text],
          to: ['hi'],
          from: 'en'
        }
      };
      const response = await axios.request(options);
      console.log(response.data);
      // Aquí puedes manejar la respuesta de la traducción, por ejemplo, mostrarla en una alerta
      alert('Texto traducido: ' + response.data.translations[0].translatedText);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEmailValidation = async () => {
    try {
      const response = await axios.get(`https://api.emailvalidation.io/v1/info?apikey=ema_live_XLB4Wa2f5MQJ2CQ3Iqy17QaWcBisK8v1GeGuGuxV&email=${email}`);
      console.log(response.data);
      // Validar el correo electrónico
      if (response.data.state === 'deliverable') {
        setValidEmail(true);
        setEmailValidated(true);
      } else {
        setValidEmail(false);
      }
    } catch (error) {
      console.error('Error validating email:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Título de la aplicación */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10 }}>
        <Image
          source={require('./imagenes/iconos/newspaper.png')}
          style={{ width: 30, height: 30, marginRight: 10 }}
        />
        <Text style={{ color: 'black', fontSize: 24, fontWeight: 'bold' }}>News</Text>
      </View>
      
      <ImageBackground
        source={require('./imagenes/fondos/fondo5.jpg')}
        style={{ flex: 1 }}
        blurRadius={0}
      >
        {!emailValidated && (
          <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
            <Image
              source={require('./imagenes/iconos/icono1.png')}
              style={{ width: 50, height: 50, marginBottom: 20 }}
            />
            <Text style={{ color: 'white' }}>Ingrese su correo electrónico</Text>
            <TextInput
              style={{ backgroundColor: 'white', width: '80%', padding: 10, marginBottom: 20 }}
              placeholder="Correo electrónico"
              value={email}
              onChangeText={setEmail}
            />
            <Button title="Iniciar sesión" onPress={handleEmailValidation} />
          </View>
        )}
        {emailValidated && (
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            {news.map((item, index) => (
              <TouchableOpacity key={index} onPress={() => handlePress(item.link)}>
                <View style={{ marginBottom: 20 }}>
                  <View style={{ backgroundColor: 'gray', padding: 10 }}>
                    <Text style={{ color: "white", fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>{item.title}</Text>
                    <Text style={{ color: "white" }}>{item.description}</Text>
                    <Text style={{ marginTop: 5, color: "white" }}>Language: {item.language}</Text>
                    <Text style={{ color: "white" }}>Publication Date: {item.pubDate}</Text>
                    <Text style={{ color: "white" }}>Country: {item.country}</Text>
                    <Text style={{ color: "white" }}>Category: {item.category}</Text>
                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                      <TouchableOpacity onPress={() => handleTranslatePress(item.description)} style={{ marginRight: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Image
                            source={require('./imagenes/iconos/translate.png')}
                            style={{ width: 30, height: 30, marginRight: 5 }}
                          />
                          <Text style={{ color: 'white' }}>Translate text</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handlePress(item.link)}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Image
                            source={require('./imagenes/iconos/link.png')}
                            style={{ width: 30, height: 30, marginRight: 5 }}
                          />
                          <Text style={{ color: 'white' }}>Original link</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        {!validEmail && (
          <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
            <Text style={{ color: 'red' }}>Correo no válido</Text>
          </View>
        )}
      </ImageBackground>
    </View>
  );
};

export default Proyecto;

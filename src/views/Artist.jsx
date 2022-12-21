import React, {useEffect, useState} from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import axios from 'axios'
import apiUrl from '../api/url'
import { ActivityIndicator, Title } from 'react-native-paper'
import { ScrollView ,ImageBackground, Dimensions, Text, View, Pressable } from 'react-native'

export default function Artist({routes}) {
  let {id} = useRoute().params
  let [artist, setArtist] = useState({})
  let [concerts, setConcerts] = useState([])
  let [load, setLoad] = useState(true)
  let [error, setError] = useState('')
  let {navigate} = useNavigation()
  let screenHeight = Dimensions.get('window').height

  useEffect(() => {
    axios.get(`${apiUrl}/artists/${id}`)
       .then(res => {
          setArtist(res.data.data)
          setLoad(false)
       })
       .catch(err => {
          setLoad(false)
          err.response ?
             setError(err.response.data.message) :
             setError(err.message)
       })

    axios.get(`${apiUrl}/concerts?artistId=${id}`)
       .then(res => setConcerts(res.data.response))
 }, [id])

  return (
    <ScrollView>
    {load ?
    <ActivityIndicator style={{marginTop:25}} animating={true} /> :
    artist.name ?
    <>
    <ImageBackground source={{uri: artist.photo}} resizeMode='cover' imageStyle={{opacity: .5}} style={{height: screenHeight}}>
          <Text style={{textAlign:'center', fontFamily: 'monospace', fontSize: 40, marginTop: 30}}>{artist.name}</Text>
          <View style={{marginTop: 150, marginStart:10}}>
            <Text style={{fontSize: 25, color: 'gold', fontWeight: '800'}}>Upcoming concerts</Text>
            {
              concerts.length > 0 ?
              concerts.map(el => 
                <Pressable key={el._id} onPress={() => navigate("Concert", {id: el._id})}>
                  <Text style={{fontSize: 18, fontWeight: '600'}}>+{el.name}</Text>
                </Pressable>
                ) :
              <Text>Not concerts yet</Text>
            }
          </View>
      </ImageBackground>
      <View style={{padding: 5}}>
        <Text style={{fontSize: 17, marginBottom: 5}}>{artist.description}</Text>
        <Text style={{textAlign: 'center'}}>Genre: {artist.genre.join(', ')}</Text>
      </View>
    </> :
    <Text>{error}</Text>}
    </ScrollView>
  )
}
import { FlatList, StyleSheet, View } from "react-native";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import concertsActions from "../redux/actions/concertsActions";
import ConcertCard from "../components/ConcertCard";
import { ActivityIndicator, Searchbar, Title } from "react-native-paper";
import { t } from "i18next";

export default function Concerts({ navigation }) {
  const dispatch = useDispatch();
  const { getInitialData, getQuery } = concertsActions;
  const { concerts, loading, message } = useSelector(store => store.concerts);

  useEffect(() => {
      dispatch(getInitialData());
  }, []);

  const onSearch = text => {
    let query = { params: { name: text } };
    dispatch(getQuery({ query }));
  };

  return (
    loading ? <ActivityIndicator animating={true} style={styles.message} />  :
    <FlatList
      data={concerts}
      keyExtractor={item => item._id}
      renderItem={({ item }) => <ConcertCard item={item} navigation={navigation} />}
      ItemSeparatorComponent={<View style={{margin: 20}}></View>}
      ListHeaderComponent={<View>
        <Searchbar placeholder={t('search_c')} onChangeText={onSearch}/>
      </View>}
      ListEmptyComponent={<Title style={styles.message}>{message}</Title> }
    />
  );
}

const styles = StyleSheet.create({
  message: {
    textAlign: 'center',
    marginTop: 20
  }
})
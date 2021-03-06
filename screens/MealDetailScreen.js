import React, { useState, Fragment, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  FlatList,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  TouchableHighlight,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import DefaultText from '../components/DefaultText';

import GradientButton from 'react-native-gradient-buttons';
import Carousel from '../components/Carousel';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { IoniconCustomHeaderButton } from '../components/HeaderButton';
import { toggleFavorite, deleteMeal } from '../store/actions/meals';

import BackButton from '../components/BackButton';

const { width: viewportWidth } = Dimensions.get('window');

const ListItem = (props) => {
  return (
    <View style={styles.listItem}>
      <DefaultText style={styles.textContent}>{props.children}</DefaultText>
    </View>
  );
};

const MealDetailScreen = (props) => {
  const [mealImages, setMealImages] = useState(
    props.navigation.getParam('item') &&
      props.navigation.getParam('item').imgUrl
  );

  const [showDetails, setShowDetails] = useState(false);
  const availableMeals = useSelector((state) => state.meals.meals);
  const mealId = props.navigation.getParam('item').id;
  const currentMeal = availableMeals.find((meal) => meal.id == mealId);
  const currentMealIsFavorite = currentMeal && currentMeal.isFavorite;
  const dispatch = useDispatch();

  const deleteMealHandler = useCallback(() => {
    console.log('deleteMealHandler has dispatched');
    dispatch(deleteMeal(mealId, props));
  }, [dispatch]);

  const toggleFavoriteHandler = useCallback(() => {
    dispatch(toggleFavorite(mealId));
  }, [dispatch, mealId, toggleFavorite]);

  useEffect(() => {
    props.navigation.setParams({ toggleFav: toggleFavoriteHandler });
    props.navigation.setParams({ isFav: currentMealIsFavorite });
    props.navigation.setParams({ deleteMealHandler: deleteMealHandler });

    // return () => {
    //   props.navigation.de;
    // };
  }, [toggleFavoriteHandler, currentMealIsFavorite, deleteMealHandler]);

  const renderImage = ({ item }) => (
    <TouchableHighlight>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: item }} />
      </View>
    </TouchableHighlight>
  );

  const { navigation } = props;
  const item = navigation.getParam('item');
  const category = navigation.getParam('categoryId');
  const categoryName = navigation.getParam('categoryName');

  return (
    <ScrollView style={styles.container}>
      <StatusBar />

      <View style={styles.carouselContainer}>
        <View style={styles.carousel}>
          <Carousel data={mealImages} />
        </View>
      </View>
      <View style={styles.infoRecipeContainer}>
        <Text style={styles.infoRecipeName}>{item.title}</Text>
        <View style={styles.infoContainer}>
          <TouchableHighlight>
            <Text style={styles.category}>{categoryName}</Text>
          </TouchableHighlight>
        </View>

        <View style={styles.infoContainer}>
          <Image
            style={styles.infoPhoto}
            source={require('../assets/time.png')}
          />
          <Text style={styles.infoRecipe}>{item.duration} minutes </Text>
        </View>
        <GradientButton
          text={showDetails ? 'Hide details' : 'Show details'}
          width='90%'
          height={60}
          blueViolet
          impact
          style={styles.expendButton}
          onPressAction={() => setShowDetails((prev) => !prev)}
        />

        {showDetails ? (
          <Fragment>
            <View style={styles.infoContainer}>
              <Text style={styles.infoDescriptionRecipe}>
                {item.description}
              </Text>
            </View>
            <Text style={styles.title}>Ingredients</Text>
            {item.ingredients.map((ingredient) => (
              <View style={styles.ingredient} key={ingredient}>
                <Ionicons
                  name='md-checkmark'
                  size={24}
                  color={Colors.primaryColor}
                />
                <ListItem>{ingredient}</ListItem>
              </View>
            ))}
            <Text style={styles.title}>Steps</Text>
            {item.steps.map((step, index) => (
              <View style={styles.step} key={step}>
                <View style={index + 1 < 10 ? styles.circle : styles.bigCircle}>
                  <Text style={styles.number}>{index + 1}</Text>
                </View>
                <ListItem>{step}</ListItem>
              </View>
            ))}
          </Fragment>
        ) : null}
      </View>
    </ScrollView>
  );
};

MealDetailScreen.navigationOptions = (navigationData) => {
  const mealTitle = navigationData.navigation.getParam('mealTitle');
  const toggleFavorite = navigationData.navigation.getParam('toggleFav');
  const isFavorite = navigationData.navigation.getParam('isFav');
  const deleteMealHandler = navigationData.navigation.getParam(
    'deleteMealHandler'
  );
  const { navigation } = navigationData;

  return {
    headerTitle: '',
    // headerShown: false,
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={IoniconCustomHeaderButton}>
        <Item
          title='Favorite'
          iconName={isFavorite ? 'ios-star' : 'ios-star-outline'}
          onPress={toggleFavorite}
        />
        <Item title='Favorite2' iconName={'ios-create'} onPress={() => {}} />
        <Item
          title='Favorite2'
          iconName={'ios-trash'}
          onPress={() => {
            Alert.alert(
              'Attention!',
              'This action can not be undone, are you sure you want to delete this recipe?',
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: 'OK',
                  onPress: () => deleteMealHandler(),
                  style: 'destructive',
                },
              ]
            );
          }}
        />
      </HeaderButtons>
    ),
    headerLeft: () => (
      <BackButton
        onPress={() => {
          navigation.goBack();
        }}
      />
    ),
    headerTransparent: 'true',
  };
};

export default MealDetailScreen;

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  expendButton: {
    marginVertical: 20,
  },
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  carouselContainer: {
    minHeight: 250,
  },
  carousel: {},

  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: 250,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    width: viewportWidth,
    height: 250,
  },
  paginationContainer: {
    flex: 1,
    position: 'absolute',
    alignSelf: 'center',
    paddingVertical: 8,
    marginTop: 200,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 0,
  },
  infoRecipeContainer: {
    flex: 1,
    margin: 25,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  infoPhoto: {
    height: 20,
    width: 20,
    marginRight: 0,
  },
  infoRecipe: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  category: {
    fontSize: 14,
    fontWeight: 'bold',
    margin: 10,
    color: '#2cd18a',
  },
  infoDescriptionRecipe: {
    textAlign: 'left',
    fontSize: 16,
    marginTop: 30,
    margin: 15,
  },
  infoRecipeName: {
    fontSize: 28,
    margin: 10,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  screen: {},
  image: {
    width: '100%',
    height: 200,
  },
  details: {
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'space-around',
  },
  title: {
    fontFamily: 'open-sans-bold',
    fontSize: 22,
    textAlign: 'center',
    marginTop: 20,
  },
  listItem: {
    marginVertical: 10,
    marginHorizontal: 20,
    flexGrow: 1,
    flex: 1,
  },
  step: {
    flexDirection: 'row',
    borderColor: '#ccc',
    borderBottomWidth: 1,
    alignItems: 'center',
    paddingVertical: 15,
  },
  ingredient: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    alignItems: 'center',
    paddingLeft: 10,
  },
  circle: {
    marginLeft: 10,
    padding: 10,
    height: 30,
    width: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: Colors.primaryColor,
    marginVertical: 10,
    alignContent: 'center',
    justifyContent: 'center',
  },
  bigCircle: {
    marginLeft: 10,
    paddingLeft: 4.5,
    height: 30,
    width: 30,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: Colors.primaryColor,
    marginVertical: 10,
    alignContent: 'center',
    justifyContent: 'center',
  },
  number: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'open-sans-bold',
  },
  textContent: {
    fontSize: 16,
  },
});

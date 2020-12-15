import React,{useState,useEffect,useRef} from 'react';
import { StyleSheet, Text, View, Animated,Dimensions } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import Constants from 'expo-constants';

export default function App() {
  const [items, setItems] = useState([]);

  const rowTranslateAnimatedValues = {};

  Array(20)
    .fill('')
    .forEach((_, i) => {
        rowTranslateAnimatedValues[`${i}`] = new Animated.Value(1);
  });  

  const animationIsRunning = useRef(false);

  useEffect(() => {
    const testArray = Array(20)
      .fill('')
      .map((_,i) => ({ key: `${i}`, text: `test ${i}`}));
    setItems(testArray);
  },[])

  
  const onSwipeValueChanged = swipeData => {
    const { key, value } = swipeData;

    if (
      value < -Dimensions.get('window').width &&
      !animationIsRunning.current
    ) {
      animationIsRunning.current = true;
      Animated.timing(rowTranslateAnimatedValues[key], {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
      }).start(() => {
        const newItems = [...items];
        const deletedItem = items.findIndex(item => item.key == swipeData.key);
        newItems.splice(deletedItem,1);
        setItems(newItems);
          animationIsRunning.current = false;
      });
    }
  }

  return (
    <View style={styles.container}>
      <SwipeListView
        data={items}
        renderItem={ (data) => (
            <Animated.View          
              style={[
                styles.rowFrontContainer,
                {
                  height: rowTranslateAnimatedValues[
                    data.item.key
                  ].interpolate({
                    inputRange: [0,1],
                    outputRange: [0,50],
                  }),
                }
              ]}
              >
              <View style={styles.rowFront}>
                  <Text>{data.item.text}</Text>
              </View>
            </Animated.View>  
        )}
        renderHiddenItem={ (data) => (
            <View style={styles.rowBack}></View>
        )}
        disableRightSwipe
        rightOpenValue={-Dimensions.get('window').width}
        onSwipeValueChange={onSwipeValueChanged}
        useNativeDriver={false}
      />
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop:  Constants.statusBarHeight,
    flex: 1,
    backgroundColor: '#fff',
  },
  rowFront: {
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderBottomColor: '#c0c0c0',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 50,
    width: '100%',
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#ff0000',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
});
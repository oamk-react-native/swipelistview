import React,{useState, useEffect,useRef} from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import Constants from 'expo-constants';

export default function App() {
  /* State variable for list items (array). */
  const [items, setItems] = useState([]);

  // Create and populate array with animation for each row.
  const rowTranslateAnimatedValues = {};
  Array(20)
    .fill('')
    .forEach((_,i)=> {
      rowTranslateAnimatedValues[`${i}`] = new Animated.Value(1);
    })

  // Declare variable (true/false) in animation is running. This variable can be used within this component,
  // so useRef is used in declaration.   
  const animationIsRunning = useRef(false);  

  /* Fill state variable with some testa data when component is mounted. */
  useEffect(() => {
    const testArray = Array(20)
      .fill('')
      .map((_,i) => ({ key: `${i}`, text: `test ${i}`}));
    setItems(testArray);
  },[])


  const onSwipeValueChange = swipeData => {
    const {key,value} = swipeData;

    // Define and start animation, if row is swiped and animation is not running (possible previous
    // deletion is finished).
    if (value < -Dimensions.get('window').width && !animationIsRunning.current) {
      animationIsRunning.current = true; // Other rows cannot be deleted.
      // Define, how animation is executed. Value goes from 1 (initial value declared earlier) to 0.
      // Duration is 300 ms.
      Animated.timing(rowTranslateAnimatedValues[key],{
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => { // Run animation and delete row.
        const newItems = [...items];
        const deletedItem = items.findIndex(item => item.key == swipeData.key);
        newItems.splice(deletedItem,1);
        setItems(newItems);
        animationIsRunning.current = false; // Other rows can be deleted.
      })
    }
  }

  return (
    <View style={styles.container}>
      <SwipeListView 
        data={items} /* Data source for the list is state variable array. */
        renderItem={(data) => ( /* Define, how to render each row. */
          <Animated.View /* Animated is required for animating row deletion.  */
            style={[
              styles.rowFrontContainer,
              {
                height: rowTranslateAnimatedValues[data.item.key]
                .interpolate({
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
        renderHiddenItem={(data) => ( /* Define, how to render, if row is swiped. */
          <View style={styles.rowBack}></View>
        )}
        disableRightSwipe /* Swiping can be done only fro left to right. */
        rightOpenValue={-Dimensions.get('window').width} /* Define, how "much" user needs to swipe in order to launch row deletion. */
        onSwipeValueChange={onSwipeValueChange} /* Call function if row is swiped. */
        useNativeDriver={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    flex: 1,
    backgroundColor: '#fff',
  },
  rowFront: {
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderBottomColor: '#c0c00c',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 50,
    width: '100%'
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#ff0000',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15
  }
});

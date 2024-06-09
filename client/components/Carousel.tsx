import React, { useState, useEffect, useRef } from "react";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import axios from "axios";

const StatesCarousel = () => {
  const [states, setStates] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string>();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const carouselRef = useRef<any>(null);

  useEffect(() => {
    axios
      .get("http://localhost:3232/")
      .then((response) => setStates(response.data.data))
      .catch((error) => console.error("Error fetching states: ", error));
  }, []);

  const onViewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  };

  const handleNext = () => {
    const nextIndex = activeIndex + 1;
    if (nextIndex < states.length) {
      setActiveIndex(nextIndex);
      carouselRef.current.scrollToIndex({ index: nextIndex });
    }
  };

  const handlePrev = () => {
    const prevIndex = activeIndex - 1;
    if (prevIndex >= 0) {
      setActiveIndex(prevIndex);
      carouselRef.current.scrollToIndex({ index: prevIndex });
    }
  };

  const renderItem = ({ item }: any) => (
    <Pressable
      style={[
        styles.carouselItem,
        selectedState === item && styles.selectedItem,
      ]}
      onPress={() => setSelectedState(item)}
    >
      <Text>{item}</Text>
    </Pressable>
  );

  const progressBar = () => (
    <View style={styles.progressBar}>
      <Pressable onPress={handlePrev}>
        <View style={styles.arrowLeft} />
      </Pressable>
      {states.map(
        (_, index) =>
          index < 7 && (
            <View
              key={index}
              style={[
                styles.dot,
                Math.round(activeIndex / 8) === index && styles.activeDot,
              ]}
            />
          )
      )}
      <Pressable onPress={handleNext}>
        <View style={styles.arrowRight} />
      </Pressable>
    </View>
  );

  const config = {
    viewAreaCoveragePercentThreshold: 50,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Savings carousel test</Text>
      <FlatList
        data={states}
        ref={carouselRef}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.carousel}
        viewabilityConfig={config}
        onViewableItemsChanged={onViewableItemsChanged}
      />
      {progressBar()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingTop: 50,
  },
  header: {
    padding: 20,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "Arial",
  },
  carousel: {
    paddingLeft: 10,
    height: 125,
  },
  carouselItem: {
    backgroundColor: "#fff",
    width: 120,
    height: 75,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
  },
  selectedItem: {
    backgroundColor: "#EBEBE9",
  },
  progressBar: {
    flexDirection: "row",
    alignSelf: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    marginHorizontal: 7,
    backgroundColor: "#ccc",
  },
  activeDot: {
    backgroundColor: "#000",
  },
  arrowLeft: {
    width: 8,
    height: 8,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    transform: [{ rotate: "135deg" }],
  },
  arrowRight: {
    width: 8,
    height: 8,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    transform: [{ rotate: "-45deg" }],
  },
});

export default StatesCarousel;

import React, { useState, useEffect } from 'react';
import { Box, Image, SimpleGrid, Center, Button, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import * as tf from '@tensorflow/tfjs';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [model, setModel] = useState(null);
  const [allImages, setAllImages] = useState([
    'test_images/test_image_0.png',
    'test_images/test_image_1.png',
    'test_images/test_image_2.png',
    'test_images/test_image_3.png',
    'test_images/test_image_4.png',
      'test_images/test_image_5.png',
    'test_images/test_image_6.png',
    'test_images/test_image_7.png',
    'test_images/test_image_8.png',
    'test_images/test_image_9.png',
       'test_images/test_image_10.png',
    'test_images/test_image_11.png',
    'test_images/test_image_12.png',
    'test_images/test_image_13.png',
    'test_images/test_image_14.png',
      'test_images/test_image_15.png',
    'test_images/test_image_16.png',
    'test_images/test_image_17.png',
    'test_images/test_image_18.png',
    'test_images/test_image_19.png','test_images/test_image_20.png',
    'test_images/test_image_21.png',
    'test_images/test_image_22.png',
    'test_images/test_image_23.png',
    'test_images/test_image_24.png',
      'test_images/test_image_25.png',
    'test_images/test_image_26.png',
    'test_images/test_image_27.png',
    'test_images/test_image_28.png',
    'test_images/test_image_29.png',
      'test_images/test_image_30.png',
    'test_images/test_image_31.png',
    'test_images/test_image_32.png',
    'test_images/test_image_33.png',
    'test_images/test_image_34.png',
      'test_images/test_image_35.png',
    'test_images/test_image_36.png',
    'test_images/test_image_37.png',
    'test_images/test_image_38.png',
    'test_images/test_image_39.png',
 ]);
  const [displayedImages, setDisplayedImages] = useState([]);

  useEffect(() => {
    handleShuffle();
    async function loadModel() {
      const loadedModel = await tf.loadLayersModel("/model/model.json");
      setModel(loadedModel);
      console.log("Model loaded");
    }
    loadModel();
  }, []);

  const handleImageClick = (image) => {
    console.log(`Image clicked: ${image}`);
    setSelectedImage(image);
  };

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const handleShuffle = () => {
    const shuffled = shuffleArray([...allImages]);
    setDisplayedImages(shuffled.slice(0, 5));
  };

const handlePredict = async () => {
    console.log("Predict button clicked");

    if (!selectedImage || !model) {
      console.log("Missing image or model");
      return;
    }

    const imgElement = document.createElement('img');
    imgElement.src = `/model/${selectedImage}`;
    console.log("Image element created");

    await new Promise((resolve) => {
      imgElement.onload = resolve;
    });
    console.log("Image loaded");

    // Preprocess the image
    const tensor = tf.browser.fromPixels(imgElement)
    .resizeNearestNeighbor([28, 28])
    .mean(2)  // Convert to grayscale by averaging RGB channels
    .toFloat()
    .expandDims();

    // Log the preprocessed image data to console
    console.log("Preprocessed Image Data:", tensor.arraySync());

    const prediction = model.predict(tensor);
    const predictionArray = Array.from(prediction.dataSync());

    console.log("Predictions:", predictionArray);
    setPredictions(predictionArray);


};

  const topPredictions = predictions
    .map((value, index) => ({ value, index }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 1);

  return (
    <Center h="100vh">
      <Box>
        <SimpleGrid columns={5} spacing={10}>
          {displayedImages.map((img, index) => (
            <Box key={index} boxSize="100px">
              <Image
                src={`/model/${img}`}
                alt={`Option ${index + 1}`}
                onClick={() => handleImageClick(img)}
                cursor="pointer"
              />
            </Box>
          ))}
        </SimpleGrid>
        <Center>
          <Box mt={5}>
            {selectedImage && (
              <Image
                src={`/model/${selectedImage}`}
                alt="Selected Option"
                boxSize="200px"
                objectFit="contain"
              />
            )}
          </Box>
        </Center>
        <Box mt={5}>
          <Button onClick={handlePredict}>
            Predict
          </Button>
          <Button mt={5} onClick={handleShuffle}>
            Shuffle Images
          </Button>
        </Box>
        <Box mt={5}>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Prediction</Th>
                <Th>Confidence</Th>
              </Tr>
            </Thead>
            <Tbody>
              {topPredictions.map(pred => (
                <Tr key={pred.index}>
                  <Td>Prediction {pred.index}</Td>
                  <Td>{pred.value.toFixed(2)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </Center>
  );
}

export default App;
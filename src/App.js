import React, { useState, useEffect } from 'react';
import {useBreakpointValue, VStack, StackDivider, Heading, Box, Image, SimpleGrid, Center, Button, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
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
        'test_images/test_image_19.png', 'test_images/test_image_20.png',
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
    // Define the number of grid columns based on viewport width
    const gridColumns = useBreakpointValue({ base: 3, sm: 4, md: 5, lg: 5 });


    // Define the image box size based on viewport width
        const imageSize = useBreakpointValue({ base: '50px', sm: '70px', md: '75px', lg: '80px' });


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
        setDisplayedImages(shuffled.slice(0, 10));
    };

    const handlePredict = async () => {
        console.log("Predict button clicked");

        if (!selectedImage || !model) {
            console.log("Missing image or model");
            return;
        }

        const imgElement = document.createElement('img');
        imgElement.src = `${process.env.PUBLIC_URL}/${selectedImage}`;
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

 return (<center>
    <VStack
        divider={<StackDivider borderColor='gray.200' />}
        spacing={4}
        align='center'
        p={5}  // padding for overall alignment
        bg="gray.50"  // light gray background
        w="100vw"
        h="100vh"
    >
        <Box
            bg="teal.500"
            p={3}
            color="white"
            borderRadius="md"
            w="full"
        >
            <Center>
                <Heading as="h1">Simple CNN for Handwriting Prediction</Heading>
            </Center>
        </Box>

             <Center w="full">
                    <SimpleGrid columns={gridColumns} spacing={10}>
                        {displayedImages.map((img, index) => (
                            <Box key={index} boxSize={imageSize}>
                                <Image
                                    src={`${process.env.PUBLIC_URL}/${img}`}
                                    alt={`Option ${index + 1}`}
                                    onClick={() => handleImageClick(img)}
                                    cursor="pointer"
                                    borderRadius={'15px'}
                                    boxSize={imageSize}
                                    objectFit="cover"
                                />
                            </Box>
                        ))}
                    </SimpleGrid>
                </Center>

        <Center>
            <Button colorScheme="teal" onClick={handleShuffle}>
                Shuffle Images
            </Button>
        </Center>

           <Center mt={5}>
                    <Box>
                        {selectedImage ? (
                            <Image
                                src={`${process.env.PUBLIC_URL}/${selectedImage}`}
                                alt="Selected Option"
                                boxSize="75px"
                                objectFit="contain"
                                borderRadius={'15px'}
                            />
                        ) : (
                            <Image
                                src={`${process.env.PUBLIC_URL}/download.png`}
                                alt="Placeholder"
                                boxSize="73px"
                                borderRadius={'15px'}
                            />
                        )}
                    </Box>
                </Center>

        <Center>
            <Button colorScheme="teal" onClick={handlePredict}>
                Predict
            </Button>
        </Center>

       <Center w="full">
    <Table variant="simple" maxW={'40%'}>
        <Thead bg="teal.500">
            <Tr>
                <Th
                    color="white"
                    borderTopLeftRadius="5px"
                    borderBottomLeftRadius="5px"
                    textAlign="center"

                >
                    Prediction
                </Th>
                <Th
                    color="white"
                    borderTopRightRadius="10px"
                    borderBottomRightRadius="10px"
                    textAlign="center"
                >
                    Confidence
                </Th>
            </Tr>
        </Thead>
        <Tbody>
            {topPredictions.map(pred => (
                <Tr key={pred.index}>
                    <Td fontWeight="bold" fontSize="35px"
                        textAlign="center">{pred.index}</Td>
                    <Td fontWeight="bold" fontSize="35px"
                        textAlign="center">{pred.value.toFixed(2)}</Td>
                </Tr>
            ))}
        </Tbody>
    </Table>
</Center>
    </VStack>
     </center>
);

}
export default App;
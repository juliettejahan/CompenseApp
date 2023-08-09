import RNFS from 'react-native-fs';
import { sendRequestImage } from '../common/sendRequest';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Image } from 'react-native';
import { baseUrl } from '../common/const';

const styles = StyleSheet.create({
  mainContainer: {
    flexGrow: 1,
  },
  cardContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    marginBottom: 8,
  },
  bottomButton: {
    flexShrink: 0,
    flexBasis: 100,
  }, title: {

    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    paddingVertical: 8,
    borderWidth: 4,
    borderColor: '#20232a',
    borderRadius: 6,
    backgroundColor: '#61dafb',
    color: '#20232a',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
  }, profilePicture: {
    width: 90,
    height: 90,
    alignItems: 'center',
  },

  logo: {
    width: 65,
    height: 65,
  }, Row: {
    flexDirection: 'row',
    backgroundColor: '#828282',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  }, container: {
    flex: 1,
    padding: 20,
  }, textStyle: {
    padding: 10,
    color: 'black',
  },
  buttonStyle: {
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 5,
    width: 100,
    height: 100,
  }, imageStyle: {
    width: 200,
    height: 200,
    margin: 5,
  },

});


export function SendpicView({ files, setFiles, authToken, fileName, setFileName }) {
  const [hasPermissionError, setPermissionError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const options = {
    title: "Select Avatar",
    customButtons: [{ name: "fb", title: "Choose Photo from Facebook" }],
    storageOptions: {
      skipBackup: true,
      path: "images",
      saveToPhoto: true,
    }
  };

  const useCamera = () => {
    launchCamera(options, response => {

      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {

        console.debug(response.assets[0].uri)
        console.debug("String(response.assets[0].uri):", String(response.assets[0].uri));
        setFiles(response.assets[0].uri);
        const path = response.assets[0].uri.replace("file://", "");
        var imageName = response.assets[0].fileName;
        setFileName(imageName);
        console.debug("path:", path);
        {
          setIsLoading(true);

          (RNFS.readFile(path, "base64")).then((reader) => {
            sendRequestImage('/image', 'POST', { token: authToken }, (status, data) => {
              setIsLoading(false);
              if (status == 201) {
                setPermissionError(false);
              } else if (status == 403) {
                setPermissionError(true);
              }
            }, () => { setIsLoading(false); }, imageName, reader);
          })
        }
      }
    });
  }

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={styles.buttonStyle}
      onPress={() => { useCamera() }}>
      <Image
        style={styles.profilePicture}
        source={{ uri: baseUrl + '/static/images/baseline_add_a_photo_black_24dp.png' }}
      />
    </TouchableOpacity>

  );
}


export function SendpicViewRegister({ setFiles, setFileName }) {
  const [hasPermissionError, setPermissionError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const options = {
    title: "Select Avatar",
    customButtons: [{ name: "fb", title: "Choose Photo from Facebook" }],
    storageOptions: {
      skipBackup: true,
      path: "images",
      saveToPhoto: true,
    }
  };

  const useCamera = () => {
    launchCamera(options, response => {

      console.log("Response = ", response);
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {

        console.debug(response.assets[0].uri)
        console.debug("String(response.assets[0].uri):", String(response.assets[0].uri));
        setFiles(response.assets[0].uri);
        const path = response.assets[0].uri.replace("file://", "");
        var imageName = response.assets[0].fileName;
        setFileName(imageName);
        console.debug("path:", path);
        {
          setIsLoading(true);

          (RNFS.readFile(path, "base64")).then((reader) => {
            sendRequestImage('/imageRegister', 'POST', null, (status, data) => {
              setIsLoading(false);
              if (status == 201) {
                console.log(status);
                setPermissionError(false);
              } else if (status == 403) {
                setPermissionError(true);
              }
            }, () => { setIsLoading(false); }, imageName, reader);
          })
        }
      }
    });
  }

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={styles.buttonStyle}
      onPress={() => { useCamera() }}>
      <Image
        style={styles.profilePicture}
        source={{ uri: baseUrl + '/static/images/baseline_add_a_photo_black_24dp.png' }}
      />


    </TouchableOpacity>

  );
}

getAvatarPhoto = () => {
  // see https://github.com/react-community/react-native-image-picker
  // for full documentation on the Image Picker api

  const options = {
    title: "Select Avatar",
    customButtons: [{ name: "fb", title: "Choose Photo from Facebook" }],
    storageOptions: {
      skipBackup: true,
      path: "images"
    }

  };


  launchCamera(options, response => {
    console.log("Response = ", response);
    const APP_FOLDER_NAME = 'testImageFolder';
    const pictureFolder = `${RNFS.PicturesDirectoryPath}/${APP_FOLDER_NAME}`;
    console.log("RNFS.PicturesDirectoryPath:", RNFS.PicturesDirectoryPath);
    if (response.didCancel) {
      console.log("User cancelled image picker");
    } else if (response.error) {
      console.log("ImagePicker Error: ", response.error);
    } else if (response.customButton) {
      console.log("User tapped custom button: ", response.customButton);
    } else {
      setFileUri(response.assets[0].uri)
      console.debug(response.assets[0].uri)
      const { uri } = fileUri;
      const fileName = new Date().getTime();
      console.log("uri:", uri);
      RNFS.copyFile(response.assets[0].uri, `${pictureFolder}/${fileName}`)
        .then(() => { });
    }

  });
}


export function GetFilePhotoView({ setFiles, authToken, setFileName }) {
  const [hasPermissionError, setPermissionError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // see https://github.com/react-community/react-native-image-picker
  // for full documentation on the Image Picker api

  const options = {
    title: "Select Avatar",
    customButtons: [{ name: "fb", title: "Choose Photo from Facebook" }],
    storageOptions: {
      skipBackup: true,
      path: "images"
    }
  };

  const useImagelib = () => {
    launchImageLibrary(options, response => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {

        setFiles(response.assets[0].uri);
        const path = response.assets[0].uri.replace("file://", "");
        var imageName = response.assets[0].fileName;
        setFileName(imageName);

        {
          setIsLoading(true);

          (RNFS.readFile(path, "base64")).then((reader) => {
            sendRequestImage('/image', 'POST', { token: authToken }, (status, data) => {
              setIsLoading(false);
              if (status == 201) {
                console.log(status);
                setPermissionError(false);
              } else if (status == 403) {
                setPermissionError(true);
              }
            }, () => { setIsLoading(false); }, imageName, reader)
          })
        }
      }
    });
  }

  return (

    <TouchableOpacity
      activeOpacity={0.5}
      style={styles.buttonStyle}
      onPress={() => { useImagelib() }}>
      <Image
        style={styles.profilePicture}
        source={{ uri: baseUrl + '/static/images/baseline_image_black_24dp.png' }}
      />
    </TouchableOpacity>

  );
}


export function GetFilePhotoViewRegister({ setFiles, setFileName }) {
  const [hasPermissionError, setPermissionError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // see https://github.com/react-community/react-native-image-picker
  // for full documentation on the Image Picker api

  const options = {
    title: "Select Avatar",
    customButtons: [{ name: "fb", title: "Choose Photo from Facebook" }],
    storageOptions: {
      skipBackup: true,
      path: "images"
    }
  };

  const useImagelib = () => {
    launchImageLibrary(options, response => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {

        console.debug(response.assets[0].uri)
        console.debug("String(response.assets[0].uri):", String(response.assets[0].uri));
        setFiles(response.assets[0].uri);
        const path = response.assets[0].uri.replace("file://", "");
        var imageName = response.assets[0].fileName;
        setFileName(imageName);
        console.debug("path:", path);

        {
          setIsLoading(true);

          (RNFS.readFile(path, "base64")).then((reader) => {
            sendRequestImage('/imageRegister', 'POST', null, (status, data) => {
              setIsLoading(false);
              if (status == 201) {

                console.log(status);

                setPermissionError(false);
              } else if (status == 403) {
                setPermissionError(true);
              }
            }, () => { setIsLoading(false); }, imageName, reader)
          })
        }
      }
    });
  }

  return (

    <TouchableOpacity
      activeOpacity={0.5}
      style={styles.buttonStyle}
      onPress={() => { useImagelib() }}>
      <Image
        style={styles.profilePicture}
        source={{ uri: baseUrl + '/static/images/baseline_image_black_24dp.png' }}
      />
    </TouchableOpacity>

  );
}


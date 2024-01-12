import {View, Text, Alert, Linking} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';

export default function App() {
  const {hasPermission, requestPermission} = useCameraPermission();
  const device = useCameraDevice('back');
  const [scanned, setScanned] = useState(false);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: codes => {
      if (scanned) return;
      setScanned(true);
      return Alert.alert('Sucesso!', `Você encontrou ${codes.length} código!`, [
        {
          text: 'Abrir',
          onPress: () => {
            Linking.openURL(codes[0].value);
            setScanned(false);
          },
        },
        {
          text: 'Cancelar',
          onPress: () => setScanned(false),
          style: 'cancel',
        },
      ]);
    },
  });
  useEffect(() => {
    requestPermission();
  }, []);

  if (device == null || !hasPermission) {
    return (
      <View>
        <Text>Error or no camera</Text>
      </View>
    );
  }
  return (
    <Camera
      style={{flex: 1}}
      device={device}
      isActive={true}
      codeScanner={codeScanner}
    />
  );
}

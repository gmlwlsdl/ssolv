import { useEffect, useRef, useState } from 'react';

import { LinearGradient } from 'expo-linear-gradient';
import { Animated, Image, StyleSheet } from 'react-native';

type SplashScreenProps = {
  visible: boolean;
};

const SplashScreen = ({ visible }: SplashScreenProps) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    if (!visible) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => setMounted(false));
    }
  }, [visible, fadeAnim]);

  if (!mounted) return null;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={['#FF7E52', '#FF4F14', '#FF7E52']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      <Image
        source={require('../../assets/solv-splash-icon.png')}
        style={styles.logo}
        resizeMode="contain"
        alt="solv 로고"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  logo: {
    width: 219.38,
    height: 78,
  },
});

export default SplashScreen;

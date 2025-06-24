import { MotiView } from 'moti';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import globalStyles from '../../app/styles';
const { width } = Dimensions.get('window');

const LoaderSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <View key={index} style={styles.card}>
          {/* Ligne 1 (ex: image/titre) */}
          <MotiView
            from={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            transition={{
              opacity: {
                type: 'timing',
                duration: 800,
                loop: true,
              },
            }}
            style={[styles.shimmerBlock, { height: 100, marginBottom: 12 }]}
          />

          {/* Ligne 2 (ex: sous-titre) */}
          <MotiView
            from={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            transition={{
              opacity: {
                type: 'timing',
                duration: 800,
                loop: true,
              },
            }}
            style={[styles.shimmerBlock, { height: 20, width: '70%', marginBottom: 8 }]}
          />

          {/* Ligne 3 (ex: description) */}
          <MotiView
            from={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            transition={{
              opacity: {
                type: 'timing',
                duration: 800,
                loop: true,
              },
            }}
            style={[styles.shimmerBlock, { height: 16, width: '90%' }]}
          />
        </View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: globalStyles.backgroundColorPrimary.backgroundColor,
    padding: 20,
    width: width,
    alignSelf: 'center',
  },
  shimmerBlock: {
    backgroundColor: '#333',
    borderRadius: 5,
  },
});

export default LoaderSkeleton;
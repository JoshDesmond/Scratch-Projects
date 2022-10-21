import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, } from 'react-native';
import { Div2Quiz } from './src/components/Div2Quiz';

export default function App() {

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Div2Quiz>
      </Div2Quiz>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});

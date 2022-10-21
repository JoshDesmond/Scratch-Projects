import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';

export default function App() {

  const num = 21;

  return (
    <View style={styles.container}> 
      <View>
        <Text>{num}</Text>
      </View>
      <View style={styles.inputRow}>
        <TextInput style={styles.input}></TextInput>
        <Button title="Input"></Button> 
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  inputRow: {
    margin: 'auto',
    width: '50%',
    flexDirection: 'row',
  }
});

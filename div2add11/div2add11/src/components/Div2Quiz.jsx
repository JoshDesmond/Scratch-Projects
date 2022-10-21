import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import {div2Add11, checkValidity, getRandomYYInput} from '../div2logic';
import { useState } from 'react';

export function Div2Quiz() {

  const [inputNum, setInputNum] = useState(getRandomYYInput);
  const [resultText, setResultText] = useState('');

  const checkAnswer = (e) => {
    
  }

  return (
    <View style={styles.container}> 
      <View style={styles.questionZone}>
        <Text style={styles.promptText}>Input: {inputNum}</Text>
        <View style={styles.inputRow}>
          <TextInput keyboardType='number-pad' style={styles.input}></TextInput>
          <View style={{margin: 3, flex: 2}}>
            <Button title="Enter" onPress={checkAnswer}></Button>
          </View>
        </View>
        <Text style={styles.outputText}>{resultText}</Text>
      </View>
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
    width: '100%',
  },
  questionZone: {
    margin: 20,
    borderWidth: 1,
    borderColor: 'red',
    width: '80%',
  },
  inputRow: {
    flexDirection: 'row',
    margin: 'auto',
    flexDirection: 'row',
  },
  promptText: {
    margin: 3,
    fontSize: 20,
  },
  input: {
    flex: 7,
    height: 40,
    margin: 3,
    borderWidth: 1,
    padding: 10,
  },
  enterButton: {
    flex: 2,
    margin: 3,
  },
  outputText: {
    textAlign: 'center',
  },
});

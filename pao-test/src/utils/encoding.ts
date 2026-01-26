import { PAOData } from '../types';

export function encodeNumber(number: string, paoData: PAOData): string {
  // Ensure 6-digit number with zero padding
  const paddedNumber = number.padStart(6, '0');
  
  // Split into pairs: first 2, middle 2, last 2 digits
  const personNum = paddedNumber.substring(0, 2);
  const actionNum = paddedNumber.substring(2, 4);
  const objectNum = paddedNumber.substring(4, 6);
  
  const person = paoData.get(personNum);
  const action = paoData.get(actionNum);
  const object = paoData.get(objectNum);
  
  if (!person || !action || !object) {
    throw new Error(`Invalid PAO data for number ${number}`);
  }
  
  return `${person.person} ${action.action} ${object.object}`;
}

export function generateRandomNumber(): string {
  const num = Math.floor(Math.random() * 1000000);
  return num.toString().padStart(6, '0');
}

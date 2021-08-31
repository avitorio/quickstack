let LinkingPrefixes: string[];
try {
  let expoLinking = require('expo-linking');
  LinkingPrefixes = [expoLinking.makeUrl('/')];
} catch {
  LinkingPrefixes = ['exp://127.0.0.1:19000/--/']
}
export default LinkingPrefixes;

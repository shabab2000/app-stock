// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Stock from './Stock';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{title:'จัดการสต๊อกสินค้า'}} name="Stock" component={Stock} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

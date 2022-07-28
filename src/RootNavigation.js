import {createNavigationContainerRef} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigate(name, params) {
  console.log(navigationRef);
  if (navigationRef.isReady()) {
    console.log('is getting navigated');
    navigationRef.navigate(name, params);
  }
  console.log('isn"t getting navigated');
}

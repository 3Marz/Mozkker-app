import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useRef, useState } from 'react';
import 'react-native-reanimated';
import { SQLiteProvider } from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Platform, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import "@/i18n"
import { useFonts } from 'expo-font';
import {RobotoSlab_400Regular, RobotoSlab_500Medium, RobotoSlab_900Black, RobotoSlab_700Bold} from "@expo-google-fonts/roboto-slab"

import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: false
	})
})

const loadDB = async () => {
	const dbName = "sunnan.db";
	const dbAsset = require('../assets/sunnan.db');
	const dbUri = Asset.fromModule(dbAsset).uri;
	const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

	const fileInfo = await FileSystem.getInfoAsync(dbFilePath);
	if (!fileInfo.exists) {
		await FileSystem.makeDirectoryAsync(
			`${FileSystem.documentDirectory}SQLite`,
			{intermediates: true}	
		);

		await FileSystem.downloadAsync(dbUri, dbFilePath);
	}
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
	const [dbLoaded, setDBLoaded] = useState(false);
	const [fontLoaded] = useFonts({
		RobotoSlab_900Black, RobotoSlab_500Medium, RobotoSlab_700Bold, RobotoSlab_400Regular
	})

  const [expoPushToken, setExpoPushToken] = useState('');
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>([]);
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined
  );
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));

    if (Platform.OS === 'android') {
      Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []));
    }
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

	useEffect(() => {
		loadDB()
			.then(res =>  setDBLoaded(true))
			.catch(er => console.error(er))
	}, [])

  useEffect(() => {
    if (dbLoaded && fontLoaded) {
      SplashScreen.hideAsync();
    }
  }, [dbLoaded, fontLoaded]);

  if (!dbLoaded || !fontLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
	<>
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
			<React.Suspense>
				<SQLiteProvider databaseName='sunnan.db' useSuspense>
					<Stack>
						<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
						<Stack.Screen name="+not-found" />
					</Stack>
				</SQLiteProvider>
			</React.Suspense>
    </ThemeProvider>
		<StatusBar style='auto'/>
	</>
  );
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    // EAS projectId is used here.
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error('Project ID not found');
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(token);
    } catch (e) {
      token = `${e}`;
    }
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}


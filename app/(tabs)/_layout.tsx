import { Tabs } from "expo-router";
import React from "react";

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { AnimatedTabBarButton } from "@/components/navigation/AnimatedTabBarButton";
import { useTranslation } from "react-i18next";

export default function TabLayout() {
  const colorScheme = useColorScheme();
	const {t} = useTranslation()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].tabBarBackground,
          height: 80,
          borderTopWidth: 2,
          borderTopColor: "#000",
        },
      }}
    >
			<Tabs.Screen
            name="index"
            options={{
              tabBarShowLabel: false,
              tabBarButton: (props) => <AnimatedTabBarButton {...props} name={t('tabs.home')} activeIcon="home" inactiveIcon="home-outline"/>,
            }}
          />
			<Tabs.Screen
            name="sunnan"
            options={{
              tabBarShowLabel: false,
              tabBarButton: (props) => <AnimatedTabBarButton {...props} name={t('tabs.sunnan')} activeIcon="book" inactiveIcon="book-outline"/>,
            }}
          />
			<Tabs.Screen
            name="settings"
            options={{
              tabBarShowLabel: false,
              tabBarButton: (props) => <AnimatedTabBarButton {...props} name={t('tabs.settings')} activeIcon="settings" inactiveIcon="settings-outline"/>,
            }}
          /> 
    </Tabs>
  );
}

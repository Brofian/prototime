import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import React from 'react';
import { Platform } from 'react-native';
import {Colors} from "../styles/Variables";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});


export default class NotificationService {

    static instance = null;

    /**
     * @returns {NotificationService}
     */
    static getInstance() {
        if (NotificationService.instance === null) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }


    constructor() {
        this.expoPushToken = '';
        this.notification = false;
        this.notificationListener   = React.createRef();
        this.responseListener       = React.createRef();

        this.registerForPushNotificationsAsync().then(token => {
            this.expoPushToken =  token;
            //console.log('expo push token: ', token);
        });

        // This listener is fired whenever a notification is received while the app is foregrounded
        this.notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            this.notification = notification;
        });

        // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
        this.responseListener.current = Notifications.addNotificationResponseReceivedListener(this.onPushNotificationInteraction.bind(this));
    }


    onPushNotificationInteraction(response) {
        let request = response.notification.request;
        let data = request.content.data;

        if(data.openPage) {
            console.log('should open page', data.openPage);
        }
    }


    async registerForPushNotificationsAsync() {
        let token;
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
            token = (await Notifications.getExpoPushTokenAsync()).data;
            // console.log(token);
        } else {
            alert('Must use physical device for Push Notifications');
        }

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: Colors.primary+'7C',
            });
        }

        return token;
    }

    /**
     * @param {String} title
     * @param {String} body
     * @param {Object|string|number} data
     * @param {Boolean} isSticky
     * @param {Boolean} allowSwipeClear
     * @param {Function} callback
     * @returns {Promise<void>}
     */
    async schedulePushNotification(title, body, data, isSticky = false, allowSwipeClear = true, callback = null) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: title,
                body: body,
                data: data,
                sticky: isSticky,
                autoDismiss: allowSwipeClear
            },
            trigger: null,
        }).then(callback);
    }

    async removePushNotifications(id = null) {
        if(id) {
            await Notifications.dismissNotificationAsync(id);
        }
        else {
            await Notifications.dismissAllNotificationsAsync();
        }
    }




    render() {
        return null;
    }
}
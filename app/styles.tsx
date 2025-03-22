import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
    // **** COLORS **** //
    // background
    backgroundColorPrimary: {
        backgroundColor: "rgb(1, 4, 15)",
    },
    backgroundColorSecondary: {
        backgroundColor: "rgb(3, 7, 20)",
    },
    // text
    primaryText: {
        color: "rgb(250, 250, 250)",
    },
    secondaryText: {
        color: "rgb(143, 158, 178)",
    },
    // color
    primaryColor: {
        color: "rgb(69, 194, 138)",
    },
    secondaryColor: {
        color: "rgb(100, 250, 126)",
    },
    tertiaryColor: {
        color: "rgb(50, 120, 80)",
    },
    quaternaryColor: {
        color: "rgb(30, 80, 50)",
    },
    quaternaryColorWithOpacity: {
        color: "rgba(30, 80, 50, 0.4)",
    },
    dangerColor: {
        color: "rgb(114, 12, 16)",
    },
    // *** LAYOUT ****
    boxPadding : {
        padding: 10,
    },
    boxBorderRadius : {
        borderRadius : 10,
    },
    boxBorderWidth : {
        borderWidth: 1,
    }
});

export default globalStyles;
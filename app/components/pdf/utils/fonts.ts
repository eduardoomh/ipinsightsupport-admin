import { Font } from "@react-pdf/renderer";

export function registerMontserratFonts() {
  Font.register({
    family: 'Montserrat',
    fonts: [
      {
        src: '/fonts/Montserrat-Regular.ttf',
        fontWeight: 'normal',
      },
      {
        src: '/fonts/Montserrat-Italic.ttf',
        fontStyle: 'italic',
      },
      {
        src: '/fonts/Montserrat-Medium.ttf',
        fontWeight: 500,
      },
      {
        src: '/fonts/Montserrat-SemiBold.ttf',
        fontWeight: 600,
      },
      {
        src: '/fonts/Montserrat-Bold.ttf',
        fontWeight: 'bold',
      },
      {
        src: '/fonts/Montserrat-ExtraBold.ttf',
        fontWeight: 800,
      },
      {
        src: '/fonts/Montserrat-Black.ttf',                 
        fontWeight: 900,
      },
    ],
  });
}
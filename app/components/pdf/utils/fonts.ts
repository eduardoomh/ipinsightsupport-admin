import { Font } from "@react-pdf/renderer";

export function registerMontserratFonts() {
  Font.register({
    family: 'Montserrat',
    fonts: [
      {
        src: 'https://bimaqujlbuunpcprllcv.supabase.co/storage/v1/object/public/ip-insights-support//Montserrat-Regular.ttf',
        fontWeight: 'normal',
      },
      {
        src: 'https://bimaqujlbuunpcprllcv.supabase.co/storage/v1/object/public/ip-insights-support//Montserrat-Italic.ttf',
        fontStyle: 'italic',
      },
      {
        src: 'https://bimaqujlbuunpcprllcv.supabase.co/storage/v1/object/public/ip-insights-support//Montserrat-Medium.ttf',
        fontWeight: 500,
      },
      {
        src: 'https://bimaqujlbuunpcprllcv.supabase.co/storage/v1/object/public/ip-insights-support//Montserrat-SemiBold.ttf',
        fontWeight: 600,
      },
      {
        src: 'https://bimaqujlbuunpcprllcv.supabase.co/storage/v1/object/public/ip-insights-support//Montserrat-Bold.ttf',
        fontWeight: 'bold',
      },
      {
        src: 'https://bimaqujlbuunpcprllcv.supabase.co/storage/v1/object/public/ip-insights-support//Montserrat-ExtraBold.ttf',
        fontWeight: 800,
      },
      {
        src: 'https://bimaqujlbuunpcprllcv.supabase.co/storage/v1/object/public/ip-insights-support//Montserrat-Black.ttf',                 
        fontWeight: 900,
      },
    ],
  })}
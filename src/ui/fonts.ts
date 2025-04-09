import localFont from "next/font/local";

export const cinzel = localFont({
  src: "./fontsFolder/Cinzel/Cinzel-VariableFont_wght.ttf",
  weight: "100 900",
  style: "normal",
  variable: "--font-cinzel",
});

export const ptserif = localFont({
  src: [
    {
      path: "./fontsFolder/PTSerif/PTSerif-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fontsFolder/PTSerif/PTSerif-Bold.ttf",
      weight: "700",
      style: "bold",
    },
  ],
  variable: "--font-ptserif",
});

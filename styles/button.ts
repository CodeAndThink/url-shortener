export const buttonStyles = {
  primary: `
    flex h-12 w-[25vw] items-center justify-center gap-2 rounded-full 
    bg-foreground px-5 text-background transition-colors 
    hover:bg-[#383838] dark:hover:bg-[#ccc] sm:w-[158px]
  `,
  secondary: `
    flex h-12 w-[25vw] items-center justify-center rounded-full 
    border border-solid border-black/[.08] px-5 transition-colors 
    hover:border-transparent hover:bg-black/[.04] 
    dark:border-white/[.145] dark:hover:bg-[#1a1a1a] sm:w-[158px]
  `,
  text: `
    flex h-12 w-[25vw] items-center justify-center gap-2 rounded-full px-5
    text-foreground bg-transparent transition-colors
    hover:bg-black/[.04] dark:hover:bg-white/[.08] sm:w-[158px]
  `,
};

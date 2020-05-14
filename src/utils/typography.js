import Typography from 'typography'
import TypographyTheme from 'typography-theme-wordpress-2016'

TypographyTheme.overrideThemeStyles = () => {
  return {
    'a.gatsby-resp-image-link': {
      boxShadow: `none`,
    },
    li: {
      marginBottom: 0,
    },
  }
}

TypographyTheme.baseFontSize = '18px'
TypographyTheme.headerWeight = 700

const typography = new Typography(TypographyTheme)

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale

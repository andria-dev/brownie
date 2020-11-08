import Typography from 'typography'
import TypographyTheme from 'typography-theme-wordpress-2016'

TypographyTheme.overrideThemeStyles = () => {
	return {
		'a.gatsby-resp-image-link': {
			boxShadow: `none`,
		},
		li: {
			paddingLeft: '10px !important',
			marginBottom: 0,
		},
		h1: {
			fontWeight: 900,
		},
		pre: {
			marginBottom: '1.75rem !important',
		},
		code: {
			lineHeight: '1.25rem !important',
		},
	}
}

TypographyTheme.baseFontSize = '18px'
TypographyTheme.googleFonts = [
	{
		name: 'Montserrat',
		styles: ['700', '900'],
	},
	{
		name: 'Merriweather',
		styles: ['400', '400i', '700', '700i', '900', '900i'],
	},
]

const typography = new Typography(TypographyTheme)

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
	typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale

import Document, {Html, Head, Main, NextScript} from 'next/document'
import {TypographyStyle, GoogleFont} from 'react-typography'
import typography from '../utils/typography'

export default class BlogDocument extends Document {
	render() {
		const shouldRenderScripts =
			this.props.unstable_runtimeJS || process.env.NODE_ENV !== 'production'
		// noinspection HtmlRequiredTitleElement
		return (
			<Html lang="en-US">
				<Head>
					<meta charSet="UTF-8" />

					{/* Favicon info */}
					<link
						rel="apple-touch-icon"
						sizes="180x180"
						href="/favicons/apple-touch-icon.png?V=PYAmmRp8gy"
					/>
					<link
						rel="icon"
						type="image/png"
						sizes="32x32"
						href="/favicons/favicon-32x32.png?V=PYAmmRp8gy"
					/>
					<link
						rel="icon"
						type="image/png"
						sizes="16x16"
						href="/favicons/favicon-16x16.png?V=PYAmmRp8gy"
					/>
					<link rel="manifest" href="/favicons/site.webmanifest?V=PYAmmRp8gy" />
					<link
						rel="mask-icon"
						href="/favicons/safari-pinned-tab.svg?V=PYAmmRp8gy"
						color="#668bfe"
					/>
					<link rel="shortcut icon" href="/favicons/favicon.ico?V=PYAmmRp8gy" />
					<meta name="msapplication-TileColor" content="#ffc40d" />
					<meta name="theme-color" content="#fafafa" />

					{this.props.styleTags}
					<TypographyStyle typography={typography} />
					<GoogleFont typography={typography} />
					<link rel="preload" as="style" href="/fonts/JetBrainsMono/font.css" />
				</Head>
				<body>
					<Main />
					{shouldRenderScripts ? <NextScript /> : null}
				</body>
			</Html>
		)
	}
}

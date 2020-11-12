import Document, {Html, Head, Main, NextScript} from 'next/document'
import {ServerStyleSheet} from 'styled-components'
import flush from 'styled-jsx/server'
import {TypographyStyle, GoogleFont} from 'react-typography'
import typography from '../utils/typography'

export default class BlogDocument extends Document {
	static getInitialProps({renderPage}) {
		// Step 1: Create an instance of ServerStyleSheet
		const sheet = new ServerStyleSheet()

		// Step 2: Retrieve styles from components in the page
		const page = renderPage((App) => (props) =>
			sheet.collectStyles(<App {...props} />),
		)

		// Step 3: Extract the styles as <style> tags
		const styleTags = sheet.getStyleElement()
		const styles = flush()

		// Step 4: Pass styleTags as a prop
		return {...page, styleTags, styles}
	}

	render() {
		// noinspection HtmlRequiredTitleElement
		return (
			<Html lang="en-US">
				<Head>
					<meta charSet="UTF-8" />
					{this.props.styleTags}
					<TypographyStyle typography={typography} />
					<GoogleFont typography={typography} />
				</Head>
				<body>
					<Main />
					{this.props.unstable_runtimeJS ? <NextScript /> : null}
				</body>
			</Html>
		)
	}
}

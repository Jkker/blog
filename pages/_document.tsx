import Document, { Head, Html, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang='en'>
        <Head>
          <link rel='shortcut icon' href='/favicon.ico' />
          <link rel='icon' type='image/ico' sizes='32x32' href='favicon.ico' />

          {/* <link rel='manifest' href='/manifest.json' /> */}
        </Head>

        <body>
          <link
            href='https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&display=swap'
            rel='stylesheet'
          />
          <link
            rel='stylesheet'
            href='https://cdn.jsdelivr.net/npm/katex@0.16.2/dist/katex.min.css'
            integrity='sha384-bYdxxUwYipFNohQlHt0bjN/LCpueqWz13HufFEV1SUatKs1cm4L6fFgCi1jT643X'
            crossOrigin='anonymous'
          />
          <Main />

          <NextScript />
        </body>
      </Html>
    )
  }
}

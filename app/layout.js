import './globals.css'

export const metadata = {
  title: 'Mood Tracker',
  description: 'Track your daily moods',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
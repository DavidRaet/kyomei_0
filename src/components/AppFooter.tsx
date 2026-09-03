interface AppFooterProps {
  source: string
}

export function AppFooter({ source }: AppFooterProps) {
  return (
    <footer className="foot">
      <span>© MMXXVI · Kyomei</span>
      <span className="jp">共鳴 - 響き合う物語の索引</span>
      <span>{source}</span>
    </footer>
  )
}

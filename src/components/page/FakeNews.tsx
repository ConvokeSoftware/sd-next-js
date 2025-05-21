'use client';
const fakeArticles = [
  {
    headline: 'Cardinals Secure Dramatic Win in Overtime',
    date: '2024-04-21',
    summary:
      'The Arizona Cardinals clinched a thrilling victory in overtime, with a last-minute touchdown sealing the game.',
  },
  {
    headline: 'Injury Update: Key Players Return to Practice',
    date: '2024-04-20',
    summary:
      'Several Cardinals starters were seen back on the field, raising hopes for the upcoming matchup.',
  },
  {
    headline: 'Coach Praises Team Chemistry Ahead of Playoffs',
    date: '2024-04-19',
    summary:
      'Head coach emphasized the importance of teamwork and resilience as the team prepares for the postseason.',
  },
];

export function FakeNews() {
  return (
    <div className="h-48 overflow-y-auto space-y-4">
      {fakeArticles.map((article, i) => (
        <div key={i} className="bg-background rounded-lg border p-4">
          <div className="font-bold text-lg mb-1">{article.headline}</div>
          <div className="text-xs text-muted-foreground mb-2">{article.date}</div>
          <div className="text-sm text-gray-700">{article.summary}</div>
        </div>
      ))}
    </div>
  );
}

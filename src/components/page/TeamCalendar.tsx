'use client';
const fakeGames = [
  { date: '2024-04-25', opponent: 'San Francisco 49ers', home: true },
  { date: '2024-05-02', opponent: 'Seattle Seahawks', home: false },
  { date: '2024-05-09', opponent: 'Los Angeles Rams', home: true },
  { date: '2024-05-16', opponent: 'Green Bay Packers', home: false },
];

export function TeamCalendar() {
  return (
    <div className="bg-background rounded-lg border p-4 h-48 overflow-y-auto">
      <div className="font-bold text-lg mb-2">Upcoming Games</div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-muted-foreground">
            <th className="py-1">Date</th>
            <th className="py-1">Opponent</th>
            <th className="py-1">Venue</th>
          </tr>
        </thead>
        <tbody>
          {fakeGames.map((game, i) => (
            <tr key={i} className="border-t">
              <td className="py-1">{game.date}</td>
              <td className="py-1">{game.opponent}</td>
              <td className="py-1">{game.home ? 'Home' : 'Away'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

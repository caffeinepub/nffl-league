# NFFL League - National Flag Football League

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Homepage with NFFL League branding and hero section
- Teams page listing league teams with basic info
- Schedule/Games page showing upcoming and past games
- Standings page with team rankings and stats
- News/Announcements section
- About/League info page

### Modify
N/A

### Remove
N/A

## Implementation Plan

### Backend
- Data types: Team, Game, Standing, NewsPost
- Store teams with name, city, logo color, wins, losses
- Store games with home/away teams, date, score (optional), status (upcoming/completed)
- Store standings computed from game results
- Store news posts with title, content, date
- Public query functions: getTeams, getGames, getStandings, getNewsPosts
- Admin update functions: addTeam, addGame, updateGameScore, addNewsPost
- Seed sample data for teams, games, standings, and news

### Frontend
- Navigation bar with NFFL League logo and links
- Hero section on homepage with league tagline and call-to-action
- Teams grid showing all league teams
- Schedule table with upcoming and past games
- Standings table with win/loss records, points
- News feed with recent announcements
- Responsive layout for mobile and desktop

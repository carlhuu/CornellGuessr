# What if there was GeoGuessr but only for Cornell?

CornellGuessr is a location-guessing game inspired by GeoGuessr, but exclusively featuring locations from Cornell University. Players are shown photos of various campus spots and must pinpoint their exact location on an interactive map. The closer your guess, the higher your score! Go to [cornellguessr.vercel.app](https://cornellguessr.vercel.app) and signup with your Google account to play!

# Features
- 5-Round Challenge System - Each game consists of 5 carefully curated photos of Cornell campus locations
- Interactive Map Interface - Users can click anywhere on the Cornell campus map to place your guess
- Real-Time Feedback - After guessing, users instantly see distance from the actual location, round score, and cumulative total
- Google OAuth Login - Secure authentication through Firebase with one-click sign-in
- Personal Profile Dashboard - Users can track performance over time with comprehensive statistics, including total games played, all-time high score, and average score across all games.
- Persistent Data Storage - All user stats saved to Firebase Firestore database

# Technical Stuff

Tech Stack: React TypeScript, Node.js, Express.js, Firebase (authentication, database), Google Maps API

Frontend hosted on Vercel, Backend hosted on Render. Made by [Carl Hu](https://github.com/carlhuu) and [Gordon Mei](https://github.com/gordonm0253).

# pulselive pulseball app

### Exposed functions for the PULSEBALL Ranking simulator:

#### init(rankings)
Initializes the rankings values for the simulator. 
Also if there's a previous ranking in localStorage it 
gets loaded to avoid showing an empty table

#### addMatch(match)
Makes required calculations and updates rankings reflecting match results

#### getRankings
Shows via `console` the rankings array

This project was generated with yeoman's webapp generator but ran into a few 
issues with node version and ES6's plugin
/* Defines the basic database */
CREATE TABLE Quotes(quote TEXT, author TEXT, year INTEGER);
INSERT INTO Quotes VALUES('Life is short', 'Unknown', 1902);
INSERT INTO Quotes VALUES ('Be the change that you wish to see in the world.', 'Unknown', 1831);
INSERT INTO Quotes VALUES ('Without music, life would be a mistake.', 'Nietzsche', 1888);
SELECT * FROM Quotes

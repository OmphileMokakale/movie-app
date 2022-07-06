create table movie_user(
	id serial not null primary key,
    firstname text,
    lastname text,
	username text,
	password text
);

CREATE TABLE User_Playlist (
    user_id INTEGER REFERENCES movie_user (id) ON DELETE CASCADE ON UPDATE CASCADE,
    movie_id int,
	movie_name text,
	moviePosterUrl text
);

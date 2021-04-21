CREATE DATABASE chessapp;

CREATE TABLE usuario (
  id SERIAL NOT NULL,
  nome VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(50) NOT NULL UNIQUE,
  data_criacao TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  senha TEXT NOT NULL,
  PRIMARY KEY(id) 
);

CREATE TABLE partida (
  id SERIAL NOT NULL,
  finalizada BOOLEAN NOT NULL DEFAULT false,
  data_criacao TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  vencedor VARCHAR(6),
  ritmo VARCHAR(6) NOT NULL,
  motivo_final VARCHAR(50),
  player_brancas INTEGER NOT NULL,
  player_pretas INTEGER NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY(player_brancas) REFERENCES USUARIO(id),
  FOREIGN KEY(player_pretas) REFERENCES USUARIO(id),
  CHECK(player_brancas != player_pretas)
);

CREATE TABLE LANCE (
  id_partida INTEGER NOT NULL,
  sequencial INTEGER NOT NULL,
  de VARCHAR(2) NOT NULL,
  para VARCHAR(2) NOT NULL,
  momento_lance TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  tempo INTEGER NOT NULL,
  PRIMARY KEY(id_partida, sequencial),
  FOREIGN KEY(id_partida) REFERENCES PARTIDA(id)
);

CREATE TABLE follow (
  seguindo INTEGER NOT NULL,
  seguidor INTEGER NOT NULL,
  data_criacao TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  PRIMARY KEY(seguindo, seguidor),
  FOREIGN KEY(seguindo) REFERENCES USUARIO(id),
  FOREIGN KEY(seguidor) REFERENCES USUARIO(id),
  CHECK(seguidor != seguindo)
);

CREATE TABLE IF NOT EXISTS estados (
	estado_key INT,
	nome VARCHAR(30) NOT NULL,
	PRIMARY KEY (estado_key)
);

CREATE TABLE IF NOT EXISTS data_investimento (
	data_key INT,
	ano integer NOT NULL,
	PRIMARY KEY (data_key)
);

CREATE TABLE IF NOT EXISTS subfuncoes (
	subfuncoes_key INT,
	nome VARCHAR(30) NOT NULL,
	PRIMARY KEY (subfuncoes_key)
);

CREATE TABLE IF NOT EXISTS investimentos (
	investimento_key INT,
	montante NUMERIC NOT NULL,
	estado INT NOT NULL,
	"data" INT NOT NULL,
	subfuncao INT NOT NULL,
	PRIMARY KEY (investimento_key),
	FOREIGN KEY (estado)
		REFERENCES estados (estado_key),
	FOREIGN KEY ("data")
		REFERENCES data_investimento (data_key),
	FOREIGN KEY (subfuncao)
		REFERENCES subfuncoes (subfuncoes_key)
);

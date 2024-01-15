CREATE TABLE IF NOT EXISTS estados (
    estado_key INT,
    nome VARCHAR(30) NOT NULL,
    PRIMARY KEY(estado_key)
);

CREATE TABLE IF NOT EXISTS data_ocorrencia (
    data_key INT,
    ano INT NOT NULL,
    mes INT NOT NULL,
    PRIMARY KEY(data_key)
);

CREATE TABLE IF NOT EXISTS categorias (
    categoria_key INT,
    nome VARCHAR NOT NULL,
    PRIMARY KEY(categoria_key)
);

CREATE TABLE IF NOT EXISTS ocorrencias (
    ocorrencia_key INT,
    quantidade INT NOT NULL,
    estado INT NOT NULL,
    "data" INT NOT NULL,
    categoria INT NOT NULL,
    PRIMARY KEY(ocorrencia_key),
    FOREIGN KEY(estado) 
		REFERENCES estados(estado_key),
    FOREIGN KEY("data") 
		REFERENCES data_ocorrencia(data_key),
    FOREIGN KEY(categoria) 
		REFERENCES categorias(categoria_key)
);

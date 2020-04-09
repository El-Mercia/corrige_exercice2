-- create table articles
CREATE TABLE node_articles2 (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR (100) NOT NULL,
    content TEXT NOT NULL,
    author INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    -- PRIMARY KEY (id),
    CONSTRAINT FK_articles2_author FOREIGN KEY (author) REFERENCES node_users(id)
);

-- creatz table comments
CREATE TABLE node_comments2 (
    id INT PRIMARY KEY AUTO_INCREMENT,
    articles_id INT NOT NULL,
    author INT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_comments2_articles_id FOREIGN KEY (articles_id) REFERENCES node_articles2(id) ON DELETE CASCADE,
    CONSTRAINT FK_comments2_author FOREIGN KEY (author) REFERENCES node_users(id)
)
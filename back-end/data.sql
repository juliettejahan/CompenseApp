--
-- import from local external file:
--
--\copy Auth(login, email, mobile, password, isAdmin, unom, prenom) from './--test_users.csv' (format csv)
INSERT INTO Auth(login, email, mobile, password, isAdmin, unom, prenom) VALUES
('calvin', 'calvin.debile@gmail.com', '0000000000', '$2b$04$v4H2LahKtxuxavpOOBCZmeHHBF8J3B//vO7RjDAgRXAiLL8jneOlG',TRUE, 'Debile', 'Calvin');

INSERT INTO Auth(login, email, mobile, password, isAdmin, unom, prenom) VALUES
('hobbes', 'hobbes.relou@gmail.com', '0999999999', '$2b$04$Yrjy1y8CtwGpTeTCFbjzWepaREKuSl6Vivk.YcJXLDtK5h/6sc8gK',FALSE, 'Relou', 'Hobbes');

INSERT INTO categorie(cnom) VALUES ('Jardinage');

INSERT INTO categorie(cnom) VALUES ('Cuisine');

INSERT INTO categorie(cnom) VALUES ('Couture');

INSERT INTO categorie(cnom) VALUES ('Photo');

INSERT INTO categorie(cnom) VALUES ('Pharmacie');

INSERT INTO categorie(cnom) VALUES ('Bricomarché');

INSERT INTO objet(dispo,onom,lid,pictures) VALUES (0,'louche',(SELECT lid FROM Auth WHERE login='calvin'), './static/images/louche.jpg');

INSERT INTO objet(dispo,onom,lid,pictures) VALUES (0,'cuillere',(SELECT lid FROM Auth WHERE login='hobbes') , './static/images/cuillere.jpg');

INSERT INTO objet(dispo,onom,lid,pictures) VALUES (2,'fourchette',(SELECT lid FROM Auth WHERE login='calvin') , './static/images/fourchette.jpg');

INSERT INTO objet(dispo,onom,lid,pictures) VALUES (1,'casserole',(SELECT lid FROM Auth WHERE login='calvin'), './static/images/casserole1.jpg');

INSERT INTO objet(dispo,onom,lid,pictures) VALUES (2,'casserole2',(SELECT lid FROM Auth WHERE login='hobbes'), './static/images/casserole2.jpg');

INSERT INTO objet(dispo,onom,lid,pictures) VALUES (1,'casserole3',(SELECT lid FROM Auth WHERE login='hobbes'), './static/images/casserole3.jpg');

INSERT INTO objet(dispo,onom,lid,pictures) VALUES (3,'casserole4',(SELECT lid FROM Auth WHERE login='calvin'), './static/images/casserole4.jpg');

INSERT INTO objet(dispo,onom,lid,cid,pictures) VALUES (3,'rateau',(SELECT lid FROM Auth WHERE login='hobbes'),1, './static/images/rateau.jpg');

INSERT INTO objet(dispo,onom,lid,cid,pictures) VALUES (2,'de a coudre',(SELECT lid FROM Auth WHERE login='calvin'),3, './static/images/coudre.png');

INSERT INTO objet(dispo,onom,lid,cid,pictures) VALUES (0,'mug koala',(SELECT lid FROM Auth WHERE login='hobbes'),3, './static/images/mug-koala.jpg');

INSERT INTO action(lid,oid,action_id) VALUES (2,(SELECT oid FROM objet WHERE onom='casserole4'),3);

INSERT INTO action(lid,oid,action_id) VALUES (2,(SELECT oid FROM objet WHERE onom='casserole'),1);

INSERT INTO action(lid,oid,action_id) VALUES (1,(SELECT oid FROM objet WHERE onom='casserole2'),2);

INSERT INTO action(lid,oid,action_id) VALUES (1,(SELECT oid FROM objet WHERE onom='casserole3'),1);

INSERT INTO action(lid,oid,action_id) VALUES (1,(SELECT oid FROM objet WHERE onom='rateau'),3);

INSERT INTO action(lid,oid,action_id) VALUES (2,(SELECT oid FROM objet WHERE onom='fourchette'),2);

INSERT INTO action(lid,oid,action_id) VALUES (2,(SELECT oid FROM objet WHERE onom='de a coudre'),2);

INSERT INTO appel(lid,cid,onom) VALUES (1,(SELECT cid FROM categorie WHERE cnom='Jardinage'),'truelle');

INSERT INTO groupe(gnom) VALUES ('Meuh');

INSERT INTO groupe(gnom) VALUES ('5e étage');

INSERT INTO groupe(gnom) VALUES ('Paris');

INSERT INTO groupe(gnom) VALUES ('Nantes');

INSERT INTO appartient(lid,gid) VALUES ((SELECT lid FROM Auth WHERE login='calvin'), (SELECT gid FROM groupe WHERE gnom='Nantes'));

INSERT INTO appartient(lid,gid) VALUES ((SELECT lid FROM Auth WHERE login='hobbes'), (SELECT gid FROM groupe WHERE gnom='Meuh'));

INSERT INTO appartient(lid,gid) VALUES ((SELECT lid FROM Auth WHERE login='calvin'), (SELECT gid FROM groupe WHERE gnom='Meuh'));

INSERT INTO appartient(lid,gid) VALUES ((SELECT lid FROM Auth WHERE login='hobbes'), (SELECT gid FROM groupe WHERE gnom='5e étage'));

INSERT INTO appartient(lid,gid) VALUES ((SELECT lid FROM Auth WHERE login='calvin'), (SELECT gid FROM groupe WHERE gnom='Paris'));

INSERT INTO appartient(lid,gid) VALUES ((SELECT lid FROM Auth WHERE login='hobbes'), (SELECT gid FROM groupe WHERE gnom='Paris'));

INSERT INTO EstExpert(cid,lid) VALUES ((SELECT cid FROM categorie WHERE cnom='Jardinage'), (SELECT lid FROM Auth WHERE login='hobbes'));

INSERT INTO EstExpert(cid,lid) VALUES ((SELECT cid FROM categorie WHERE cnom='Couture'), (SELECT lid FROM Auth WHERE login='hobbes'));

INSERT INTO EstExpert(cid,lid) VALUES ((SELECT cid FROM categorie WHERE cnom='Cuisine'), (SELECT lid FROM Auth WHERE login='calvin'));

INSERT INTO EstExpert(cid,lid) VALUES ((SELECT cid FROM categorie WHERE cnom='Couture'), (SELECT lid FROM Auth WHERE login='calvin'));

INSERT INTO EstExpert(cid,lid) VALUES ((SELECT cid FROM categorie WHERE cnom='Jardinage'), (SELECT lid FROM Auth WHERE login='calvin'));

INSERT INTO appel(lid,cid,onom) VALUES (1, 2, 'pokémon');

INSERT INTO appel(lid,cid,onom) VALUES (1, 2, 'pokémon2');

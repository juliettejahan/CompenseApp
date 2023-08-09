-- SQL queries to be fed to anosql

-- name: now$
SELECT CURRENT_TIMESTAMP;

-- name: version$
SELECT VERSION();

-- name: get_auth_login^
SELECT password, isAdmin
FROM Auth
WHERE login = :login;

-- name: get_auth_login_lock^
SELECT password, isAdmin
FROM Auth
WHERE login = :login
FOR UPDATE;

-- name: get_auth_infopersonnel^
SELECT *
FROM Auth
WHERE login = :login;

-- name: get_auth_all
SELECT login, isAdmin
FROM Auth
ORDER BY 1;

-- name: insert_auth!
INSERT INTO Auth(login, email, mobile, password, isAdmin, unom, prenom, pictures)
VALUES (:login, :email, :mobile, :password, :is_admin, :unom, :prenom, :pictures);

-- name: get_lid_login^ 
SELECT lid FROM Auth WHERE login = :login ORDER BY 1;

-- name: patch_auth_all_info!
UPDATE Auth
SET email=:email, mobile=:mobile, password=:password, unom=:unom, prenom=:prenom, pictures=:pictures
WHERE lid = :lid;

--name : patch_auth!
UPDATE Auth SET picture=:picture WHERE lid=:lid;

-- name: delete_user!
DELETE FROM Auth WHERE login = :login;

-- name: get_objet_all
SELECT oid,onom,dispo,login,objet.pictures,auth.pictures FROM objet JOIN Auth ON objet.lid=Auth.lid ORDER BY onom;

-- name: get_objet_dispo
SELECT oid,onom,dispo,login,objet.pictures,auth.pictures FROM objet JOIN Auth ON objet.lid=Auth.lid WHERE dispo=:dispo ORDER BY onom;

-- name: get_objet_filter_all
SELECT onom,dispo,login,objet.pictures,auth.pictures FROM objet JOIN Auth ON objet.lid=Auth.lid WHERE onom LIKE :filter ORDER BY 1;

-- name: get_objet_filter_dispo
SELECT onom,oid,login,objet.pictures,auth.pictures FROM objet JOIN Auth ON objet.lid=Auth.lid WHERE dispo=:dispo AND onom LIKE :filter ORDER BY 1;

--name : get_objet_filter_login
SELECT onom,dispo,login,objet.pictures,auth.pictures FROM objet JOIN Auth ON objet.lid=Auth.lid WHERE login=:filter ORDER BY 1;


-- name: get_objet_login_dispo
SELECT onom,dispo,login,objet.pictures,auth.pictures, oid FROM objet JOIN Auth ON objet.lid=Auth.lid WHERE dispo=:dispo AND login=:filter ORDER BY 1;

-- name: get_objet_login_dispo_with_names
SELECT onom,dispo,Auth1.login,objet.pictures, Auth2.pictures,Auth2.login, objet.oid FROM objet JOIN Auth AS Auth1 ON objet.lid=Auth1.lid JOIN action ON action.oid=objet.oid JOIN Auth AS Auth2 ON Auth2.lid=action.lid WHERE dispo=:dispo AND Auth1.login=:filter ORDER BY 1;

-- name: get_objet_oid^ 
SELECT * FROM objet WHERE oid=:oid ORDER BY 1;

-- name: add_to_objet!
INSERT INTO objet(dispo, onom, lid, cid) VALUES (:dispo, :onom, :lid, :cid);

-- name: add_to_photo!
INSERT INTO objet(dispo, onom, lid, pictures, cid) VALUES (:dispo, :onom, :lid, :pictures, :cid);

-- name: patch_objet_oid!
UPDATE objet SET dispo=:dispo WHERE oid=:oid;

--name: patch_objet_oid_picture!
UPDATE objet SET picture=:picture WHERE oid=:oid;

-- name: delete_objet_oid!
DELETE FROM objet WHERE oid=:oid;

-- name: get_categorie_all
SELECT cnom,cid FROM categorie ORDER BY cnom;

-- name: get_categorie_filter_cnom
SELECT cnom,cid FROM categorie WHERE cnom=:cnom ORDER BY 1;

-- name: get_categorie_filter_cid
SELECT cnom,cid FROM categorie WHERE cid=:filter ORDER BY 1;

-- name: get_cid^ 
SELECT * FROM categorie WHERE cid=:cid ORDER BY 1;

-- name: add_to_categorie!
INSERT INTO categorie(cnom) VALUES (:cnom);

-- name: delete_categorie_cid!
DELETE FROM categorie WHERE cid=:cid;

--name: get_user_id$
SELECT lid FROM Auth WHERE login=:login;

-- name: get_action_all
SELECT action.oid, action_id, login AS a_emprunté, onom AS objet, debut FROM action JOIN Auth ON Auth.lid=action.lid JOIN objet ON objet.oid=action.oid WHERE action_id=:action_id ORDER BY debut;

-- name: get_action_filter_all
SELECT action.oid, action_id, Auth1.login AS a_emprunté, onom AS objet, debut, objet.pictures, Auth2.login  FROM action JOIN Auth AS Auth1 ON Auth1.lid=action.lid JOIN objet ON objet.oid=action.oid JOIN Auth AS Auth2 ON Auth2.lid=objet.lid WHERE action.lid=:filter AND action_id=:action_id ORDER BY debut;

-- name: get_action_demande_a_cet_utilisateur
SELECT action.oid, action_id, login AS a_demandé, onom AS objet, debut FROM action JOIN Auth ON Auth.lid=action.lid JOIN objet ON objet.oid=action.oid WHERE objet.lid=:filter AND action_id=:action_id ORDER BY debut;

-- name: get_action_recuperer_a_cet_utilisateur
SELECT action.oid, action_id, login AS a_recuperer, onom AS objet, debut FROM action JOIN Auth ON Auth.lid=action.lid JOIN objet ON objet.oid=action.oid WHERE action.lid=:filter AND action_id=:action_id ORDER BY debut;

-- name: get_action_oid
SELECT action.oid AS oid, action_id,login AS a_emprunté, onom AS objet, debut, objet.pictures FROM action JOIN Auth ON Auth.lid=action.lid JOIN objet ON objet.oid=action.oid WHERE action.oid=:oid AND action_id=:action_id ORDER BY 1;

-- name: patch_action_oid!
UPDATE action SET action_id=:action_id WHERE oid=:oid;

-- name: add_to_action!
INSERT INTO action (lid, oid,action_id) VALUES (:lid, :oid, :action_id);

-- name: get_timestamp^
SELECT CURRENT_TIMESTAMP;

-- name: delete_action_oid!
DELETE FROM action WHERE oid=:oid;

-- name: get_group_all
SELECT gnom FROM groupe ORDER BY gnom;

-- name: get_group_all_gid_gnom
SELECT gnom,gid FROM groupe ORDER BY 1;

-- name: get_group_filter_all
SELECT gnom FROM groupe WHERE gid LIKE :filter ORDER BY gnom;

-- name: get_group_gid^ 
SELECT gnom FROM groupe WHERE gid=:gid ORDER BY 1;

-- name: add_to_group!
INSERT INTO groupe (gnom) VALUES (:gnom);

-- name: delete_group_gid!
DELETE FROM groupe WHERE gid=:gid;

-- name: get_appel_all
SELECT lid,cid,onom FROM appel ORDER BY onom;

-- name: get_appel_cid 
SELECT * FROM appel WHERE cid=:cid ORDER BY 1;

-- name: add_to_appel!
INSERT INTO appel(lid,cid,onom) VALUES (:lid,:cid,:onom);

-- name: delete_appel_lid_cid_onom!
DELETE FROM appel WHERE lid=:lid AND cid=:cid AND onom=:onom;

-- name: get_expert_all
SELECT categorie.cid,cnom AS categorie, lid AS personne FROM EstExpert JOIN categorie ON categorie.cid=EstExpert.cid ORDER BY cnom;

-- name: get_expert_filter_categorie
SELECT categorie.cid,lid AS personne FROM EstExpert JOIN categorie ON categorie.cid=EstExpert.cid WHERE cnom=:filter ORDER BY lid;

-- name: get_expert_filter_name
SELECT categorie.cid,cnom AS categorie FROM EstExpert JOIN categorie ON categorie.cid=EstExpert.cid WHERE lid=:filter ORDER BY cnom;

-- name: get_experts_cid^ 
--SELECT gnom FROM groupe WHERE gid=:gid ORDER BY 1; JE PENSE QUE ÇA SERT À RIEN DONC JE LE CODE PAS

-- name: get_expert_cid_lid^
SELECT cid,lid FROM EstExpert WHERE cid=:cid AND lid=:lid;

-- name: add_to_expert!
INSERT INTO EstExpert(cid,lid) VALUES (:cid,:lid);

-- name: delete_expert_cid_lid!
DELETE FROM EstExpert WHERE cid=:cid AND lid=:lid;

-- name: delete_expert_all_lid!
DELETE FROM EstExpert WHERE lid=:lid;

-- name: get_appartient_all
SELECT gnom AS groupe, lid AS personne FROM appartient JOIN groupe ON groupe.gid=appartient.gid ORDER BY gnom;

-- name: get_appartient_filter_groupe
SELECT lid AS personne, gnom AS groupe FROM appartient JOIN groupe ON groupe.gid=appartient.gid WHERE appartient.gid=:filter ORDER BY gnom;

-- name: get_appartient_filter_lid
SELECT gnom AS groupe FROM appartient JOIN groupe ON groupe.gid=appartient.gid WHERE lid=:filter ORDER BY gnom;

-- name: get_appartient_gid_lid^
SELECT gid,lid FROM appartient WHERE appartient.gid=:gid AND lid=:lid;

-- name: add_to_appartient!
INSERT INTO appartient(gid,lid) VALUES (:gid,:lid);

-- name: delete_appartient_gid_lid!
DELETE FROM appartient WHERE gid=:gid AND lid=:lid;

-- name: delete_appartient_all_lid!
DELETE FROM appartient WHERE  lid=:lid;

-- name: can_access_owned^
SELECT login=:login FROM Auth JOIN objet USING (lid) WHERE oid=:oid;

-- name: can_access_action^
SELECT login=:login FROM Auth JOIN action USING (lid) WHERE oid=:oid;

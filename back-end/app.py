import os
import re
import datetime
import logging
from flask import request
from werkzeug.utils import secure_filename
from base64 import b64decode
from pathlib import Path
import re

# initial logging configuration
logging.basicConfig(level=logging.INFO)

# start and configure flask service
import FlaskSimpleAuth as fsa
from FlaskSimpleAuth import jsonify as json  # type: ignore

app = fsa.Flask(os.environ["APP_NAME"])
app.config.from_envvar("APP_CONFIG")

# setup application log
log = logging.getLogger(app.name)
if "APP_LOGGING_LEVEL" in app.config:
    log.setLevel(app.config["APP_LOGGING_LEVEL"])
started = datetime.datetime.now()
log.info(f"started on {started}")

# create database connection and load queries based on DB_* directives
import database

database.init_app(app)
from database import db

# authentication and authorization for the app
import auth

auth.init_app(app)


#
# General information about running app.
#
# FIXME should be restricted
#
# GET /version (sleep?)
@app.get("/version", authorize="ANY")
def get_version(sleep: float = 0.0):
    import flask
    import aiosql
    import CacheToolsUtils as ctu
    import ProxyPatternPool as ppp
    import version

    # possibly include a delay, for testing purpose
    if sleep:
        import time

        time.sleep(sleep)
    # describe app
    return {
        # running
        "app": app.name,
        "version": 17,
        "started": str(started),
        # git info
        "git-remote": version.remote,
        "git-branch": version.branch,
        "git-commit": version.commit,
        "git-date": version.date,
        # auth
        "auth": app.config.get("FSA_AUTH", None),
        "user": app.get_user(required=False),
        # database
        "db-type": app.config["DB_TYPE"],
        "db-driver": db._db,
        "db-version": db._db_version,
        "now": db.now(),
        "connections": db._nobjs,
        "hits": app._fsa._cache.hits(),
        # package versions
        "flask-simple-auth": fsa.__version__,
        "flask": flask.__version__,
        "anodb": db.__version__,
        "aiosql": aiosql.__version__,
        "postgres": db.version(),
        "cachetools-utils": ctu.__version__,
        "proxy-pattern-pool": ppp.__version__,
        db._db: db._db_version,
    }, 200


# GET /stats
@app.get("/stats", authorize="ADMIN")
def get_stats():
    dbc = db._count
    return {k: dbc[k] for k in dbc if dbc[k] != 0}, 200


#
# Self care
#


# GET /who-am-i
@app.get("/who-am-i", authorize="ALL")
def get_who_am_i(user: fsa.CurrentUser):
    return json(user), 200


# GET /get_auth_info
@app.get("/get_auth_infopersonnel", authorize="ALL")
def get_auth_infopersonnel():
    # log("ret:",json(db.get_auth_infopersonnel(login = app.current_user())))
    return json(db.get_auth_infopersonnel(login=app.current_user())), 200


# POST /register (login, password)
@app.post("/register", authorize="ANY")
def post_register(
    login: str,
    password: str,
    email: str,
    mobile: str,
    unom: str,
    prenom: str,
    pictures: str,
    expertises,
    selectedGroup,
):
    # check constraints on "login"
    if len(login) < 3:
        return "login must be at least 3 chars", 400
    if not re.match(r"^[a-zA-Z][-a-zA-Z0-9_\.]+$", login):
        return "login can only contain simple characters", 400
    if db.get_auth_login(login=login) is not None:
        return f"user {login} already registered", 409
    log.debug(f"user registration: {login}")
    # NOTE passwords have constraints, see configuration
    db.insert_auth(
        login=login,
        email=email,
        mobile=mobile,
        unom=unom,
        prenom=prenom,
        password=app.hash_password(password),
        is_admin=False,
        pictures=pictures,
    )
    lid = db.get_lid_login(login=login)[0]

    t = re.findall(r"\[(.+?)\]", expertises)
    t1 = re.findall(r"\d+", t[0])
    ret = [int(i) for i in t1]

    log.debug("expertises:", (ret))
    log.debug("lidexpertises:", (lid))
    log.debug("lidexpertisestype:", (type(lid)))
    for cid in ret:
        db.add_to_expert(lid=lid, cid=cid)

    t_ = re.findall(r"\[(.+?)\]", selectedGroup)
    t1_ = re.findall(r"\d+", t_[0])
    ret_ = [int(i) for i in t1_]
    log.debug("selectedGroup:", (ret_))

    for gid in ret_:
        db.add_to_appartient(lid=lid, gid=gid)
    return "", 201


# GET /login (user)
@app.get("/login", authorize="ANY", auth="basic")
def get_login(user: fsa.CurrentUser):
    return json(app.create_token(user)), 200


# PATCH /Auth (picture)
@app.patch("/Auth", authorize="ANY")
def patch_user(picture=None):
    lid = int(db.get_user_id(login=app.current_user()))
    res = db.get_login(user=lid)
    if not res:
        return "L'utilisateur n'existe pas", 404
    else:
        res = db.patch_auth(lid=lid, picture=picture)
    return "", 204


# PATCH /Auth (password, email, mobile, unom, prenom, pictures, expertises)
@app.patch("/Auth_all_info", authorize="ALL")
def patch_user_all_info(
    password, email, mobile, unom, prenom, pictures, expertises, groups
):
    lid = int(db.get_user_id(login=app.current_user()))
    res = db.patch_auth_all_info(
        lid=lid,
        email=email,
        mobile=mobile,
        password=password,
        unom=unom,
        prenom=prenom,
        pictures=pictures,
    )
    db.delete_expert_all_lid(lid=lid)

    t = re.findall(r"\[(.+?)\]", expertises)
    t1 = re.findall(r"\d+", t[0])
    ret = [int(i) for i in t1]

    log.debug("expertises:", (ret))
    for cid in ret:
        db.add_to_expert(lid=lid, cid=cid)

    db.delete_appartient_all_lid(lid=lid)

    t_ = re.findall(r"\[(.+?)\]", groups)
    t1_ = re.findall(r"\d+", t_[0])
    ret_ = [int(i) for i in t1_]
    log.debug("selectedGroup:", (ret_))

    for gid in ret_:
        db.add_to_appartient(lid=lid, gid=gid)
    return "", 204


# POST /image (fileName, fileData)
@app.post("/image", authorize="ALL")  # , methods = ['GET', 'POST'])
def upload_function(fileName, fileData):
    """"""
    data = b64decode(fileData)
    # fileName = b64decode(fileName)
    print("type of data:", type(data))
    # print("filename:",fileName)
    image_dir = Path("./static/images")
    with open(image_dir / fileName, "wb") as f:
        f.write(data)
        f.close()
    return "", 201


# POST /imageRegister (fileName, fileData)
@app.post("/imageRegister", authorize="ANY")  # , methods = ['GET', 'POST'])
def upload_function_register(fileName, fileData):
    """"""
    data = b64decode(fileData)
    # fileName = b64decode(fileName)
    print("type of data:", type(data))
    # print("filename:",fileName)
    image_dir = Path("./static/imagesRegister")
    with open(image_dir / fileName, "wb") as f:
        f.write(data)
        f.close()
    return "", 201


# GET /users
@app.get("/users", authorize="ANY")
def get_users():
    return json(db.get_auth_all()), 200


# DELETE /users/<login>  # while testing only…
if app.config.get("APP_TEST", False):

    @app.delete("/users/<login>", authorize="ADMIN")
    def delete_users_login(login: str):
        if not db.get_auth_login_lock(login=login):
            return "no such user", 404
        # in the real world a user would rather be disactivated
        db.delete_user(login=login)
        return "", 204


# Get tools available (when we want to list the tools available or all the tools, according to a filter or not)
# GET /objet (filter, filter_by_mine, filtrer_par_dispo, filtre_dispo)
@app.get("/objet", authorize="ALL")
def get_objet(
    filter=None, filter_by_mine=False, filtrer_par_dispo=True, filtre_dispo=0
):
    # this calls the function defined from "queries.sql"
    if filter is None and not filter_by_mine:
        if filtrer_par_dispo is False:
            res = db.get_objet_all()
        else:
            res = db.get_objet_dispo(dispo=filtre_dispo)

    elif not filter_by_mine:
        if filtrer_par_dispo is False:
            res = db.get_objet_filter_all(
                filter="%" + str(filter) + "%"
            )  # en filtre, on peut mettre un type d'outil
        else:
            res = db.get_objet_filter_dispo(
                filter="%" + str(filter) + "%", dispo=filtre_dispo
            )
    else:  # ça veut dire qu'on veut accéder au catalogue de quelqu'un
        user_login = app.current_user()
        log.debug(user_login)
        if filtrer_par_dispo is False:
            res = db.get_objet_filter_login(filter=user_login)
        else:
            if int(filtre_dispo) == 0:
                # log.debug("get_objet_login_dispo used, filtre_dispo={}".format(filtre_dispo))
                res = db.get_objet_login_dispo(filter=user_login, dispo=filtre_dispo)
            else:
                # log.debug("get_objet_login_dispo_with_names used, filtre_dispo={}".format(filtre_dispo))
                res = db.get_objet_login_dispo_with_names(
                    filter=user_login, dispo=filtre_dispo
                )

        # else :
        # return "Vous n'avez pas les droits", 401
    # before returning the result
    return json(res), 200


# Gives the content of an item called with the key
# GET /objet/<oid>
@app.get("/objet/<oid>", authorize="ALL")
def get_objet_oid(oid: int):
    # this fails if the oid doesn't exists…
    res = db.get_objet_oid(oid=oid)
    if not res:
        return "Cet objet n'existe pas", 404
    # must release locks… will be removed later.
    return json(res), 200


# POST /objet (onom, Categoriename, pic)
@app.post("/objet", authorize="ALL")
def post_objet(
    onom: str, Categoriename: str, pic: str = None
):  # la requête sql doit créer l'oid
    user_login = app.get_user()
    lid = db.get_user_id(login=user_login)
    cid = db.get_categorie_filter_cnom(cnom=Categoriename)[0][1]
    log.debug(f"cid={cid} lid={lid}")
    # print("cid:",cid)
    # log.debug("lid:",lid)
    if pic is None:
        db.add_to_objet(dispo=0, onom=onom, lid=lid, cid=cid)
    else:
        db.add_to_photo(dispo=0, onom=onom, lid=lid, pictures=pic, cid=cid)

    # end of transaction
    # we are done, all is well
    return "", 201


# PATCH /objet/<oid> (dispo, patch_picture, picture)
@app.patch("/objet/<oid>", authorize="ALL")
def patch_objet(oid: int, dispo=3, patch_picture=False, picture=None):
    log.debug(f"token: {fsa.request.headers['Authorization']}")
    res = db.get_objet_oid(oid=oid)
    log.debug(f"res_patch_oid: {res}")
    if not res:
        return "L'objet n'existe pas", 404
    if patch_picture:
        db.patch_objet_oid_picture(oid=oid, picture=picture)
    else:
        db.patch_objet_oid(oid=oid, dispo=dispo)
    # end of transaction
    # we are done, all is well
    return "", 204


# DELETE / objet/<oid>
@app.delete("/objet/<oid>", authorize="ALL")
def delete_objet_oid(oid: int):
    res = db.get_objet_oid(oid=oid)
    if not res:
        return "L'objet n'existe pas", 404
    db.delete_objet_oid(oid=oid)
    return "", 204


# Get list of categories
# GET /categorie (filter, filter_on_cnom)
@app.get("/categorie", authorize="ALL")
def get_categorie(filter=None, filter_on_cnom=True):
    # this calls the function defined from "queries.sql"
    if filter is None:
        res = db.get_categorie_all()
        log.debug("resMulti:", res)
    else:
        if filter_on_cnom:
            res = db.get_categorie_filter_cnom(
                filter="%" + str(filter) + "%"
            )  # en filtre, on peut juste mettre un nom de catégorie
        # before returning the result
        else:
            res = db.get_categorie_filter_cid(filter=filter)
    return json(res), 200


# Get list of categories
# GET /categorie_register
@app.get("/categorie_register", authorize="ANY")
def get_categorie_register():
    # this calls the function defined from "queries.sql"

    res = db.get_categorie_all()
    # log.debug("resMulti:",res)
    res = [[res_[0], res_[1]] for res_ in res]
    # log.debug("resMulti:",res)

    return json(res), 200


# Get list of groups
@app.get("/groups_register", authorize="ANY")
def get_groups_register():
    # this calls the function defined from "queries.sql"

    res = db.get_group_all_gid_gnom()
    # log.debug("resMultiGroup:",res)
    res = [[res_[0], res_[1]] for res_ in res]
    # log.debug("resMultiGroup:",res)

    return json(res), 200


# Gives the content of a categorie called with the cid
# GET /categorie/<cid>
@app.get("/categorie/<cid>", authorize="ALL")
def get_categorie_cid(cid):
    # this fails if the cid doesn't exists
    res = db.get_cid(cid=cid)
    if not res:
        return "Cette catégorie n'existe pas", 404
    # must release locks… will be removed later.
    return json(res), 200


# POST /categorie (cnom)
@app.post("/categorie", authorize="ALL")
def post_categorie(cnom: str):  # la requête sql doit créer le cid
    res = db.get_categorie_all()
    if cnom in res:
        return "Cette catégorie existe déjà", 409
    db.add_to_categorie(cnom=cnom)
    # end of transaction
    # we are done, all is well
    return "", 201


# DELETE /categorie/<cid>
@app.delete("/categorie/<cid>", authorize="ALL")
def delete_categorie_cid(cid: int):
    res = db.get_categorie_filter_cid(filter=cid)
    if not res:
        return "L'objet n'existe pas dans cette catégorie", 404
    db.delete_categorie_cid(cid=cid)
    return "", 204


# Get action (when we want to list the things that are borrowed)
@app.get("/action", authorize="ALL")
def get_action(action_id=1, filter_by_mine=True):
    # this calls the function defined from "queries.sql"
    if not filter_by_mine:
        # log.debug("get_action_all used:")
        res = db.get_action_all(action_id=int(action_id))
    else:
        log.debug("get_action_filter_all used:")
        lid = int(db.get_user_id(login=app.current_user()))
        res = db.get_action_filter_all(filter=lid, action_id=int(action_id))

    # before returning the result
    return json(res), 200


# GET /action_notif (action_id)
@app.get("/action_notif", authorize="ALL")
def get_action_notif(action_id=1):
    # this calls the function defined from "queries.sql"
    lid = int(db.get_user_id(login=app.current_user()))
    res = db.get_action_demande_a_cet_utilisateur(filter=lid, action_id=action_id)
    return json(res), 200


# GET /action_notif_recuperer (action_id)
@app.get("/action_notif_recuperer", authorize="ALL")
def get_action_notif_recuperer(action_id=2):
    # this calls the function defined from "queries.sql"
    lid = int(db.get_user_id(login=app.current_user()))
    res = db.get_action_recuperer_a_cet_utilisateur(filter=lid, action_id=action_id)
    return json(res), 200


# Gives the content of a borrowing called with the oid
# GET /action/<oid> (action_id)
@app.get("/action/<oid>", authorize="ALL")
def get_action_oid(oid, action_id: int):
    # this fails if the oid doesn't exists…
    res = db.get_action_oid(oid=oid, action_id=int(action_id))
    if not res:
        return (
            "Cet objet n'est pas emprunté, demandé ou réservé (ou peut-être qu'il l'est mais vous n'avez pas mis la bonne action)",
            404,
        )
    return json(res), 200


# POST /action (oid, action_id)
@app.post("/action", authorize="ALL")
def post_action(oid: int, action_id: int):
    # this fails if the key already exists…
    action_id = int(action_id)
    res1 = db.get_action_all(action_id=1)
    res2 = db.get_action_all(action_id=2)
    res3 = db.get_action_all(action_id=3)
    if (oid in res1) or (oid in res2) or (oid in res3):
        return "L'objet est déjà emprunté, réservé ou demandé", 409
    log.debug("saucisse")
    user_login = app.get_user()
    log.debug(user_login)
    lid = db.get_user_id(login=user_login)
    db.add_to_action(lid=lid, oid=oid, action_id=action_id)
    # end of transaction
    # we are done, all is well
    return "", 201


# PATCH /action/<oid>/please
# change action_id 
@app.patch("/action/<oid>/please", authorize="ALL")
def patch_action_please(oid: int):
    res = db.get_action_oid(oid=oid, action_id=0)
    if not (res):
        return "L'objet n'est pas disponible", 404
    # end of transaction
    # we are done, all is well
    db.patch_action_oid(oid=oid, action_id=1)
    return "", 204


# PATCH /action/<oid>/accept
@app.patch("/action/<oid>/accept", authorize=("owned",))
def patch_action_accept(oid: int):
    log.debug(f"valeur oid {oid}")
    res = db.get_action_oid(oid=oid, action_id=1)
    if not (res):
        return "L'objet n'est pas demandé", 404
    # end of transaction
    # we are done, all is well
    db.patch_action_oid(oid=oid, action_id=2)
    return "", 204


# PATCH /action/<oid>/take
@app.patch("/action/<oid>/take", authorize=("actionner",))
def patch_action_take(oid: int):
    log.debug(f"valeur oid {oid}")
    res = db.get_action_oid(oid=oid, action_id=2)
    if not (res):
        return "La demande n'a pas été acceptée", 404
    # end of transaction
    # we are done, all is well
    db.patch_action_oid(oid=oid, action_id=3)
    return "", 204


# PATCH /action/<oid>/return
@app.patch("/action/<oid>/return", authorize=("actionner",))
def patch_action_return(oid: int):
    log.debug(f"valeur oid {oid}")
    res = db.get_action_oid(oid=oid, action_id=3)
    if not (res):
        return "L'objet n'est pas emprunté", 404
    # end of transaction
    # we are done, all is well
    db.patch_action_oid(oid=oid, action_id=0)
    return "", 204

#DELETE /action/<oid>
@app.delete("/action/<oid>", authorize=("owned", ))
def delete_action_oid(oid: int):
    res1 = db.get_action_all(action_id=1)
    res2 = db.get_action_all(action_id=2)
    res3 = db.get_action_all(action_id=3)
    res1 = [res[0] for res in res1]
    res2 = [res[0] for res in res2]
    res3 = [res[0] for res in res3]
    if not ((oid in res1) or (oid in res2) or (oid in res3)):
        return "L'objet n'existe pas", 404
    db.delete_action_oid(oid=oid)
    return "", 204


# Get group (when we want to list the groups that exist)
# GET /groupe
@app.get("/groupe", authorize="ALL")
def get_groupe(filter=None):
    # this calls the function defined from "queries.sql"
    if filter is None:
        res = db.get_group_all()
    else:
        res = db.get_group_filter_all(
            filter=filter
        )  # en filtre, on peut juste mettre un nom de groupe
    # before returning the result
    return json(res), 200


# Gives the name of a group called with gid
# GET /groupe/<gid>
@app.get("/groupe/<gid>", authorize="ALL")
def get_groupe_gid(gid):
    # this fails if the gid doesn't exist
    res = db.get_group_gid(gid=gid)
    if not res:
        return "Ce groupe n'existe pas", 404
    return json(res), 200


# POST /groupe (gnom)
@app.post("/groupe", authorize="ALL")
def post_groupe(gnom: str):
    # this fails if the key already exists
    res = db.get_group_all()
    if gnom in res:
        return "Ce groupe existe déjà", 409
    db.add_to_group(gnom=gnom)
    # end of transaction
    # we are done, all is well
    return "", 201


# DELETE /groupe (gid)
@app.delete("/groupe", authorize="ALL")
def delete_groupe_gnom(gid: int):
    res = db.get_group_gid(gid=gid)
    if not res:
        return "Le groupe n'existe pas", 404
    db.delete_group_gid(gid=gid)
    return "", 204


# Get appel (when we want to list the calls that were made)
# GET /appel (filter)
@app.get("/appel", authorize="ALL")
def get_appel(filter=None):
    # this calls the function defined from "queries.sql"
    if filter is None:
        res = db.get_appel_all()
    else:
        return "On veut filtrer", 400
    # before returning the result
    return json(res), 200


# Gives the calls to a categorie
# GET /appel/<cid>
@app.get("/appel/<cid>", authorize="ALL")
def get_appel_gid(cid):
    # this fails if the cid doesn't exist
    res = db.get_appel_cid(cid=cid)
    if not res:
        return "Ce groupe d'experts n'a pas été appelé", 404
    return json(res), 200


# Gives the calls to a categorie
# GET /appel_notif
@app.get("/appel_notif", authorize="ALL")
def get_appel_gid_notif():
    # this fails if the cid doesn't exist
    user_login = app.get_user()

    lid = db.get_user_id(login=user_login)
    res = db.get_expert_filter_name(filter=int(lid))
    # log.debug("res_notif:",res)
    list_cid = [re[0] for re in res]
    log.debug("list_cid:", list_cid)
    res = []
    for cid in list_cid:
        if db.get_appel_cid(cid=cid) != None:
            for item in db.get_appel_cid(cid=cid):
                res.append(item)
    # res = [db.get_appel_cid(cid=cid) for cid in list_cid if db.get_appel_cid(cid=cid) != None]
    # log.debug('db.get_appel_cid(cid=1):',db.get_appel_cid(cid=1))
    # log.debug('ret:',res)
    log.debug("res appel cid:", res)
    # if not res:
    #    return "Ce groupe d'experts n'a pas été appelé", 404
    return json(res), 200


# POST /appel (cid,onom)
@app.post("/appel", authorize="ALL")
def post_appel(onom: str, cid: int):
    user_login = app.current_user()
    lid = db.get_user_id(login=user_login)
    db.add_to_appel(lid=lid, cid=cid, onom=onom)
    # end of transaction
    # we are done, all is well
    return "", 201


# POST /appel_by_cnom (onom, cnom)
@app.post("/appel_by_cnom", authorize="ALL")
def post_appel_by_cnom(onom: str, cnom: str):
    user_login = app.current_user()
    lid = db.get_user_id(login=user_login)
    log.debug(f"cnom={cnom} lid={lid}")
    cid = db.get_categorie_filter_cnom(cnom=cnom)[0][1]
    log.debug(f"cid={cid} lid={lid} onom={onom}")
    db.add_to_appel(lid=lid, cid=cid, onom=onom)
    # end of transaction
    # we are done, all is well
    return "", 201


# DELETE /appel (lid,cid,onom)
@app.delete("/appel", authorize="ALL")
def delete_appel_lid_cid_onom(cid: int, lid: int, onom: str):
    res = db.get_appel_all()
    list_cid = [re[1] for re in res]
    list_lid = [re[0] for re in res]
    list_onom = [re[2] for re in res]
    if not (cid in list_cid and lid in list_lid and onom in list_onom):
        return "L'appel n'existe pas", 404
    db.delete_appel_lid_cid_onom(cid=cid, lid=lid, onom=onom)
    return "", 204


# Get expert (when we want to list the experts that exist)
# GET /EstExpert (filter, filtre_personne, filter_by_mine)
@app.get("/EstExpert", authorize="ALL")
def get_expert(filter=None, filtre_personne=True, filter_by_mine=True):
    # this calls the function defined from "queries.sql"
    if filter_by_mine:
        user_login = app.get_user()
        log.debug(user_login)
        lid = db.get_user_id(login=user_login)
        res = db.get_expert_filter_name(filter=int(lid))
    elif filter is None:
        res = db.get_expert_all()
    else:
        if filtre_personne:
            res = db.get_expert_filter_name(
                filter=filter
            )  # returns expert categories of person name
        else:
            res = db.get_expert_filter_categorie(filter=filter)  # returns
            # expert names for one categorie
    return json(res), 200


# POST /EstExpert (cid,lid)
@app.post("/EstExpert", authorize="ALL")
def post_expert(cid: int, lid: int):
    # this fails if the (cid,lid) already exists
    res = db.get_expert_all()
    res_cid_lid = [(re[0], re[2]) for re in res]
    if (cid, lid) in res_cid_lid:  # à vérifier avec fabien
        return "Im a teapot (coucou Kilian)", 409
    db.add_to_expert(cid=cid, lid=lid)
    # end of transaction
    return "", 201


# POST /EstExpert_register (cid)
@app.post("/EstExpert_register", authorize="ALL")
def post_expert_register(cid: int):
    # this fails if the (cid,lid) already exists
    user_login = app.current_user()
    lid = db.get_user_id(login=user_login)
    res = db.get_expert_all()
    res_cid_lid = [(re[0], re[2]) for re in res]
    if (cid, lid) in res_cid_lid:  # à vérifier avec fabien
        return "Im a teapot (coucou Kilian)", 409
    db.add_to_expert(cid=cid, lid=lid)
    # end of transaction
    return "", 201


# PATCH /EstExpert (cid)
@app.patch("/EstExpert", authorize="ALL")
def patch_expert(cid: int):
    # this fails if the (cid,lid) already exists
    user_login = app.current_user()
    lid = db.get_user_id(login=user_login)
    res = db.get_expert_all()
    res_cid_lid = [(re[0], re[2]) for re in res]
    if (cid, lid) in res_cid_lid:  # à vérifier avec fabien
        return "Im a teapot (coucou Kilian)", 409
    db.add_to_expert(cid=cid, lid=lid)
    # end of transaction
    return "", 201


# DELETE /EstExpert (cid,lid)
@app.delete("/EstExpert", authorize="ALL")
def delete_expert_cid_lid(cid: int, lid: int):
    res = db.get_expert_cid_lid(cid=cid, lid=lid)
    if not res:
        return "Ce user n'est pas expert dans cette catégorie", 404
    db.delete_expert_cid_lid(cid=cid, lid=lid)
    return "", 204


# Get appartient (when we want to list the group members that exist)
# GET /appartient (filter, filtre_lid, filter_by_mine)
@app.get("/appartient", authorize="ALL")
def get_appartient(filter=None, filtre_lid=True, filter_by_mine=True):
    # this calls the function defined from "queries.sql"
    if filter_by_mine:
        lid = db.get_user_id(login=app.current_user())
        res = db.get_appartient_filter_lid(filter=int(lid))
        log.debug(res)
    elif filter is None:
        res = db.get_appartient_all()
    else:
        if filtre_lid:
            res = db.get_appartient_filter_lid(
                filter=filter
            )  # returns groups of person name
        else:
            res = db.get_appartient_filter_groupe(
                filter=filter
            )  # returns member names for one group
    return json(res), 200


# POST /appartient (gid,lid)
@app.post("/appartient", authorize="ALL")
def post_appartient(gid: int, lid: int):
    # this fails if the (cid,lid) already exists
    res = db.get_appartient_all()
    if (gid, lid) in res:  # à vérifier avec fabien
        return "Im a teapot (coucou Kilian)", 409
    db.add_to_appartient(gid=gid, lid=lid)
    # end of transaction
    return "", 201


# DELETE /appartient (gid,lid)
@app.delete("/appartient", authorize="ALL")
def delete_appartient_gid_lid(gid: int, lid: int):
    res = db.get_appartient_gid_lid(gid=gid, lid=lid)
    if not res:
        return "Ce user n'est pas un membre dans cette groupe", 404
    db.delete_appartient_gid_lid(gid=gid, lid=lid)
    return "", 204


# SHOULD STAY AS LAST LOC
log.debug("running…")

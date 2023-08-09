#
# Authentication and Authorization Helpers
#

import logging
from typing import Optional
from FlaskSimpleAuth import Flask, ErrorResponse  # type: ignore
from database import db

log = logging.getLogger(__name__)
log.setLevel(logging.DEBUG)


# authentication helper function
def get_user_pass(login: str) -> Optional[str]:
    res = db.get_auth_login(login=login)
    return res[0] if res else None


# group authorization helper function
def user_in_group(login: str, group: str) -> Optional[bool]:
    res = db.get_auth_login(login=login)
    return (res[1] if group == "ADMIN" else False) if res else None  # fmt: skip


# a user can access an object they own


def check_owned_perms(login: str, oid: int, _mode):
    # log.debug(f"login : {login} et oid : {oid}")
    # log.debug(f"db = {sorted(db._available_queries)}")
    res = db.can_access_owned(login=login, oid=oid)
    return res[0] if res else None


def check_actionner_perms(login: str, oid: int, _mode):
    res = db.can_access_action(login=login, oid=oid)
    log.debug(f"le résultat de la requête est {res}")
    return res[0] if res else None


# register authentication and authorization helpers to FlaskSimpleAuth
def init_app(app: Flask):
    log.info(f"initializing auth for {app.name}")
    app.get_user_pass(get_user_pass)
    app.user_in_group(user_in_group)
    app.object_perms("owned", check_owned_perms)
    app.object_perms("actionner", check_actionner_perms)
    # app.object_perms(…)
    app.add_group("ADMIN")

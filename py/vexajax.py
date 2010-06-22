import logging
from django.utils import simplejson
from google.appengine.api import users
from google.appengine.ext import webapp

class Options:
  ALLOW_GET = True
  CACHE_TIME_S = 60

"""
URLGenerator: AppEngine specific URL Generator
"""
class AppEngineWrapper:
  @classmethod
  def LoginURL(cls):
    return users.create_login_url('/')

  @classmethod
  def LogoutURL(cls):
    return users.create_logout_url('/')

  @classmethod
  def CurrentUser(cls):
    return users.get_current_user()

  @classmethod
  def IsAdminUser(cls):
    return users.is_current_user_admin()

  @classmethod
  def StandardTemplateValues(cls):
    return {
      'user': CurrentUser(),
      'is_admin': IsAdminUser(),
      'login_url': LoginURL(),
      'logout_url': LogoutURL(),
    }

class AuthenticatedHandler(webapp.RequestHandler):
  def _IsUserAdmin(self):
    """Override this method"""
    return AppEngineWrapper.IsAdminUser()

  def _CheckAdmin(self):
    if (not self._IsUserAdmin()):
      self.response.clear()
      self.response.set_status(401)
      self.response.out.write(
          "<h2>Sorry. Access Denied.</h2> [ <a href='%s'>login</a> ]" %
          URLGenerator.Login())

      return False
    return True


class AJAXResponse(object):
  @classmethod
  def Success(cls, data):
    return simplejson.dumps({
      "success": True,
      "data": data
      })

  @classmethod
  def Error(cls, message):
    return simplejson.dumps({
      "success": False,
      "message": message
      })


class AJAXHandlerException(Exception):
  pass

class AJAXHandler(webapp.RequestHandler):
  def _Success(self, data):
    self.response.out.write(AJAXResponse.Success(data))

  def _Error(self, message):
    logging.info("(AJAX error) %s" % message)
    self.response.out.write(AJAXResponse.Error(message))

  def _IsUserAdmin(self):
    """Override this method"""
    return AppEngineWrapper.IsAdminUser()

  def _CheckAdmin(self):
    if (not _IsUserAdmin(self)):
      self.response.clear()
      self.response.set_status(401)
      self._Error("Access denied.")
      return False
    return True

  def _process(self):
    action = self.request.get('action')
    raise NotImplementedError("Method not implemented: _process, action: %s" %
        action)

  def get(self):
    if Options.ALLOW_GET:
      self.post()
    else:
      self._Error('No GET requests allowed');

  def post(self):
    self._process()

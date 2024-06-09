from rest_framework import authentication
from rest_framework import exceptions
from firebase_admin import auth
from .models import User

class FirebaseAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.META.get("HTTP_AUTHORIZATION")
        if not auth_header:
            return None

        id_token = auth_header.split(" ").pop()
        try:
            decoded_token = auth.verify_id_token(id_token)
        except Exception:
            raise exceptions.AuthenticationFailed("Invalid Firebase ID token")

        try:
            uid = decoded_token["uid"]
            email = decoded_token["email"]
            user = User.objects.get(social_login_uid=uid, email=email)
        except User.DoesNotExist:
            raise exceptions.AuthenticationFailed("User not found")

        return (user, None)
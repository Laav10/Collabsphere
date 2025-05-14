# auth.py
from flask import Blueprint, request, jsonify
import firebase_admin
from firebase_admin import credentials, auth
from functools import wraps

# Initialize Firebase Admin SDK
cred = credentials.Certificate("key.json")

#firebase_admin.initialize_app(cred)

# Create a blueprint for authentication
#auth_bp = Blueprint('auth', __name__)

# Custom Decorator for Firebase UID Authentication
def firebase_uid_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        uid = request.cookies.get('uid')
        print(uid,"ss")
        #print("f")
        if not uid:
            return jsonify({"message": "Unauthorized"}), 401

        try:
            user = auth.get_user(uid)
        except firebase_admin.exceptions.FirebaseError as e:
            return jsonify({"message": "Unauthorized"}), 401
        
        # Attach user data to the request
        request.user = user
        return f(*args, **kwargs)
    return decorated_function

import firebase_admin
from firebase_admin import credentials, auth,firestore
from flask import Flask, request, jsonify,make_response
from flask_cors import CORS  # Import CORS
import time
from data_valid import UserSchema,add_project_schema,first_login_schema,list_of_mentors_schema,apply_mentors_schema,apply_mentors_status_takeback_schema
from data_valid import accept_mentor_schema,apply_project_schema,apply_project_status_schema,list_apply_project_schema,list_projects_scheme
from datetime import datetime

from smtp import send_email
from sql import add_projects,ranking,first_logins,profile_views,list_of_mentors_sql,apply_mentors_sql,apply_project_sql
from sql import apply_project_status_sql,list_apply_project_sql,update_project_application_status_sql,apply_project_status_takeback_sql,update_profile_sql,accept_mentor_sql
from sql import apply_mentors_takeback_sql,list_users_sql,list_projects_sql,list_current_projects_sql,list_past_projects_sql,admin_request_sql,admin_request_accept_sql,list_myprojects_sql,user_insert_google_sql
from google.cloud.firestore_v1 import FieldFilter
# Initialize Firebase Admin
cred = credentials.Certificate("key.json")
firebase_admin.initialize_app(cred)
db = firestore.client()
users = db.collection('users')

app = Flask(__name__)
CORS(app,supports_credentials=True)
@app.route('/verify/user_id',methods=['POST'])
def verify_email():
            data = request.json
            id_token = data.get("idToken")
            uid = data.get("uid")
            user_email = data.get("user_email")

            fingerprint = data.get("fingerprint")

            decoded_token = auth.verify_id_token(id_token)  # Verify token
       
            if decoded_token['uid'] != uid:
               return jsonify({"user_verfied": "false"}), 403
            #set in db
           # users.set({"first": "Ada", "last": "Lovelace", "born": 1815})

           
            response = make_response(jsonify({"user_verified": True, "message": "Cookie Set"}))
            response.set_cookie(
            "uid", uid, 
            httponly=True,  # Prevent JS access (security)
            secure=True,  # Only allow over HTTPS
            samesite="None",  # Restrict cross-site access
            max_age=60*60*24*3, ) # 3 days expiration
            
            response.set_cookie(
            "fingerprint", fingerprint, 
            httponly=True,  # Prevent JS access (security)
            secure=True,  # Only allow over HTTPS
            samesite="None",  # Restrict cross-site access
            max_age=60*60*24*3, ) 

            try:
              
              users = db.collection('users').document(user_email)
              users.set({
    "uid": uid,
    "fingerprint": fingerprint,
    "created_at": datetime.utcnow()  # Store exact timestamp from Python
})
              print("Firestore write successful!")  # ✅ Debug message
            except Exception as e:
                 print(f"Firestore error: {e}")  # Log the error
                 return jsonify({"success": False, "message": f"Firestore error: {e}"}), 500  # Return error response
            # put uid and fingerprint in firebase db
            print(response.headers)
            return response
import re

def transform_email(username):
    # Extract year and branch code
    username = username.split('@')[0]  

    match = re.search(r'(\d{2})([a-zA-Z]+)(\d+)$', username)
    if match:
        year, branch, roll = match.groups()
        return f"20{year}{branch}{roll.zfill(4)}"  # Ensure roll number is 4 digits
    return None  # Return None if the pattern does not match


@app.route('/verify/google', methods=['POST'])
def verify():
    #new sign in
    time.sleep(2)  # Add a 2-second delay before verifying

    data = request.json
    id_token = data.get("idToken")
    uid = data.get("uid")
    email=data.get("email")
    roll_no= transform_email(email)

    fingerprint = data.get("fingerprint")
    #print(data)
    try:
        decoded_token = auth.verify_id_token(id_token)  # Verify token
        user_name = decoded_token.get('name')
        print(f"User name: {user_name}")
        user_name = user_name.replace("-IIITK", "").strip()
        data['user_name']=user_name
        data[roll_no]=roll_no
        #data[user_name]=user_name
       

        #print(decoded_token)
        if decoded_token['uid'] != uid:
              return jsonify({"user_verfied": "false"}), 403
        # Verify fingerprint (implement fingerprint logic)
       # if fingerprint :
          #return jsonify({"error": "Fingerprint mismatch"}), 403
        try:
         #   print(username)
            users = db.collection('users').document(roll_no)
            user_insert_google_sql(data)
        

            
            users.set({
    "uid": uid,
    "fingerprint": fingerprint,
    "created_at": datetime.utcnow() })
           # Add to Firestore
            print("success")
            print("ds")
            response = make_response(jsonify({"user_verified": True, "message": "cookie set"}))
            response.set_cookie(
            "fingerprint", fingerprint, 
         
            httponly=True,  # Prevent JS access (security)
            
            secure=True,  # Only allow over HTTPS
            samesite="None",  # Restrict cross-site access
            max_age=60*60*24*3,  # 7 days expiration
            
            )
            response.set_cookie(
            "uid", uid, 
         
            httponly=True,  # Prevent JS access (security)
            secure=True,  # Only allow over HTTPS
            samesite="None",  # Restrict cross-site access
            max_age=60*60*24*3,  # 7 days expiration
            
            )
           # print(response.headers)
            return response
               #add user in db if not present
        except Exception as e:
             print(e,"s")
             return jsonify({"error": str(e)}), 500

        
    except Exception as e:
         return jsonify({"error": str(e)}), 401

 
@app.route('/auto_login',methods=['GET','POST'])
def auto_login():
    if request.method=='GET':
     #    uid=request.cookies.get("uid")
       #  print(uid)
       #take fingerprint frontend
       
     uid=request.cookies.get("uid")

     
     fingerprint=request.cookies.get("fingerprint")


     if not uid or not fingerprint:
        return jsonify({"authenticated": False, "message": "Session expired"}), 401
     

     try:
       #user=auth.get_user(uid)
      # use firebase client and set expiration time
       result = users.where(filter=FieldFilter("uid", "==", uid)) \
              .where(filter=FieldFilter("fingerprint", "==", fingerprint))

       output=result.get()
       if output:
             
         return jsonify({
            "authenticated": True,

        })
       else:
            return jsonify({"authenticated": False, "message": "Invalid session"}), 401


     except:
         return jsonify({"authenticated": False, "message": "Invalid session"}), 401
@app.route('/logout',methods=['GET'])
def logout():
 try:
    response = make_response(jsonify({"success": True, "message": "Logged out"}))
    response.delete_cookie("uid")
    response.delete_cookie("fingerprint")
    return jsonify({"deleted":True}), 200
 except Exception as e:
    return jsonify({"deleted":False}), 500

@app.route('/add/project',methods=['POST'])
def add_project():


    data = request.json
    errors=add_project_schema().validate(data)
    if errors:
        return jsonify({"error": errors}), 400
    else:
       return add_projects(data)
    
@app.route('/best_projects',methods=['GET'])
def best_projects():
      
      return ranking()

@app.route('/first_login',methods=['POST'])
def first_login():
      
      data=request.json
      errors=first_login_schema().validate(data)
      if errors:
        return jsonify({"errors": errors}), 400
      else:
          return first_logins(data)
@app.route('/profile/view',methods=['POST'])
def profile_view():
        data=request.json
        errors=first_login_schema().validate(data)
        if errors:
         return jsonify({"errors": errors}), 400
        else:
          return profile_views(data)

@app.route('/update/profile',methods=['POST'])
def update_profile():
    data=request.json
    schema = UserSchema()
    errors = schema.validate(data)
    if errors:
        return jsonify({"errordd": errors}), 400
    else:
     return update_profile_sql(data)


"""@app.route('/list/mentors',methods=['POST'])
def list_of_mentors():
     data=request.json
     errors=list_of_mentors_schema().validate(data)
     if errors:
      return jsonify({"errors": errors}), 400
     else:
      return list_of_mentors_sql(data)

@app.route('/apply/mentors',methods=['POST'])
def apply_mentors():
     
     data=request.json
     errors=apply_mentors_schema().validate(data)
     if errors:
       return jsonify({"errors": errors}), 400
     else:
       return apply_mentors_sql(data)
@app.route('/apply/mentors/status/takeback',methods=['POST'])
def apply_mentors_status_takeback():
    data=request.json
    errors=apply_mentors_status_takeback_schema().validate(data)
    if errors:
       return jsonify({"errors": errors}), 400
    else:
      return apply_mentors_takeback_sql(data)
@app.route('/accept/mentors',methods=['POST'])
def accept_mentor():
     data=request.json
     errors=accept_mentor_schema().validate(data)
     if errors:
       return jsonify({"errors": errors}), 400
     else:
         #required mentor_id(user_id),project_id
       return accept_mentor_sql(data)
     """
@app.route('/list/projects',methods=['POST'])
def list_projects():
    data=request.json
    errors=list_projects_scheme().validate(data)
    if errors:
        return jsonify({"errors":errors}),400
    
    else:
        return list_projects_sql(data)
    
@app.route('/list/current/projects',methods=['POST'])
def list_current_projects():
    data=request.json
    errors=list_projects_scheme().validate(data)
    if errors:
        return  jsonify({"errors":errors}),400
    else:
        return list_current_projects_sql(data)
    

@app.route('/list/past/projects',methods=['POST'])
def list_past_projects():
    data=request.json
    errors=list_projects_scheme().validate(data)
    if errors:
        return  jsonify({"errors":errors}),400
    else:
        return list_past_projects_sql(data)
    
@app.route('/list/myprojects',methods=['POST'])
def list_myprojects():
    data=request.json
    errors=list_projects_scheme().validate(data)
    if errors:
        return  jsonify({"errors":errors}),400
    else:
        return list_myprojects_sql(data)
     
 

@app.route('/apply/project',methods=['POST'])
def apply_project():
      data=request.json
      errors=apply_project_schema().validate(data)
      if errors:
        return jsonify({"errors": errors}), 400
      else:
        return apply_project_sql(data)
@app.route('/apply/project/status',methods=['POST'])
def apply_project_status():
    
  data=request.json
  errors=apply_project_status_schema().validate(data)
  if errors:
        return jsonify({"errors": errors}), 400
  else:
     return apply_project_status_sql(data)

@app.route('/apply/project/status/takeback',methods=['POST'])
def apply_project_status_takeback():
    data=request.json
    errors=apply_project_status_schema().validate(data)
    if errors:
        return jsonify({"errors": errors}), 400
    else:
        
        return apply_project_status_takeback_sql(data)

@app.route('/list/apply/status',methods=['POST'])
def list_apply_project_():
    data=request.json
    errors=list_apply_project_schema().validate(data)
    return list_apply_project_sql(data)

@app.route('/update/project/app/status',methods=['POST'])
def list_update_project_status():
    data=request.json
   # errors=update_project_status_schema().validate(data)
    return update_project_application_status_sql(data)

#delete project by admi

@app.route('/admin/request',methods=['POST'])

def admin_request():
 #check user_id is admin or not  later 
 data=request.json
#check whether user is admin  then request

 return admin_request_sql(data)



@app.route('/admin/request/accept',methods=['POST'])

def admin_request_accept():
 #check user_id is admin or not  later 
 data=request.json
#check whether user is admin  then request

 return admin_request_accept_sql(data)






#discuss request to join

 
@app.route('/list/users',methods=['GET'])
def list_users():
    
     return list_users_sql()


     
if __name__ == "__main__":
    app.run(debug=True)



#email notification of things



       



         




    
     
     
     



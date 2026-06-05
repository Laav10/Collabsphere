import firebase_admin
from firebase_admin import credentials, auth, firestore
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS, cross_origin
import os
import time
from data_valid import UserSchema,add_project_schema,first_login_schema,list_of_mentors_schema,apply_mentors_schema,apply_mentors_status_takeback_schema
from data_valid import accept_mentor_schema,apply_project_schema,apply_project_status_schema,list_apply_project_schema,list_projects_scheme
from datetime import datetime,timedelta
from auth import firebase_uid_required
from smtp import send_email
from sql import *
from google.cloud.firestore_v1 import FieldFilter
from dotenv import load_dotenv

load_dotenv()

# ── Environment ────────────────────────────────────────────────────────────────
IS_PROD    = os.getenv("FLASK_ENV", "development") == "production"
# Comma-separated list of allowed frontend origins, e.g.:
#   ALLOWED_ORIGINS=https://collabsphere.vercel.app,https://www.collabsphere.in
ALLOWED_ORIGINS = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:52843,http://127.0.0.1:3000").split(",")]

COOKIE_SECURE   = IS_PROD          # True in prod (requires HTTPS)
COOKIE_SAMESITE = "None" if IS_PROD else "Lax"

# ── Firebase Admin ─────────────────────────────────────────────────────────────
cred = credentials.Certificate("key.json")
firebase_admin.initialize_app(cred)
db    = firestore.client()
users = db.collection('users')

# ── Flask app ──────────────────────────────────────────────────────────────────
app = Flask(__name__)

CORS(app,
     origins=ALLOWED_ORIGINS,
     supports_credentials=True)

@app.route('/check',methods=['GET'])
def check():
   return insert()


@app.route('/verify/user_id',methods=['POST'])
def verify_email():
            data = request.json
            id_token = data.get("idToken")
            uid = data.get("uid")
            user_email = data.get("user_email")

            fingerprint = data.get("fingerprint")

            decoded_token = auth.verify_id_token(id_token, clock_skew_seconds=10)
       
            if decoded_token['uid'] != uid:
               return jsonify({"user_verfied": "false"}), 403
            #set in db
           # users.set({"first": "Ada", "last": "Lovelace", "born": 1815})

           
            response = make_response(jsonify({"user_verified": True, "message": "Cookie Set"}))
            response.set_cookie(
            "uid", uid,
            httponly=True, secure=COOKIE_SECURE, samesite=COOKIE_SAMESITE,
            max_age=60*60*24*3)

            response.set_cookie(
            "fingerprint", fingerprint,
            httponly=True, secure=COOKIE_SECURE, samesite=COOKIE_SAMESITE,
            max_age=60*60*24*3) 

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

    data = request.json
    id_token = data.get("idToken")
    uid = data.get("uid")
    email=data.get("email")
    roll_no= transform_email(email)

    fingerprint = data.get("fingerprint")
    #print(data)
    try:
        decoded_token = auth.verify_id_token(id_token, clock_skew_seconds=10)
        user_name = decoded_token.get('name')
        print(f"User name: {user_name}")
        user_name = user_name.replace("-IIITK", "").strip()
        data['user_name']=user_name
        #data[roll_no]=roll_no
        data['roll_no']=email.split('@')[0]

        #data[user_name]=user_name
       

      
        if decoded_token['uid'] != uid:
              return jsonify({"user_verfied": "false",}), 403
        # Verify fingerprint (implement fingerprint logic)
       # if fingerprint :
          #return jsonify({"error": "Fingerprint mismatch"}), 403
        try:
         #   print(username)
         #not for prof
            users = db.collection('users').document( email.split('@')[0] )
        

            
            users.set({
    "uid": uid,
    "fingerprint": fingerprint,
    "created_at": datetime.utcnow() })
           # Add to Firestore
            print("success")
            print("ds")
            # Insert/update user in postgres (non-blocking — login succeeds even if DB is down)
            try:
                user_insert_google_sql(data)
            except Exception as sql_err:
                print("SQL insert failed (non-fatal):", sql_err)

            response = make_response(jsonify({
                "user_verified": True,
                "message": "cookie set",
                "roll_no": data['roll_no']
            }))
            response.set_cookie("fingerprint", fingerprint,
                httponly=True, secure=COOKIE_SECURE, samesite=COOKIE_SAMESITE,
                max_age=60*60*24*3)
            response.set_cookie("uid", uid,
                httponly=True, secure=COOKIE_SECURE, samesite=COOKIE_SAMESITE,
                max_age=60*60*24*3)
            return response

        except Exception as e:
            print("verify/google inner error:", e)
            return jsonify({"error": str(e)}), 500

        
    except Exception as e:
         return jsonify({"error": str(e)}), 401

def get_roll_no(uid):
    user_id=auth.get_user(uid)
    
    email=user_id.email.split('@')[0]
    return email
#uid="cpV0OfOaqvfQGdGMI6c1vkjqTEg2"
#get_roll_no(uid)
 
@app.route('/auto_login', methods=['GET'])
def auto_login():
    uid = request.cookies.get("uid")
    fingerprint = request.cookies.get("fingerprint")

    if not uid or not fingerprint:
        return jsonify({"authenticated": False, "message": "No session"}), 401

    try:
        result = users.where(filter=FieldFilter("uid", "==", uid)) \
                      .where(filter=FieldFilter("fingerprint", "==", fingerprint))
        output = result.get()
        if output:
            try:
                roll_no = get_roll_no(uid)
            except Exception:
                roll_no = None
            return jsonify({"authenticated": True, "roll_no": roll_no})
        return jsonify({"authenticated": False, "message": "Invalid session"}), 401
    except Exception as e:
        print("auto_login error:", e)
        return jsonify({"authenticated": False, "message": "Invalid session"}), 401
@app.route('/logout', methods=['GET'])
def logout():
    try:
        response = make_response(jsonify({"success": True}))
        response.delete_cookie("uid", samesite=COOKIE_SAMESITE, secure=COOKIE_SECURE)
        response.delete_cookie("fingerprint", samesite=COOKIE_SAMESITE, secure=COOKIE_SECURE)
        return response
    except Exception as e:
        return jsonify({"deleted": False}), 500

@app.route('/add/project',methods=['POST'])
@firebase_uid_required  # Apply the middleware here to protect the route

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
@firebase_uid_required  # Apply the middleware here to protect the route

def update_profile():
    data=request.json
    schema = UserSchema()
   # errors = schema.validate(data)
   # if errors:
      #  return jsonify({"errordd": errors}), 400
    #else:
    return update_profile_sql(data)


@app.route('/list/mentors',methods=['POST'])
@firebase_uid_required
def list_of_mentors():
     data=request.json
     errors=list_of_mentors_schema().validate(data)
     if errors:
      return jsonify({"errors": errors}), 400
     else:
      return list_of_mentors_sql(data)

@app.route('/apply/mentors',methods=['POST'])
@firebase_uid_required
def apply_mentors():
     
     data=request.json
     errors=apply_mentors_schema().validate(data)
     if errors:
       return jsonify({"errors": errors}), 400
     else:
       return apply_mentors_sql(data)
@app.route('/apply/mentors/status/takeback',methods=['POST'])
@firebase_uid_required
def apply_mentors_status_takeback():
    data=request.json
    errors=apply_mentors_status_takeback_schema().validate(data)
    if errors:
       return jsonify({"errors": errors}), 400
    else:
      return apply_mentors_takeback_sql(data)
@app.route('/accept/mentors',methods=['POST'])
@firebase_uid_required
def accept_mentor():
     data=request.json
     errors=accept_mentor_schema().validate(data)
     if errors:
       return jsonify({"errors": errors}), 400
     else:
         #required mentor_id(user_id),project_id
       return accept_mentor_sql(data)
   
@app.route('/list/projects',methods=['POST'])
 # Apply the middleware here to protect the route
@firebase_uid_required
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
    
@app.route('/list/myprojects', methods=['POST'])
@firebase_uid_required
def list_myprojects():
    data = request.json or {}
    if not data.get('user_id'):
        return jsonify({"errors": "user_id required"}), 400
    errors = list_projects_scheme().validate(data)
    if errors:
        return jsonify({"errors": errors}), 400
    return list_myprojects_sql(data)
     
 

@app.route('/apply/project',methods=['POST'])
@firebase_uid_required
 # Apply the middleware here to protect the route

def apply_project():
      data=request.json
      errors=apply_project_schema().validate(data)
      if errors:
        return jsonify({"errors": errors}), 400
      else:
        return apply_project_sql(data)
@app.route('/apply/project/status',methods=['POST'])
@firebase_uid_required  # Apply the middleware here to protect the route

def apply_project_status():
    
  data=request.json
  errors=apply_project_status_schema().validate(data)
  if errors:
        return jsonify({"errors": errors}), 400
  else:
     return apply_project_status_sql(data)

@app.route('/apply/project/status/takeback',methods=['POST'])
@firebase_uid_required  # Apply the middleware here to protect the route

def apply_project_status_takeback():
    data=request.json
    errors=apply_project_status_schema().validate(data)
    if errors:
        return jsonify({"errors": errors}), 400
    else:
        
        return apply_project_status_takeback_sql(data)

@app.route('/list/apply/status',methods=['POST'])
@firebase_uid_required  # Apply the middleware here to protect the route

def list_apply_project_():
    data=request.json
    errors=list_apply_project_schema().validate(data)
    return list_apply_project_sql(data)

@app.route('/update/project/app/status',methods=['POST'])
@firebase_uid_required  # Apply the middleware here to protect the route

def list_update_project_status():
    data=request.json
   # errors=update_project_status_schema().validate(data)
    return update_project_application_status_sql(data)

#delete project by admi

@app.route('/admin/request',methods=['POST'])
@firebase_uid_required  # Apply the middleware here to protect the route


def admin_request():
 #check user_id is admin or not  later 
 data=request.json
#check whether user is admin  then request

 return admin_request_sql(data)



@app.route('/admin/request/accept',methods=['POST'])
@firebase_uid_required  # Apply the middleware here to protect the route


def admin_request_accept():
 data=request.json

 return admin_request_accept_sql(data)






#discuss request to join

 
@app.route('/list/users', methods=['GET'])
def list_users():
    return list_users_sql()

@app.route('/notification',methods=['POST'])
@firebase_uid_required  # Apply the middleware here to protect the route

def notification():

 data=request.json
 
 return notification_sql(data)

@app.route('/verify/member',methods=['POST'])
@firebase_uid_required
def verify_member():
 data=request.json
 return member_sql(data)

@app.route('/change/sprint/status',methods=['POST'])
@firebase_uid_required
def change_sprint_status():
 data=request.json
 return change_sprint_status_sql(data)


#laavanya

#1
@app.route('/project/view_details', methods=['GET'])
@firebase_uid_required
def view_project_details():
    project_id = request.args.get("project_id")
    #print(f"Received project_id: {project_id}") 

    if not project_id:
        return jsonify({"error": "Missing project_id parameter"}), 400

    details = get_project_details(project_id)

    if not details:
        return jsonify({"error": "Project not found"}), 404

    return jsonify(details), 200

#2
@app.route('/project/analytics', methods=['GET'])
@firebase_uid_required
def project_analytics():
    project_id = request.args.get("project_id")
    if not project_id:
        return jsonify({"error": "Missing project_id parameter"}), 400
    try:
       
        project_id = int(project_id)
        analytics = get_project_analytics(project_id)
        
        if analytics is None:
            return jsonify({"error": "Project not found"}), 404
        return jsonify(analytics), 200
    except ValueError:
        return jsonify({"error": "Invalid project_id"}), 400
    except Exception as e:
        print(f"Error in project_analytics route: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

#3   
@app.route('/project/view_tasks', methods=['GET'])
@firebase_uid_required
def view_sprint_tasks():
    
    project_id = request.args.get("project_id")
    if not project_id:
        return jsonify({"error": "Missing project_id parameter"}), 400
    try:
        
        project_id = int(project_id)
        sprints = get_sprint_tasks(project_id)
        if not sprints:
            return jsonify({"error": "No sprints found for this project"}), 404
        return jsonify({"sprints": sprints}), 200
    except ValueError:
        return jsonify({"error": "Invalid project_id format"}), 400
    except Exception as e:
        print(f"Error in view_sprint_tasks: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500
    
#4
@app.route('/project/view_sprints', methods=['GET'])
@firebase_uid_required

def get_sprints_route():
    uid = request.cookies.get('uid')
    print(uid)

    """API endpoint to fetch sprints for a given project."""
    project_id = request.args.get("project_id")
    
    if not project_id:
        return jsonify({"error": "Missing required parameter: project_id"}), 400

    try:
        sprints = get_sprints(project_id)  
        return jsonify({"sprints": [{"sprint_id": s[0], "name": s[1], "Start": s[2], "End": s[3], "Status": s[4]} for s in sprints]}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500

#5
#Mapping Frontend to Backend
STATUS_MAPPING = {
    "To Do": "pending",
    "In Progress": "review",
    "Completed": "done"
}
def has_project_access(user_id, project_id):
    """Check if the user is an admin, mod, or mentor for a project in Firestore."""
    try:
        project_ref = db.collection("projects").document(project_id).get()
        if project_ref.exists:
            project_data = project_ref.to_dict()
            return user_id in project_data.get("admins", []) or \
                   user_id in project_data.get("moderators", []) or \
                   user_id in project_data.get("mentors", [])
        return False
    except Exception as e:
        print(f"Error checking user access: {e}")
        return False
@app.route('/project/edit_tasks/add_task', methods=['POST'])
@firebase_uid_required
def add_task_route():

    """API endpoint to add a task to a sprint with access control."""
    data = request.json
    print(data)
    project_id = data.get("project_id")
    sprint_number = data.get("sprint_number")
    description = data.get("description")
    assigned_to = data.get("assigned_to")
    points = data.get("points")
    user_id = data.get("user_id")  
   # status = data.get("status", "To Do") 
    status="To Do"
    print(data,"lala",status) 

    if not all([project_id, sprint_number, description, assigned_to, points, user_id]):
        return jsonify({"error": "Missing required parameters"}), 400

   # if not has_project_access(user_id, project_id): 
      # return jsonify({"error": "Unauthorized"}), 403
    
    # **Check if Sprint is Open**
    sprint_status = get_sprint_status(project_id, sprint_number)
    if  sprint_status != "open":
                return jsonify({"error": "Cannot add task. Sprint is not open."}), 400

    if status in STATUS_MAPPING:
       status = STATUS_MAPPING[status]
    else:
        return jsonify({"error": "Invalid status value"}), 400

    try:
         add_task(project_id, sprint_number, description, assigned_to, points, status)
         return jsonify({"message": "Task added successfully!"}), 201
      
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/project/edit_tasks/update_task_status', methods=['POST','OPTIONS'])
@cross_origin(origins="http://localhost:3000", supports_credentials=True)
@firebase_uid_required

def update_task_routes():
    data = request.json
    print(data)
    task_id = data.get("task_id")

    if not task_id:
        return jsonify({"error": "Missing required parameter: task_id"}), 400

   # allowed_fields = ["description", "assigned_to", "status", "points"]
    #updates = {key: data[key] for key in data if key in allowed_fields}

  #  if not updates:
     #   return jsonify({"error": "No fields provided to update"}), 400

   # if "status" in updates and updates["status"] in STATUS_MAPPING:
       # updates["status"] = STATUS_MAPPING[updates["status"]]
    status=STATUS_MAPPING[data["status"]]
    try:
        with engine.connect() as conn:
            print(f"Checking if task {task_id} exists...")  
            result = conn.execute(
                text("SELECT COUNT(*) FROM task WHERE id = :task_id"),
                {"task_id": task_id}
            ).scalar()

            if result == 0:
                return jsonify({"error": "Task ID does not exist"}), 404

        
        success = update_task_status(task_id, status)
        if success:
            return jsonify({"message": "Task updated successfully!"}), 200
        else:
            return jsonify({"error": "Failed to update task"}), 500

    except Exception as e:
        print(f"Database Error: {str(e)}")  
        return jsonify({"error": str(e)}), 500
#6
@app.route('/project/edit_tasks/update_task', methods=['POST','OPTIONS'])
@cross_origin(origins="http://localhost:3000", supports_credentials=True)
@firebase_uid_required

def update_task_route():
    data = request.json
    print(data)
    task_id = data.get("task_id")

    if not task_id:
        return jsonify({"error": "Missing required parameter: task_id"}), 400

    allowed_fields = ["description", "assigned_to", "status", "points"]
    updates = {key: data[key] for key in data if key in allowed_fields}
 
    if not updates:
        return jsonify({"error": "No fields provided to update"}), 400

    if "status" in updates and updates["status"] in STATUS_MAPPING:
        updates["status"] = STATUS_MAPPING[updates["status"]]

    try:
        with engine.connect() as conn:
            print(f"Checking if task {task_id} exists...")  
            result = conn.execute(
                text("SELECT COUNT(*) FROM task WHERE id = :task_id"),
                {"task_id": task_id}
            ).scalar()

            if result == 0:
                return jsonify({"error": "Task ID does not exist"}), 404

        
        success = update_task(task_id, **updates)
        if success:
            return jsonify({"message": "Task updated successfully!"}), 200
        else:
            return jsonify({"error": "Failed to update task"}), 500

    except Exception as e:
        print(f"Database Error: {str(e)}")  
        return jsonify({"error": str(e)}), 500
    
#7
@app.route('/project/task/start', methods=['POST'])
@firebase_uid_required
def start_task():
    """Move task from To Do to In Progress"""
    data = request.json
    task_id = data.get('task_id')
    frontend_status = data.get('status')  

    if not task_id or not frontend_status:
        return jsonify({"error": "Missing task_id or status"}), 400

   
    db_status = STATUS_MAPPING.get(frontend_status)
    if not db_status:
        return jsonify({"error": f"Invalid status: {frontend_status}"}), 400

    try:
        success = update_task(task_id, status=db_status)  
        if success:
            return jsonify({"message": f"Task {task_id} moved to {frontend_status}."}), 200
        else:
            return jsonify({"error": "Failed to update task"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

#8
@app.route('/project/task/complete', methods=['POST'])
@firebase_uid_required
def complete_task():
    """Move task from In Progress to Completed"""
    data = request.json
    task_id = data.get('task_id')
    frontend_status = data.get('status')  

    if not task_id or not frontend_status:
        return jsonify({"error": "Missing task_id or status"}), 400

    db_status = STATUS_MAPPING.get(frontend_status)
    if not db_status:
        return jsonify({"error": f"Invalid status: {frontend_status}"}), 400

    try:
        success = update_task(task_id, status=db_status)  
        if success:
            return jsonify({"message": f"Task {task_id} marked as {frontend_status}."}), 200
        else:
            return jsonify({"error": "Failed to update task"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

#9
@app.route('/project/task/reopen', methods=['POST'])
@firebase_uid_required
def reopen_task():
    """Move task from Completed to To Do"""
    data = request.json
    task_id = data.get('task_id')
    frontend_status = data.get('status')  
    if not task_id or not frontend_status:
        return jsonify({"error": "Missing task_id or status"}), 400

    
    db_status = STATUS_MAPPING.get(frontend_status)
    if not db_status:
        return jsonify({"error": f"Invalid status: {frontend_status}"}), 400

    try:
        success = update_task(task_id, status=db_status)  
        if success:
            return jsonify({"message": f"Task {task_id} reopened to {frontend_status}."}), 200
        else:
            return jsonify({"error": "Failed to update task"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

#10
@app.route('/project/add_mod/eligible_users', methods=['GET'])
@firebase_uid_required
def get_eligible_users_route():
    """Fetch users eligible for moderator promotion"""
    project_id = request.args.get("project_id")
    
    if not project_id:
        return jsonify({"error": "Missing project_id"}), 400

    try:
        users = get_eligible_users_for_mod(project_id) 

        if not users:
            return jsonify({"message": "No eligible users found"}), 404
        
        return jsonify({"eligible_users": [{"roll_no": u[0], "name": u[1]} for u in users]}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


#11. 
@app.route('/project/add_mod/promote', methods=['POST'])
@firebase_uid_required
def promote_moderator_route(): 
    """Promote user to moderator role with proper checks"""
    data = request.json
    project_id = data.get("project_id")
    user_id = data.get("user_id")

    if not project_id or not user_id:
        return jsonify({"error": "Missing project_id or user_id"}), 400

    try:
        with engine.connect() as conn:
            success, message = promote_to_moderator(conn, project_id, user_id)
            if success:
                return jsonify({"message": message}), 200
            else:
                return jsonify({"error": message}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500

#12
@app.route('/project/add_mod/demote', methods=['POST'])
@firebase_uid_required
def demote_moderator_route():
    """Remove moderator role (Revert to Member)"""
    data = request.json
    project_id = data.get("project_id")
    user_id = data.get("user_id")

    if not project_id or not user_id:
        return jsonify({"error": "Missing project_id or user_id"}), 400

    try:
        success = remove_moderator(project_id, user_id)  
        if success:
            return jsonify({"message": f"User {user_id} demoted to Member."}), 200
        else:
            return jsonify({"error": "User is not a moderator or demotion failed."}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

#13
@app.route("/rate_member", methods=["POST"])
@firebase_uid_required
def rate_member():
    try:
        data = request.get_json()
        rated_by = data.get("rated_by")
        rated_user = data.get("rated_user")
        project_id = data.get("project_id")
        score = data.get("score")
        comment = data.get("comment", "")

        if not all([rated_by, rated_user, project_id, score]):
            return jsonify({"error": "Missing required fields"}), 400

        success = add_member_rating(rated_by, rated_user, project_id, score, comment)
        
        if success:
            return jsonify({"message": "Rating added successfully"}), 201
        else:
            return jsonify({"error": "Failed to add rating"}), 500
    except Exception as e:
        print(f"Error in rate_member: {e}")
        return jsonify({"error": "Internal server error"}), 500
    
#14
@app.route("/rate_project", methods=["POST"])
@firebase_uid_required
def rate_project():
    """Endpoint to rate a project (only if user is not a project member)"""
    try:
        data = request.get_json()
        user_id = data.get("user_id")
        project_id = data.get("project_id")
        score = data.get("score")
        comment = data.get("comment", "")

        if not all([user_id, project_id, score]):
            return jsonify({"error": "Missing required fields"}), 400

        success = add_project_rating(user_id, project_id, score, comment)

        if success:
            return jsonify({"message": "Project rating added successfully"}), 201
        return jsonify({"error": "You are a team member and cannot rate this project."}), 403

    except Exception as e:
        print(f"Error in rate_project: {e}")
        return jsonify({"error": "Internal server error"}), 500
    
#15 
@app.route('/project/create_sprint', methods=['POST'])
@firebase_uid_required
def create_sprint_route():
    """API endpoint to create a sprint."""
    data = request.get_json()
    user_id = data.get("user_id")  # Must be passed in the request body for now
    project_id = data.get("project_id")
    name = data.get("name")
    start_date = data.get("start_date")
    end_date = data.get("end_date")

    if not all([user_id, project_id, name, start_date, end_date]):
        return jsonify({"error": "Missing required fields"}), 400

    return create_sprint(user_id, project_id, name, start_date, end_date)
 

     
if __name__ == "__main__":
    app.run(debug=True)






#email notification of things



       



         




    
     
     
     



import firebase_admin
from firebase_admin import credentials, auth,firestore
from flask import Flask, request, jsonify,make_response
from flask_cors import CORS  # Import CORS
import time
from data_valid import UserSchema,add_project_schema,first_login_schema,list_of_mentors_schema,apply_mentors_schema,apply_mentors_status_takeback_schema
from data_valid import accept_mentor_schema,apply_project_schema,apply_project_status_schema,list_apply_project_schema,list_projects_scheme
from datetime import datetime

from smtp import send_email
#from sql import add_projects,ranking,first_logins,profile_views,list_of_mentors_sql,apply_mentors_sql,apply_project_sql
#from sql import apply_project_status_sql,list_apply_project_sql,update_project_application_status_sql,apply_project_status_takeback_sql,update_profile_sql,accept_mentor_sql
#from sql import apply_mentors_takeback_sql,list_users_sql,list_projects_sql,list_current_projects_sql,list_past_projects_sql,admin_request_sql,admin_request_accept_sql,list_myprojects_sql,user_insert_google_sql
from sql import *
from sql import engine
from google.cloud.firestore_v1 import FieldFilter

# Initializing  Firebase Admin - Aditya 
cred = credentials.Certificate("key.json")
firebase_admin.initialize_app(cred)
db = firestore.client()
users = db.collection('users')

app = Flask(__name__)
CORS(app,supports_credentials=True)

def is_admin(user_id, project_id):
    """Check if the user is an admin for a project in Firestore."""
    try:
        project_ref = db.collection("projects").document(project_id).get()
        if project_ref.exists:
            project_data = project_ref.to_dict()
            return user_id in project_data.get("admins", [])
        return False
    except Exception as e:
        print(f"Error checking admin status: {e}")
        return False

@app.route('/verify/user_id',methods=['POST'])
def verify_email():
            data = request.json
            id_token = data.get("idToken")
            uid = data.get("uid")
            user_email = data.get("user_email")

            fingerprint = data.get("fingerprint")

            decoded_token = auth.verify_id_token(id_token)  # Verifying token
       
            if decoded_token['uid'] != uid:
               return jsonify({"user_verfied": "false"}), 403
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

#delete project by admin

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



#________PROJECT__________#

@app.route('/project/view_details', methods=['GET'])
def view_project_details():
    project_id = request.args.get("project_id")
    if not project_id:
        return jsonify({"error": "Missing project_id parameter"}), 400
    try:
        details = get_project_details(project_id)
        if not details:
            return jsonify({"error": "Project not found"}), 404
        return jsonify(details), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/project/analytics', methods=['GET'])
def project_analytics():
    project_id = request.args.get("project_id")
    if not project_id:
        return jsonify({"error": "Missing project_id parameter"}), 400
    try:
        analytics = get_project_analytics(project_id)
        if analytics is None:
            return jsonify({"error": "Project not found"}), 404
        return jsonify(analytics), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/project/view_tasks', methods=['GET'])
def view_sprint_tasks():
    project_id = request.args.get("project_id")
    if not project_id:
        return jsonify({"error": "Missing project_id parameter"}), 400
    try:
        sprints = get_sprint_tasks(project_id)
        if not sprints:
            return jsonify({"error": "No sprints found for this project"}), 404
        return jsonify({"sprints": sprints}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/project/add_tasks', methods=['GET'])   
def add_task(conn, project_id, sprint_number, description, assigned_to, points):
    with conn.cursor() as cur:
        cur.execute("""
            INSERT INTO task (project_id, sprint_number, description, assigned_to, status, points)
            VALUES (%s, %s, %s, %s, 'pending', %s)
        """, (project_id, sprint_number, description, assigned_to, points))
        conn.commit()

@app.route('/project/view_sprints', methods=['GET'])   
def get_sprints(conn, project_id):
    with conn.cursor() as cur:
        cur.execute("""
            SELECT sprint_id, name FROM sprint
            WHERE project_id = %s
            ORDER BY sprint_id
        """, (project_id,))
        return cur.fetchall()
    
@app.route('/project/edit_tasks/add_task', methods=['POST'])
def add_task_route(): # Renamed to avoid function name conflicts
    data = request.json
    project_id = data['project_id']
    sprint_number = data['sprint_number']
    description = data['description']
    assigned_to = data['assigned_to']
    points = data['points']

    try:
        with engine.connect() as conn:
            add_task(conn, project_id, sprint_number, description, assigned_to, points)
        return jsonify({"message": "Task added successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/project/edit_tasks/update_task', methods=['POST'])
def update_task_route(): # Renamed to avoid function name conflicts
    data = request.json
    task_id = data['task_id']
    description = data['description']
    assigned_to = data['assigned_to']
    status = data['status']

    try:
        with engine.connect() as conn:
            update_task(conn, task_id, description, assigned_to, status)
        return jsonify({"message": "Task updated successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/project/edit_tasks/get_sprints/<int:project_id>', methods=['GET'])
def get_sprints_route(project_id): # Renamed to avoid function name conflicts
    try:
        with engine.connect() as conn:
            sprints = get_sprints(conn, project_id)
        return jsonify({"sprints": [{"sprint_id": s[0], "name": s[1]} for s in sprints]})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/project/task/start', methods=['POST'])
def start_task():
    """Move task from To Do to In Progress"""
    data = request.json
    task_id = data.get('task_id')

    if not task_id:
        return jsonify({"error": "Missing task_id"}), 400

    try:
        with engine.connect() as conn:
            update_task_status(conn, task_id, "review")
        return jsonify({"message": f"Task {task_id} moved to In Progress."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/project/task/complete', methods=['POST'])
def complete_task():
    """Move task from In Progress to Completed"""
    data = request.json
    task_id = data.get('task_id')

    if not task_id:
        return jsonify({"error": "Missing task_id"}), 400

    try:
        with engine.connect() as conn:
            update_task_status(conn, task_id, "done")
        return jsonify({"message": f"Task {task_id} marked as Completed."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/project/task/reopen', methods=['POST'])
def reopen_task():
    """Move task from Completed to To Do"""
    data = request.json
    task_id = data.get('task_id')

    if not task_id:
        return jsonify({"error": "Missing task_id"}), 400

    try:
        with engine.connect() as conn:
            update_task_status(conn, task_id, "pending")
        return jsonify({"message": f"Task {task_id} reopened to To Do List."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/project/add_mod/eligible_users', methods=['GET'])
def get_eligible_users_route(): # Renamed to avoid function name conflicts
    """Fetch users eligible for moderator promotion"""
    project_id = request.args.get("project_id")
    if not project_id:
        return jsonify({"error": "Missing project_id"}), 400

    try:
        with engine.connect() as conn:
            users = get_eligible_users_for_mod(conn, project_id)
        if not users:
            return jsonify({"message": "No eligible users found"}), 404
        return jsonify({"eligible_users": [{"roll_no": u[0], "name": u[1]} for u in users]}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/project/add_mod/promote', methods=['POST'])
def promote_moderator_route(): # Renamed to avoid function name conflicts
    """Promote user to moderator role"""
    data = request.json
    project_id = data.get("project_id")
    user_id = data.get("user_id")

    if not project_id or not user_id:
        return jsonify({"error": "Missing project_id or user_id"}), 400

    try:
        with engine.connect() as conn:
            promote_to_moderator(conn, project_id, user_id)
        return jsonify({"message": f"User {user_id} promoted to Moderator."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/project/add_mod/demote', methods=['POST'])
def demote_moderator_route(): # Renamed to avoid function name conflicts
    """Remove moderator role (Revert to Member)"""
    data = request.json
    project_id = data.get("project_id")
    user_id = data.get("user_id")

    if not project_id or not user_id:
        return jsonify({"error": "Missing project_id or user_id"}), 400

    try:
        with engine.connect() as conn:
            remove_moderator(conn, project_id, user_id)
        return jsonify({"message": f"User {user_id} demoted to Member."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


     
if __name__ == "__main__":
    app.run(debug=True)


@app.route("/rate_member", methods=["POST"])
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
    

@app.route("/rate_project", methods=["POST"])
def rate_project():
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
        else:
            return jsonify({"error": "Failed to add project rating"}), 500
    except Exception as e:
        print(f"Error in rate_project: {e}")
        return jsonify({"error": "Internal server error"}), 500

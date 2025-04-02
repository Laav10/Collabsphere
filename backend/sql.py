from sqlalchemy import create_engine,text
import psycopg2
from flask import Flask, request, jsonify
import binascii
from datetime import date


engine = create_engine('postgresql+psycopg2://postgres:Laav10%40inf@localhost:5432/collabsphere', echo=True)

from Crypto.Cipher import AES
import os
import base64

def encrypt_message(message, secret_key):
    cipher = AES.new(secret_key, AES.MODE_GCM)  # Use AES-GCM mode
    nonce = cipher.nonce  # Generate a unique nonce for each encryption
    ciphertext, tag = cipher.encrypt_and_digest(message.encode())  # Encrypt + Authentication Tag

    return base64.b64encode(nonce + tag + ciphertext).decode()

def decrypt_message(encrypted_message, secret_key):
    data = base64.b64decode(encrypted_message)
    nonce, tag, ciphertext = data[:16], data[16:32], data[32:]

    cipher = AES.new(secret_key, AES.MODE_GCM, nonce=nonce)
    return cipher.decrypt_and_verify(ciphertext, tag).decode()

def user_insert_google_sql(data):

    try:
        # Connect to the database
        with engine.connect() as conn:
            query = text("""INSERT INTO "User" (roll_no, name,email) VALUES (:roll_no, :name,:email)""")
            conn.execute(query, {"roll_no": 11, "name": data['user_name'],"email":data['email']})
            conn.commit()  # Commit the transaction
        return  jsonify({"user":"registered successfully"})
    except Exception as e:
        return f"Error: {str(e)}"

def  insert_message(message):
 with engine.connect() as conn:
     aes_key = binascii.unhexlify("f3a1c4e72d7b6a8fcb4d9912e5a8c37e4b9f02c6d78e5f1a9c3bdf8a45e7d203")

     print(message)
     encrypted_msg = encrypt_message(message['message'], aes_key)
     conn.execute(text("""
    INSERT INTO messages (username, usergroup, message,type,file_name) 
    VALUES 
    (:val1, :val2, :val3,:val4,:val5)"""),
   { "val1":message['username'],
    "val2":"general",
    "val3":encrypted_msg,
    "val4":message['type'],
    "val5":message['fileName']})
     conn.commit()

     decrypt_message(encrypted_msg, aes_key)
     print(decrypt_message(encrypted_msg, aes_key), "decrypted")



def  fetch_message(message):
 with engine.connect() as conn:
    
     conn.execute(text("""
  select * from messages where username=:val1



    """),{
  
  "val1":message['username']


     })
     conn.commit()

def add_projects(data):
   with engine.connect() as conn:
       # check whether with same admin same name other project exist
       result=conn.execute(text("""select * from "Project" where admin_id=:val1 and title=:val2"""),{
          
          "val1":data['admin_id'],
          "val2":data['title']})
       
       conn.commit()
   if(result.rowcount>0):
         print(result)  
           ### return can't be inserted change project name
         return jsonify({"project":"already exist"}), 401
   
   else:
      with engine.connect() as conn:
       # check whether with same admin same name other project exist
       try:
        result=conn.execute(text("""INSERT INTO "Project"
(admin_id, title, description, start_date, end_date, members_required, status, tags)
                                values
            (:val1,:val2,:val3,:val4,:val5,:val6,:val7,:val8)"""),{
          
          "val1":data['admin_id'],
          "val2":data['title'],
          "val3":data['description'],
          "val4":data['start_date'],
          "val5":data['end_date'],
         "val6":data['members_required'],
         "val7":data['status'],
         "val8":data['tags']
          
          })
        conn.commit()
         
        return jsonify({"project":"added"})


       

       except Exception as e: 
         return jsonify({"error": str(e)}), 500 
def ranking():
    with engine.connect() as conn:
        result=conn.execute(text("""SELECT 
    p.project_id, 
    p.title, 
    AVG(r.rating_value)*0.7+0.3 * COUNT(r.review) AS score
    FROM 
    Rating r
    JOIN 
    "Project" p ON r.project_id = p.project_id
    GROUP BY  
    p.project_id, 
    p.title
    ORDER BY 
    score DESC;
    """))
        conn.commit()
        
        rows=result.fetchall()
       
        data = [
    {"project_id": row[0], "title": row[1], "score": row[2]}
    for row in rows
]
        
        print(data)
        return jsonify({"project": data})
def first_logins(data):
       with engine.connect() as conn:
           try:
            result=conn.execute(text("""select * from "User" where roll_no=:val1"""),{
               "val1":data.get('roll_no')})
    
            conn.commit()
            if(result.rowcount>0):
               return jsonify ({"user":True})
            else:
             return jsonify ({"user":False}) 
           except Exception as e:
               return jsonify({"error": str(e)}), 500

def profile_views(data):
    #user profile view
    with engine.connect() as conn:
        try:
          result=conn.execute(text("""select * from "User" where roll_no=:val1"""),{
             
              "val1":data.get('roll_no')})
             
          conn.commit()
          rows=result.fetchall()
          data = [
    {
        "roll_no": row[0],  
        "email": row[1],  
        "past_experience": row[2],  
        "tech_stack": row[3],  
        "github_profile": row[4],  
        "linkedin_profile": row[5],  
        "role_type": row[6],  
        "rating": row[7]  ,
        "email_update": row[8],
        "project_update": row[9]
    }
    for row in rows
]
          if(result.rowcount==0):
              return jsonify({"user":False})
          else:
           return jsonify({"user": data})

        except Exception as e:
            return jsonify({"error": str(e)}), 500

def update_profile_sql(data):
   with engine.connect() as conn:
        try:
            query = text("""
        UPDATE "User"
        SET 
            
            past_experience = :past_experience,
            tech_stack = :tech_stack,
            github_profile = :github_profile,
            linkedin_profile = :linkedin_profile,
           
            
            email_update = :email_update,
            project_update = :project_update
        WHERE roll_no = :roll_no
    """)

            conn.execute(query, {
        
        "past_experience": data["past_experience"],
        "tech_stack": data["tech_stack"],
        "github_profile": data["github_profile"],
        "linkedin_profile": data["linkedin_profile"],
       
        "email_update": data["email_update"],
        "project_update": data["project_update"],
        "roll_no": data["roll_no"]
    })

            conn.commit()
            return jsonify({"profile":"updated"})
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        


def list_users_sql():
   #for students only:
   with engine.connect() as conn:
        try:
            query = text("""
                SELECT 
                    u.*, 
                     
                    COUNT(u.roll_no) AS project_count
                FROM 
                    "User" u
                LEFT JOIN 
                    "projectmembers" p ON u.roll_no = p.member_id
                JOIN 
                    "Project" pa ON p.project_id = pa.project_id
                WHERE 
                    pa.status = 'Completed'
                GROUP BY 
                    u.roll_no
            """)

            result = conn.execute(query)
            rows = result.fetchall()

            data = [
                {
                    "roll_no": row[0],
                    "email": row[1],
                    "past_experience": row[2],
                    "tech_stack": row[3],
                    "github_profile": row[4],
                    "linkedin_profile": row[5],
                    "role_type": row[6],
                    "rating": row[7],
                    "email_update": row[8],
                    "project_update": row[9],
                    "name":row[10],
                    "project_count": row[11]   # Count of users per project
                }
                for row in rows
            ]

            return jsonify({"projects": data})

        except Exception as e:
            return jsonify({"error": str(e)}), 500

def list_of_mentors_sql(data):
   #list of mentors  # addxtaus of reject applied pending
   ##first check whether project  has mentor or not.
 with engine.connect() as conn:

   result0=conn.execute(text("""select * from "projectmembers" where project_id=:val1 and role=:val2"""),{
      


        "val1":data['project_id'],
        "val2":"mentor"
   })
   if result0.rowcount>0:
        return jsonify({"mentor":"already exist"})
   else:
     project_id=data['project_id']
     with engine.connect() as conn:
      try:
        # return   in it the alumini professr to whom he applied status
         query = text("""
   SELECT 
    u.*, 
    CASE 
        WHEN m.status = 'Pending' THEN 'Pending' 
        ELSE 'Apply' 
    END AS status  
FROM "User" u
LEFT JOIN "mentorrequest" m 
    ON u.roll_no = m.mentor_id 
    AND m.project_id = :project_id  -- Filter for a specific project
WHERE u.role_type IN ('professor', 'alumni');

""")

         result = conn.execute(query, {"project_id": project_id})
         conn.commit()
         rows=result.fetchall()
         data = [
    {   
        "roll_no": row[0],  
        "email": row[1],  
        "past_experience": row[2],  
        "tech_stack": row[3],  
        "github_profile": row[4],  
        "linkedin_profile": row[5],  
        "role_type": row[6],  
        "rating": row[7]  ,
        "name":row[10],
        "status": row[11     ]
      
    }
        for row in rows
]
         return jsonify({"mentor":data})
      except Exception as e:
          return jsonify({"error": str(e)}), 500

def apply_mentors_sql(data):
   #apply for mentor
   with engine.connect() as conn:
      try:
          #check forreuested at
          result=conn.execute(text("""INSERT INTO "MentorRequest" (project_id, admin_id, mentor_id, status, requested_at, remarks)  
VALUES (:val1, :val2, :val3, :val4, :val5, :val6);
 """),{
    "val1":data['project_id'],
    "val2":data['admin_id'],
    "val3":data['mentor_id'],
    "val4":data['status'],
    "val5":data['requested_at'],
    "val6":data['remarks']
 })
          conn.commit()
          return jsonify({"mentor":"applied"})
      except Exception as e:
      
       return jsonify({"error": str(e)}), 500

def apply_mentors_takeback_sql(data):
    with engine.connect() as conn:
        try:
            result=conn.execute(text("""DELETE FROM "MentorRequest" WHERE mentor_id = :val1 AND project_id = :val2;"""),{
              "val1":data["mentor_id"],
              "val2":data["project_id"]
    
            })
            conn.commit()
            return jsonify({"request":"taken"})
        except Exception as e:
             return jsonify({"error": str(e)}), 500
      

def apply_project_sql(data):
   
   #apply for role in project
   with engine.connect() as conn:
      try:
         result=conn.execute(text("""Insert into "projectapplication" (user_id,project_id,role,remarks)
    VALUES(:val1,:val2,:val3,:val4);"""),{
       "val1":data['user_id'],
       "val2":data['project_id'],
        "val3":data['role'],
        "val4":data['remarks']





         })
         conn.commit()
         return jsonify({"project":"applied"})
      except Exception as e:
            return jsonify({"error": str(e)}), 500
      
      
def apply_project_status_takeback_sql(data):
   
   with engine.connect() as conn:
      try:
         result=conn.execute(text("""DELETE FROM "projectapplication" WHERE user_id = :val1 AND project_id = :val2;"""),{
           "val1":data["user_id"],
           "val2":data["project_id"]

         })
         print(data["user_id"],data["project_id"])
         conn.commit()
         return jsonify({"request":"taken"})
      except Exception as e:
          return jsonify({"error": str(e)}), 500
      

def  admin_request_sql(data):
     with engine.connect() as conn:
      try:
         result=conn.execute(text("""Insert into "projectjoin" (user_id,project_id,role,remarks)
    VALUES(:val1,:val2,:val3,:val4);"""),{
       "val1":data['to_user_id'],
       "val2":data['project_id'],
        "val3":data['role'],
        "val4":data['remarks']





         })
         conn.commit()
         return jsonify({"user":"requested"})
      except Exception as e:
            return jsonify({"error": str(e)}), 500
      

def admin_request_accept_sql(data):
    data = request.json
    query_check_exists = text("""
        SELECT COUNT(*) FROM "projectjoin"
        WHERE user_id = :user_id AND project_id = :project_id;
    """)
    query_update = text("""
        UPDATE "projectjoin" 
        SET status = :status
        WHERE user_id = :user_id AND project_id = :project_id;
    """)

    query_insert_member = text("""
        INSERT INTO "projectmembers" (project_id, member_id, role)
        VALUES (:project_id, :member_id, :role)
    """)

    query_delete_others = text("""
        DELETE FROM "projectjoin" 
        WHERE project_id = :project_id 
        AND user_id = :user_id;
    """)

    try:
        with engine.connect() as conn:
            result = conn.execute(query_check_exists, {
                "user_id": data["user_id"],
                "project_id": data["project_id"]
            })
            request_exists = result.scalar() # Get the count result
            print(request_exists,"ss")
            if request_exists == 0:
                return jsonify({"error": "No join request found"}), 400
            conn.execute(query_update, {
                "status": data["status"],
                "user_id": data["user_id"],
                "project_id": data["project_id"]
            })

            if data["status"] == "Accepted":
                 result1=conn.execute(text("""select * from projectapplication
                                              
                      where user_id=:val1 and project_id=:val2                        
                                              
                                              
                                              """),{
                                                  
                "val1":data["user_id"],
                "val2":data["project_id"]


                                              })
                  
                 rows=result1.fetchall()
                 datas = [
    {
          "application_id": row[0],
        "user_id":row[1],
        "project_id":row[2],
        "role":row[3],
        "status":row[4],
        "remarks":row[5]
      
    }
        for row in rows
]

                 conn.execute(query_insert_member, {
                    "member_id": data["user_id"],
                    "project_id": data["project_id"],
                    "role": datas[0]["role"] #add later
                })

                 conn.execute(query_delete_others, {
                    "project_id": data["project_id"],
                    "user_id": data["user_id"]
                })

                 conn.commit()
            else:
              conn.execute(query_delete_others, {
                    "project_id": data["project_id"],
                    "user_id": data["user_id"]
                })
            return jsonify({"request": "updated"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
         


def apply_project_status_sql(data):
   with engine.connect() as conn:
      try:
          #for single project and a user application status
         result=conn.execute(text("""select * from "projectapplication" where user_id=:val1 and project_id=:val2"""),{
       "val1":data['user_id'],
       "val2":data['project_id']


         })
         conn.commit()
         rows=result.fetchall()
         data = [
    {
          "application_id": row[0],
        "user_id":row[1],
        "project_id":row[2],
        "role":row[3],
        "status":row[4],
        "remarks":row[5]
      
    }
        for row in rows
]

         return jsonify({"project_status":data})
      
      except Exception as e:
            return jsonify({"error": str(e)}), 500
      

      

def list_apply_project_sql(data):
   # for single project how many people applied
   with engine.connect() as conn:
        try:
          result=conn.execute(text("""select * from "projectapplication" where project_id=:val1"""),{
              "val1":data['project_id']
          })

          rows=result.fetchall()
          data = [
    {
          "application_id": row[0],
        "user_id":row[1],
        "project_id":row[2],
        "role":row[3],
        "status":row[4],
        "remarks":row[5]
      
    }
        for row in rows
]
          return jsonify({"project_list":data})

        except Exception as e:
            return jsonify({"error": str(e)}), 500
def update_project_application_status_sql(data):
# ak update status by admin and add in project members table
    # update /apply/takeback project applied
    #user_id which sent
    with engine.connect() as conn:
      try:
         results = conn.execute(text("""
                UPDATE projectapplication 
                SET status = :status
                WHERE user_id = :user_id AND project_id = :project_id
            """), {
                "status": data["status"],
                "user_id": data["user_id"],
                "project_id": data["project_id"]
            })

         conn.commit()
        
         if results.rowcount == 0:
                return jsonify({"error": "Application not found"}), 404
         
         else:
            with engine.connect() as conn:
              
                  if data["status"] =="Accepted":
                
                    #take role from project application table
                       # include in pm table
                       #delete from project application table
                    result1=conn.execute(text("""select * from projectapplication
                                              
                      where user_id=:val1 and project_id=:val2                        
                                              
                                              
                                              """),{
                                                  
                "val1":data["user_id"],
                "val2":data["project_id"]


                                              })
                  
                    rows=result1.fetchall()
                    datas = [
    {
          "application_id": row[0],
        "user_id":row[1],
        "project_id":row[2],
        "role":row[3],
        "status":row[4],
        "remarks":row[5]
      
    }
        for row in rows
]


                                         # include in pm table
                    with engine.connect() as conn:
                        res=conn.execute(text(""" INSERT INTO "projectmembers" (project_id, member_id, role)
        VALUES (:project_id, :member_id, :role)"""),{
  "member_id": data["user_id"],
                    "project_id": data["project_id"],
                    "role": datas[0]["role"] #add later

        })
                        conn.commit()



                    with engine.connect() as conn:
                      result3=conn.execute(text("""

DELETE FROM projectapplication WHERE user_id = :val1 and project_id=:val2
                                                
    
                                            """),{

  
"val1":data["user_id"],
"val2":data["project_id"]


                                            })
                      conn.commit()
              
               
                
                      
                     
                    
                  else:
                       result4=conn.execute(text("""

DELETE FROM projectapplication WHERE user_id = :val1
                                                
    
                                            """),{

  
"val1":data["user_id"]


                                            })
                       conn.commit()

         return jsonify({"project":"updated"})
                      
                  
                    
                  
             

      except Exception as e:
            return jsonify({"error": str(e)}), 500


def accept_mentor_sql(data):
 #update ,push to project member table ,delete other mentor request
  with engine.connect() as conn:
     try:

        ##cond if  metnor page is not updated and  mentor accepted then error wll come handle that
        #update
        result=conn.execute(text("""
    UPDATE "mentorrequest" 
    SET status = :status
    WHERE mentor_id = :mentor_id AND project_id = :project_id;
"""),{
   
    "status": data["status"],  # "Accepted" or "Rejected"
    "mentor_id": data["mentor_id"],
    "project_id": data["project_id"]
})
      
        if data['status']=='Accepted':

            ### delete other mentor request
         result1=conn.execute(text("""
 DELETE FROM "mentorrequest" 
    WHERE project_id = :project_id AND status IN ('Rejected', 'Pending');


"""
        ),{
                "project_id": data["project_id"]


                }
                )
        ### insert into project members table
        result2=conn.execute(text("""
INSERT INTO "projectmembers" (project_id, user_id, role)
VALUES (:val1, :val2, :val3);
"""),{
    "val1":data['project_id'],
    "val2":data['mentor_id'],
    "val3":"mentor"
})
        conn.commit()
        return jsonify({"mentor":"accepted"})


     except Exception as e:
            return jsonify({"error": str(e)}), 500
     


def list_projects_sql(data):
   

     #show  pending ,part of project,apply ,closed
     #pending project projectapplication
     #part of  project  projetct project members

    with engine.connect() as conn:
     try:
          result=conn.execute(text(
             """SELECT 
    p.*, 
    CASE 
        WHEN pm.member_id IS NOT NULL THEN 'Part'
        WHEN p.status IN ('Completed', 'Active') THEN 'Closed'
        WHEN pa.status = 'Pending' THEN 'Pending'
        ELSE 'Apply Now'
    END AS status
FROM "Project" AS p
LEFT JOIN projectmembers AS pm 
    ON p.project_id = pm.project_id AND pm.member_id = :val1
LEFT JOIN projectapplication AS pa 
    ON p.project_id = pa.project_id AND pa.user_id = :val1;

"""



          ),{
             
  'val1':data['user_id']

          })
          rows=result.fetchall()
          data = [
    {   
        "project_id": row[0],  
        "admin_id": row[1],  
        "title": row[2],  
        "description": row[3],  
        "start_date": row[4],  
        "end_date": row[5],  
        "members_required": row[6],  
        "status": row[9],  
        "tags": row[8]  
    }
      for row in rows
]
           


          return jsonify({"project":data})
     except Exception as e:
            return jsonify({"error": str(e)}), 500
          
       


     
def list_current_projects_sql(data):
   with engine.connect() as conn:
      
    try:
       result=conn.execute(text("""select p.* ,pm.role
                                from "Project" as p
                                join projectmembers as pm
                                on  p.project_id=pm.project_id
                                 WHERE pm.member_id = :val1
                                and p.status in ('Planning','Active')
      
                                         
       
       """),
                           
                           {
                              
                        'val1':data['user_id']
                              })
       rows=result.fetchall()
       data = [
    {   
        "project_id": row[0],  
        "admin_id": row[1],  
        "title": row[2],  
        "description": row[3],  
        "start_date": row[4],  
        "end_date": row[5],  
        "members_required": row[6],  
        "status": row[7],  
        "tags": row[8],
        "role":row[9]
    }
      for row in rows
]
           
       

       return jsonify({"project":data}) 
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

def list_past_projects_sql(data):
       
       with engine.connect() as conn:
          try:
             result=conn.execute(text("""select p.* ,pm.role
                                from "Project" as p
                                join projectmembers as pm
                                on  p.project_id=pm.project_id
                                 WHERE pm.member_id = :val1
                                and p.status ='Completed'
      
                                         
       
       """),
                                 
                                 {


                          'val1': data['user_id']
              

                                 })
             rows=result.fetchall()
             data = [
    {   
        "project_id": row[0],  
        "admin_id": row[1],  
        "title": row[2],  
        "description": row[3],  
        "start_date": row[4],  
        "end_date": row[5],  
        "members_required": row[6],  
        "status": row[7],  
        "tags": row[8],
        "role":row[9] 
    }
      for row in rows
]
             return jsonify({"project":data}) 

             
          except Exception as e:
                     return jsonify({"error": str(e)}), 500
          

def list_myprojects_sql(data):
   

     #show  pending ,part of project,apply ,closed
     #pending project projectapplication
     #part of  project  projetct project members

    with engine.connect() as conn:
     try:
          result=conn.execute(text(
             """SELECT 
    p.*, 
    CASE 
        WHEN pa.status = 'Pending' THEN 'Applied'
        WHEN p.status IN ('Completed') THEN 'Completed'
        wHEN p.status='Active'  THEN 'Active'
        
        ELSE 'Apply Now'
    END AS status
FROM "Project" AS p
LEFT JOIN projectmembers AS pm 
    ON p.project_id = pm.project_id AND pm.member_id = :val1
LEFT JOIN projectapplication AS pa 
    ON p.project_id = pa.project_id AND pa.user_id = :val1
    WHERE pm.project_id IS NOT NULL OR pa.project_id IS NOT NULL;


"""



          ),{
             
  'val1':data['user_id']

          })
          rows=result.fetchall()
          data = [
    {   
        "project_id": row[0],  
        "admin_id": row[1],  
        "title": row[2],  
        "description": row[3],  
        "start_date": row[4],  
        "end_date": row[5],  
        "members_required": row[6],  
        "status": row[9],  
        "tags": row[8]  
    }
      for row in rows
]
           


          return jsonify({"project":data})
     except Exception as e:
            return jsonify({"error": str(e)}), 500
          
       
       #__________PROJECT SQL _____________#


def get_project_details(project_id):
    try:
        with engine.connect() as conn:
            project_query = text("""
                SELECT 
                    description,
                    title,
                    start_date,
                    end_date,
                    members_required,
                    status,
                    tags
                FROM "Project"
                WHERE project_id = :project_id
            """)
            project = conn.execute(project_query, {"project_id": int(project_id)}).fetchone()  # Convert to int

            print(f"Fetched project: {project}")  # Debugging
            if not project:
                return None

            project_details = {
                "description": project["description"],
                "title": project["title"],
                "start_date": project["start_date"].isoformat() if project["start_date"] else None,
                "end_date": project["end_date"].isoformat() if project["end_date"] else None,
                "project_size": project["members_required"],
                "project_type": project["status"],
                "github_link": None,
                "tech_stack": project["tags"] if project["tags"] else [],
                "team_members": []
            }

            members_query = text("""
                SELECT u.name
                FROM projectmembers pm
                JOIN "User" u ON pm.member_id = u.roll_no
                WHERE pm.project_id = :project_id
            """)
            members = conn.execute(members_query, {"project_id": project_id}).fetchall()
            project_details["team_members"] = [member["name"] for member in members]

        return project_details
    except Exception as e:
        print(f"Error in get_project_details: {e}")
        return None

def get_project_analytics(project_id):
    try:
        with engine.connect() as conn:
            proj_query = text("""
                SELECT start_date, end_date
                FROM "Project"
                WHERE project_id = :project_id
            """)
            project = conn.execute(proj_query, {"project_id": project_id}).fetchone()
            if not project:
                return None

            tasks_query = text("""
                SELECT sprint_number, status, points
                FROM task
                WHERE project_id = :project_id
            """)
            tasks = conn.execute(tasks_query, {"project_id": project_id}).fetchall()

            total_tasks = len(tasks)
            completed_tasks = [t for t in tasks if t["status"] == "done"]
            total_completed = len(completed_tasks)
            percentage_completed = (total_completed / total_tasks * 100) if total_tasks else 0

            sprint_numbers = [t["sprint_number"] for t in tasks if t["sprint_number"] is not None]
            latest_sprint = max(sprint_numbers, default=None)
            sprint_velocity = sum(t["points"] for t in tasks 
                                  if t["sprint_number"] == latest_sprint and t["status"] == "done") if latest_sprint is not None else 0

            team_query = text("""
                SELECT COUNT(*) as team_count
                FROM projectmembers
                WHERE project_id = :project_id
            """)
            team_count = conn.execute(team_query, {"project_id": project_id}).fetchone()["team_count"]
            total_completed_points = sum(t["points"] for t in tasks if t["status"] == "done")
            team_efficiency = total_completed_points / team_count if team_count else 0

            pending_days = 0
            if project["end_date"]:
                delta = project["end_date"] - date.today()
                pending_days = delta.days if delta.days > 0 else 0

            sprint_data = {}
            for t in tasks:
                sprint = t["sprint_number"] or 0
                if sprint not in sprint_data:
                    sprint_data[sprint] = {"planned": 0, "completed": 0}
                sprint_data[sprint]["planned"] += t["points"]
                if t["status"] == "done":
                    sprint_data[sprint]["completed"] += t["points"]

            burndown_data = []
            velocity_trend = []
            for sprint in sorted(sprint_data.keys()):
                data = sprint_data[sprint]
                burndown_data.append({
                    "sprint_number": sprint,
                    "planned_points": data["planned"],
                    "completed_points": data["completed"]
                })
                velocity_trend.append({
                    "sprint_number": sprint,
                    "velocity": data["completed"]
                })

            performance_query = text("""
                SELECT t.assigned_to, COUNT(*) as total_tasks, 
                       SUM(CASE WHEN t.status = 'done' THEN 1 ELSE 0 END) as done_tasks
                FROM task t
                WHERE t.project_id = :project_id
                GROUP BY t.assigned_to
            """)
            performance = conn.execute(performance_query, {"project_id": project_id}).fetchall()

            team_performance = []
            for p in performance:
                name_query = text("""
                    SELECT name FROM "User" WHERE roll_no = :roll_no
                """)
                user = conn.execute(name_query, {"roll_no": p["assigned_to"]}).fetchone()
                team_performance.append({
                    "member": user["name"] if user else p["assigned_to"],
                    "done_tasks": p["done_tasks"],
                    "total_tasks": p["total_tasks"],
                    "completion_rate": (p["done_tasks"] / p["total_tasks"] * 100) if p["total_tasks"] else 0
                })

            analytics = {
                "percentage_completed": percentage_completed,
                "sprint_velocity": sprint_velocity,
                "team_efficiency": team_efficiency,
                "pending_days": pending_days,
                "burndown_data": burndown_data,
                "velocity_trend": velocity_trend,
                "team_performance": team_performance
            }
            return analytics
    except Exception as e:
        print(f"Error in get_project_analytics: {e}")
        return None

def get_sprint_tasks(project_id):
    try:
        with engine.connect() as conn:
            sprint_query = text("""
                SELECT DISTINCT sprint_number, 
                    (SELECT COUNT(*) FROM task t2 WHERE t2.project_id = :project_id AND t2.sprint_number = t.sprint_number) AS total_tasks,
                    (SELECT COUNT(*) FROM task t2 WHERE t2.project_id = :project_id AND t2.sprint_number = t.sprint_number AND t2.status = 'done') AS completed_tasks
                FROM task t
                WHERE t.project_id = :project_id
                ORDER BY sprint_number
            """)
            sprints = conn.execute(sprint_query, {"project_id": project_id}).fetchall()

            sprint_data = []
            for sprint in sprints:
                sprint_number = sprint["sprint_number"]

                task_query = text("""
                    SELECT id, title, description, assigned_to, points, status
                    FROM task
                    WHERE project_id = :project_id AND sprint_number = :sprint_number
                    ORDER BY status
                """)
                tasks = conn.execute(task_query, {"project_id": project_id, "sprint_number": sprint_number}).fetchall()

                categorized_tasks = {"todo": [], "in_progress": [], "completed": []}
                for task in tasks:
                    task_data = {
                        "id": task["id"],
                        "title": task["title"],
                        "description": task["description"],
                        "assigned_to": task["assigned_to"],
                        "points": task["points"]
                    }
                    if task["status"] == "pending":
                        categorized_tasks["todo"].append(task_data)
                    elif task["status"] == "review":
                        categorized_tasks["in_progress"].append(task_data)
                    elif task["status"] == "done":
                        categorized_tasks["completed"].append(task_data)

                sprint_data.append({
                    "sprint_number": sprint_number,
                    "total_tasks": sprint["total_tasks"],
                    "completed_tasks": sprint["completed_tasks"],
                    "tasks": categorized_tasks
                })

            return sprint_data
    except Exception as e:
        print(f"Error in get_sprint_tasks: {e}")
        return None

def add_task(project_id, sprint_number, description, assigned_to, points):
    try:
        with engine.connect() as conn:
            conn.execute(text("""
                INSERT INTO task (project_id, sprint_number, description, assigned_to, status, points)
                VALUES (:project_id, :sprint_number, :description, :assigned_to, 'pending', :points)
            """), {"project_id": project_id, "sprint_number": sprint_number, "description": description, "assigned_to": assigned_to, "points": points})
            conn.commit()
        return True
    except Exception as e:
        print(f"Error adding task: {e}")
        return False

def update_task(task_id, description, assigned_to, status, points):
    try:
        with engine.connect() as conn:
            conn.execute(text("""
                UPDATE task 
                SET description = :description, assigned_to = :assigned_to, status = :status, points = :points
                WHERE id = :task_id
            """), {"description": description, "assigned_to": assigned_to, "status": status, "points": points, "task_id": task_id})
            conn.commit()
        return True
    except Exception as e:
        print(f"Error updating task: {e}")
        return False

def update_task_status(task_id, new_status):
    try:
        with engine.connect() as conn:
            conn.execute(text("""
                UPDATE task SET status = :status WHERE id = :task_id
            """), {"status": new_status, "task_id": task_id})
            conn.commit()
        return True
    except Exception as e:
        print(f"Error updating task status: {e}")
        return False

def get_eligible_users_for_mod(project_id):
    try:
        with engine.connect() as conn:
            users = conn.execute(text("""
                SELECT u.roll_no, u.name 
                FROM "User" u
                JOIN project_member pm ON u.roll_no = pm.user_id
                WHERE pm.project_id = :project_id 
                AND pm.role NOT IN ('admin', 'moderator', 'mentor')
            """), {"project_id": project_id}).fetchall()
            return users
    except Exception as e:
        print(f"Error getting eligible users: {e}")
        return None

def promote_to_moderator(project_id, user_id):
    try:
        with engine.connect() as conn:
            conn.execute(text("""
                UPDATE project_member
                SET role = 'moderator'
                WHERE project_id = :project_id AND user_id = :user_id
            """), {"project_id": project_id, "user_id": user_id})
            conn.commit()
        return True
    except Exception as e:
        print(f"Error promoting user: {e}")
        return False

def remove_moderator(project_id, user_id):
    try:
        with engine.connect() as conn:
            conn.execute(text("""
                UPDATE project_member
                SET role = 'member'
                WHERE project_id = :project_id AND user_id = :user_id AND role = 'moderator'
            """), {"project_id": project_id, "user_id": user_id})
            conn.commit()
        return True
    except Exception as e:
        print(f"Error demoting user: {e}")
        return False

def get_sprints(project_id):
    try:
        with engine.connect() as conn:
            sprints = conn.execute(text("""
                SELECT sprint_id, name FROM sprint
                WHERE project_id = :project_id
                ORDER BY sprint_id
            """),{"project_id": project_id}).fetchall()
            return sprints
    except Exception as e:
        print(f"Error getting sprints: {e}")
        return None
    

def add_member_rating(rated_by, rated_user, project_id, score, comment):
    try:
        with engine.connect() as conn:
            conn.execute(text("""
                INSERT INTO memberrating (rated_by, rated_user, project_id, score, comment)
                VALUES (:rated_by, :rated_user, :project_id, :score, :comment)
            """), {
                "rated_by": rated_by,
                "rated_user": rated_user,
                "project_id": project_id,
                "score": score,
                "comment": comment
            })
            conn.commit()
        return True
    except Exception as e:
        print(f"Error adding member rating: {e}")
        return False

def is_valid_member(project_id, user_id):
    try:
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT 1 FROM projectmembers
                WHERE project_id = :project_id AND member_id = :user_id
            """), {"project_id": project_id, "user_id": user_id}).fetchone()
            return result is not None
    except Exception as e:
        print(f"Error checking membership: {e}")
        return False

def add_project_rating(user_id, project_id, score, comment):
    try:
        with engine.connect() as conn:
            conn.execute(text("""
                INSERT INTO projectrating (user_id, project_id, score, comment)
                VALUES (:user_id, :project_id, :score, :comment)
            """), {"user_id": user_id, "project_id": project_id, "score": score, "comment": comment})
            conn.commit()
        return True
    except Exception as e:
        print(f"Error adding project rating: {e}")
        return False



       
       


     





  
     

    






         
























         # do url thing so after refresh data stays there




      
          


 
   
       
       
          
       
      

